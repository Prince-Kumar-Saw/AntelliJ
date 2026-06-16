import React, { useEffect, useState } from 'react'
import { progressAPI } from '../services/api'
import { Flame, TrendingUp, Target, BookOpen, ChevronRight, Lightbulb, BarChart3 } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const DEMO_TOPIC_DATA = {
  categories: ['Arrays', 'Strings', 'Trees', 'Graphs', 'DP', 'Linked Lists', 'Greedy'],
  scores: [85, 72, 60, 45, 38, 70, 55],
}

const DEMO_RECOMMENDATIONS = [
  '📘 Practice 5 Graph problems daily — your graph score is 45%',
  '💡 Review Dynamic Programming patterns: knapsack, LCS, LIS',
  '⏰ Spend 30 min daily on Aptitude — focus on Logical Reasoning',
  '🎯 Take 2 mock interviews this week to boost your confidence score',
  '📄 Update your resume with Docker/Kubernetes skills to improve ATS',
]

// Heatmap helpers
const getDayLabel = (offset) => {
  const d = new Date(); d.setDate(d.getDate() - offset)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
const STREAK_DAYS = 84 // 12 weeks
const activityData = Array.from({ length: STREAK_DAYS }, (_, i) =>
  Math.random() > 0.45 ? Math.floor(Math.random() * 5) + 1 : 0
)

function ProgressTracker() {
  const [streak, setStreak] = useState({ currentStreak: 5, longestStreak: 12, totalActiveDays: 28 })
  const [topicData, setTopicData] = useState(DEMO_TOPIC_DATA)
  const [recommendations, setRecommendations] = useState(DEMO_RECOMMENDATIONS)

  useEffect(() => {
    progressAPI.getStreak().then(r => setStreak(r.data)).catch(() => {})
    progressAPI.getTopicPerformance().then(r => setTopicData(r.data || DEMO_TOPIC_DATA)).catch(() => {})
    progressAPI.getRecommendations().then(r => setRecommendations(r.data || DEMO_RECOMMENDATIONS)).catch(() => {})
  }, [])

  const weakTopics = topicData.categories
    .map((c, i) => ({ category: c, score: topicData.scores[i] }))
    .filter(t => t.score < 60)
    .sort((a, b) => a.score - b.score)

  const barData = {
    labels: topicData.categories,
    datasets: [{
      data: topicData.scores,
      backgroundColor: topicData.scores.map(s =>
        s >= 75 ? 'rgba(16,185,129,0.7)' : s >= 55 ? 'rgba(14,165,233,0.7)' : 'rgba(239,68,68,0.7)'
      ),
      borderRadius: 6,
    }]
  }

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', max: 100 } },
    }
  }

  const heatColor = (v) =>
    v === 0 ? 'bg-gray-800'
    : v === 1 ? 'bg-primary-900'
    : v === 2 ? 'bg-primary-700'
    : v === 3 ? 'bg-primary-600'
    : v === 4 ? 'bg-primary-500'
    : 'bg-primary-400'

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="section-title flex items-center gap-2"><TrendingUp size={24} /> Progress Tracker</h1>
        <p className="section-subtitle">Track your learning journey and identify areas for improvement</p>
      </div>

      {/* Streak cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Flame,  label: 'Current Streak', value: `${streak.currentStreak} Days`, color: 'text-orange-400 bg-orange-500/15' },
          { icon: Target, label: 'Longest Streak',  value: `${streak.longestStreak} Days`, color: 'text-purple-400 bg-purple-500/15' },
          { icon: BookOpen,label:'Active Days',     value: streak.totalActiveDays,          color: 'text-emerald-400 bg-emerald-500/15' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card text-center py-5">
            <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-black text-white font-display">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <div className="card mb-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Flame size={16} className="text-orange-400" /> Activity Heatmap (Last 12 Weeks)
        </h2>
        <div className="flex gap-1 flex-wrap">
          {activityData.map((val, i) => (
            <div
              key={i}
              title={`${getDayLabel(STREAK_DAYS - 1 - i)} — ${val > 0 ? `${val} activities` : 'No activity'}`}
              className={`w-4 h-4 rounded-sm ${heatColor(val)} cursor-pointer transition-transform hover:scale-110`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
          <span>Less</span>
          {['bg-gray-800', 'bg-primary-900', 'bg-primary-700', 'bg-primary-500', 'bg-primary-400'].map(c => (
            <div key={c} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Topic Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-400" /> Topic-wise Performance
          </h2>
          <div className="h-56">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            {[['bg-emerald-500', '≥75% Strong'], ['bg-blue-500', '55–74% OK'], ['bg-red-500', '<55% Weak']].map(([c, l]) => (
              <span key={l} className="flex items-center gap-1.5 text-gray-500">
                <span className={`w-2.5 h-2.5 rounded-sm ${c}`} /> {l}
              </span>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Target size={16} className="text-red-400" /> Weak Areas Detected
          </h2>
          {weakTopics.length === 0 ? (
            <div className="text-center py-8 text-emerald-400">
              <span className="text-3xl mb-2 block">🎉</span>
              <p className="font-medium">No weak areas! Keep it up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {weakTopics.map(({ category, score }) => (
                <div key={category} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="font-medium text-gray-200">{category}</span>
                    <span className="text-red-400 font-bold">{score}%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-red-500" style={{ width: `${score}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Needs {100 - score}% improvement · Practice recommended
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-400" /> Personalized AI Recommendations
        </h2>
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-pointer">
              <span className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold
                               flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <p className="text-sm text-gray-300 flex-1">{rec}</p>
              <ChevronRight size={14} className="text-gray-700 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker
