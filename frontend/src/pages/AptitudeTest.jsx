import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { aptitudeAPI } from '../services/api'
import { Clock, ChevronRight, ChevronLeft, Send, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const DEMO_QUESTIONS = [
  { id: 1, question: 'A train travels 60 km/h for 2 hours and then 80 km/h for 3 hours. What is the average speed?', optionA: '68 km/h', optionB: '72 km/h', optionC: '70 km/h', optionD: '75 km/h', timeLimitSec: 90 },
  { id: 2, question: 'If 5x + 3 = 23, what is the value of x?', optionA: '3', optionB: '4', optionC: '5', optionD: '6', timeLimitSec: 60 },
  { id: 3, question: 'What percentage of 150 is 45?', optionA: '25%', optionB: '30%', optionC: '35%', optionD: '40%', timeLimitSec: 60 },
  { id: 4, question: 'A shopkeeper buys an item for Rs. 800 and sells it for Rs. 1000. What is the profit percentage?', optionA: '20%', optionB: '25%', optionC: '15%', optionD: '30%', timeLimitSec: 60 },
  { id: 5, question: 'The sum of three consecutive even numbers is 78. What is the largest number?', optionA: '24', optionB: '26', optionC: '28', optionD: '30', timeLimitSec: 90 },
]

function AptitudeTest() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState(DEMO_QUESTIONS)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 min total
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    aptitudeAPI.getQuestions(category, 10)
      .then(r => setQuestions(r.data?.length > 0 ? r.data : DEMO_QUESTIONS))
      .catch(() => {})
      .finally(() => setLoading(false))

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [category])

  const q = questions[current]
  const opts = q ? [['A', q.optionA], ['B', q.optionB], ['C', q.optionC], ['D', q.optionD]] : []

  const handleSubmit = async () => {
    clearInterval(timerRef.current)
    setSubmitting(true)
    const timeTakenSec = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const answersArr = Object.entries(answers).map(([qId, ans]) => ({ questionId: Number(qId), selectedAnswer: ans }))
    try {
      const { data } = await aptitudeAPI.submitTest({
        category, answers: answersArr, timeTakenSec, totalQuestions: questions.length
      })
      toast.success('Test submitted successfully!')
      navigate(`/aptitude/result/${data.id || 'demo'}`)
    } catch {
      navigate('/aptitude/result/demo')
    }
  }

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const answered = Object.keys(answers).length
  const urgent = timeLeft < 300

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="card mb-6 p-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-white">{category?.charAt(0) + category?.slice(1).toLowerCase()} Aptitude Test</h1>
          <p className="text-xs text-gray-500 mt-0.5">{questions.length} questions · {answered} answered</p>
        </div>
        <div className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg',
          urgent ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                 : 'bg-gray-900 text-gray-300')}>
          <Clock size={18} />
          {fmtTime(timeLeft)}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={clsx('w-8 h-8 rounded-lg text-xs font-bold transition-all',
              i === current ? 'bg-primary-500 text-white scale-110'
              : answers[questions[i]?.id] ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'
              : 'bg-white/[0.04] text-gray-500 hover:bg-white/[0.08]')}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      {q && (
        <div className="card mb-6">
          <div className="flex items-start gap-3 mb-6">
            <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {current + 1}
            </span>
            <p className="text-gray-100 leading-relaxed font-medium">{q.question}</p>
          </div>

          <div className="space-y-3">
            {opts.map(([letter, text]) => {
              const selected = answers[q.id] === letter
              return (
                <button key={letter}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: letter }))}
                  className={clsx('w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                    selected
                      ? 'bg-primary-500/20 border-primary-500/60 text-primary-200'
                      : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.07] hover:border-gray-600')}>
                  <span className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors',
                    selected ? 'bg-primary-500 text-white' : 'bg-white/[0.06] text-gray-400')}>
                    {letter}
                  </span>
                  <span className="text-sm">{text}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0} className="btn-outline gap-2 disabled:opacity-40">
          <ChevronLeft size={16} /> Previous
        </button>

        <div className="flex gap-2">
          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent(c => c + 1)} className="btn-primary gap-2">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary gap-2 bg-gradient-to-r from-emerald-600 to-teal-500">
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit Test</>}
            </button>
          )}
        </div>
      </div>

      {/* Warning if unanswered */}
      {current === questions.length - 1 && answered < questions.length && (
        <div className="alert-warning mt-4">
          <AlertCircle size={16} />
          <span>{questions.length - answered} question(s) unanswered. You can go back and answer them.</span>
        </div>
      )}
    </div>
  )
}

export default AptitudeTest
