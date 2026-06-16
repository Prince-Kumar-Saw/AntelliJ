import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardAPI } from '../services/api'
import {
  Code2, Brain, Mic2, FileText, TrendingUp, Flame,
  Trophy, Target, ArrowRight, BookOpen, Star
} from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, LineElement, PointElement, Filler
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  LineElement, PointElement, Filler)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1 } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } },
  },
}

function StatCard({ icon: Icon, label, value, trend, color, link }) {
  return (
    <Link to={link} className="stat-card hover:scale-[1.02] transition-transform group">
      <div className={`stat-icon ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-black text-white font-display">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
      <ArrowRight size={16} className="text-gray-600 group-hover:text-primary-400 transition-colors flex-shrink-0" />
    </Link>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [weekly, setWeekly] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), dashboardAPI.getWeeklyPerformance()])
      .then(([s, w]) => { setStats(s.data); setWeekly(w.data) })
      .catch(() => {
        // fallback demo data
        setStats({ problemsSolved: 42, aptitudeTestsTaken: 18, mockInterviewsCompleted: 5, resumesUploaded: 2, weeklyActivity: 12 })
        setWeekly({ labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], problemsSolved: [2,3,1,4,2,5,3], aptitudeTests: [1,0,2,1,0,1,2], studyMinutes: [45,60,30,90,45,120,75] })
      })
      .finally(() => setLoading(false))
  }, [])

  const barData = weekly ? {
    labels: weekly.labels,
    datasets: [{
      label: 'Problems',
      data: weekly.problemsSolved,
      backgroundColor: 'rgba(14,165,233,0.7)',
      borderRadius: 6,
    }, {
      label: 'Tests',
      data: weekly.aptitudeTests,
      backgroundColor: 'rgba(217,70,239,0.7)',
      borderRadius: 6,
    }]
  } : null

  const lineData = weekly ? {
    labels: weekly.labels,
    datasets: [{
      label: 'Study Minutes',
      data: weekly.studyMinutes,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
    }]
  } : null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="section-subtitle">Here's your preparation overview for today</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <Flame size={18} className="text-amber-400" />
          <span className="text-amber-400 font-semibold text-sm">5 Day Streak 🔥</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Code2} label="Problems Solved"
          value={loading ? '...' : stats?.problemsSolved ?? 0}
          color="bg-gradient-to-br from-blue-600 to-blue-500" link="/dsa" />
        <StatCard icon={Brain} label="Aptitude Tests"
          value={loading ? '...' : stats?.aptitudeTestsTaken ?? 0}
          color="bg-gradient-to-br from-purple-600 to-accent-500" link="/aptitude" />
        <StatCard icon={Mic2} label="Mock Interviews"
          value={loading ? '...' : stats?.mockInterviewsCompleted ?? 0}
          color="bg-gradient-to-br from-orange-600 to-amber-500" link="/interview" />
        <StatCard icon={FileText} label="Resume Score"
          value={loading ? '...' : stats?.resumesUploaded ? '82/100' : '—'}
          color="bg-gradient-to-br from-emerald-600 to-teal-500" link="/resume" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Weekly Activity</h2>
            <span className="badge-blue text-xs">Last 7 Days</span>
          </div>
          <div className="h-56">
            {barData ? <Bar data={barData} options={chartOptions} /> :
              <div className="skeleton h-full rounded-xl" />}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Study Time</h2>
            <span className="badge-success text-xs">Minutes/Day</span>
          </div>
          <div className="h-56">
            {lineData ? <Line data={lineData} options={chartOptions} /> :
              <div className="skeleton h-full rounded-xl" />}
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: Code2, label: 'Solve a DSA Problem', sub: '42 new problems this week', color: 'text-blue-400 bg-blue-500/15', link: '/dsa' },
              { icon: Brain, label: 'Take Aptitude Test', sub: 'Improve your score', color: 'text-purple-400 bg-purple-500/15', link: '/aptitude' },
              { icon: Mic2, label: 'Start Mock Interview', sub: 'AI-powered evaluation', color: 'text-orange-400 bg-orange-500/15', link: '/interview' },
              { icon: FileText, label: 'Analyze My Resume', sub: 'Get ATS score', color: 'text-emerald-400 bg-emerald-500/15', link: '/resume' },
            ].map(({ icon: Icon, label, sub, color, link }) => (
              <Link key={link} to={link}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-primary-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="card">
          <h2 className="font-bold text-white mb-4">Achievements</h2>
          <div className="space-y-3">
            {[
              { icon: '🔥', title: '5-Day Streak', desc: 'Practice 5 days in a row', earned: true },
              { icon: '💡', title: 'First Solve',  desc: 'Solved your first DSA problem', earned: true },
              { icon: '🎯', title: 'Sharp Shooter', desc: '90%+ in aptitude test', earned: true },
              { icon: '🤖', title: 'Interview Ace', desc: 'Complete 10 mock interviews', earned: false },
              { icon: '📄', title: 'Resume Star',  desc: 'ATS score above 85', earned: false },
            ].map(({ icon, title, desc, earned }) => (
              <div key={title} className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                                           ${earned ? 'bg-white/[0.04]' : 'opacity-40'}`}>
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                {earned && <span className="badge-success text-xs">Earned</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
