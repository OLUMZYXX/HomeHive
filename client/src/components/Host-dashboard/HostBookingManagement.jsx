import React, { useState, useEffect } from 'react'
import { useAPI } from '../../contexts/APIContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaFilter,
  FaCheck,
  FaTimes,
  FaClock,
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

// Booking status component
const BookingStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          icon: FaCheckCircle,
          text: 'Confirmed',
          color: 'text-success-600',
          bgColor: 'bg-success-100',
          borderColor: 'border-success-200',
        }
      case 'cancelled':
        return {
          icon: FaTimesCircle,
          text: 'Cancelled',
          color: 'text-error-600',
          bgColor: 'bg-error-100',
          borderColor: 'border-error-200',
        }
      case 'pending':
        return {
          icon: FaHourglassHalf,
          text: 'Pending',
          color: 'text-warning-600',
          bgColor: 'bg-warning-100',
          borderColor: 'border-warning-200',
        }
      default:
        return {
          icon: FaClock,
          text: status || 'Unknown',
          color: 'text-neutral-600',
          bgColor: 'bg-neutral-100',
          borderColor: 'border-neutral-200',
        }
    }
  }

  const { icon: Icon, text, color, bgColor, borderColor } = getStatusConfig()

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${bgColor} ${borderColor} ${color}`}
    >
      <Icon className='text-sm' />
      <span className='text-sm font-medium'>{text}</span>
    </div>
  )
}

// Individual booking card for hosts
const HostBookingCard = ({
  booking,
  onUpdateStatus,
  onViewProperty,
  onContactGuest,
}) => {
  const { convertFromCurrency, selectedCurrencyData } = useCurrency()
  const [isUpdating, setIsUpdating] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0

    try {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)

      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0

      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    } catch (error) {
      return 0
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true)
    try {
      await onUpdateStatus(booking.id, newStatus)
      toast.success(`Booking ${newStatus} successfully!`)
    } catch (error) {
      toast.error(`Failed to ${newStatus} booking`)
    } finally {
      setIsUpdating(false)
    }
  }

  const nights = calculateNights()
  const convertedAmount = booking.totalAmount
    ? convertFromCurrency(booking.totalAmount, booking.currency || 'NGN')
    : 0

  const canConfirm = booking.status === 'pending'
  const canCancel =
    booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-xl shadow-soft border border-primary-200 overflow-hidden hover:shadow-medium transition-all duration-300'
    >
      <div className='p-6'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-primary-800 mb-1'>
              {booking.propertyTitle || 'Property Booking'}
            </h3>
            <div className='flex items-center gap-4 text-sm text-primary-600'>
              <div className='flex items-center gap-1'>
                <FaMapMarkerAlt className='text-xs' />
                <span>{booking.propertyLocation || 'Location'}</span>
              </div>
              {booking.guestName && (
                <div className='flex items-center gap-1'>
                  <FaUsers className='text-xs' />
                  <span>Guest: {booking.guestName}</span>
                </div>
              )}
            </div>
          </div>
          <BookingStatus status={booking.status} />
        </div>

        {/* Booking Details Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          {/* Check-in */}
          <div>
            <div className='text-xs text-primary-500 font-medium mb-1'>
              Check-in
            </div>
            <div className='text-sm text-primary-800'>
              {formatDate(booking.checkIn)}
            </div>
          </div>

          {/* Check-out */}
          <div>
            <div className='text-xs text-primary-500 font-medium mb-1'>
              Check-out
            </div>
            <div className='text-sm text-primary-800'>
              {formatDate(booking.checkOut)}
            </div>
          </div>

          {/* Guests */}
          <div>
            <div className='text-xs text-primary-500 font-medium mb-1'>
              Guests
            </div>
            <div className='flex items-center gap-1 text-sm text-primary-800'>
              <FaUsers className='text-xs' />
              <span>{booking.guests || 1}</span>
            </div>
          </div>

          {/* Nights */}
          <div>
            <div className='text-xs text-primary-500 font-medium mb-1'>
              Nights
            </div>
            <div className='text-sm text-primary-800'>
              {nights > 0 ? nights : 'N/A'}
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className='bg-success-50 rounded-lg p-3 mb-4 border border-success-200'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-success-700 font-medium'>
              Earnings
            </span>
            <span className='text-lg font-bold text-success-800'>
              {selectedCurrencyData.symbol}
              {Math.round(convertedAmount).toLocaleString()}
            </span>
          </div>
          {nights > 0 && (
            <div className='text-xs text-success-600 mt-1'>
              {selectedCurrencyData.symbol}
              {Math.round(convertedAmount / nights).toLocaleString()} per night
              × {nights} nights
            </div>
          )}
        </div>

        {/* Guest Contact Info */}
        {(booking.guestEmail || booking.guestPhone) && (
          <div className='bg-neutral-50 rounded-lg p-3 mb-4'>
            <div className='text-xs text-primary-500 font-medium mb-2'>
              Guest Contact
            </div>
            <div className='flex flex-wrap gap-2 text-sm'>
              {booking.guestEmail && (
                <div className='flex items-center gap-1 text-primary-700'>
                  <FaEnvelope className='text-xs' />
                  <span>{booking.guestEmail}</span>
                </div>
              )}
              {booking.guestPhone && (
                <div className='flex items-center gap-1 text-primary-700'>
                  <FaPhone className='text-xs' />
                  <span>{booking.guestPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Date */}
        <div className='flex items-center justify-between text-xs text-primary-500 mb-4'>
          <span>Booked on: {formatDate(booking.createdAt)}</span>
          {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
            <span>Updated: {formatDate(booking.updatedAt)}</span>
          )}
        </div>

        {/* Actions */}
        <div className='flex flex-wrap gap-2'>
          {/* Confirm/Reject for pending bookings */}
          {canConfirm && (
            <>
              <button
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={isUpdating}
                className='flex items-center gap-2 px-4 py-2 text-sm text-white bg-success-600 hover:bg-success-700 disabled:opacity-50 rounded-lg transition-colors duration-300'
              >
                <FaCheck className='text-xs' />
                {isUpdating ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={isUpdating}
                className='flex items-center gap-2 px-4 py-2 text-sm text-white bg-error-600 hover:bg-error-700 disabled:opacity-50 rounded-lg transition-colors duration-300'
              >
                <FaTimes className='text-xs' />
                Reject
              </button>
            </>
          )}

          {/* Cancel for confirmed bookings */}
          {booking.status === 'confirmed' && canCancel && (
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isUpdating}
              className='flex items-center gap-2 px-4 py-2 text-sm text-error-600 bg-error-50 hover:bg-error-100 disabled:opacity-50 rounded-lg transition-colors duration-300'
            >
              <FaTimes className='text-xs' />
              Cancel Booking
            </button>
          )}

          {/* View Property */}
          {booking.propertyId && (
            <button
              onClick={() => onViewProperty(booking.propertyId)}
              className='flex items-center gap-2 px-4 py-2 text-sm text-accent-blue-600 bg-accent-blue-50 hover:bg-accent-blue-100 rounded-lg transition-colors duration-300'
            >
              <FaEye className='text-xs' />
              View Property
            </button>
          )}

          {/* Contact Guest */}
          {booking.guestEmail && (
            <button
              onClick={() => onContactGuest(booking)}
              className='flex items-center gap-2 px-4 py-2 text-sm text-primary-600 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors duration-300'
            >
              <FaEnvelope className='text-xs' />
              Contact Guest
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const HostBookingManagement = () => {
  const { user, updateBookingStatus } = useAPI()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'confirmed', 'cancelled'

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchHostBookings = async () => {
      if (!user?.uid) return

      try {
        setLoading(true)
        setError(null)

        // This would be replaced with actual API call
        // const hostBookings = await getHostBookings(user.uid)

        // Mock data for now
        const mockBookings = [
          {
            id: 'booking-1',
            propertyId: 'prop-1',
            propertyTitle: 'Modern Downtown Apartment',
            propertyLocation: 'Lagos, Nigeria',
            guestName: 'John Doe',
            guestEmail: 'john.doe@email.com',
            guestPhone: '+234 801 234 5678',
            checkIn: '2024-09-01',
            checkOut: '2024-09-05',
            guests: 2,
            totalAmount: 80000,
            currency: 'NGN',
            status: 'pending',
            createdAt: '2024-08-15T10:30:00Z',
            updatedAt: '2024-08-15T10:30:00Z',
          },
          {
            id: 'booking-2',
            propertyId: 'prop-2',
            propertyTitle: 'Cozy Beach House',
            propertyLocation: 'Victoria Island, Lagos',
            guestName: 'Jane Smith',
            guestEmail: 'jane.smith@email.com',
            checkIn: '2024-08-25',
            checkOut: '2024-08-28',
            guests: 4,
            totalAmount: 120000,
            currency: 'NGN',
            status: 'confirmed',
            createdAt: '2024-08-10T14:20:00Z',
            updatedAt: '2024-08-12T09:15:00Z',
          },
        ]

        setBookings(mockBookings)
      } catch (err) {
        console.error('Error fetching host bookings:', err)
        setError(err.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchHostBookings()
  }, [user])

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true
    return booking.status?.toLowerCase() === filter.toLowerCase()
  })

  // Handle booking status updates
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus)

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : booking
        )
      )
    } catch (error) {
      throw error
    }
  }

  // Handle view property
  const handleViewProperty = (propertyId) => {
    window.open(`/listing/${propertyId}`, '_blank')
  }

  // Handle contact guest
  const handleContactGuest = (booking) => {
    if (booking.guestEmail) {
      const subject = `Regarding your booking at ${booking.propertyTitle}`
      const body = `Dear ${
        booking.guestName || 'Guest'
      },\n\nI hope this message finds you well. I wanted to reach out regarding your upcoming stay at ${
        booking.propertyTitle
      } from ${booking.checkIn} to ${
        booking.checkOut
      }.\n\nBest regards,\nYour Host`

      window.open(
        `mailto:${booking.guestEmail}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`
      )
    }
  }

  // Get filter counts
  const getFilterCount = (status) => {
    if (status === 'all') return bookings.length
    return bookings.filter(
      (b) => b.status?.toLowerCase() === status.toLowerCase()
    ).length
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-primary-800'>
            Booking Management
          </h2>
          <p className='text-primary-600 mt-1'>
            Manage your property bookings and guest communications
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='bg-white rounded-xl p-1 shadow-soft border border-primary-200 inline-flex'>
        {[
          { key: 'all', label: 'All Bookings', count: getFilterCount('all') },
          {
            key: 'pending',
            label: 'Pending',
            count: getFilterCount('pending'),
          },
          {
            key: 'confirmed',
            label: 'Confirmed',
            count: getFilterCount('confirmed'),
          },
          {
            key: 'cancelled',
            label: 'Cancelled',
            count: getFilterCount('cancelled'),
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === tab.key
                ? 'bg-primary-600 text-white shadow-soft'
                : 'text-primary-600 hover:text-primary-800 hover:bg-primary-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
            <p className='text-primary-600'>Loading bookings...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='bg-error-50 border border-error-200 text-error-600 p-4 rounded-lg'>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-2 text-error-600 hover:text-error-800 underline text-sm'
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        filteredBookings.length === 0 &&
        bookings.length === 0 && (
          <div className='text-center py-12 bg-white rounded-xl'>
            <FaCalendarAlt className='text-neutral-400 text-6xl mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-primary-800 mb-2'>
              No bookings yet
            </h3>
            <p className='text-primary-600'>
              Your booking requests will appear here once guests start booking
              your properties.
            </p>
          </div>
        )}

      {/* No Results for Filter */}
      {!loading &&
        !error &&
        filteredBookings.length === 0 &&
        bookings.length > 0 && (
          <div className='text-center py-8 bg-white rounded-xl'>
            <FaFilter className='text-neutral-400 text-4xl mx-auto mb-3' />
            <h3 className='text-lg font-medium text-primary-800 mb-2'>
              No {filter !== 'all' ? filter : ''} bookings found
            </h3>
            <p className='text-primary-600'>
              Try changing the filter to see your other bookings.
            </p>
          </div>
        )}

      {/* Bookings List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
          {filteredBookings.map((booking, index) => (
            <HostBookingCard
              key={booking.id || index}
              booking={booking}
              onUpdateStatus={handleUpdateBookingStatus}
              onViewProperty={handleViewProperty}
              onContactGuest={handleContactGuest}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HostBookingManagement
