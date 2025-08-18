import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { userService } from '../homeHiveService/homeHiveService.js'

const router = express.Router()

// ...favorites routes from server.js...
// Get User Favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res
        .status(403)
        .json({ success: false, message: 'Only users can access favorites' })
    }
    const favorites = await userService.getUserFavorites(req.user.userId)
    res.json({ success: true, favorites, count: favorites.length })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Add to Favorites
router.post('/:propertyId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res
        .status(403)
        .json({ success: false, message: 'Only users can save favorites' })
    }
    await userService.saveFavorite(req.user.userId, req.params.propertyId)
    res.json({ success: true, message: 'Property added to favorites' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Remove from Favorites
router.delete('/:propertyId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res
        .status(403)
        .json({ success: false, message: 'Only users can remove favorites' })
    }
    await userService.removeFavorite(req.user.userId, req.params.propertyId)
    res.json({ success: true, message: 'Property removed from favorites' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

export default router
