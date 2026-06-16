import React, { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'
import { Search, ToggleLeft, ToggleRight, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const DEMO_USERS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 2,
  name: ['Rahul Verma', 'Priya Sharma', 'Anjali Patel', 'Arjun Singh', 'Sneha Gupta',
         'Rohan Das', 'Meera Nair', 'Vivek Kumar', 'Ananya Joshi', 'Deepak Rao',
         'Kavya Reddy', 'Sumit Yadav'][i],
  email: `user${i + 2}@example.com`,
  role: 'STUDENT',
  isActive: i !== 3,
  emailVerified: i !== 5,
  createdAt: new Date(Date.now() - i * 86400000 * 3).toLocaleDateString(),
  problemsSolved: Math.floor(Math.random() * 30),
  testsCompleted: Math.floor(Math.random() * 10),
}))

function AdminUsers() {
  const [users, setUsers] = useState(DEMO_USERS)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const pageSize = 8

  useEffect(() => {
    adminAPI.getUsers({ page, size: pageSize, search }).then(r => {
      setUsers(r.data.content || DEMO_USERS)
    }).catch(() => {})
  }, [page])

  const toggleStatus = async (userId, current) => {
    try {
      await adminAPI.updateUserStatus(userId, !current)
      setUsers(us => us.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u))
      toast.success(`User ${!current ? 'activated' : 'deactivated'}`)
    } catch { toast.error('Failed to update status') }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2"><Users size={22} /> User Management</h1>
          <p className="section-subtitle">Manage student accounts and access</p>
        </div>
        <span className="badge-blue text-sm px-3 py-1">{filtered.length} Users</span>
      </div>

      <div className="card mb-4 p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-10" />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Problems</th>
              <th>Tests</th>
              <th>Joined</th>
              <th>Verified</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(page * pageSize, (page + 1) * pageSize).map(u => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600
                                    flex items-center justify-center text-white text-xs font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td><span className={u.role === 'ADMIN' ? 'badge-purple' : 'badge-blue'}>{u.role}</span></td>
                <td className="text-gray-400 text-sm">{u.problemsSolved ?? '—'}</td>
                <td className="text-gray-400 text-sm">{u.testsCompleted ?? '—'}</td>
                <td className="text-gray-500 text-xs">{u.createdAt}</td>
                <td>
                  <span className={u.emailVerified ? 'badge-success' : 'badge-danger'}>
                    {u.emailVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span className={u.isActive ? 'badge-success' : 'badge-danger'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    id={`toggle-user-${u.id}`}
                    onClick={() => toggleStatus(u.id, u.isActive)}
                    title={u.isActive ? 'Deactivate user' : 'Activate user'}
                    className={`p-1 rounded-lg transition-colors ${u.isActive ? 'text-red-400 hover:bg-red-500/15' : 'text-emerald-400 hover:bg-emerald-500/15'}`}>
                    {u.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Showing {Math.min(page * pageSize + 1, filtered.length)}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="btn-outline p-2 disabled:opacity-40"><ChevronLeft size={16} /></button>
          <button onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * pageSize >= filtered.length}
            className="btn-outline p-2 disabled:opacity-40"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
