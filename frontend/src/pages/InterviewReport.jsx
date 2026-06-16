import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { interviewAPI } from '../services/api'
import { Trophy, Star, TrendingUp, AlertTriangle, CheckCircle,
         Lightbulb, Award, ArrowRight, BarChart3 } from 'lucide-react'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const DEMO_REPORT = {
  role: 'Software Engineer',
  questionCount: 8,
  technicalScore: 78,
  communicationScore: 82,
  confidenceScore: 75,
  completenessScore: 80,
  overallScore: 79,
  overallGrade: 'B',
  hiringRecommendation: 'RECOMMEND',
  strengths: [
    'Strong grasp of data structures and algorithms',
    'Clear and structured communication style',
    'Good problem-solving approach with step-by-step thinking',
    'Showed enthusiasm for system design concepts',
  ],
  weaknesses: [
    'Limited knowledge of distributed systems and microservices',
    'Could improve on time complexity analysis',
    'Some answers lacked real-world examples',
  ],
  detailedFeedback: 'Overall a strong performance for a fresher candidate. You demonstrated solid understanding of core CS concepts and communicated your thoughts clearly. Your approach to problem-solving was methodical, which is exactly what interviewers look for. To improve, focus on system design patterns, distributed systems, and always back your answers with concrete examples from your projects. With more preparation on advanced topics, you could easily achieve an A grade.',
  recommendations: [
    'Study distributed system design patterns (CAP theorem, load balancing)',
    'Practice explaining Big O notation with examples in every answer',
    'Prepare 3-5 STAR-format behavioral stories from your projects',
    'Learn Kubernetes and Docker for DevOps-related questions',
    'Practice mock interviews 3x per week on this platform',
  ]
}

const gradeInfo = {
  A: { color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40', label: 'Outstanding' },
  B: { color: 'text-blue-400',    bg: 'bg-blue-500/20 border-blue-500/40',       label: 'Good' },
  C: { color: 'text-amber-400',   bg: 'bg-amber-500/20 border-amber-500/40',     label: 'Average' },
  D: { color: 'text-orange-400',  bg: 'bg-orange-500/20 border-orange-500/40',   label: 'Needs Work' },
  F: { color: 'text-red-400',     bg: 'bg-red-500/20 border-red-500/40',         label: 'Poor' },
}

const hiringColors = {
  STRONGLY_RECOMMEND: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  RECOMMEND:          'text-blue-400 bg-blue-500/15 border-blue-500/30',
  NEUTRAL:            'text-amber-400 bg-amber-500/15 border-amber-500/30',
  NOT_RECOMMEND:      'text-red-400 bg-red-500/15 border-red-500/30',
}

function InterviewReport() {
  const { id } = useParams()
  const [report, setReport] = useState(null)

  useEffect(() => {
    if (id === 'demo' || id?.startsWith('demo-')) { setReport(DEMO_REPORT); return }
    interviewAPI.getReport(id).then(r => setReport(r.data)).catch(() => setReport(DEMO_REPORT))
  }, [id])

  if (!report) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )

  const g = gradeInfo[report.overallGrade] || gradeInfo.C

  const radarData = {
    labels: ['Technical', 'Communication', 'Confidence', 'Completeness'],
    datasets: [{
      label: 'Your Scores',
      data: [report.technicalScore, report.communicationScore, report.confidenceScore, report.completenessScore],
      backgroundColor: 'rgba(14,165,233,0.15)',
      borderColor: '#0ea5e9',
      borderWidth: 2,
      pointBackgroundColor: '#0ea5e9',
      pointRadius: 5,
    }]
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        min: 0, max: 100,
        ticks: { stepSize: 25, color: '#64748b', font: { size: 10 }, backdropColor: 'transparent' },
        grid: { color: 'rgba(255,255,255,0.08)' },
        pointLabels: { color: '#94a3b8', font: { size: 12, weight: '600' } },
        angleLines: { color: 'rgba(255,255,255,0.08)' },
      }
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500 mb-2">{report.role} Interview · {report.questionCount} Questions</p>
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border ${g.bg}`}>
          <span className={`text-5xl font-black font-display ${g.color}`}>{report.overallGrade}</span>
          <div className="text-left">
            <p className={`text-lg font-bold ${g.color}`}>{g.label}</p>
            <p className="text-sm text-gray-400">{report.overallScore}/100 Overall Score</p>
          </div>
        </div>
        <div className="mt-4">
          <span className={`badge border px-4 py-1.5 text-sm font-medium ${hiringColors[report.hiringRecommendation]}`}>
            {report.hiringRecommendation?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Score Breakdown + Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        <div className="card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-400" /> Skill Radar
          </h2>
          <div className="h-56">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Individual Scores */}
        <div className="card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Star size={16} className="text-amber-400" /> Score Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Technical Knowledge', score: report.technicalScore, color: 'bg-blue-500' },
              { label: 'Communication',        score: report.communicationScore, color: 'bg-purple-500' },
              { label: 'Confidence',           score: report.confidenceScore, color: 'bg-amber-500' },
              { label: 'Completeness',         score: report.completenessScore, color: 'bg-emerald-500' },
            ].map(({ label, score, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-semibold">{score}/100</span>
                </div>
                <div className="progress">
                  <div className={`progress-bar ${color}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="card mb-6">
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <Award size={16} className="text-primary-400" /> Detailed AI Feedback
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">{report.detailedFeedback}</p>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400" /> Strengths
          </h2>
          <ul className="space-y-2">
            {report.strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" /> Areas to Improve
          </h2>
          <ul className="space-y-2">
            {report.weaknesses?.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card mb-6">
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-400" /> AI Recommendations
        </h2>
        <div className="space-y-2">
          {report.recommendations?.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
              <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-gray-300">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/interview" className="btn-outline gap-2">New Interview</Link>
        <Link to="/progress" className="btn-ghost gap-2"><TrendingUp size={16} /> View Progress</Link>
        <Link to="/dsa" className="btn-primary gap-2">Practice DSA <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}

export default InterviewReport
