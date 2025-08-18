// Client-side token management service
export class TokenManager {
  static ACCESS_TOKEN_KEY = 'homehive_access_token'
  static REFRESH_TOKEN_KEY = 'homehive_refresh_token'
  static USER_DATA_KEY = 'homehive_user_data'

  // Store tokens in localStorage
  static setTokens(accessToken, refreshToken) {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      }
    } catch (error) {
      console.error('Error storing tokens:', error)
    }
  }

  // Get access token
  static getAccessToken() {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('Error getting access token:', error)
      return null
    }
  }

  // Get refresh token
  static getRefreshToken() {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Error getting refresh token:', error)
      return null
    }
  }

  // Clear all tokens
  static clearTokens() {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_DATA_KEY)
    } catch (error) {
      console.error('Error clearing tokens:', error)
    }
  }

  // Store user data
  static setUserData(userData) {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData))
    } catch (error) {
      console.error('Error storing user data:', error)
    }
  }

  // Get user data
  static getUserData() {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const token = this.getAccessToken()
    if (!token) return false

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp > currentTime
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return false
    }
  }

  // Alias for isAuthenticated (used in APIContext)
  static isLoggedIn() {
    return this.isAuthenticated()
  }

  // Get current user (used in APIContext)
  static getCurrentUser() {
    return this.getUserData()
  }

  // Check if token is expired
  static isTokenExpired(token = null) {
    const tokenToCheck = token || this.getAccessToken()
    if (!tokenToCheck) return true

    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp <= currentTime
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  }

  // Refresh token if needed
  static async refreshTokenIfNeeded() {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      return false
    }

    // Check if access token is expired or about to expire (within 5 minutes)
    if (accessToken && !this.isTokenExpired(accessToken)) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = payload.exp - currentTime

        // If token expires in more than 5 minutes, no need to refresh
        if (timeUntilExpiry > 300) {
          return true
        }
      } catch (error) {
        console.error('Error checking token expiry time:', error)
      }
    }

    try {
      // Make request to refresh endpoint
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
        }/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.accessToken) {
          this.setTokens(data.accessToken, data.refreshToken || refreshToken)
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    }
  }

  // Get user info from token
  static getUserFromToken(token = null) {
    const tokenToUse = token || this.getAccessToken()
    if (!tokenToUse) return null

    try {
      const payload = JSON.parse(atob(tokenToUse.split('.')[1]))
      return {
        id: payload.id,
        email: payload.email,
        userType: payload.userType,
        iat: payload.iat,
        exp: payload.exp,
      }
    } catch (error) {
      console.error('Error parsing token:', error)
      return null
    }
  }

  // Initialize token manager (check for existing tokens on app start)
  static initialize() {
    try {
      const accessToken = this.getAccessToken()
      if (accessToken && this.isTokenExpired(accessToken)) {
        // Token is expired, try to refresh
        this.refreshTokenIfNeeded().catch(() => {
          // If refresh fails, clear tokens
          this.clearTokens()
        })
      }
    } catch (error) {
      console.error('Error initializing token manager:', error)
    }
  }
}

export default TokenManager
