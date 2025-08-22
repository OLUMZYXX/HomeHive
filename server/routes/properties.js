import express from 'express'
import {
  authenticateToken,
  optionalAuth,
} from '../middleware/authMiddleware.js'
import { mongoPropertyService } from '../services/mongoService.js'

const router = express.Router()

// Get All Properties
router.get('/', optionalAuth, async (req, res) => {
  try {
    console.log('🎯 Properties endpoint hit - GET /')

    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const skip = (page - 1) * limit

    const filters = {}
    if (req.query.city) filters.city = req.query.city
    if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice)
    if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice)
    if (req.query.propertyType) filters.propertyType = req.query.propertyType
    if (req.query.bedrooms) filters.bedrooms = parseInt(req.query.bedrooms)
    if (req.query.bathrooms) filters.bathrooms = parseInt(req.query.bathrooms)

    console.log('🏠 Fetching properties with filters:', filters)
    console.log('📄 Pagination - Page:', page, 'Limit:', limit, 'Skip:', skip)

    let properties = await mongoPropertyService.getAllProperties(filters, {
      page,
      limit,
      skip,
    })
    console.log('📊 Found properties:', properties.length)

    // Get total count for pagination
    const totalProperties = await mongoPropertyService.getPropertiesCount(
      filters
    )
    const hasMore = skip + properties.length < totalProperties

    // Ensure each property has a valid images array
    properties = properties.map((property) => {
      // If images is not an array or is missing, set to []
      if (!Array.isArray(property.images)) {
        property.images = []
      }
      // If images array contains non-string values, filter them out
      property.images = property.images.filter(
        (img) => typeof img === 'string' && img.length > 0
      )
      return property
    })

    console.log('🔍 Properties data:', properties)
    res.json({
      success: true,
      properties,
      count: properties.length,
      totalCount: totalProperties,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalProperties / limit),
    })
  } catch (error) {
    console.error('❌ Error fetching properties:', error)
    res.status(400).json({ success: false, message: error.message })
  }
})

// Get Single Property
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    console.log('🔍 Fetching property with ID:', req.params.id)

    // Validate the ID format
    if (
      !req.params.id ||
      req.params.id === 'undefined' ||
      req.params.id === 'null'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID provided',
      })
    }

    const property = await mongoPropertyService.getProperty(req.params.id)
    if (!property) {
      console.log('❌ Property not found for ID:', req.params.id)
      return res
        .status(404)
        .json({ success: false, message: 'Property not found' })
    }

    await mongoPropertyService.incrementViews(req.params.id)

    // Ensure the property has the correct ID field for frontend consumption
    const propertyWithId = {
      ...property.toObject(),
      id: property._id.toString(), // Add id field for frontend
      propertyId: property._id.toString(), // Alternative ID field
    }

    console.log('✅ Property found:', property.title)
    res.json({ success: true, property: propertyWithId })
  } catch (error) {
    console.error('Error fetching single property:', error)

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format',
      })
    }

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
    // Log the images array received from frontend
    console.log('📸 Received images for new property:', propertyData.images)

    // Process and validate images array
    if (
      !Array.isArray(propertyData.images) ||
      propertyData.images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid images array. Please upload at least one image.',
      })
    }

    // Convert base64 image objects to base64 strings for storage
    const processedImages = propertyData.images.map((img, index) => {
      if (typeof img === 'object' && img.data && typeof img.data === 'string') {
        // Handle base64 image objects {data: "data:image/...", type: "image/..."}
        if (img.data.startsWith('data:image/')) {
          console.log(`📸 Processing base64 image ${index + 1}`)
          return img.data
        } else {
          throw new Error(`Image ${index + 1} has invalid base64 format`)
        }
      } else if (typeof img === 'string' && img.length > 0) {
        // Handle direct base64 strings or URLs
        return img
      } else {
        throw new Error(`Image ${index + 1} is not in valid format`)
      }
    })

    // Update the property data with processed images
    propertyData.images = processedImages
    console.log('✅ Successfully processed', processedImages.length, 'images')
    const propertyId = await mongoPropertyService.createProperty(
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
    const property = await mongoPropertyService.getProperty(req.params.id)
    if (!property || property.hostId !== req.user.userId) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found or unauthorized' })
    }

    const updateData = req.body

    // Process images if they are being updated
    if (updateData.images && Array.isArray(updateData.images)) {
      console.log(
        '📸 Processing images for property update:',
        updateData.images
      )

      try {
        // Convert base64 image objects to base64 strings for storage
        const processedImages = updateData.images.map((img, index) => {
          if (
            typeof img === 'object' &&
            img.data &&
            typeof img.data === 'string'
          ) {
            // Handle base64 image objects {data: "data:image/...", type: "image/..."}
            if (img.data.startsWith('data:image/')) {
              console.log(`📸 Processing base64 image ${index + 1} for update`)
              return img.data
            } else {
              throw new Error(`Image ${index + 1} has invalid base64 format`)
            }
          } else if (typeof img === 'string' && img.length > 0) {
            // Handle direct base64 strings or URLs
            return img
          } else {
            throw new Error(`Image ${index + 1} is not in valid format`)
          }
        })

        // Update with processed images
        updateData.images = processedImages
        console.log(
          '✅ Successfully processed',
          processedImages.length,
          'images for update'
        )
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        })
      }
    }

    await mongoPropertyService.updateProperty(req.params.id, updateData)
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
    const property = await mongoPropertyService.getProperty(req.params.id)
    if (!property || property.hostId !== req.user.userId) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found or unauthorized' })
    }
    await mongoPropertyService.deleteProperty(req.params.id)
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
    const properties = await mongoPropertyService.getHostProperties(
      req.user.userId
    )
    res.json({ success: true, properties, count: properties.length })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

export default router
