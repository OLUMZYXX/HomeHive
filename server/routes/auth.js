import express from 'express'
import AuthService from '../authService/authService.js'
import JWTAuthService from '../jwtAuthService/jwtAuthService.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      })
    }
    const result = await AuthService.registerUser({
      email,
      password,
      name,
      phone,
    })
    res.status(201).json(result)
  } catch (error) {
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
    const result = await AuthService.registerHost({
      email,
      password,
      name,
      phone,
      businessName,
      businessType,
    })
    res.status(201).json(result)
  } catch (error) {
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
    const result = await AuthService.login(email, password, isHost)
    res.json(result)
  } catch (error) {
    res.status(401).json({ success: false, message: error.message })
  }
})

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const isHost = req.user.role === 'host'
    const result = await AuthService.logout(isHost)
    res.json(result)
  } catch (error) {
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
    const result = await AuthService.changePassword(
      currentPassword,
      newPassword,
      isHost
    )
    res.json(result)
  } catch (error) {
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
    const result = await AuthService.resetPassword(email, isHost)
    res.json(result)
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Get Current User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const isHost = req.user.role === 'host'
    const userProfile = await AuthService.getUserProfile(
      req.user.userId,
      isHost
    )
    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: 'User profile not found' })
    }
    const { password, ...safeUserProfile } = userProfile
    res.json({ success: true, user: safeUserProfile })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

export default router
