import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login({ userId: data.userId, name: data.name, email: data.email, role: data.role },
             { accessToken: data.accessToken, refreshToken: data.refreshToken })
      toast.success(`Welcome back, ${data.name}! 🎉`)
      navigate('/dashboard')
    } catch (err) {
      // toast handled by axios interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      {/* Background glows */}
      <div className="fixed top-20 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/3 w-72 h-72 bg-accent-500/08 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                            flex items-center justify-center shadow-glow">
              <Zap size={22} className="text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-black font-display text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to continue your interview prep journey</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input pl-10"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <p className="text-xs text-primary-400 font-medium mb-1">Demo Credentials</p>
            <p className="text-xs text-gray-400">Student: <code className="text-primary-300">student@interviewace.ai</code></p>
            <p className="text-xs text-gray-400">Admin: <code className="text-primary-300">admin@interviewace.ai</code></p>
            <p className="text-xs text-gray-500 mt-1">Password: <code>Admin@123</code></p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
