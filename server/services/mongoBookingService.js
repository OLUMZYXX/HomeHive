import { Booking, Property } from '../models/mongodb-models.js'

// MongoDB Booking Service
export const mongoBookingService = {
  async createBooking(bookingData) {
    try {
      // Fetch the property to get the hostId
      const property = await Property.findById(bookingData.propertyId)
      if (!property) {
        throw new Error('Property not found')
      }

      // Add hostId to booking data
      const completeBookingData = {
        ...bookingData,
        hostId: property.hostId,
      }

      // Prevent duplicate reservation for same user/property/date
      const existingReservation = await Booking.findOne({
        propertyId: completeBookingData.propertyId,
        userId: completeBookingData.userId,
        checkIn: completeBookingData.checkIn,
        checkOut: completeBookingData.checkOut,
      })
      if (existingReservation) {
        throw new Error(
          'You have already reserved this property for these dates.'
        )
      }

      // Prevent booking if any paid booking exists for property/date range
      const paidConflict = await Booking.findOne({
        propertyId: completeBookingData.propertyId,
        paymentStatus: 'paid',
        $or: [
          {
            checkIn: { $lte: completeBookingData.checkIn },
            checkOut: { $gt: completeBookingData.checkIn },
          },
          {
            checkIn: { $lt: completeBookingData.checkOut },
            checkOut: { $gte: completeBookingData.checkOut },
          },
          {
            checkIn: { $gte: completeBookingData.checkIn },
            checkOut: { $lte: completeBookingData.checkOut },
          },
          {
            checkIn: { $lte: completeBookingData.checkIn },
            checkOut: { $gte: completeBookingData.checkOut },
          },
        ],
      })
      if (paidConflict) {
        throw new Error('This property is already booked for these dates.')
      }

      console.log('📝 Creating booking with complete data:', {
        propertyId: completeBookingData.propertyId,
        userId: completeBookingData.userId,
        hostId: completeBookingData.hostId,
        checkIn: completeBookingData.checkIn,
        checkOut: completeBookingData.checkOut,
        guests: completeBookingData.guests,
        totalAmount: completeBookingData.totalAmount,
      })

      const booking = new Booking(completeBookingData)
      const savedBooking = await booking.save()
      console.log('✅ Booking created successfully:', savedBooking._id)
      return savedBooking._id.toString()
    } catch (error) {
      console.error('❌ Error creating booking:', error)
      throw new Error(error.message || 'Failed to create booking')
    }
  },

  async checkDateConflict(propertyId, checkIn, checkOut) {
    try {
      const startDate = new Date(checkIn)
      const endDate = new Date(checkOut)

      console.log('🔍 Checking date conflict for property:', propertyId)
      console.log('📅 Check-in:', startDate)
      console.log('📅 Check-out:', endDate)

      // Only block if a paid booking exists for the date range
      const paidBookings = await Booking.find({
        propertyId: propertyId,
        paymentStatus: 'paid',
        $or: [
          { checkIn: { $lte: startDate }, checkOut: { $gt: startDate } },
          { checkIn: { $lt: endDate }, checkOut: { $gte: endDate } },
          { checkIn: { $gte: startDate }, checkOut: { $lte: endDate } },
          { checkIn: { $lte: startDate }, checkOut: { $gte: endDate } },
        ],
      })
      const hasConflict = paidBookings.length > 0
      console.log('📊 Found', paidBookings.length, 'paid conflicting bookings')
      if (hasConflict) {
        console.log(
          '❌ Date conflict found:',
          paidBookings.map((b) => ({
            id: b._id,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            status: b.status,
          }))
        )
      } else {
        console.log('✅ No paid date conflicts found')
      }
      return hasConflict
    } catch (error) {
      console.error('❌ Error checking date conflict:', error)
      throw new Error('Failed to check date availability')
    }
  },

  async getBookingsByProperty(propertyId) {
    try {
      const bookings = await Booking.find({ propertyId }).sort({
        createdAt: -1,
      })
      return bookings
    } catch (error) {
      console.error('Error fetching bookings for property:', error)
      throw error
    }
  },

  async getBookingsByUser(userId) {
    try {
      const bookings = await Booking.find({ userId }).sort({ createdAt: -1 })
      return bookings
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  },

  async getBookingById(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
      return booking
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw error
    }
  },

  async updateBooking(bookingId, updateData) {
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
      return booking
    } catch (error) {
      console.error('Error updating booking:', error)
      throw error
    }
  },

  async deleteBooking(bookingId) {
    try {
      const booking = await Booking.findByIdAndDelete(bookingId)
      return booking
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  },

  async getHostBookings(hostId) {
    try {
      // Find all properties belonging to the host first, then get bookings for those properties
      const hostProperties = await Property.find({ hostId })
      const propertyIds = hostProperties.map((prop) => prop._id.toString())

      const bookings = await Booking.find({
        propertyId: { $in: propertyIds },
      }).sort({ createdAt: -1 })

      return bookings
    } catch (error) {
      console.error('Error fetching host bookings:', error)
      throw error
    }
  },

  async getUserBookings(userId) {
    try {
      const bookings = await Booking.find({ userId }).sort({ createdAt: -1 })
      return bookings
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status, updatedAt: new Date() },
        { new: true }
      )
      return booking
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  },

  async getHostStats(hostId) {
    try {
      const hostBookings = await this.getHostBookings(hostId)

      // Calculate stats
      const totalBookings = hostBookings.length
      const confirmedBookings = hostBookings.filter(
        (b) => b.status === 'confirmed'
      ).length
      const totalRevenue = hostBookings
        .filter((b) => b.status === 'confirmed')
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const monthlyRevenue = hostBookings
        .filter((b) => {
          const bookingDate = new Date(b.createdAt)
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear &&
            b.status === 'confirmed'
          )
        })
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)

      return {
        totalBookings,
        confirmedBookings,
        totalRevenue,
        monthlyRevenue,
        averageBookingValue:
          confirmedBookings > 0 ? totalRevenue / confirmedBookings : 0,
      }
    } catch (error) {
      console.error('Error calculating host stats:', error)
      throw error
    }
  },

  async getPropertyAvailability(propertyId, startDate, endDate) {
    try {
      const bookings = await Booking.find({
        propertyId,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { checkIn: { $gte: new Date(startDate), $lte: new Date(endDate) } },
          { checkOut: { $gte: new Date(startDate), $lte: new Date(endDate) } },
          {
            checkIn: { $lte: new Date(startDate) },
            checkOut: { $gte: new Date(endDate) },
          },
        ],
      })

      return bookings.map((booking) => ({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: booking.status,
      }))
    } catch (error) {
      console.error('Error fetching property availability:', error)
      throw error
    }
  },
}

export default mongoBookingService
