import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Calculator, Lightbulb, BookOpen, Clock, Trophy, ArrowRight, ChevronRight } from 'lucide-react'

const categories = [
  {
    id: 'QUANTITATIVE',
    title: 'Quantitative Aptitude',
    icon: Calculator,
    color: 'from-blue-600 to-cyan-500',
    glow: 'shadow-blue-500/25',
    desc: 'Number systems, percentages, profit & loss, time & work, speed & distance',
    topics: ['Percentages', 'Profit & Loss', 'Time & Work', 'Speed & Distance', 'Geometry'],
    questions: 120,
    avgTime: '45 min',
    difficulty: 'Medium',
  },
  {
    id: 'LOGICAL',
    title: 'Logical Reasoning',
    icon: Lightbulb,
    color: 'from-purple-600 to-accent-500',
    glow: 'shadow-purple-500/25',
    desc: 'Puzzles, syllogisms, coding-decoding, series, blood relations',
    topics: ['Syllogisms', 'Coding-Decoding', 'Series', 'Blood Relations', 'Directions'],
    questions: 100,
    avgTime: '40 min',
    difficulty: 'Medium',
  },
  {
    id: 'VERBAL',
    title: 'Verbal Ability',
    icon: BookOpen,
    color: 'from-emerald-600 to-teal-500',
    glow: 'shadow-emerald-500/25',
    desc: 'Vocabulary, grammar, reading comprehension, sentence completion',
    topics: ['Synonyms & Antonyms', 'Sentence Correction', 'Reading Comprehension', 'Fill in the Blanks'],
    questions: 80,
    avgTime: '35 min',
    difficulty: 'Easy-Medium',
  },
]

function AptitudeModule() {
  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2"><Brain size={24} /> Aptitude Tests</h1>
          <p className="section-subtitle">Sharpen your aptitude skills for campus placements and competitive exams</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <Trophy size={16} className="text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold">Best Score: 92%</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Tests Completed', value: '18', icon: Trophy, color: 'text-amber-400' },
          { label: 'Avg Score', value: '76%', icon: Brain, color: 'text-primary-400' },
          { label: 'Hours Practiced', value: '12.5', icon: Clock, color: 'text-emerald-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center py-4">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <p className={`text-2xl font-black font-display ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Test Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map(({ id, title, icon: Icon, color, glow, desc, topics, questions, avgTime, difficulty }) => (
          <div key={id} className="card group flex flex-col">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg ${glow} group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={26} className="text-white" />
            </div>

            <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-1">{desc}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {topics.slice(0, 3).map(t => (
                <span key={t} className="badge-blue text-xs">{t}</span>
              ))}
              {topics.length > 3 && <span className="badge text-xs text-gray-500 bg-white/[0.04]">+{topics.length - 3}</span>}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-3 border-t border-white/[0.06]">
              <span className="flex items-center gap-1"><Brain size={11} /> {questions} Questions</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {avgTime}</span>
            </div>

            <Link
              to={`/aptitude/test/${id}`}
              id={`start-${id.toLowerCase()}-test`}
              className={`btn bg-gradient-to-r ${color} text-white hover:opacity-90 active:scale-95 w-full justify-center`}
            >
              Start Test <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Results */}
      <div className="card">
        <h2 className="font-bold text-white mb-4">Recent Test Results</h2>
        <div className="space-y-3">
          {[
            { cat: 'QUANTITATIVE', score: 85, total: 20, date: '2 days ago', passed: true },
            { cat: 'LOGICAL', score: 72, total: 20, date: '4 days ago', passed: true },
            { cat: 'VERBAL', score: 55, total: 20, date: '1 week ago', passed: false },
          ].map(({ cat, score, total, date, passed }, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                               ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {Math.round((score / total) * 100)}%
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-200">{cat.charAt(0) + cat.slice(1).toLowerCase()} Aptitude</p>
                <p className="text-xs text-gray-500">{score}/{total} correct · {date}</p>
              </div>
              <span className={passed ? 'badge-success' : 'badge-danger'}>
                {passed ? 'Passed' : 'Failed'}
              </span>
              <ChevronRight size={14} className="text-gray-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AptitudeModule
