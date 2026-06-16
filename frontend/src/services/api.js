import axios from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post('/api/auth/refresh', { refreshToken })
        localStorage.setItem('accessToken', data.accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong'
    if (error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

// ---- Auth ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
}

// ---- Dashboard ----
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getWeeklyPerformance: () => api.get('/dashboard/weekly-performance'),
}

// ---- Coding / DSA ----
export const codingAPI = {
  getProblems: (params) => api.get('/coding/problems', { params }),
  getProblem: (id) => api.get(`/coding/problems/${id}`),
  getProblemBySlug: (slug) => api.get(`/coding/problems/slug/${slug}`),
  submitCode: (data) => api.post('/coding/submit', data),
  getMySubmissions: (params) => api.get('/coding/submissions/me', { params }),
}

// ---- Aptitude ----
export const aptitudeAPI = {
  getCategories: () => api.get('/aptitude/categories'),
  getQuestions: (category, count) => api.get(`/aptitude/questions/${category}`, { params: { count } }),
  submitTest: (data) => api.post('/aptitude/submit', data),
  getMyResults: (params) => api.get('/aptitude/results/me', { params }),
  getResult: (id) => api.get(`/aptitude/results/${id}`),
}

// ---- Resume ----
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getReport: (id) => api.get(`/resume/report/${id}`),
  getMyReports: () => api.get('/resume/reports/me'),
}

// ---- Mock Interview ----
export const interviewAPI = {
  start: (data) => api.post('/interview/start', data),
  answer: (data) => api.post('/interview/answer', data),
  getReport: (id) => api.get(`/interview/report/${id}`),
  getHistory: (params) => api.get('/interview/history/me', { params }),
}

// ---- Progress ----
export const progressAPI = {
  getStreak: () => api.get('/progress/streak'),
  getTopicPerformance: () => api.get('/progress/topic-performance'),
  getRecommendations: () => api.get('/progress/recommendations'),
}

// ---- Profile ----
export const profileAPI = {
  getProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.put('/profile/me', data),
}

// ---- Admin ----
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  addCodingProblem: (data) => api.post('/admin/coding/problems', data),
  addAptitudeQuestion: (data) => api.post('/admin/aptitude/questions', data),
  getAnalytics: () => api.get('/admin/analytics'),
}
