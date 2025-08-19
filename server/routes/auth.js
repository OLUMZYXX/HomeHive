import express from 'express'
import MongoAuthService from '../authService/mongoAuthService.js'
import JWTAuthService from '../jwtAuthService/jwtAuthService.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { OAuth2Client } from 'google-auth-library'

const router = express.Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, firstName, lastName, phone } = req.body
    if (!email || !password || (!name && (!firstName || !lastName))) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      })
    }
    const result = await MongoAuthService.registerUser({
      email,
      password,
      name,
      firstName,
      lastName,
      phone,
    })
    res.status(201).json(result)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Host Registration
router.post('/register-host', async (req, res) => {
  try {
    const { email, password, name, phone, businessName, businessType } =
      req.body
    if (!email || !password || !name || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, name, and business name are required',
      })
    }
    const result = await MongoAuthService.registerHost({
      email,
      password,
      name,
      phone,
      businessName,
      businessType,
    })
    res.status(201).json(result)
  } catch (error) {
    console.error('Host registration error:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, isHost = false } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' })
    }
    const result = await MongoAuthService.login(email, password, isHost)
    res.json(result)
  } catch (error) {
    console.error('Login error:', error)
    res.status(401).json({ success: false, message: error.message })
  }
})

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const isHost = req.user.role === 'host'
    const result = await MongoAuthService.logout(isHost)
    res.json(result)
  } catch (error) {
    console.error('Logout error:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Refresh Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: 'Refresh token required' })
    }
    const newAccessToken = JWTAuthService.refreshAccessToken(refreshToken)
    res.json({ success: true, accessToken: newAccessToken })
  } catch (error) {
    res.status(401).json({ success: false, message: error.message })
  }
})

// Change Password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      })
    }
    const isHost = req.user.role === 'host'
    const result = await MongoAuthService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword,
      isHost
    )
    res.json(result)
  } catch (error) {
    console.error('Change password error:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, isHost = false } = req.body
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' })
    }
    const result = await MongoAuthService.resetPassword(email, isHost)
    res.json(result)
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Get Current User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const isHost = req.user.role === 'host'
    const userProfile = await MongoAuthService.getUserProfile(
      req.user.userId,
      isHost
    )
    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: 'User profile not found' })
    }
    res.json({ success: true, user: userProfile })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Google OAuth Login/Register
router.post('/google', async (req, res) => {
  try {
    const { idToken, userData } = req.body

    if (!idToken || !userData) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token and user data are required',
      })
    }

    // Verify Google ID token
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()
      console.log('Google OAuth payload verified:', payload.email)

      // Use verified data from Google
      const { email, name, given_name, family_name, picture } = payload

      // Try to find existing user
      try {
        // Try to login existing user
        const loginResult = await MongoAuthService.loginByEmail(email)

        // Update user's profile picture and last login if they exist
        await MongoAuthService.updateUserProfile(loginResult.user.userId, {
          profilePicture: picture,
          lastLogin: new Date(),
        })

        console.log('Existing Google user logged in:', email)
        res.json(loginResult)
      } catch (loginError) {
        // User doesn't exist, create new account
        console.log('Creating new Google user:', email)

        const registerResult = await MongoAuthService.registerUser({
          email,
          name: name || `${given_name} ${family_name}`,
          firstName: given_name || name.split(' ')[0],
          lastName: family_name || name.split(' ')[1] || '',
          profilePicture: picture,
          password: 'google_oauth_' + Date.now(), // Random password for OAuth users
          provider: 'google',
          googleId: payload.sub,
          lastLogin: new Date(),
        })

        console.log('New Google user registered:', email)
        res.status(201).json(registerResult)
      }
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError.message)
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token',
      })
    }
  } catch (error) {
    console.error('Google OAuth error:', error)
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
    })
  }
})

export default router
