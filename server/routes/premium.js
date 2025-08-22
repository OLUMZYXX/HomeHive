import express from 'express'
import mongoPropertyService from '../services/mongoService.js'

const router = express.Router()

// Get Premium Featured Images
router.get('/featured-images', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6

    // Get premium properties (luxury with high prices)
    const premiumImages = await mongoPropertyService.getPremiumFeaturedImages(
      limit
    )

    res.json({
      success: true,
      images: premiumImages,
      totalFound: premiumImages.length,
      premium: true,
      luxuryOnly: true,
      minPrice: 300000,
      currency: 'NGN',
      database: 'MongoDB Atlas',
    })
  } catch (error) {
    console.error('Error fetching premium featured images:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to fetch premium featured images',
      images: [], // Empty array for fallback handling
      useLocal: true, // Signal to use local fallback images
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Database error',
    })
  }
})

// Get Premium Showcase (same as existing premium-showcase in featured.js)
router.get('/showcase', async (req, res) => {
  try {
    const showcase = (await mongoPropertyService.getPremiumShowcaseImages)
      ? await mongoPropertyService.getPremiumShowcaseImages()
      : []

    res.json({
      success: true,
      showcase,
      totalImages: showcase.length,
      qualityFiltered: true,
      database: 'MongoDB Atlas',
    })
  } catch (error) {
    console.error('Error fetching premium showcase:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to fetch premium showcase',
      showcase: [],
      useLocal: true,
    })
  }
})

// Get Premium Properties (High-end listings)
router.get('/properties', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12
    const minPrice = parseInt(req.query.minPrice) || 300000

    const premiumProperties = await mongoPropertyService.getPremiumProperties(
      limit,
      minPrice
    )

    res.json({
      success: true,
      properties: premiumProperties,
      totalFound: premiumProperties.length,
      minPrice,
      premium: true,
      database: 'MongoDB Atlas',
    })
  } catch (error) {
    console.error('Error fetching premium properties:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to fetch premium properties',
      properties: [],
      useLocal: true,
    })
  }
})

export default router
