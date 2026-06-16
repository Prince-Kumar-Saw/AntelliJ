import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AppLayout from './components/AppLayout'

// Pages - Auth
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

// Pages - App
import Dashboard from './pages/Dashboard'
import DSAModule from './pages/DSAModule'
import ProblemEditor from './pages/ProblemEditor'
import AptitudeModule from './pages/AptitudeModule'
import AptitudeTest from './pages/AptitudeTest'
import AptitudeResult from './pages/AptitudeResult'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import MockInterview from './pages/MockInterview'
import InterviewReport from './pages/InterviewReport'
import ProgressTracker from './pages/ProgressTracker'
import ProfilePage from './pages/ProfilePage'

// Pages - Admin
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminQuestions from './pages/AdminQuestions'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected App Routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dsa" element={<DSAModule />} />
              <Route path="/dsa/:id" element={<ProblemEditor />} />
              <Route path="/aptitude" element={<AptitudeModule />} />
              <Route path="/aptitude/test/:category" element={<AptitudeTest />} />
              <Route path="/aptitude/result/:id" element={<AptitudeResult />} />
              <Route path="/resume" element={<ResumeAnalyzer />} />
              <Route path="/interview" element={<MockInterview />} />
              <Route path="/interview/report/:id" element={<InterviewReport />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute><AppLayout /></AdminRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/questions" element={<AdminQuestions />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
