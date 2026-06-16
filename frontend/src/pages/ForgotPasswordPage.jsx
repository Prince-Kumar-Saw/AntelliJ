import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent! Check your email.')
    } catch { } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                          flex items-center justify-center shadow-glow mx-auto mb-6">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-3xl font-black font-display text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your email and we'll send a reset link</p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 text-sm mb-6">We've sent a password reset link to <strong className="text-white">{email}</strong></p>
              <Link to="/login" className="btn-primary w-full justify-center">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input id="reset-email" type="email" placeholder="you@example.com"
                    className="input pl-10" value={email}
                    onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
