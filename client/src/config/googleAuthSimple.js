// Simplified Google OAuth Configuration
// This version uses a more direct approach to avoid popup issues

class SimpleGoogleAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return

    if (!this.clientId) {
      throw new Error('Google Client ID not configured')
    }

    try {
      await this.loadGoogleScript()

      // Initialize with simple configuration
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false,
      })

      this.isInitialized = true
      console.log('Simple Google Auth initialized')
    } catch (error) {
      console.error('Google Auth initialization failed:', error)
      throw error
    }
  }

  loadGoogleScript() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true

      script.onload = () => {
        const checkGoogle = () => {
          if (window.google?.accounts?.id) {
            resolve()
          } else {
            setTimeout(checkGoogle, 100)
          }
        }
        checkGoogle()
      }

      script.onerror = () => reject(new Error('Failed to load Google script'))
      document.head.appendChild(script)
    })
  }

  async signIn() {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      this.pendingPromise = { resolve, reject }

      // Create visible Google button that user can click
      const buttonContainer = document.createElement('div')
      buttonContainer.style.position = 'fixed'
      buttonContainer.style.top = '50%'
      buttonContainer.style.left = '50%'
      buttonContainer.style.transform = 'translate(-50%, -50%)'
      buttonContainer.style.zIndex = '9999'
      buttonContainer.style.backgroundColor = 'white'
      buttonContainer.style.padding = '20px'
      buttonContainer.style.borderRadius = '10px'
      buttonContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'

      const overlay = document.createElement('div')
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100%'
      overlay.style.height = '100%'
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'
      overlay.style.zIndex = '9998'

      const title = document.createElement('h3')
      title.textContent = 'Sign in with Google'
      title.style.marginBottom = '15px'
      title.style.textAlign = 'center'

      const cancelButton = document.createElement('button')
      cancelButton.textContent = 'Cancel'
      cancelButton.style.marginTop = '10px'
      cancelButton.style.padding = '5px 15px'
      cancelButton.style.marginLeft = '10px'
      cancelButton.onclick = () => {
        document.body.removeChild(overlay)
        document.body.removeChild(buttonContainer)
        reject(new Error('User cancelled'))
      }

      buttonContainer.appendChild(title)

      // Render Google button
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        width: 250,
      })

      buttonContainer.appendChild(cancelButton)

      document.body.appendChild(overlay)
      document.body.appendChild(buttonContainer)

      // Cleanup function
      this.cleanup = () => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay)
        }
        if (document.body.contains(buttonContainer)) {
          document.body.removeChild(buttonContainer)
        }
      }

      // Timeout
      setTimeout(() => {
        if (this.pendingPromise) {
          this.cleanup()
          this.pendingPromise.reject(new Error('Timeout'))
          this.pendingPromise = null
        }
      }, 60000)
    })
  }

  handleCredentialResponse(response) {
    if (this.cleanup) {
      this.cleanup()
    }

    if (!this.pendingPromise) return

    try {
      if (!response?.credential) {
        throw new Error('No credential received')
      }

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
      this.pendingPromise.resolve(userInfo)
      this.pendingPromise = null
    } catch (error) {
      console.error('Google credential error:', error)
      this.pendingPromise.reject(error)
      this.pendingPromise = null
    }
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  }
}

export default new SimpleGoogleAuth()
