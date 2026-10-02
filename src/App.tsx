import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Zap, CheckCircle, Clock } from 'lucide-react';
import Logo from './components/Logo';
import SEO from './components/SEO';

type CourseType = 'college' | 'advance' | null;

const courses = {
  college: {
    id: 'college',
    title: 'College Students Program',
    subtitle: '4-Week Foundation to Industry-Ready',
    description: 'Designed specifically for college students and fresh graduates. Bridges the gap between academic learning and industry expectations with hands-on labs and real-world projects.',
    icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    price: '₹499',
    details: [
      { week: 'Week 1', title: 'Databases & SQL', items: ['Relational DB Design', 'SQL Queries', 'NoSQL Intro', 'Hands-on Project'] },
      { week: 'Week 2', title: 'Linux & Infrastructure', items: ['Linux Fundamentals', 'Shell Scripting', 'System Admin', 'Lab Exercises'] },
      { week: 'Week 3', title: 'DevOps & Containers', items: ['Git & GitHub', 'CI/CD Pipelines', 'Docker', 'Production Deploy'] },
      { week: 'Week 4', title: 'AI & Agents', items: ['AI Fundamentals', 'LLM Basics', 'Prompt Engineering', 'Capstone Project'] },
    ]
  },
  advance: {
    id: 'advance',
    title: 'Advance Course',
    subtitle: '6-Hour Intensive: AI Use Cases in IT Infrastructure',
    description: 'An intensive, advanced track for working professionals. Dive deep into enterprise-grade infrastructure, AI-driven monitoring, predictive maintenance, and intelligent resource allocation.',
    icon: <Zap className="w-8 h-8 text-gold" />,
    color: 'from-gold/20 to-amber-500/20',
    borderColor: 'border-gold/30',
    price: '₹1,999',
    details: [
      { week: 'Hour 1', title: 'Intro to AI in IT & Tooling', items: ['AI Landscape in IT', 'Setting up AI Dev Environments', 'Overview of LLMs for Ops'] },
      { week: 'Hour 2', title: 'Automated Monitoring & Logs', items: ['AI-powered Log Analysis', 'Anomaly Detection Setup', 'Smart Dashboarding'] },
      { week: 'Hour 3', title: 'Predictive Maintenance', items: ['Forecasting System Failures', 'Intelligent Alerting Systems', 'Reducing False Positives'] },
      { week: 'Hour 4', title: 'AI-Driven Security & Compliance', items: ['Automated Threat Hunting', 'Compliance Checking via AI', 'Incident Response Automation'] },
      { week: 'Hour 5', title: 'Intelligent Resource Allocation', items: ['Cloud Cost Optimization', 'Auto-scaling with AI', 'Workload Prediction'] },
      { week: 'Hour 6', title: 'Capstone: Build an IT AI Agent', items: ['Designing the Agent', 'Connecting to IT APIs', 'Deployment & Testing'] },
    ]
  }
};

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<CourseType>(null);
  const navigate = useNavigate();

  const handleRegister = (courseId: string) => {
    navigate(`/payment?course=${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c1d1b] to-[#0d0e10] text-white overflow-hidden">
      <SEO 
        title="IT Infrastructure Training Courses - SARMAK Learning" 
        description="Enroll in SARMAK's 4-Week College Student IT Program or 6-Hour Advance AI in IT Infrastructure Course. Industry-ready training with expert mentorship."
        keywords="IT infrastructure course, AI in IT training, college student IT program, DevOps training, SARMAK learning, IT certification"
      />

      {/* --- ORIGINAL HEADER (Intact) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1c1d1b]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-auto transition-transform duration-300 hover:scale-105" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-wider">SARMAK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500">Learning Portal</span></span>
              <span className="block text-xs text-gold font-mono tracking-widest">INNOVATE. TRANSFORM. EXCEL.</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
        {/*     <a href="https://learn.sarmak.in" className="text-sm text-white/80 hover:text-gold transition-colors">Back to SARMAK →</a> */}
            <Link to="/login" className="btn-outline text-sm inline-flex items-center gap-2">Login</Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Choose Your Learning Path
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500">IT Infrastructure</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Select a program tailored to your experience level. View full details below, then register and proceed to secure your seat.
            </p>
          </div>
        </section>

{/* Navigation */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#1c1d1b]/95 backdrop-blur-xl border-b border-white/10">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Logo className="h-12 w-auto transition-transform duration-300 hover:scale-105" />
      <div className="hidden sm:block">
        <span className="text-xl font-bold tracking-wider">SARMAK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500">Learning Portal</span></span>
        <span className="block text-xs text-gold font-mono tracking-widest">INNOVATE. TRANSFORM. EXCEL.</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
     {/*  <a href="https://sarmak.in" className="text-sm text-white/80 hover:text-gold transition-colors hidden lg:block">
        Back to SARMAK →
      </a> 
      <Link to="/course-details" className="text-sm text-white/80 hover:text-gold transition-colors hidden md:block">
        Course Details
      </Link>
      <Link to="/profile" className="text-sm text-white/80 hover:text-gold transition-colors hidden md:block">
        Profile
      </Link>*/}
      

      
      <Link to="/login" className="btn-outline text-sm inline-flex items-center gap-2">
        Login
      </Link>
    </div>
  </div>
</nav>
      {/* Blinking Webinar Registration Label */}
      <Link 
        to="/webinar" 
        className="fixed top-24 right-6 z-40 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold blink group animate-pulse-glow"
      >
        <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-75"></span>
        <span className="relative flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1c1d1b] animate-pulse"></span>
          <span className="font-bold text-[#1c1d1b] text-sm uppercase tracking-wider whitespace-nowrap">
             Register for Webinar ₹9 
          </span>
        </span>
      </Link>
      
        {/* Course Selection Cards */}
        <section className="px-6 max-w-7xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {(['college', 'advance'] as CourseType[]).map((key) => {
              const course = courses[key!];
              const isSelected = selectedCourse === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCourse(key)}
                  className={`relative group text-left rounded-3xl border p-8 transition-all duration-500 ease-out backdrop-blur-xl overflow-hidden
                    ${isSelected 
                      ? `${course.borderColor} bg-gradient-to-br ${course.color} shadow-2xl shadow-emerald-500/10 scale-[1.02]` 
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:scale-[1.01]'
                    }`}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    {course.icon}
                  </div>
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors duration-300 ${isSelected ? 'bg-white/20' : 'bg-white/5'}`}>
                      {course.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gold font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {course.subtitle}
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed mb-6">{course.description}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all text-emerald-400">
                      <span>{isSelected ? 'Viewing Details' : 'Click to View Details'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold flex items-center justify-center animate-bounce-in">
                      <CheckCircle className="w-5 h-5 text-[#1c1d1b]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Course Details Breakdown (Visible BEFORE Login) */}
        {selectedCourse && (
          <section id="course-breakdown" className="px-6 max-w-5xl mx-auto animate-fade-in-up">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="p-8 md:p-12 border-b border-white/10 bg-white/5">
                <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                  {courses[selectedCourse].icon}
                  {courses[selectedCourse].title} Breakdown
                </h2>
                <p className="text-white/70">Complete syllabus and schedule. No login required to view.</p>
              </div>
              
              <div className="p-8 md:p-12 grid gap-6">
                {courses[selectedCourse].details.map((module, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-[#111314] border border-white/5 hover:border-emerald-500/30 transition-colors duration-300">
                    <div className="md:w-48 flex-shrink-0">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold mb-2">
                        {module.week}
                      </span>
                      <h4 className="text-xl font-bold text-white">{module.title}</h4>
                    </div>
                    <div className="flex-1 grid sm:grid-cols-2 gap-3">
                      {module.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-white/80">
                          <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Registration & Payment CTA */}
              <div className="p-8 md:p-12 bg-gradient-to-r from-emerald-900/20 to-green-900/20 border-t border-white/10 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to transform your career?</h3>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">
                  Secure your seat in the <span className="text-gold font-semibold">{courses[selectedCourse].title}</span>. 
                  Complete your registration and proceed to our secure payment gateway.
                </p>
                <button
                  onClick={() => handleRegister(courses[selectedCourse].id)}
                  disabled={selectedCourse === 'advance'}
                  className={selectedCourse === 'advance'
                    ? 'inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-6 py-3 text-lg text-white/40 cursor-not-allowed'
                    : 'btn-primary text-lg inline-flex items-center gap-3 pulse-glow'}
                >
                  <span>Register & Proceed to Payment ({courses[selectedCourse].price})</span>
                  {selectedCourse === 'advance' ? (
                    <span className="text-sm font-semibold">Coming soon</span>
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
                <p className="text-xs text-white/40 mt-4">Secure checkout • Instant access upon payment • 100% Satisfaction guarantee</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* --- ORIGINAL FOOTER (Intact) --- */}
      <footer className="bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <a href="https://sarmak.in" className="flex items-center gap-3 mb-6 inline-flex">
                <Logo className="h-14 w-auto" />
                <div>
                  <span className="text-2xl font-bold text-white tracking-wider block">SARMAK</span>
                  <span className="text-xs text-gold font-mono tracking-widest">INNOVATE. TRANSFORM. EXCEL.</span>
                </div>
              </a>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
                SARMAK is a group of technology enthusiasts driven by passion and commitment to revolutionize businesses through innovative IT solutions and AI-powered services.
              </p>
              <div className="space-y-3 text-sm text-white/60">
                <a href="mailto:info@sarmak.in" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">@</span>
                  info@sarmak.in
                </a>
                <a href="tel:+919764000745" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">📞</span>
                  +91 97640 00745
                </a>
                <div className="flex items-start gap-3 text-white/60">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">📍</span>
                  Joyville, Meridian-1302, Hinjewadi, Pune MH 411057, India
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://sarmak.in" className="text-white/60 hover:text-gold transition-colors">Home</a></li>
                <li><a href="https://sarmak.in/about" className="text-white/60 hover:text-gold transition-colors">About Us</a></li>
                <li><a href="https://sarmak.in/services/learning-with-sarmak" className="text-white/60 hover:text-gold transition-colors">Learning with SARMAK</a></li>
                <li><a href="https://sarmak.in/contact" className="text-white/60 hover:text-gold transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://sarmak.in/services/ai" className="text-white/60 hover:text-gold transition-colors">AI Solutions</a></li>
                <li><a href="https://sarmak.in/services/cloud" className="text-white/60 hover:text-gold transition-colors">Cloud Services</a></li>
                <li><a href="https://sarmak.in/services/database" className="text-white/60 hover:text-gold transition-colors">Database Services</a></li>
                <li><a href="https://sarmak.in/services/devops" className="text-white/60 hover:text-gold transition-colors">DevOps</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://sarmak.in/blog" className="text-white/60 hover:text-gold transition-colors">Blog</a></li>
                <li><a href="https://sarmak.in/resources" className="text-white/60 hover:text-gold transition-colors">Resources</a></li>
                <li><a href="https://sarmak.in/faq" className="text-white/60 hover:text-gold transition-colors">FAQ</a></li>
                <li><a href="https://sarmak.in/service-plans" className="text-white/60 hover:text-gold transition-colors">Service Plans</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
              <p>© {new Date().getFullYear()} SARMAK. All rights reserved.</p>
              <div className="flex flex-wrap items-center gap-6">
                <a href="https://sarmak.in/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</a>
                <a href="https://sarmak.in/terms-of-service" className="hover:text-gold transition-colors">Terms of Service</a>
              </div>
              <div className="flex items-center gap-3">
                <a href="https://www.linkedin.com/company/sarmak-solutions" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-[#1c1d1b] transition-all duration-300">in</a>
                <a href="https://x.com/SarmakSolutions" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-[#1c1d1b] transition-all duration-300">x</a>
                <a href="https://www.instagram.com/sarmaksolutions/" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-[#1c1d1b] transition-all duration-300">ig</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}