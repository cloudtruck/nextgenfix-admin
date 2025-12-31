import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 60000, // Increased to 60 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach token in browser only
apiClient.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      // noop
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: unwrap data and handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminInfo')
          window.location.href = '/login'
        }
      } catch {
        // noop
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
