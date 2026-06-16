import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (form.password.length < 8) errs.password = 'Minimum 8 characters'
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = 'Must contain uppercase, lowercase, and number'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await authAPI.register({ name: form.name, email: form.email, password: form.password })
      login({ userId: data.userId, name: data.name, email: data.email, role: data.role },
             { accessToken: data.accessToken, refreshToken: data.refreshToken })
      toast.success(`Welcome to InterviewAce, ${data.name}! 🚀`)
      navigate('/dashboard')
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type, icon, placeholder, autoComplete) => (
    <div>
      <label htmlFor={key} className="label">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        <input
          id={key}
          type={key === 'password' || key === 'confirmPassword' ? (showPass ? 'text' : 'password') : type}
          placeholder={placeholder}
          className={`input pl-10 ${key === 'password' || key === 'confirmPassword' ? 'pr-10' : ''} ${errors[key] ? 'input-error' : ''}`}
          value={form[key]}
          onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })) }}
          autoComplete={autoComplete}
        />
        {(key === 'password') && (
          <button type="button" onClick={() => setShowPass(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="fixed top-20 right-1/3 w-96 h-96 bg-accent-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                            flex items-center justify-center shadow-glow">
              <Zap size={22} className="text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-black font-display text-white">Create Your Account</h1>
          <p className="text-gray-400 mt-2 text-sm">Start your AI-powered interview prep for free</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', 'Full Name', 'text', <User size={16} />, 'Rahul Sharma', 'name')}
            {field('email', 'Email Address', 'email', <Mail size={16} />, 'rahul@example.com', 'email')}
            {field('password', 'Password', 'password', <Lock size={16} />, '••••••••', 'new-password')}
            {field('confirmPassword', 'Confirm Password', 'password', <Lock size={16} />, '••••••••', 'new-password')}

            <div className="text-xs text-gray-500 mt-1">
              Password must be 8+ chars with uppercase, lowercase, and a number.
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
