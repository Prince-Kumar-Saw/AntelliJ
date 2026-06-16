import React, { useState } from 'react'
import { adminAPI } from '../services/api'
import { Plus, Code2, Brain, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function AdminQuestions() {
  const [activeTab, setActiveTab] = useState('coding') // coding | aptitude
  const [codingForm, setCodingForm] = useState({
    title: '', slug: '', description: '', difficulty: 'EASY',
    category: 'ARRAYS', constraints: '', starterCodeJava: '', solutionJava: '',
  })
  const [aptitudeForm, setAptitudeForm] = useState({
    question: '', optionA: '', optionB: '', optionC: '', optionD: '',
    correctAnswer: 'A', explanation: '', category: 'QUANTITATIVE', difficulty: 'EASY',
  })
  const [saving, setSaving] = useState(false)

  const saveCoding = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminAPI.addCodingProblem(codingForm)
      toast.success('Coding problem added! ✅')
      setCodingForm({ title: '', slug: '', description: '', difficulty: 'EASY', category: 'ARRAYS', constraints: '', starterCodeJava: '', solutionJava: '' })
    } catch { toast.error('Failed to add problem') } finally { setSaving(false) }
  }

  const saveAptitude = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminAPI.addAptitudeQuestion(aptitudeForm)
      toast.success('Aptitude question added! ✅')
      setAptitudeForm({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', category: 'QUANTITATIVE', difficulty: 'EASY' })
    } catch { toast.error('Failed to add question') } finally { setSaving(false) }
  }

  const sc = (key) => (e) => setCodingForm(f => ({ ...f, [key]: e.target.value }))
  const sa = (key) => (e) => setAptitudeForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <h1 className="section-title flex items-center gap-2"><Plus size={22} /> Manage Questions</h1>
        <p className="section-subtitle">Add new coding problems and aptitude questions</p>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-900 mb-6 w-fit">
        {[['coding', Code2, 'Add Coding Problem'], ['aptitude', Brain, 'Add Aptitude Question']].map(([t, Icon, label]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === t ? 'bg-primary-500 text-white shadow' : 'text-gray-400 hover:text-white')}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'coding' ? (
        <form onSubmit={saveCoding} className="card space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Code2 size={16} className="text-primary-400" /> New Coding Problem</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Title *</label>
              <input required value={codingForm.title} onChange={sc('title')} placeholder="Two Sum" className="input" />
            </div>
            <div>
              <label className="label">Slug *</label>
              <input required value={codingForm.slug} onChange={sc('slug')} placeholder="two-sum" className="input" />
            </div>
            <div>
              <label className="label">Difficulty *</label>
              <select value={codingForm.difficulty} onChange={sc('difficulty')} className="input bg-gray-900">
                {['EASY', 'MEDIUM', 'HARD'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category *</label>
              <select value={codingForm.category} onChange={sc('category')} className="input bg-gray-900">
                {['ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'GREEDY', 'BACKTRACKING'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Problem Description * (Markdown supported)</label>
            <textarea required rows={6} value={codingForm.description} onChange={sc('description')}
              placeholder="## Problem Statement&#10;&#10;Given an array..." className="input resize-none font-mono text-sm" />
          </div>

          <div>
            <label className="label">Constraints</label>
            <textarea rows={2} value={codingForm.constraints} onChange={sc('constraints')}
              placeholder="1 <= n <= 10^4" className="input resize-none" />
          </div>

          <div>
            <label className="label">Java Starter Code</label>
            <textarea rows={6} value={codingForm.starterCodeJava} onChange={sc('starterCodeJava')}
              placeholder="class Solution {&#10;    public int[] twoSum(int[] nums, int target) {&#10;        // Write here&#10;    }&#10;}"
              className="input resize-none font-mono text-sm" />
          </div>

          <div>
            <label className="label">Java Solution (Hidden from students)</label>
            <textarea rows={8} value={codingForm.solutionJava} onChange={sc('solutionJava')}
              placeholder="class Solution {&#10;    // Solution code here&#10;}"
              className="input resize-none font-mono text-sm" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 gap-2">
            {saving ? 'Saving...' : <><Save size={16} /> Add Problem</>}
          </button>
        </form>
      ) : (
        <form onSubmit={saveAptitude} className="card space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Brain size={16} className="text-primary-400" /> New Aptitude Question</h2>

          <div>
            <label className="label">Question *</label>
            <textarea required rows={3} value={aptitudeForm.question} onChange={sa('question')}
              placeholder="What is the average speed if..." className="input resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D'].map(opt => (
              <div key={opt}>
                <label className="label">Option {opt} *</label>
                <input required value={aptitudeForm[`option${opt}`]} onChange={sa(`option${opt}`)}
                  placeholder={`Option ${opt}`} className="input" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Correct Answer *</label>
              <select value={aptitudeForm.correctAnswer} onChange={sa('correctAnswer')} className="input bg-gray-900">
                {['A', 'B', 'C', 'D'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category *</label>
              <select value={aptitudeForm.category} onChange={sa('category')} className="input bg-gray-900">
                {['QUANTITATIVE', 'LOGICAL', 'VERBAL'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty *</label>
              <select value={aptitudeForm.difficulty} onChange={sa('difficulty')} className="input bg-gray-900">
                {['EASY', 'MEDIUM', 'HARD'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Explanation / Solution</label>
            <textarea rows={3} value={aptitudeForm.explanation} onChange={sa('explanation')}
              placeholder="Step-by-step solution explanation..." className="input resize-none" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 gap-2">
            {saving ? 'Saving...' : <><Save size={16} /> Add Question</>}
          </button>
        </form>
      )}
    </div>
  )
}

export default AdminQuestions
