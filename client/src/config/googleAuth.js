// Google OAuth Configuration for HomeHive
// Using Google Identity Services with popup handling

class GoogleAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return

    if (!this.clientId) {
      throw new Error(
        'Google Client ID not configured. Please check your .env file.'
      )
    }

    try {
      // Load Google Identity Services
      await this.loadGoogleIdentityScript()

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      this.isInitialized = true
      console.log('Google Auth initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error)
      throw new Error(
        `Google authentication initialization failed: ${error.message}`
      )
    }
  }

  loadGoogleIdentityScript() {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google && window.google.accounts) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true

      script.onload = () => {
        // Wait a bit for the script to be fully ready
        setTimeout(() => {
          if (window.google && window.google.accounts) {
            resolve()
          } else {
            reject(new Error('Google script loaded but APIs not available'))
          }
        }, 100)
      }

      script.onerror = () =>
        reject(new Error('Failed to load Google Identity Services'))
      document.head.appendChild(script)
    })
  }

  async signIn() {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      try {
        // Store the resolve/reject functions for the callback
        this.pendingPromise = { resolve, reject }

        // Create a temporary container for the Google Sign-In button
        const tempContainer = document.createElement('div')
        tempContainer.style.position = 'fixed'
        tempContainer.style.top = '-1000px'
        tempContainer.style.left = '-1000px'
        tempContainer.style.zIndex = '-1000'
        document.body.appendChild(tempContainer)

        // Render Google Sign-In button
        window.google.accounts.id.renderButton(tempContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          width: 250,
        })

        // Auto-click the button after a short delay
        setTimeout(() => {
          const googleButton = tempContainer.querySelector('div[role="button"]')
          if (googleButton) {
            googleButton.click()
          } else {
            // Fallback: try using the prompt method
            window.google.accounts.id.prompt((notification) => {
              if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
              ) {
                reject(new Error('Google sign-in was cancelled or blocked'))
              }
            })
          }

          // Clean up the temporary container
          setTimeout(() => {
            if (document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer)
            }
          }, 100)
        }, 200)

        // Set a timeout to reject if no response
        setTimeout(() => {
          if (this.pendingPromise) {
            this.pendingPromise.reject(new Error('Google sign-in timeout'))
            this.pendingPromise = null
          }
        }, 30000) // 30 second timeout
      } catch (error) {
        console.error('Google sign-in failed:', error)
        reject(new Error(`Google sign-in failed: ${error.message}`))
      }
    })
  }

  handleCredentialResponse(response) {
    try {
      if (!response || !response.credential) {
        throw new Error('No credential received from Google')
      }

      // Decode JWT token to get user info
      const payload = this.parseJwt(response.credential)

      const userInfo = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        firstName: payload.given_name,
        lastName: payload.family_name,
        idToken: response.credential,
      }

      console.log('Google sign-in successful:', userInfo.email)

      if (this.pendingPromise) {
        this.pendingPromise.resolve(userInfo)
        this.pendingPromise = null
      }
    } catch (error) {
      console.error('Failed to handle Google credential:', error)
      if (this.pendingPromise) {
        this.pendingPromise.reject(
          new Error(`Failed to process Google credentials: ${error.message}`)
        )
        this.pendingPromise = null
      }
    }
  }

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to parse JWT token:', error)
      throw new Error('Invalid token format')
    }
  }

  async signOut() {
    try {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect()
      }
      console.log('Google sign-out completed')
    } catch (error) {
      console.error('Google sign-out failed:', error)
    }
  }

  isSignedIn() {
    // With Google Identity Services, we don't maintain persistent sign-in state
    // Each sign-in is handled per session
    return false
  }

  getCurrentUser() {
    // Not applicable with Google Identity Services
    // User info is obtained during sign-in process
    return null
  }
}

export default new GoogleAuth()
