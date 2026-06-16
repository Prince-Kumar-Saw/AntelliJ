import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Code2, Brain, FileText, Mic2,
  TrendingUp, Settings, LogOut, X, ChevronRight,
  Zap, Shield, BookOpen
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',        path: '/dashboard' },
  { icon: Code2,           label: 'DSA Practice',     path: '/dsa' },
  { icon: Brain,           label: 'Aptitude Tests',   path: '/aptitude' },
  { icon: FileText,        label: 'Resume Analyzer',  path: '/resume' },
  { icon: Mic2,            label: 'Mock Interview',   path: '/interview' },
  { icon: TrendingUp,      label: 'Progress Tracker', path: '/progress' },
]

const adminItems = [
  { icon: Shield,    label: 'Admin Panel',   path: '/admin' },
  { icon: BookOpen,  label: 'Manage Users',  path: '/admin/users' },
  { icon: Zap,       label: 'Manage Q&A',   path: '/admin/questions' },
]

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <aside className={clsx(
        'fixed top-0 left-0 h-screen w-[260px] z-40 flex flex-col',
        'glass border-r border-white/[0.06] transition-transform duration-300',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500
                            flex items-center justify-center shadow-glow flex-shrink-0">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white font-display leading-none text-sm">InterviewAce</p>
              <p className="text-[10px] text-primary-400 font-medium tracking-wide">AI PLATFORM</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                            flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            {isAdmin && (
              <span className="badge-blue text-[10px] px-1.5 py-0.5 flex-shrink-0">Admin</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/')
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={clsx('nav-item', active && 'active')}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            )
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="pt-3 pb-1">
                <p className="px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                  Administration
                </p>
              </div>
              {adminItems.map(({ icon: Icon, label, path }) => {
                const active = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={clsx('nav-item', active && 'active')}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight size={14} className="opacity-50" />}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          <Link to="/profile" onClick={onClose} className="nav-item">
            <Settings size={18} />
            <span>Settings & Profile</span>
          </Link>
          <button onClick={handleLogout} className="nav-item w-full text-left hover:text-red-400 hover:bg-red-500/10">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
