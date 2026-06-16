import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { codingAPI } from '../services/api'
import { Search, Filter, Code2, CheckCircle, Clock, BarChart3 } from 'lucide-react'
import clsx from 'clsx'

const categories = ['ALL', 'ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'GREEDY', 'BACKTRACKING']
const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD']

const DEMO_PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'EASY', category: 'ARRAYS', acceptanceRate: 48.2, slug: 'two-sum' },
  { id: 2, title: 'Reverse String', difficulty: 'EASY', category: 'STRINGS', acceptanceRate: 72.1, slug: 'reverse-string' },
  { id: 3, title: 'Merge Two Sorted Lists', difficulty: 'EASY', category: 'LINKED_LISTS', acceptanceRate: 61.5, slug: 'merge-two-sorted-lists' },
  { id: 4, title: 'Maximum Depth of Binary Tree', difficulty: 'EASY', category: 'TREES', acceptanceRate: 73.4, slug: 'maximum-depth-binary-tree' },
  { id: 5, title: 'Climbing Stairs', difficulty: 'EASY', category: 'DYNAMIC_PROGRAMMING', acceptanceRate: 51.2, slug: 'climbing-stairs' },
  { id: 6, title: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', category: 'STRINGS', acceptanceRate: 33.8, slug: 'longest-substring-no-repeat' },
  { id: 7, title: 'Number of Islands', difficulty: 'MEDIUM', category: 'GRAPHS', acceptanceRate: 57.3, slug: 'number-of-islands' },
  { id: 8, title: 'Coin Change', difficulty: 'MEDIUM', category: 'DYNAMIC_PROGRAMMING', acceptanceRate: 41.6, slug: 'coin-change' },
  { id: 9, title: 'Binary Tree Level Order Traversal', difficulty: 'MEDIUM', category: 'TREES', acceptanceRate: 63.2, slug: 'binary-tree-level-order' },
  { id: 10, title: 'Word Ladder', difficulty: 'HARD', category: 'GRAPHS', acceptanceRate: 35.5, slug: 'word-ladder' },
  { id: 11, title: 'Longest Valid Parentheses', difficulty: 'HARD', category: 'DYNAMIC_PROGRAMMING', acceptanceRate: 32.8, slug: 'longest-valid-parentheses' },
  { id: 12, title: 'Trapping Rain Water', difficulty: 'HARD', category: 'ARRAYS', acceptanceRate: 57.9, slug: 'trapping-rain-water' },
]

const solvedProblems = new Set([1, 2, 5]) // demo solved

function DSAModule() {
  const [problems, setProblems] = useState(DEMO_PROBLEMS)
  const [category, setCategory] = useState('ALL')
  const [difficulty, setDifficulty] = useState('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = {}
    if (category !== 'ALL') params.category = category
    if (difficulty !== 'ALL') params.difficulty = difficulty
    setLoading(true)
    codingAPI.getProblems(params)
      .then(r => setProblems(r.data.content || DEMO_PROBLEMS))
      .catch(() => {}) // use demo data
      .finally(() => setLoading(false))
  }, [category, difficulty])

  const filtered = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'ALL' || p.category === category) &&
    (difficulty === 'ALL' || p.difficulty === difficulty)
  )

  const counts = {
    EASY: problems.filter(p => p.difficulty === 'EASY').length,
    MEDIUM: problems.filter(p => p.difficulty === 'MEDIUM').length,
    HARD: problems.filter(p => p.difficulty === 'HARD').length,
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2"><Code2 size={24} /> DSA Practice</h1>
          <p className="section-subtitle">Master Data Structures & Algorithms — one problem at a time</p>
        </div>
        <div className="flex gap-3 text-sm">
          {[['EASY', 'text-emerald-400'], ['MEDIUM', 'text-amber-400'], ['HARD', 'text-red-400']].map(([d, c]) => (
            <div key={d} className={`text-center px-3 py-1.5 rounded-lg bg-white/[0.04] ${c}`}>
              <p className="font-bold">{counts[d]}</p>
              <p className="text-xs text-gray-500">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text" placeholder="Search problems..."
            className="input pl-10" value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 flex items-center gap-1 mr-1"><Filter size={12} /> Difficulty:</span>
          {difficulties.map(d => (
            <button key={d}
              onClick={() => setDifficulty(d)}
              className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-all',
                difficulty === d
                  ? d === 'EASY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : d === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : d === 'HARD' ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                  : 'bg-white/[0.04] text-gray-400 border border-transparent hover:border-gray-700'
              )}>
              {d}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 flex items-center gap-1 mr-1"><BarChart3 size={12} /> Topic:</span>
          {categories.map(c => (
            <button key={c}
              onClick={() => setCategory(c)}
              className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-all',
                category === c
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                  : 'bg-white/[0.04] text-gray-400 border border-transparent hover:border-gray-700'
              )}>
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Problem</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Acceptance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-gray-500 py-12">No problems found</td></tr>
            ) : filtered.map((p, i) => {
              const solved = solvedProblems.has(p.id)
              return (
                <tr key={p.id} className={solved ? 'bg-emerald-500/[0.03]' : ''}>
                  <td className="text-gray-500 text-xs w-12">{i + 1}</td>
                  <td>
                    <Link to={`/dsa/${p.id}`}
                      className="font-medium text-gray-200 hover:text-primary-400 transition-colors">
                      {p.title}
                    </Link>
                  </td>
                  <td>
                    <span className="badge-blue text-xs">{p.category?.replace('_', ' ')}</span>
                  </td>
                  <td>
                    <span className={
                      p.difficulty === 'EASY' ? 'badge-easy' :
                      p.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'
                    }>{p.difficulty}</span>
                  </td>
                  <td className="text-gray-400 text-sm">{p.acceptanceRate?.toFixed(1)}%</td>
                  <td>
                    {solved
                      ? <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle size={13} /> Solved</span>
                      : <span className="flex items-center gap-1 text-gray-600 text-xs"><Clock size={13} /> Todo</span>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DSAModule
