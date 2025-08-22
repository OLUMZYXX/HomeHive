import axios from 'axios'
import { TokenManager } from '../services/jwtAuthService'

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 seconds timeout - increased from 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Check if error is due to expired token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (error.response?.data?.message?.includes('expired') ||
        error.response?.data?.message?.includes('Invalid token'))
    ) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshed = await TokenManager.refreshTokenIfNeeded()

        if (refreshed) {
          // Update the authorization header with new token
          const newToken = TokenManager.getAccessToken()
          originalRequest.headers.Authorization = `Bearer ${newToken}`

          // Retry the original request
          return axiosInstance(originalRequest)
        } else {
          // Refresh failed, redirect to login
          TokenManager.clearTokens()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        TokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
