const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim();

exports.handler = async (event) => {
  // ==================================================
  // ONLY POST REQUESTS
  // ==================================================

  if (event.httpMethod !== "POST") {
   return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed',
      }),
    };
  }

  try {
    // ==================================================
    // READ REQUEST BODY
    // ==================================================

    const body = JSON.parse(event.body || "{}");
    const {
      name,
      email,
      phone,
      course,
      country,
      countryCode,
      dialCode,
    } = body;


    // ==================================================
    // COURSES
    // ==================================================

    const courses = {
      college: {
        amount: 499,
        note: 'College Students Program',
      },

      advance: {
        amount: 1999,
        note: 'Advance Course: AI in IT Infrastructure',
      },

      webinar: {
        amount: 9,
        note: 'From Worried to Hired Workshop',
      },
    };


    const selectedCourse = courses[course];


    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (!name || !email || !phone || !selectedCourse) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error:
            'Name, email, phone and a valid course are required.',
        }),
      };
    }


    // ==================================================
    // NORMALIZE PHONE
    // ==================================================

    const normalizedPhone = String(phone)
      .replace(/\D/g, '');


    // International phone should contain
    // country code + subscriber number.
    //
    // Example:
    // India       +919876543210
    // UAE         +971501234567
    // USA         +11234567890

    if (
      normalizedPhone.length < 8 ||
      normalizedPhone.length > 15
    ) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error:
            'Please provide a valid international phone number.',
        }),
      };
    }


    // ==================================================
    // CASHFREE CREDENTIALS
    // ==================================================

    const clientId =
      process.env.CASHFREE_CLIENT_ID?.trim();

    const clientSecret =
      process.env.CASHFREE_CLIENT_SECRET?.trim();

    const mode =
      (process.env.CASHFREE_ENV || process.env.CASHFREE_MODE || 'sandbox')
        .trim()
        .toLowerCase();


    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
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
    // CASHFREE API
    // ==================================================

    const baseUrl =
      mode === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';


    // ==================================================
    // ORDER ID
    // ==================================================

    const orderId =
      `SARMAK_${Date.now()}_${Math.floor(
        Math.random() * 100000
      )}`;


    // ==================================================
    // WEBSITE URL
    // ==================================================

    const configuredSiteUrl =
      process.env.CASHFREE_RETURN_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL;


    const requestHost =
      event.headers?.host ||
      'localhost:8888';


    const requestProtocol =
      requestHost.startsWith('localhost')
        ? 'http'
        : 'https';


    const siteUrl =
      configuredSiteUrl ||
      `${requestProtocol}://${requestHost}`;


    // ==================================================
    // RETURN URL
    // ==================================================

    const callbackUrl =
      `${siteUrl.replace(/\/$/, '')}/payment-success`;

    const returnUrl =
      `${callbackUrl}?order_id={order_id}&course=${encodeURIComponent(
        course
      )}`;

    // ==================================================
    // CREATE CASHFREE ORDER
    // ==================================================

    const response = await fetch(
      `${baseUrl}/orders`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Accept:
            'application/json',

          'x-api-version':
            '2025-01-01',

          'x-client-id':
            clientId,

          'x-client-secret':
            clientSecret,
        },

        body: JSON.stringify({

          order_id:
            orderId,

          order_amount:
            selectedCourse.amount,

          order_currency:
            'INR',


          // ============================================
          // CUSTOMER
          // ============================================

          customer_details: {

            customer_id:
              `CUST_${Date.now()}`,

            customer_name:
              String(name).trim(),

            customer_email:
              String(email).trim(),

            customer_phone:
              normalizedPhone,

          },


          // ============================================
          // RETURN URL
          // ============================================

          order_meta: {

            return_url:
              `${callbackUrl}?order_id={order_id}&course=${encodeURIComponent(
                course
              )}`,

          },


          // ============================================
          // ORDER NOTE
          // ============================================

          order_note:
            selectedCourse.note,

        }),
      }
    );


    // ==================================================
    // CASHFREE RESPONSE
    // ==================================================

    const result =
      await response
        .json()
        .catch(() => ({}));


    if (!response.ok) {

      const errorMessage =
        [
          result.message,
          result.code,
          result.type,
        ]
          .filter(Boolean)
          .join(' - ');

      console.error(
        "Cashfree API error:",
        result
      );

      return {
        statusCode: response.status,

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          success: false,

          error:
            errorMessage ||
            "Unable to create payment order.",
        }),
      };
    }

    // ==================================================
    // CASHFREE SUCCESS
    // ==================================================

    const finalOrderId =
      result.order_id || orderId;

    const paymentSessionId =
      result.payment_session_id;

    if (!paymentSessionId) {
      console.error(
        "Cashfree response missing payment_session_id:",
        result
      );

      return {
        statusCode: 500,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          success: false,
          error:
            "Cashfree did not return a payment session.",
       }),
      };
    }

    // ==================================================
    // SAVE REGISTRATION TO GOOGLE SHEET
    // ==================================================

    await saveRegistrationToGoogleSheet({
      orderId: finalOrderId,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: normalizedPhone,
      country: country || "",
      countryCode: countryCode || "",
      dialCode: dialCode || "",
      paymentStatus: "PENDING",
    });

    // ==================================================
    // SUCCESS
    // ==================================================

    return {

      statusCode: 200,

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({

        success: true,

        payment_session_id:
          result.payment_session_id,

        order_id:
          result.order_id,

        mode,

        country:
          country || '',

        countryCode:
          countryCode || '',

        dialCode:
          dialCode || '',

      }),

    };


  } catch (error) {

    console.error(
      'Cashfree order error:',
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
          'Server error while creating payment.',

      }),

    };
  }
};


// ======================================================
// GOOGLE SHEET FUNCTION
// ======================================================

async function saveRegistrationToGoogleSheet(data) {
  const payload = {
    action: "create",
    orderId: data.orderId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    country: data.country,
    countryCode: data.countryCode,
    dialCode: data.dialCode,
    paymentStatus: data.paymentStatus || "PENDING",
  };

  if (!GOOGLE_SHEET_WEBHOOK_URL) {
    const message = "GOOGLE_SHEET_WEBHOOK_URL is not configured.";
    console.error(message, { payload });
    throw new Error(message);
  }

  try {
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

    console.log("Google Sheet create response:", {
      status: response.status,
      ok: response.ok,
      body: parsedResponse,
      payload,
    });

    if (!response.ok) {
      const errorMessage = `Google Apps Script rejected the create request: ${response.status} ${responseText || "empty response"}`;
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

    console.error("Google Sheet registration error:", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
      payload,
    });

    throw error;
  }
}