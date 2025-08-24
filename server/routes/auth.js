import express from 'express'
import MongoAuthService from '../authService/mongoAuthService.js'
import HostAuthService from '../authService/hostAuthService.js'
import JWTAuthService from '../jwtAuthService/jwtAuthService.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { OAuth2Client } from 'google-auth-library'
import { Property } from '../models/mongodb-models.js'

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
    const result = await HostAuthService.registerHost({
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

// Host Login (specific endpoint for hosts)
router.post('/host-login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' })
    }

    const result = await HostAuthService.loginHost(email, password)
    res.json(result)
  } catch (error) {
    console.error('Host login error:', error)
    res.status(401).json({ success: false, message: error.message })
  }
})

// User Login (separate from host login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' })
    }
    // Only allow user login, not hosts
    const result = await MongoAuthService.login(email, password)
    res.json(result)
  } catch (error) {
    console.error('User login error:', error)
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

// Get Current User or Host
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userType = req.user.userType || req.user.role
    let userProfile

    if (userType === 'host') {
      userProfile = await HostAuthService.getHostProfile(
        req.user.userId || req.user.id
      )
    } else {
      userProfile = await MongoAuthService.getUserProfile(
        req.user.userId || req.user.id
      )
    }

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

// Google OAuth Login/Register for Hosts
router.post('/google-host', async (req, res) => {
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
      console.log('Google OAuth payload verified for host:', payload.email)

      // Use verified data from Google
      const { email, name, given_name, family_name, picture } = payload

      // Use the new HostAuthService for Google OAuth
      const result = await HostAuthService.googleAuthHost({
        email,
        name: name || `${given_name} ${family_name}`,
        googleId: payload.sub,
        picture,
      })

      res.json(result)
    } catch (verificationError) {
      console.error('Google token verification failed:', verificationError)
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token',
      })
    }
  } catch (error) {
    console.error('Google host auth error:', error)
    res.status(500).json({ success: false, message: error.message })
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

// Host Property Management Routes

// Get all properties for authenticated host
router.get('/host/properties', authenticateToken, async (req, res) => {
  try {
    // Check if user is a host
    if (req.user.userType !== 'host' && req.user.role !== 'host') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Host privileges required.',
      })
    }

    // Get properties belonging to this host
    const hostId = req.user.id || req.user.userId
    console.log('🏠 Looking for properties with hostId:', hostId)
    console.log('🔍 Host user info:', {
      userType: req.user.userType,
      role: req.user.role,
    })

    const properties = await Property.find({
      hostId: hostId,
      isActive: { $ne: false },
    }).sort({ createdAt: -1 })

    console.log('📊 Found properties:', properties.length)

    res.json({
      success: true,
      data: properties,
      count: properties.length,
      message: `Found ${properties.length} properties`,
    })
  } catch (error) {
    console.error('Error fetching host properties:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message,
    })
  }
})

// Create a new property
router.post('/host/properties', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'host' && req.user.role !== 'host') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Host privileges required.',
      })
    }

    const hostId = req.user.id || req.user.userId
    console.log('🏗️ Creating property for hostId:', hostId)

    const propertyData = {
      ...req.body,
      hostId: hostId,
      hostName: req.user.name || req.user.firstName || 'Host',
      isActive: true,
      isAvailable: true,
    }

    const property = new Property(propertyData)
    await property.save()

    res.status(201).json({
      success: true,
      data: property,
      message: 'Property created successfully',
    })
  } catch (error) {
    console.error('Error creating property:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message,
    })
  }
})

// Update a property
router.put('/host/properties/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'host' && req.user.role !== 'host') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Host privileges required.',
      })
    }

    const property = await Property.findOne({
      _id: req.params.id,
      hostId: req.user.id,
    })

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      })
    }

    Object.assign(property, req.body)
    await property.save()

    res.json({
      success: true,
      data: property,
      message: 'Property updated successfully',
    })
  } catch (error) {
    console.error('Error updating property:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: error.message,
    })
  }
})

// Delete a property
router.delete('/host/properties/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'host' && req.user.role !== 'host') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Host privileges required.',
      })
    }

    const property = await Property.findOne({
      _id: req.params.id,
      hostId: req.user.id,
    })

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      })
    }

    // Soft delete - just mark as inactive
    property.isActive = false
    await property.save()

    res.json({
      success: true,
      message: 'Property deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting property:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message,
    })
  }
})

// Get a single property by ID
router.get('/host/properties/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'host' && req.user.role !== 'host') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Host privileges required.',
      })
    }

    const property = await Property.findOne({
      _id: req.params.id,
      hostId: req.user.id,
    })

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      })
    }

    res.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error: error.message,
    })
  }
})

export default router
