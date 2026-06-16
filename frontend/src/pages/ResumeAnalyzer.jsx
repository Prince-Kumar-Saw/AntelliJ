import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { resumeAPI } from '../services/api'
import { FileText, Upload, CheckCircle, AlertCircle, Star, Zap,
         Target, TrendingUp, X, BarChart3, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const DEMO_REPORT = {
  atsScore: 78,
  overallRating: 'GOOD',
  extractedName: 'Rahul Verma',
  extractedEmail: 'rahul@example.com',
  extractedPhone: '+91 98765 43210',
  skillsFound: ['Java', 'Spring Boot', 'React', 'MySQL', 'Git', 'REST APIs', 'HTML', 'CSS'],
  skillsMissing: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Redis'],
  projectsCount: 3,
  experienceYears: 0,
  strengths: [
    'Clear project descriptions with measurable outcomes',
    'Strong technical skills section with relevant technologies',
    'Good academic credentials from reputed institution',
  ],
  improvements: [
    'Add quantifiable achievements (e.g., "improved performance by 40%")',
    'Include cloud technologies like AWS or Azure',
    'Add a LinkedIn profile URL',
    'Use stronger action verbs at the start of bullet points',
    'Add GitHub profile link with open-source contributions',
  ],
  summary: 'Your resume shows solid foundational skills for a software engineering role. The projects are relevant, but adding cloud and DevOps skills would significantly increase your ATS score and callback rate.',
}

const ratingColors = {
  POOR: 'text-red-400', AVERAGE: 'text-amber-400', GOOD: 'text-blue-400', EXCELLENT: 'text-emerald-400'
}

function ScoreRing({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#0ea5e9' : score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <circle cx="72" cy="72" r={radius} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white font-display">{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  )
}

function ResumeAnalyzer() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [report, setReport] = useState(null)
  const [targetRole, setTargetRole] = useState('Software Engineer')

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxSize: 10 * 1024 * 1024, maxFiles: 1
  })

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a PDF resume first'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('targetRole', targetRole)
      const { data } = await resumeAPI.upload(fd)
      // Poll for report or get it directly
      const reportRes = await resumeAPI.getReport(data.id || data.resumeId)
      setReport(reportRes.data)
      toast.success('Resume analyzed successfully! 🎉')
    } catch {
      // Show demo report for development
      setReport(DEMO_REPORT)
      toast.success('Resume analyzed! (Demo Mode) 🎉')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="page-header">
        <h1 className="section-title flex items-center gap-2"><FileText size={24} /> AI Resume Analyzer</h1>
        <p className="section-subtitle">Get your ATS score and AI-powered improvement suggestions</p>
      </div>

      {!report ? (
        /* Upload Section */
        <div className="space-y-6">
          {/* Target role */}
          <div className="card p-5">
            <label className="label">Target Role (for ATS optimization)</label>
            <select value={targetRole} onChange={e => setTargetRole(e.target.value)}
              className="input bg-gray-900">
              {['Software Engineer', 'Java Developer', 'Frontend Developer', 'Backend Developer',
                'Full Stack Developer', 'Data Analyst', 'DevOps Engineer', 'Android Developer'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Dropzone */}
          <div {...getRootProps()} className={clsx(
            'card border-2 border-dashed cursor-pointer transition-all duration-300 text-center py-16',
            isDragActive
              ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
              : file ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-gray-700 hover:border-primary-500/60 hover:bg-white/[0.02]'
          )}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              {file ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{file.name}</p>
                    <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                  </div>
                  <button type="button" onClick={e => { e.stopPropagation(); setFile(null) }}
                    className="btn-ghost text-xs gap-1 text-gray-500">
                    <X size={12} /> Remove
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-primary-500/15 flex items-center justify-center">
                    <Upload size={30} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {isDragActive ? 'Drop your resume here...' : 'Drag & drop your resume'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse · PDF only · Max 10MB</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Target,     label: 'ATS Score',        desc: 'Out of 100' },
              { icon: Zap,        label: 'Skill Analysis',   desc: 'Found & Missing' },
              { icon: TrendingUp, label: 'Improvements',     desc: 'AI Suggestions' },
              { icon: Star,       label: 'Overall Rating',   desc: 'Poor to Excellent' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <Icon size={20} className="text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-200">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          <button
            id="analyze-resume-btn"
            onClick={handleAnalyze}
            disabled={!file || uploading}
            className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI... This may take 15-30 seconds
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Zap size={18} /> Analyze My Resume with AI
              </span>
            )}
          </button>

          {!file && (
            <button onClick={() => setReport(DEMO_REPORT)} className="btn-ghost w-full text-sm text-gray-500">
              View Demo Report →
            </button>
          )}
        </div>
      ) : (
        /* Report Section */
        <div className="space-y-6 animate-fade-in">
          {/* Re-analyze button */}
          <button onClick={() => { setReport(null); setFile(null) }} className="btn-outline gap-2 text-sm">
            <Upload size={14} /> Analyze Another Resume
          </button>

          {/* ATS Score + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <p className="text-sm text-gray-400 mb-4">ATS Score</p>
              <ScoreRing score={report.atsScore} />
              <p className={`mt-4 font-bold text-lg ${ratingColors[report.overallRating]}`}>
                {report.overallRating}
              </p>
              <p className="text-xs text-gray-500 mt-1">Overall Rating</p>
            </div>

            <div className="card md:col-span-2">
              <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                <FileText size={16} className="text-primary-400" /> Extracted Information
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                {[
                  ['Name', report.extractedName],
                  ['Email', report.extractedEmail],
                  ['Phone', report.extractedPhone],
                  ['Projects', `${report.projectsCount} detected`],
                  ['Experience', report.experienceYears > 0 ? `${report.experienceYears} years` : 'Fresher'],
                ].map(([k, v]) => v && (
                  <div key={k} className="p-2.5 rounded-lg bg-white/[0.04]">
                    <p className="text-xs text-gray-500">{k}</p>
                    <p className="text-gray-200 font-medium truncate">{v}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <p className="text-xs text-primary-400 font-medium mb-1">AI Summary</p>
                <p className="text-xs text-gray-300 leading-relaxed">{report.summary}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> Skills Found ({report.skillsFound?.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {report.skillsFound?.map(s => (
                  <span key={s} className="badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{s}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400" /> Missing Skills ({report.skillsMissing?.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {report.skillsMissing?.map(s => (
                  <span key={s} className="badge bg-amber-500/15 text-amber-400 border border-amber-500/30">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                <Star size={16} className="text-blue-400" /> Strengths
              </h2>
              <ul className="space-y-2">
                {report.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-amber-400" /> Improvement Suggestions
              </h2>
              <ul className="space-y-2">
                {report.improvements?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeAnalyzer
