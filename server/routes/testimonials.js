import express from 'express'
import { Testimonial } from '../models/mongodb-models.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Get all testimonials with pagination
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * limit

    const testimonials = await Testimonial.find({
      isApproved: true,
      isActive: true,
    })
      .populate('userId', 'firstName lastName avatar')
      .populate('propertyId', 'title address.city images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Testimonial.countDocuments({
      isApproved: true,
      isActive: true,
    })

    res.json({
      success: true,
      testimonials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTestimonials: total,
        hasMore: skip + testimonials.length < total,
      },
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    })
  }
})

// Create a new testimonial (authentication optional)
router.post('/', async (req, res) => {
  try {
    const { propertyId, rating, comment, stayDate, guestName, guestEmail } =
      req.body

    // Check if user is authenticated
    let userId = null
    let isGuest = true

    // Try to get user from auth middleware if token is provided
    if (req.headers.authorization) {
      try {
        // Use the same JWT service as the middleware
        const JWTAuthService = await import(
          '../jwtAuthService/jwtAuthService.js'
        )
        const token = req.headers.authorization.split(' ')[1]
        const user = JWTAuthService.default.extractUserFromToken(token)
        if (user) {
          userId = user.id
          isGuest = false
        }
      } catch (authError) {
        console.log('Guest submission due to auth error:', authError.message)
        // Continue as guest if token is invalid
        isGuest = true
      }
    }

    // Validate required fields
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required',
      })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      })
    }

    // For guest users, require name and email
    if (isGuest && (!guestName || !guestEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required for guest testimonials',
      })
    }

    // Check if authenticated user already left a testimonial for this property
    if (!isGuest && propertyId && userId) {
      const existingTestimonial = await Testimonial.findOne({
        userId,
        propertyId,
        isActive: true,
      })

      if (existingTestimonial) {
        return res.status(400).json({
          success: false,
          message: 'You have already left a testimonial for this property',
        })
      }
    }

    const testimonialData = {
      rating,
      comment,
      stayDate: stayDate ? new Date(stayDate) : undefined,
      isApproved: false, // Requires admin approval
      isActive: true,
      isGuest,
    }

    // Add user-specific or guest-specific data
    if (isGuest) {
      testimonialData.guestName = guestName
      testimonialData.guestEmail = guestEmail
    } else {
      testimonialData.userId = userId
    }

    // Add property ID if provided
    if (propertyId) {
      testimonialData.propertyId = propertyId
    }

    const testimonial = new Testimonial(testimonialData)
    await testimonial.save()

    // Populate the testimonial with user and property details if available
    if (!isGuest && userId) {
      await testimonial.populate([
        { path: 'userId', select: 'firstName lastName avatar' },
        { path: 'propertyId', select: 'title address.city images' },
      ])
    }

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully and is pending approval',
      testimonial,
    })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    })
  }
})

// Get testimonials for a specific property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params
    const limit = parseInt(req.query.limit) || 10

    const testimonials = await Testimonial.find({
      propertyId,
      isApproved: true,
      isActive: true,
    })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(limit)

    const stats = await Testimonial.aggregate([
      { $match: { propertyId: propertyId, isApproved: true, isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalCount: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ])

    res.json({
      success: true,
      testimonials,
      stats: stats[0] || {
        averageRating: 0,
        totalCount: 0,
        ratingDistribution: [],
      },
    })
  } catch (error) {
    console.error('Error fetching property testimonials:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property testimonials',
    })
  }
})

// Get testimonial statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Testimonial.aggregate([
      { $match: { isApproved: true, isActive: true } },
      {
        $group: {
          _id: null,
          totalTestimonials: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          fiveStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] },
          },
          fourStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] },
          },
          threeStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] },
          },
          twoStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] },
          },
          oneStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] },
          },
        },
      },
    ])

    const result = stats[0] || {
      totalTestimonials: 0,
      averageRating: 0,
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
      twoStarCount: 0,
      oneStarCount: 0,
    }

    // Calculate satisfaction rate (4+ stars)
    const satisfactionRate =
      result.totalTestimonials > 0
        ? ((result.fiveStarCount + result.fourStarCount) /
            result.totalTestimonials) *
          100
        : 0

    res.json({
      success: true,
      stats: {
        ...result,
        satisfactionRate: Math.round(satisfactionRate),
        averageRating: Math.round(result.averageRating * 10) / 10,
      },
    })
  } catch (error) {
    console.error('Error fetching testimonial stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial statistics',
    })
  }
})

// Admin routes (protected)
router.get('/pending', authenticateToken, async (req, res) => {
  // This would check for admin role in production
  try {
    const pendingTestimonials = await Testimonial.find({
      isApproved: false,
      isActive: true,
    })
      .populate('userId', 'firstName lastName avatar email')
      .populate('propertyId', 'title address.city images')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      testimonials: pendingTestimonials,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending testimonials',
    })
  }
})

router.put('/:testimonialId/approve', authenticateToken, async (req, res) => {
  // This would check for admin role in production
  try {
    const { testimonialId } = req.params

    const testimonial = await Testimonial.findByIdAndUpdate(
      testimonialId,
      { isApproved: true },
      { new: true }
    ).populate([
      { path: 'userId', select: 'firstName lastName avatar' },
      { path: 'propertyId', select: 'title address.city images' },
    ])

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      })
    }

    res.json({
      success: true,
      message: 'Testimonial approved successfully',
      testimonial,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve testimonial',
    })
  }
})

export default router
