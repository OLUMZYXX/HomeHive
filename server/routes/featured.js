import express from 'express'
import mongoPropertyService from '../services/mongoService.js'

const router = express.Router()

// Get Weekly Featured Header Images (Luxury Properties Only)
router.get('/header-images', async (req, res) => {
  try {
    const images = await mongoPropertyService.getWeeklyFeaturedImages()

    // Mark these images as used in header section
    if (images.images && images.images.length > 0) {
      await mongoPropertyService.markImagesAsUsed(images.images, 'header')
    }

    res.json({
      success: true,
      images: images.images || [],
      lastUpdated: images.lastUpdated || new Date(),
      weeklyRotation: true,
      luxuryOnly: true,
      minPrice: 200000,
      currency: 'NGN',
      totalFound: images.images?.length || 0,
      database: 'MongoDB Atlas',
    })
  } catch (error) {
    console.error('Error fetching weekly header images:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to fetch luxury header images',
      images: [], // Empty array for fallback handling
      useLocal: true, // Signal to use local fallback images
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Database error',
    })
  }
})

// Get Best Quality Images (Premium Hosts)
router.get('/premium-showcase', async (req, res) => {
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

// Get Random Best Images (Avoiding Header Duplicates)
router.get('/featured-random', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6
    const excludeHeader = req.query.excludeHeader === 'true'

    let randomImages
    if (excludeHeader) {
      // Get header images to exclude
      const headerImages = await mongoPropertyService.getUsedImages('header')
      randomImages = await mongoPropertyService.getRandomBestImages(
        limit,
        headerImages
      )
    } else {
      randomImages = await mongoPropertyService.getRandomBestImages(limit)
    }

    // Mark these images as used in hero section
    if (randomImages.length > 0) {
      await mongoPropertyService.markImagesAsUsed(randomImages, 'hero')
    }

    res.json({
      success: true,
      images: randomImages,
      randomSelection: true,
      refreshInterval: 300000, // 5 minutes in milliseconds
      excludedDuplicates: excludeHeader,
      totalFound: randomImages.length,
      database: 'MongoDB Atlas',
    })
  } catch (error) {
    console.error('Error fetching random featured images:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to fetch random images',
      images: [],
      useLocal: true,
    })
  }
})

// Get Hero Section Images (Different from Header)
router.get('/hero-images', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6

    // Get header images to avoid duplicates
    const headerImages = await mongoPropertyService.getUsedImages('header')
    const heroImages = await mongoPropertyService.getRandomBestImages(
      limit,
      headerImages
    )

    // Mark as used in hero section
    if (heroImages.length > 0) {
      await mongoPropertyService.markImagesAsUsed(heroImages, 'hero')
    }

    res.json({
      success: true,
      images: heroImages,
      excludedHeaderDuplicates: true,
      rotationEnabled: true,
      totalFound: heroImages.length,
      database: 'MongoDB Atlas',
    })
  } catch (error) {
    console.error('Error fetching hero images:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to fetch hero images',
      images: [],
      useLocal: true,
    })
  }
})

// Update Weekly Featured Images (Admin/System only)
router.post('/update-weekly', async (req, res) => {
  try {
    const { images, adminKey } = req.body

    // Simple admin validation (in production, use proper auth)
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      })
    }

    await propertyService.updateWeeklyFeaturedImages(images)

    res.json({
      success: true,
      message: 'Weekly featured images updated successfully',
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error updating weekly images:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update weekly images',
    })
  }
})

export default router
