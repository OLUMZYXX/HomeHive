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
    res
      .status(201)
      .json({
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
      return res
        .status(403)
        .json({
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

export default router
