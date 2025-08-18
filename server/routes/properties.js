import express from 'express'
import {
  authenticateToken,
  optionalAuth,
} from '../middleware/authMiddleware.js'
import { propertyService } from '../homeHiveService/homeHiveService.js'

const router = express.Router()

// Get All Properties
router.get('/', optionalAuth, async (req, res) => {
  try {
    const filters = {}
    if (req.query.city) filters.city = req.query.city
    if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice)
    if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice)
    if (req.query.propertyType) filters.propertyType = req.query.propertyType
    if (req.query.bedrooms) filters.bedrooms = parseInt(req.query.bedrooms)
    if (req.query.bathrooms) filters.bathrooms = parseInt(req.query.bathrooms)
    const properties = await propertyService.getAllProperties(filters)
    res.json({ success: true, properties, count: properties.length })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Get Single Property
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const property = await propertyService.getProperty(req.params.id)
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found' })
    }
    await propertyService.incrementViews(req.params.id)
    res.json({ success: true, property })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Create Property (Host only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'host') {
      return res
        .status(403)
        .json({ success: false, message: 'Only hosts can create properties' })
    }
    const propertyData = req.body
    const propertyId = await propertyService.createProperty(
      req.user.userId,
      propertyData
    )
    res.status(201).json({
      success: true,
      propertyId,
      message: 'Property created successfully',
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Update Property (Host only, own properties)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'host') {
      return res
        .status(403)
        .json({ success: false, message: 'Only hosts can update properties' })
    }
    const property = await propertyService.getProperty(req.params.id)
    if (!property || property.hostId !== req.user.userId) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found or unauthorized' })
    }
    await propertyService.updateProperty(req.params.id, req.body)
    res.json({ success: true, message: 'Property updated successfully' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Delete Property (Host only, own properties)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'host') {
      return res
        .status(403)
        .json({ success: false, message: 'Only hosts can delete properties' })
    }
    const property = await propertyService.getProperty(req.params.id)
    if (!property || property.hostId !== req.user.userId) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found or unauthorized' })
    }
    await propertyService.deleteProperty(req.params.id)
    res.json({ success: true, message: 'Property deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Get Host Properties
router.get('/host/properties', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'host') {
      return res.status(403).json({
        success: false,
        message: 'Only hosts can access this endpoint',
      })
    }
    const properties = await propertyService.getHostProperties(req.user.userId)
    res.json({ success: true, properties, count: properties.length })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

export default router
