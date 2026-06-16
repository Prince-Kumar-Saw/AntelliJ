import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[260px] z-30 h-16">
      <div className="h-full glass border-b border-white/[0.06] flex items-center px-4 gap-4">
        {/* Mobile menu button */}
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          className="btn-ghost p-2 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search problems, topics..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white/[0.05] border border-white/[0.08]
                         rounded-xl text-gray-300 placeholder-gray-600
                         focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.08]
                         transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="btn-ghost p-2 rounded-xl"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="btn-ghost p-2 rounded-xl relative" title="Notifications">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          {/* Avatar */}
          <Link to="/profile" className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                            flex items-center justify-center text-white font-bold text-xs cursor-pointer
                            ring-2 ring-primary-500/30 hover:ring-primary-500/60 transition-all">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
