import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import AuthService from '../authService/authService.js'

const router = express.Router()

// ...profile routes from server.js...
// Update Profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const isHost = req.user.role === 'host'
    const result = await AuthService.updateProfile(
      req.user.userId,
      req.body,
      isHost
    )
    res.json(result)
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

export default router
