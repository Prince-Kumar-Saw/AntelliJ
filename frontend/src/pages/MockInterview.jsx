import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { interviewAPI } from '../services/api'
import { Mic2, Send, User, Bot, Loader2, ChevronRight, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const roles = [
  { id: 'SOFTWARE_ENGINEER',  label: 'Software Engineer',   icon: '💻', desc: 'DSA, System Design, Problem Solving' },
  { id: 'JAVA_DEVELOPER',     label: 'Java Developer',      icon: '☕', desc: 'Java, Spring Boot, OOP, Microservices' },
  { id: 'FRONTEND_DEVELOPER', label: 'Frontend Developer',  icon: '🎨', desc: 'React, HTML/CSS, JavaScript, UI/UX' },
  { id: 'BACKEND_DEVELOPER',  label: 'Backend Developer',   icon: '⚙️', desc: 'APIs, Databases, System Architecture' },
  { id: 'DATA_ANALYST',       label: 'Data Analyst',        icon: '📊', desc: 'SQL, Python, Excel, Data Visualization' },
  { id: 'FULLSTACK_DEVELOPER',label: 'Full Stack Developer', icon: '🚀', desc: 'React + Node/Spring, Databases, DevOps' },
]

function MockInterview() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [interviewId, setInterviewId] = useState(null)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [questionNum, setQuestionNum] = useState(0)
  const [totalQuestions] = useState(8)
  const [phase, setPhase] = useState('select') // select | interview | done
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = async () => {
    if (!selectedRole) { toast.error('Please select a role'); return }
    setLoading(true)
    try {
      const { data } = await interviewAPI.start({ role: selectedRole, totalQuestions })
      setInterviewId(data.interviewId)
      setMessages([{ role: 'assistant', content: data.question, timestamp: new Date() }])
      setQuestionNum(1)
      setPhase('interview')
    } catch {
      // Demo mode
      const role = roles.find(r => r.id === selectedRole)
      setInterviewId('demo-' + Date.now())
      setMessages([{
        role: 'assistant',
        content: `Welcome to your mock interview for the **${role?.label}** role! Let's begin.\n\n**Question 1 of ${totalQuestions}:** Tell me about yourself and why you're interested in a ${role?.label} position. What's your technical background and what projects have you worked on?`,
        timestamp: new Date()
      }])
      setQuestionNum(1)
      setPhase('interview')
    } finally {
      setLoading(false)
    }
  }

  const sendAnswer = async () => {
    if (!userInput.trim()) return
    const answer = userInput.trim()
    setUserInput('')

    const newMessages = [...messages, { role: 'user', content: answer, timestamp: new Date() }]
    setMessages(newMessages)

    if (questionNum >= totalQuestions) {
      // End interview
      setLoading(true)
      try {
        const { data } = await interviewAPI.answer({ interviewId, answer, isLastAnswer: true })
        setPhase('done')
        setTimeout(() => navigate(`/interview/report/${data.reportId || interviewId}`), 1500)
      } catch {
        setPhase('done')
        setTimeout(() => navigate(`/interview/report/demo`), 1500)
      } finally { setLoading(false) }
      return
    }

    setLoading(true)
    try {
      const { data } = await interviewAPI.answer({ interviewId, answer })
      setMessages([...newMessages, { role: 'assistant', content: data.nextQuestion, timestamp: new Date() }])
      setQuestionNum(q => q + 1)
    } catch {
      const nextQ = questionNum + 1
      const demoQuestions = [
        `Good answer! Let's dive deeper.\n\n**Question ${nextQ} of ${totalQuestions}:** Explain the difference between a stack and a queue. Where would you use each in real-world applications?`,
        `Interesting! **Question ${nextQ} of ${totalQuestions}:** How would you design a URL shortening service like bit.ly? Walk me through your approach.`,
        `**Question ${nextQ} of ${totalQuestions}:** What is the time complexity of searching in a HashSet vs a TreeSet in Java? Why?`,
        `**Question ${nextQ} of ${totalQuestions}:** Tell me about a challenging technical problem you've faced and how you solved it.`,
        `**Question ${nextQ} of ${totalQuestions}:** What is the difference between REST and GraphQL APIs? When would you choose one over the other?`,
        `**Question ${nextQ} of ${totalQuestions}:** Explain SOLID principles with a real-world example from your projects.`,
        `**Final Question ${nextQ} of ${totalQuestions}:** Where do you see yourself in 5 years, and how does this role align with your career goals?`,
      ]
      const qi = Math.min(nextQ - 2, demoQuestions.length - 1)
      setMessages([...newMessages, {
        role: 'assistant',
        content: `Good response! ${demoQuestions[qi]}`,
        timestamp: new Date()
      }])
      setQuestionNum(nextQ)
    } finally { setLoading(false) }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer() }
  }

  // Role Selection
  if (phase === 'select') return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="page-header text-center">
        <h1 className="section-title flex items-center justify-center gap-2"><Mic2 size={24} /> AI Mock Interview</h1>
        <p className="section-subtitle">Practice with an AI interviewer tailored to your target role</p>
      </div>

      <div className="card mb-6 p-5">
        <h2 className="font-bold text-white mb-1">How it works</h2>
        <p className="text-sm text-gray-400 mb-4">The AI will ask you {totalQuestions} role-specific questions. Type your answers naturally, as you would in a real interview.</p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {[['🎯', 'Select Role', 'Pick your target position'], ['💬', 'Answer Questions', 'Type responses naturally'],  ['📊', 'Get Evaluated', 'AI generates detailed report']].map(([e, t, d]) => (
            <div key={t} className="p-3 rounded-xl bg-white/[0.04]">
              <div className="text-2xl mb-1">{e}</div>
              <p className="font-medium text-gray-200">{t}</p>
              <p className="text-gray-500 mt-0.5">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="font-bold text-white mb-4">Select Your Target Role</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {roles.map(({ id, label, icon, desc }) => (
          <button key={id}
            id={`role-${id.toLowerCase()}`}
            onClick={() => setSelectedRole(id)}
            className={clsx('p-4 rounded-2xl border text-left transition-all duration-200',
              selectedRole === id
                ? 'bg-primary-500/15 border-primary-500/60 shadow-glow'
                : 'glass border-white/[0.06] hover:border-primary-500/30 hover:bg-white/[0.04]')}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{icon}</span>
              <span className="font-semibold text-white">{label}</span>
              {selectedRole === id && <ChevronRight size={14} className="text-primary-400 ml-auto" />}
            </div>
            <p className="text-xs text-gray-500">{desc}</p>
          </button>
        ))}
      </div>

      <button
        id="start-interview-btn"
        onClick={startInterview}
        disabled={!selectedRole || loading}
        className="btn-primary w-full py-3.5 text-base disabled:opacity-50"
      >
        {loading
          ? <span className="flex items-center gap-2 justify-center"><Loader2 size={18} className="animate-spin" /> Starting Interview...</span>
          : <span className="flex items-center gap-2 justify-center"><Mic2 size={18} /> Begin Mock Interview <ArrowRight size={16} /></span>}
      </button>
    </div>
  )

  // Done
  if (phase === 'done') return (
    <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
      <p className="text-gray-400 mb-4">Generating your AI evaluation report...</p>
      <Loader2 size={32} className="animate-spin text-primary-400" />
    </div>
  )

  // Interview Chat
  const role = roles.find(r => r.id === selectedRole)
  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-6rem)] -m-4 md:-m-6 lg:-m-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 glass border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <p className="font-semibold text-white text-sm">AI Interviewer</p>
            <p className="text-xs text-gray-500">{role?.label} · Question {questionNum}/{totalQuestions}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-32 progress">
            <div className="progress-bar bg-primary-500" style={{ width: `${(questionNum / totalQuestions) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-500">{questionNum}/{totalQuestions}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
        {messages.map((msg, i) => (
          <div key={i} className={clsx('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
            <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1',
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                : 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-200')}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={clsx('max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'assistant'
                ? 'glass border border-white/[0.08] text-gray-200'
                : 'bg-primary-600 text-white rounded-tr-sm')}>
              {msg.content.split('\n').map((line, li) => (
                <p key={li} className={li > 0 ? 'mt-2' : ''}>
                  {line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}
                </p>
              ))}
              <p className="text-[10px] opacity-50 mt-2">
                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="glass border border-white/[0.08] rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 glass border-t border-white/[0.06] flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            id="interview-answer-input"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your answer... (Press Enter to send, Shift+Enter for new line)"
            rows={3}
            className="flex-1 input resize-none scrollbar-none text-sm"
          />
          <button
            id="send-answer-btn"
            onClick={sendAnswer}
            disabled={!userInput.trim() || loading}
            className="btn-primary p-3 h-12 w-12 flex-shrink-0 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          {questionNum < totalQuestions
            ? `Answer carefully — the AI evaluates quality, not just correctness`
            : `This is the final question — your answer will complete the interview`}
        </p>
      </div>
    </div>
  )
}

export default MockInterview
