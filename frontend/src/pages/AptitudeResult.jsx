import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { aptitudeAPI } from '../services/api'
import { Trophy, CheckCircle, XCircle, Clock, ArrowRight, BarChart3 } from 'lucide-react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const DEMO_RESULT = {
  testCategory: 'QUANTITATIVE', score: 17, totalQuestions: 20,
  correctAnswers: 17, wrongAnswers: 2, unattempted: 1,
  timeTakenSec: 1845, percentage: 85, passed: true,
}

function AptitudeResult() {
  const { id } = useParams()
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (id === 'demo') { setResult(DEMO_RESULT); return }
    aptitudeAPI.getResult(id).then(r => setResult(r.data)).catch(() => setResult(DEMO_RESULT))
  }, [id])

  if (!result) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )

  const grade = result.percentage >= 90 ? 'A' : result.percentage >= 75 ? 'B' : result.percentage >= 60 ? 'C' : result.percentage >= 45 ? 'D' : 'F'
  const gradeColors = { A: 'text-emerald-400', B: 'text-blue-400', C: 'text-amber-400', D: 'text-orange-400', F: 'text-red-400' }

  const donut = {
    labels: ['Correct', 'Wrong', 'Unattempted'],
    datasets: [{
      data: [result.correctAnswers, result.wrongAnswers, result.unattempted],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(239,68,68,0.8)', 'rgba(100,116,139,0.6)'],
      borderColor: ['#10b981', '#ef4444', '#475569'],
      borderWidth: 2,
    }]
  }

  const fmtTime = (s) => {
    const m = Math.floor(s / 60); return `${m}m ${s % 60}s`
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`text-7xl font-black font-display mb-2 ${gradeColors[grade]}`}>{grade}</div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {result.passed ? '🎉 Test Passed!' : '📚 Keep Practicing!'}
        </h1>
        <p className="text-gray-400">
          {result.testCategory} Aptitude · {result.percentage?.toFixed(1)}% Score
        </p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Score', value: `${result.score}/${result.totalQuestions}`, icon: Trophy, color: 'text-amber-400 bg-amber-500/15' },
          { label: 'Correct', value: result.correctAnswers, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/15' },
          { label: 'Wrong', value: result.wrongAnswers, icon: XCircle, color: 'text-red-400 bg-red-500/15' },
          { label: 'Time Taken', value: fmtTime(result.timeTakenSec || 0), icon: Clock, color: 'text-primary-400 bg-primary-500/15' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center py-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon size={18} />
            </div>
            <p className="text-xl font-black text-white font-display">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card flex flex-col items-center">
          <h2 className="font-bold text-white mb-4 self-start">Answer Distribution</h2>
          <div className="w-48 h-48">
            <Doughnut data={donut} options={{ plugins: { legend: { display: false } }, cutout: '65%' }} />
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Correct</span>
            <span className="flex items-center gap-1.5 text-red-400"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Wrong</span>
            <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-gray-500" /> Skipped</span>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold text-white mb-4">Performance Analysis</h2>
          <div className="space-y-4">
            {[
              { label: 'Accuracy', value: result.correctAnswers / (result.totalQuestions - result.unattempted) * 100, color: 'bg-emerald-500' },
              { label: 'Attempt Rate', value: (1 - result.unattempted / result.totalQuestions) * 100, color: 'bg-blue-500' },
              { label: 'Score %', value: result.percentage, color: 'bg-primary-500' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-medium">{value.toFixed(1)}%</span>
                </div>
                <div className="progress">
                  <div className={`progress-bar ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-sm font-medium text-gray-300 mb-1">AI Recommendation</p>
            <p className="text-xs text-gray-500">
              {result.percentage >= 80
                ? '✅ Excellent performance! Focus on hard-level problems to stay sharp.'
                : result.percentage >= 60
                ? '📈 Good effort! Practice more problems in percentages and ratios.'
                : '📚 Keep practicing! Start with easy problems and build your speed.'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/aptitude" className="btn-outline gap-2">Back to Tests</Link>
        <Link to="/aptitude/test/QUANTITATIVE" className="btn-primary gap-2">
          Retake Test <ArrowRight size={16} />
        </Link>
        <Link to="/progress" className="btn-ghost gap-2">
          <BarChart3 size={16} /> View Progress
        </Link>
      </div>
    </div>
  )
}

export default AptitudeResult
