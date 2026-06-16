import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Brain, FileText, Mic2, TrendingUp, Zap,
         CheckCircle, Star, Users, Trophy, ChevronRight } from 'lucide-react'

const features = [
  { icon: Code2,      title: 'DSA Practice',      color: 'from-blue-500 to-cyan-500',
    desc: '200+ curated problems across Arrays, Trees, Graphs, DP and more with Monaco code editor.' },
  { icon: Brain,      title: 'Aptitude Tests',     color: 'from-purple-500 to-pink-500',
    desc: 'Quantitative, Logical & Verbal tests with timer, auto-scoring and detailed explanations.' },
  { icon: FileText,   title: 'Resume Analyzer',    color: 'from-emerald-500 to-teal-500',
    desc: 'AI-powered ATS scoring, skill gap analysis and personalized improvement suggestions.' },
  { icon: Mic2,       title: 'AI Mock Interview',  color: 'from-orange-500 to-amber-500',
    desc: 'Role-specific AI interviewer evaluates technical knowledge, communication & confidence.' },
  { icon: TrendingUp, title: 'Progress Tracker',   color: 'from-rose-500 to-red-500',
    desc: 'Learning streaks, topic-wise performance heatmaps and personalized weak-area recommendations.' },
  { icon: Trophy,     title: 'Achievements',       color: 'from-yellow-500 to-orange-500',
    desc: 'Earn badges for consistency, unlock milestones and compete on the leaderboard.' },
]

const stats = [
  { value: '10,000+', label: 'Students Enrolled' },
  { value: '200+',    label: 'DSA Problems' },
  { value: '500+',    label: 'Aptitude Questions' },
  { value: '98%',     label: 'Placement Rate' },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'SDE at Amazon', rating: 5,
    text: 'The AI mock interview feature is incredibly realistic. I landed my dream job at Amazon after 3 weeks of practice!' },
  { name: 'Rahul Verma', role: 'Frontend Dev at Flipkart', rating: 5,
    text: 'The resume analyzer boosted my ATS score from 45 to 87. Got 5x more interview calls!' },
  { name: 'Anjali Patel', role: 'Data Analyst at TCS', rating: 5,
    text: 'Best platform for placement prep. The progress tracker helped me identify and fix my weak areas.' },
]

function LandingPage() {
  return (
    <div className="min-h-screen bg-mesh text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500
                            flex items-center justify-center shadow-glow">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-white font-display">InterviewAce <span className="text-gradient">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/register" id="hero-cta" className="btn-primary text-sm">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 text-center">
        {/* Background glows */}
        <div className="hero-glow bg-primary-500/15 left-1/4 top-10 -translate-x-1/2" />
        <div className="hero-glow bg-accent-500/10 right-1/4 top-20 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium
                          bg-primary-500/15 border border-primary-500/30 text-primary-400 mb-6">
            <Zap size={12} />
            Powered by Google Gemini AI
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display mb-6 leading-tight">
            Ace Every{' '}
            <span className="gradient-text">Technical</span>
            <br />
            Interview with AI
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one AI-powered platform for college students and job seekers.
            Practice DSA, take aptitude tests, analyze your resume, and ace mock interviews —
            all powered by cutting-edge AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3.5 text-base">
              Start Preparing Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-outline px-8 py-3.5 text-base">
              View Demo <ChevronRight size={18} />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            {['No credit card required', 'Free to start', 'Join 10,000+ students'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-black gradient-text font-display">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black font-display mb-4">
              Everything You Need to <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Six powerful modules designed to cover every aspect of technical interview preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} 
                                 flex items-center justify-center mb-4
                                 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary-400 text-xs font-medium
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black font-display mb-4">
            Get Interview Ready in <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-gray-400 mb-14">Your personalized journey from beginner to job-ready.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free and set up your learning profile' },
              { step: '02', title: 'Practice Daily', desc: 'Solve DSA problems and take aptitude tests' },
              { step: '03', title: 'Mock Interview', desc: 'Practice with AI interviewer for your target role' },
              { step: '04', title: 'Get Hired', desc: 'Apply with confidence using AI-optimized resume' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600
                                flex items-center justify-center text-2xl font-black font-display mx-auto mb-4
                                shadow-glow">
                  {step}
                </div>
                <h3 className="font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black font-display mb-4">
              Students Who <span className="gradient-text">Got Hired</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="card">
                <div className="flex text-amber-400 mb-3 gap-0.5">
                  {Array(rating).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                                  flex items-center justify-center text-white text-xs font-bold">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black font-display mb-4">
            Ready to <span className="gradient-text">Ace Your Interviews?</span>
          </h2>
          <p className="text-gray-400 mb-8">Join thousands of students who transformed their careers with InterviewAce AI.</p>
          <Link to="/register" className="btn-primary px-10 py-4 text-lg">
            Get Started For Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center text-sm text-gray-600">
        <p>© 2024 InterviewAce AI. Built with ❤️ for engineering students.</p>
      </footer>
    </div>
  )
}

export default LandingPage
