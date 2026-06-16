import React, { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'
import { Users, Code2, Brain, TrendingUp, BarChart3, Activity } from 'lucide-react'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Filler, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend)

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
  }
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    adminAPI.getAnalytics()
      .then(r => setAnalytics(r.data))
      .catch(() => setAnalytics({
        totalUsers: 1247, activeUsers: 834, totalProblems: 42,
        totalQuestions: 300, totalInterviews: 562, totalResumes: 318,
        registrationsThisWeek: [12, 18, 9, 24, 16, 31, 22],
        weekLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        submissionsPerDay: [145, 182, 120, 200, 163, 95, 112],
        moduleUsage: { dsa: 42, aptitude: 28, interview: 17, resume: 13 },
      }))
  }, [])

  const stats = analytics ? [
    { label: 'Total Users',     value: analytics.totalUsers,     icon: Users,    color: 'from-blue-600 to-blue-500' },
    { label: 'Active Users',    value: analytics.activeUsers,    icon: Activity, color: 'from-emerald-600 to-teal-500' },
    { label: 'Coding Problems', value: analytics.totalProblems,  icon: Code2,    color: 'from-purple-600 to-accent-500' },
    { label: 'Aptitude Q&A',    value: analytics.totalQuestions, icon: Brain,    color: 'from-amber-600 to-orange-500' },
    { label: 'Mock Interviews', value: analytics.totalInterviews,icon: TrendingUp,color: 'from-rose-600 to-red-500' },
    { label: 'Resumes Analyzed',value: analytics.totalResumes,   icon: BarChart3, color: 'from-cyan-600 to-cyan-500' },
  ] : []

  const regData = analytics ? {
    labels: analytics.weekLabels,
    datasets: [{ data: analytics.registrationsThisWeek, backgroundColor: 'rgba(14,165,233,0.7)', borderRadius: 5 }]
  } : null

  const submData = analytics ? {
    labels: analytics.weekLabels,
    datasets: [{
      data: analytics.submissionsPerDay,
      borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)',
      fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#10b981',
    }]
  } : null

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Platform-wide analytics and management</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center py-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} mx-auto flex items-center justify-center mb-2`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-xl font-black text-white font-display">{value?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="font-bold text-white mb-4">New Registrations (This Week)</h2>
          <div className="h-52">
            {regData ? <Bar data={regData} options={chartOpts} /> : <div className="skeleton h-full rounded-xl" />}
          </div>
        </div>
        <div className="card">
          <h2 className="font-bold text-white mb-4">Daily Code Submissions</h2>
          <div className="h-52">
            {submData ? <Line data={submData} options={chartOpts} /> : <div className="skeleton h-full rounded-xl" />}
          </div>
        </div>
      </div>

      {/* Module Usage */}
      {analytics?.moduleUsage && (
        <div className="card">
          <h2 className="font-bold text-white mb-4">Module Usage Distribution</h2>
          <div className="space-y-3">
            {Object.entries(analytics.moduleUsage).map(([mod, pct]) => (
              <div key={mod}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300 capitalize">{mod === 'dsa' ? 'DSA Practice' : mod.charAt(0).toUpperCase() + mod.slice(1)}</span>
                  <span className="text-white font-medium">{pct}%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-gradient-to-r from-primary-600 to-accent-500"
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
