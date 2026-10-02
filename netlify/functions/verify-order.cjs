const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim();

exports.handler = async (event) => {

  // ==================================================
  // GET ORDER ID
  // ==================================================

  const orderId =
    event.queryStringParameters?.order_id;


  if (!orderId) {

    return {

      statusCode: 400,

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({

        success: false,

        error:
          'Order ID is missing.',

      }),

    };
  }


  try {

    // ==================================================
    // CASHFREE CONFIG
    // ==================================================

    const mode =
      (process.env.CASHFREE_ENV || process.env.CASHFREE_MODE || 'sandbox')
        .trim()
        .toLowerCase();


    const clientId =
      process.env.CASHFREE_CLIENT_ID?.trim();


    const clientSecret =
      process.env.CASHFREE_CLIENT_SECRET?.trim();


    if (!clientId || !clientSecret) {

      return {

        statusCode: 500,

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({

          success: false,

          error:
            'Cashfree credentials are missing.',

        }),

      };
    }

    if (mode !== 'sandbox' && mode !== 'production') {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'CASHFREE_ENV must be either sandbox or production.',
        }),
      };
    }


    // ==================================================
    // BASE URL
    // ==================================================

    const baseUrl =
      mode === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';


    // ==================================================
    // GET PAYMENTS FOR ORDER
    // ==================================================

    const response =
      await fetch(
        `${baseUrl}/orders/${encodeURIComponent(
          orderId
        )}/payments`,
        {

          method: 'GET',

          headers: {

            Accept:
              'application/json',

            'x-api-version':
              '2025-01-01',

            'x-client-id':
              clientId,

            'x-client-secret':
              clientSecret,

          },

        }
      );


    const payments =
      await response
        .json()
        .catch(() => []);


    if (!response.ok) {
      console.error(
        "Cashfree verification error:",
        payments
      );
      return {

        statusCode:
          response.status,

        headers: {

          'Content-Type':
            'application/json',

        },

        body: JSON.stringify({

          success: false,

          order_id:
            orderId,

          error:
            payments?.message ||
            'Unable to verify payment.',

        }),

      };

    }


    // ==================================================
    // PAYMENTS ARRAY
    // ==================================================

    const paymentList =
      Array.isArray(payments)
        ? payments
        : [];


    // ==================================================
    // FIND LATEST PAYMENT
    // ==================================================

    const latestPayment =
      paymentList.length > 0
        ? paymentList[
            paymentList.length - 1
          ]
        : null;


    // ==================================================
    // PAYMENT STATUS
    // ==================================================

    const paymentStatus =
      String(
        latestPayment?.payment_status ||
        ''
      ).toUpperCase();


    // ==================================================
    // ORDER STATUS
    // ==================================================

    const orderStatus =
      String(
        latestPayment?.order_status ||
        ''
      ).toUpperCase();


    // ==================================================
    // NORMALIZE STATUS
    // ==================================================

    let finalStatus =
      paymentStatus;


    // Some Cashfree responses may expose
    // the order state instead of payment state.

    if (!finalStatus) {
      finalStatus =
        orderStatus;
    }


    // ==================================================
    // SUCCESS
    // ==================================================

    if (
      finalStatus === 'SUCCESS' ||
      finalStatus === 'PAID'
    ) {
      // ----------------------------------------------
      // UPDATE GOOGLE SHEET
      // ----------------------------------------------

      await updateGoogleSheetStatus(
        orderId,
        "PAID"
      );
      return {

        statusCode: 200,

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({

          success: true,

          order_id:
            orderId,

          payment_status:
            'SUCCESS',

          order_status:
            orderStatus,

        }),

      };
    }


    // ==================================================
    // PENDING
    // ==================================================

    if (
      finalStatus === 'PENDING' ||
      finalStatus === 'ACTIVE' ||
      finalStatus === "NOT_ATTEMPTED"
    ) {
      await updateGoogleSheetStatus(
        orderId,
        "PENDING"
      );
      return {

        statusCode: 200,

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({

          success: true,

          order_id:
            orderId,

          payment_status:
            'PENDING',

          order_status:
            orderStatus,

        }),

      };
    }


    // ==================================================
    // USER DROPPED
    // ==================================================

    if (
      finalStatus === 'USER_DROPPED'
    ) {
     await updateGoogleSheetStatus(
        orderId,
        "USER_DROPPED"
      );
      return {

        statusCode: 200,

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({

          success: true,

          order_id:
            orderId,

          payment_status:
            'USER_DROPPED',

          order_status:
            orderStatus,

        }),

      };
    }


    // ==================================================
    // FAILED
    // ==================================================

    if (
      finalStatus === 'FAILED' ||
      finalStatus === 'FAILURE'
    ) {
      await updateGoogleSheetStatus(
        orderId,
        "FAILED"
      );
      return {

        statusCode: 200,

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({

          success: true,

          order_id:
            orderId,

          payment_status:
            'FAILED',

          order_status:
            orderStatus,

        }),

      };
    }


    // ==================================================
    // UNKNOWN / NOT COMPLETED
    // ==================================================
    await updateGoogleSheetStatus(
      orderId,
      finalStatus
    );

    return {

      statusCode: 200,

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({

        success: true,

        order_id:
          orderId,

        payment_status:
          finalStatus ||
          'PENDING',

        order_status:
          orderStatus,

      }),

    };


  } catch (error) {

    console.error(
      'Cashfree verification error:',
      error
    );


    return {

      statusCode: 500,

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({

        success: false,

        error:
          'Unable to verify payment.',

      }),

    };

  }
};


// ======================================================
// UPDATE GOOGLE SHEET PAYMENT STATUS
// ======================================================

async function updateGoogleSheetStatus(
  orderId,
  paymentStatus
) {
  const payload = {
    action: "updateStatus",
    orderId,
    paymentStatus,
  };

  // --------------------------------------------------
  // Check Google Sheet URL
  // --------------------------------------------------

  if (!GOOGLE_SHEET_WEBHOOK_URL) {
    const message = "GOOGLE_SHEET_WEBHOOK_URL is not configured.";
    console.error(message, { payload });
    throw new Error(message);
  }

  try {
    // ------------------------------------------------
    // Send request to Google Apps Script
    // ------------------------------------------------

    const response = await fetch(
      GOOGLE_SHEET_WEBHOOK_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    let parsedResponse = responseText;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      // leave as plain text when not JSON
    }

    console.log("Google Sheet status update response:", {
      status: response.status,
      ok: response.ok,
      body: parsedResponse,
      payload,
    });

    if (!response.ok) {
      const errorMessage = `Google Apps Script rejected the status update: ${response.status} ${responseText || "empty response"}`;
      console.error(errorMessage, {
        status: response.status,
        body: parsedResponse,
        payload,
      });
      throw new Error(errorMessage);
    }

    return parsedResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error("Google Sheet status update error:", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
      payload,
    });

    throw error;
  }
}