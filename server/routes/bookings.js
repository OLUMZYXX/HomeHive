import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { bookingService } from '../homeHiveService/homeHiveService.js'

const router = express.Router()

// ...booking routes from server.js...
// Create Booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res
        .status(403)
        .json({ success: false, message: 'Only users can create bookings' })
    }
    const bookingData = { ...req.body, userId: req.user.userId }
    const bookingId = await bookingService.createBooking(bookingData)
    res.status(201).json({
      success: true,
      bookingId,
      message: 'Booking created successfully',
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Get User Bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const isHost = req.user.role === 'host'
    let bookings
    if (isHost) {
      bookings = await bookingService.getHostBookings(req.user.userId)
    } else {
      bookings = await bookingService.getUserBookings(req.user.userId)
    }
    res.json({ success: true, bookings, count: bookings.length })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Update Booking Status (Host only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'host') {
      return res.status(403).json({
        success: false,
        message: 'Only hosts can update booking status',
      })
    }
    const { status } = req.body
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: 'Status is required' })
    }
    await bookingService.updateBookingStatus(req.params.id, status)
    res.json({ success: true, message: 'Booking status updated successfully' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Get host dashboard statistics
router.get('/host/:hostId/stats', authenticateToken, async (req, res) => {
  try {
    const { hostId } = req.params

    // Verify the user is the host or has permission
    if (req.user.userId !== hostId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const stats = await bookingService.getHostStats(hostId)
    res.json(stats)
  } catch (error) {
    console.error('Error fetching host stats:', error)
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch host statistics' })
  }
})

// Check property availability for specific dates
router.post('/check-availability', async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.body

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const hasConflict = await bookingService.checkDateConflict(
      propertyId,
      checkIn,
      checkOut
    )

    res.json({
      available: !hasConflict,
      message: hasConflict
        ? 'Property is not available for these dates'
        : 'Property is available',
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    res
      .status(500)
      .json({ error: error.message || 'Failed to check availability' })
  }
})

// Get property availability calendar
router.get('/availability/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params
    const { month, year } = req.query

    const currentDate = new Date()
    const queryMonth = parseInt(month) || currentDate.getMonth()
    const queryYear = parseInt(year) || currentDate.getFullYear()

    const bookedDates = await bookingService.getPropertyAvailability(
      propertyId,
      queryMonth,
      queryYear
    )

    res.json({ bookedDates })
  } catch (error) {
    console.error('Error getting availability:', error)
    res
      .status(500)
      .json({ error: error.message || 'Failed to get availability' })
  }
})

export default router
