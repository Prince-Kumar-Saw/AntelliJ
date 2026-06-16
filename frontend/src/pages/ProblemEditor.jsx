import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { codingAPI } from '../services/api'
import { Play, Send, RotateCcw, ChevronLeft, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import clsx from 'clsx'

const DEMO_PROBLEM = {
  id: 1, title: 'Two Sum', difficulty: 'EASY', category: 'ARRAYS',
  description: `## Problem Statement

Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly **one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Examples

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Constraints
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- Only one valid answer exists`,
  starterCodeJava: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        // Hint: Use a HashMap for O(n) time complexity
        
    }
}`,
  starterCodePython: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass`,
  starterCodeCpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
    }
};`
}

function ProblemEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null)
  const [language, setLanguage] = useState('java')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('problem') // problem | submissions

  useEffect(() => {
    codingAPI.getProblem(id)
      .then(r => {
        setProblem(r.data)
        setCode(r.data.starterCodeJava || '')
      })
      .catch(() => {
        setProblem(DEMO_PROBLEM)
        setCode(DEMO_PROBLEM.starterCodeJava)
      })
  }, [id])

  const getStarterCode = (lang) => {
    if (!problem) return ''
    return lang === 'java' ? problem.starterCodeJava
         : lang === 'python' ? problem.starterCodePython
         : problem.starterCodeCpp || ''
  }

  const handleLangChange = (lang) => {
    setLanguage(lang)
    setCode(getStarterCode(lang))
  }

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Write some code first!'); return }
    setSubmitting(true)
    setOutput(null)
    try {
      const { data } = await codingAPI.submitCode({
        problemId: Number(id), code, language: language.toUpperCase()
      })
      setOutput(data)
      if (data.status === 'ACCEPTED') toast.success('🎉 Accepted! Great job!')
      else toast.error(`❌ ${data.status.replace('_', ' ')}`)
    } catch {
      setOutput({ status: 'RUNTIME_ERROR', testCasesPassed: 0, totalTestCases: 3 })
    } finally {
      setSubmitting(false)
    }
  }

  if (!problem) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col animate-fade-in -m-4 md:-m-6 lg:-m-8">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 glass border-b border-white/[0.06] flex-shrink-0">
        <button onClick={() => navigate('/dsa')} className="btn-ghost p-1.5">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-white text-sm truncate">{problem.title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={problem.difficulty === 'EASY' ? 'badge-easy' : problem.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'}>
              {problem.difficulty}
            </span>
            <span className="badge-blue">{problem.category}</span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
          {['java', 'python', 'cpp'].map(l => (
            <button key={l}
              onClick={() => handleLangChange(l)}
              className={clsx('px-3 py-1 rounded-md text-xs font-medium transition-all',
                language === l ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white')}>
              {l === 'cpp' ? 'C++' : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>

        <button onClick={() => setCode(getStarterCode(language))} className="btn-ghost p-1.5" title="Reset code">
          <RotateCcw size={16} />
        </button>
        <button onClick={handleSubmit} disabled={submitting}
          className="btn-primary px-4 py-2 text-sm">
          {submitting
            ? <span className="flex items-center gap-2"><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Judging...</span>
            : <span className="flex items-center gap-2"><Send size={14} />Submit</span>}
        </button>
      </div>

      {/* Main split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left - Problem */}
        <div className="flex flex-col overflow-hidden border-r border-white/[0.06]">
          <div className="flex border-b border-white/[0.06]">
            {['problem', 'submissions'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={clsx('px-4 py-2.5 text-sm font-medium transition-colors',
                  activeTab === t ? 'text-primary-400 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-300')}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
            {activeTab === 'problem' ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{problem.description}</ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">No submissions yet. Submit your first solution!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right - Editor */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={v => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbersMinChars: 3,
                automaticLayout: true,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                fontLigatures: true,
              }}
            />
          </div>

          {/* Output panel */}
          {output && (
            <div className={clsx('border-t p-4 flex-shrink-0 max-h-48 overflow-y-auto',
              output.status === 'ACCEPTED' ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-red-500/30 bg-red-500/5')}>
              <div className="flex items-center gap-2 mb-2">
                {output.status === 'ACCEPTED'
                  ? <CheckCircle size={16} className="text-emerald-400" />
                  : <XCircle size={16} className="text-red-400" />}
                <span className={clsx('font-semibold text-sm',
                  output.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-red-400')}>
                  {output.status?.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {output.testCasesPassed}/{output.totalTestCases} test cases passed
                </span>
              </div>
              {output.runtimeMs && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} /> Runtime: {output.runtimeMs}ms · Memory: {output.memoryMb}MB
                </p>
              )}
              {output.errorMessage && (
                <pre className="text-xs text-red-300 mt-2 overflow-auto">{output.errorMessage}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemEditor
