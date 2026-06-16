import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileAPI } from '../services/api'
import { User, Mail, Phone, MapPin, Github, Linkedin,
         GraduationCap, Code2, Save, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: '', college: '', degree: '', branch: '', graduationYear: '',
    skills: '', bio: '', githubUrl: '', linkedinUrl: '', phone: '', location: '',
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    profileAPI.getProfile()
      .then(r => {
        const p = r.data
        setForm({
          name: user?.name || '',
          college: p.college || '',
          degree: p.degree || '',
          branch: p.branch || '',
          graduationYear: p.graduationYear || '',
          skills: p.skills || '',
          bio: p.bio || '',
          githubUrl: p.githubUrl || '',
          linkedinUrl: p.linkedinUrl || '',
          phone: p.phone || '',
          location: p.location || '',
        })
      })
      .catch(() => setForm(f => ({ ...f, name: user?.name || '' })))
      .finally(() => setLoading(false))
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await profileAPI.updateProfile(form)
      updateUser({ name: form.name })
      toast.success('Profile updated successfully! ✅')
    } catch {
      toast.error('Failed to save profile')
    } finally { setSaving(false) }
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const InputField = ({ label, id, value, onChange, placeholder, icon: Icon, type = 'text' }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />}
        <input id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder}
          className={`input ${Icon ? 'pl-10' : ''}`} />
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <h1 className="section-title flex items-center gap-2"><User size={24} /> Profile & Settings</h1>
        <p className="section-subtitle">Manage your account and learning profile</p>
      </div>

      {/* Avatar Card */}
      <div className="card mb-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                          flex items-center justify-center text-white text-3xl font-black shadow-glow">
            {form.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gray-800 border border-gray-700
                              flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Camera size={12} className="text-gray-400" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="badge-blue">Student</span>
            {form.college && <span className="badge-purple">{form.college}</span>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Personal Info */}
        <div className="card mb-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <User size={16} className="text-primary-400" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name" id="profile-name" value={form.name} onChange={set('name')}
              placeholder="Your full name" icon={User} />
            <InputField label="Phone" id="profile-phone" value={form.phone} onChange={set('phone')}
              placeholder="+91 98765 43210" icon={Phone} />
            <InputField label="Location" id="profile-location" value={form.location} onChange={set('location')}
              placeholder="Mumbai, India" icon={MapPin} />
          </div>
        </div>

        {/* Academic Info */}
        <div className="card mb-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <GraduationCap size={16} className="text-primary-400" /> Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="College / University" id="profile-college" value={form.college} onChange={set('college')}
              placeholder="State Engineering College" />
            <InputField label="Degree" id="profile-degree" value={form.degree} onChange={set('degree')}
              placeholder="B.Tech / M.Tech" />
            <InputField label="Branch" id="profile-branch" value={form.branch} onChange={set('branch')}
              placeholder="Computer Science & Engineering" />
            <InputField label="Graduation Year" id="profile-grad-year" value={form.graduationYear}
              onChange={set('graduationYear')} placeholder="2025" type="number" />
          </div>
        </div>

        {/* Technical Profile */}
        <div className="card mb-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Code2 size={16} className="text-primary-400" /> Technical Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-skills" className="label">Skills (comma-separated)</label>
              <input id="profile-skills" value={form.skills} onChange={set('skills')}
                placeholder="Java, React, Spring Boot, MySQL, Git, Docker"
                className="input" />
              <p className="text-xs text-gray-500 mt-1">These skills will be used for ATS matching in resume analysis</p>
            </div>
            <div>
              <label htmlFor="profile-bio" className="label">Bio</label>
              <textarea id="profile-bio" rows={3} value={form.bio} onChange={set('bio')}
                placeholder="Final year CS student passionate about backend development..."
                className="input resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="GitHub Profile" id="profile-github" value={form.githubUrl}
                onChange={set('githubUrl')} placeholder="https://github.com/yourname" icon={Github} />
              <InputField label="LinkedIn Profile" id="profile-linkedin" value={form.linkedinUrl}
                onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/yourname" icon={Linkedin} />
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="card mb-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Mail size={16} className="text-primary-400" /> Account
          </h2>
          <div>
            <label className="label">Email Address</label>
            <input value={user?.email || ''} disabled className="input opacity-50 cursor-not-allowed" />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>
        </div>

        {/* Save */}
        <button id="save-profile-btn" type="submit" disabled={saving}
          className="btn-primary w-full py-3.5 text-base gap-2">
          {saving
            ? <span className="flex items-center gap-2 justify-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
            : <span className="flex items-center gap-2 justify-center"><Save size={18} /> Save Profile</span>}
        </button>
      </form>
    </div>
  )
}

export default ProfilePage
