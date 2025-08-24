import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAPI } from '../../contexts/APIContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowLeft,
  FaEye,
  FaHome,
  FaFilter,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

// Cancel Booking Modal Component
const CancelBookingModal = ({ isOpen, onClose, onConfirm, bookingTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className='bg-white rounded-3xl p-8 max-w-md w-full mx-auto shadow-intense border-2 border-primary-200'
          >
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-error-100 to-error-200 rounded-3xl flex items-center justify-center mx-auto mb-6'>
                <FaExclamationTriangle className='text-error-500 text-3xl' />
              </div>

              <h3 className='text-2xl font-bold text-primary-900 mb-3'>
                Cancel Booking?
              </h3>

              <p className='text-primary-600 text-lg mb-2 leading-relaxed'>
                Are you sure you want to cancel your booking for:
              </p>

              <p className='text-primary-800 font-semibold mb-6 bg-primary-50 px-4 py-2 rounded-xl'>
                {bookingTitle}
              </p>

              <p className='text-error-600 text-sm mb-8 bg-error-50 px-4 py-3 rounded-xl border border-error-200'>
                This action cannot be undone. You may be subject to cancellation
                fees.
              </p>

              <div className='flex gap-4'>
                <button
                  onClick={onClose}
                  className='flex-1 px-6 py-3 bg-gradient-to-r from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 text-neutral-700 hover:text-neutral-900 font-bold rounded-xl border-2 border-neutral-300 hover:border-neutral-400 transition-all duration-300 hover:scale-105'
                >
                  Keep Booking
                </button>
                <button
                  onClick={onConfirm}
                  className='flex-1 px-6 py-3 bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white font-bold rounded-xl border-2 border-error-400 hover:border-error-500 transition-all duration-300 hover:scale-105 hover:shadow-strong'
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

CancelBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  bookingTitle: PropTypes.string.isRequired,
}

// Booking status component
const BookingStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          icon: FaCheckCircle,
          text: 'Confirmed',
          color: 'text-success-700',
          bgColor: 'bg-gradient-to-r from-success-50 to-success-100',
          borderColor: 'border-success-300',
          shadowColor: 'shadow-success-100',
        }
      case 'cancelled':
        return {
          icon: FaTimesCircle,
          text: 'Cancelled',
          color: 'text-error-700',
          bgColor: 'bg-gradient-to-r from-error-50 to-error-100',
          borderColor: 'border-error-300',
          shadowColor: 'shadow-error-100',
        }
      case 'pending':
        return {
          icon: FaHourglassHalf,
          text: 'Pending',
          color: 'text-warning-700',
          bgColor: 'bg-gradient-to-r from-warning-50 to-warning-100',
          borderColor: 'border-warning-300',
          shadowColor: 'shadow-warning-100',
        }
      default:
        return {
          icon: FaClock,
          text: status || 'Unknown',
          color: 'text-neutral-700',
          bgColor: 'bg-gradient-to-r from-neutral-50 to-neutral-100',
          borderColor: 'border-neutral-300',
          shadowColor: 'shadow-neutral-100',
        }
    }
  }

  const {
    icon: Icon,
    text,
    color,
    bgColor,
    borderColor,
    shadowColor,
  } = getStatusConfig()

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${bgColor} ${borderColor} ${color} ${shadowColor} shadow-soft font-semibold transition-all duration-300 hover:scale-105`}
    >
      <Icon className='text-sm' />
      <span className='text-sm'>{text}</span>
    </div>
  )
}

BookingStatus.propTypes = {
  status: PropTypes.string,
}

// Individual booking card component
const BookingCard = ({ booking, onViewProperty, onCancelBooking }) => {
  const { convertFromCurrency, selectedCurrencyData } = useCurrency()

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
    } catch {
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
    } catch {
      return 0
    }
  }

  const nights = calculateNights()
  const convertedAmount = booking.totalAmount
    ? convertFromCurrency(booking.totalAmount, booking.currency || 'NGN')
    : 0

  const navigate = useNavigate()

  // Handle card click for desktop - navigate to property details
  const handleCardClick = (e) => {
    // Only handle clicks on desktop (screens larger than mobile)
    if (window.innerWidth >= 768) {
      // Don't trigger if clicking on buttons or interactive elements
      if (
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('[role="button"]')
      ) {
        return
      }

      // Navigate to property if available
      if (booking.propertyId) {
        onViewProperty(booking.propertyId)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-strong border border-primary-100 overflow-hidden hover:shadow-intense transition-all duration-500 hover:scale-[1.02] group ${
        booking.propertyId && window.innerWidth >= 768
          ? 'cursor-pointer md:hover:cursor-pointer'
          : ''
      }`}
      onClick={handleCardClick}
      role='article'
      tabIndex={booking.propertyId && window.innerWidth >= 768 ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth >= 768) {
          e.preventDefault()
          if (booking.propertyId) {
            onViewProperty(booking.propertyId)
          }
        }
      }}
    >
      {/* Property Image Header */}
      <div className='relative h-48 overflow-hidden'>
        {booking.propertyImages && booking.propertyImages.length > 0 ? (
          <img
            src={booking.propertyImages[0]}
            alt={booking.propertyTitle || 'Property'}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
        ) : null}
        <div
          className='w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center'
          style={{
            display:
              booking.propertyImages && booking.propertyImages.length > 0
                ? 'none'
                : 'flex',
          }}
        >
          <FaHome className='text-6xl text-primary-400' />
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

        {/* Desktop Click Indicator - only visible on larger screens */}
        {booking.propertyId && (
          <div className='hidden md:flex absolute top-4 left-4 z-10 items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-primary-700 group-hover:bg-primary-100 transition-all duration-300'>
            <FaEye className='text-xs' />
            Click to view property
          </div>
        )}

        <div className='absolute top-4 right-4 z-10'>
          <BookingStatus status={booking.status} />
        </div>
        <div className='absolute bottom-4 left-4 right-4 z-10'>
          <h3 className='text-xl font-bold text-white mb-2 line-clamp-2'>
            {booking.propertyTitle ||
              `Booking #${
                booking._id?.substring(0, 8) ||
                booking.id?.substring(0, 8) ||
                'N/A'
              }`}
          </h3>
          {booking.propertyLocation && (
            <div className='flex items-center gap-2 text-white/90'>
              <FaMapMarkerAlt className='text-sm flex-shrink-0' />
              <span className='text-sm font-medium truncate'>
                {booking.propertyLocation}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className='p-6'>
        {/* Booking Details Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {/* Check-in */}
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 hover:shadow-soft transition-all duration-300'>
            <div className='text-xs font-bold text-blue-600 uppercase tracking-wide mb-2'>
              Check-in
            </div>
            <div className='text-lg font-bold text-blue-900'>
              {formatDate(booking.checkIn)}
            </div>
          </div>

          {/* Check-out */}
          <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 hover:shadow-soft transition-all duration-300'>
            <div className='text-xs font-bold text-green-600 uppercase tracking-wide mb-2'>
              Check-out
            </div>
            <div className='text-lg font-bold text-green-900'>
              {formatDate(booking.checkOut)}
            </div>
          </div>

          {/* Guests */}
          <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 hover:shadow-soft transition-all duration-300'>
            <div className='text-xs font-bold text-purple-600 uppercase tracking-wide mb-2'>
              Guests
            </div>
            <div className='flex items-center gap-2 text-lg font-bold text-purple-900'>
              <FaUsers className='text-sm' />
              <span>{booking.guests || 1}</span>
            </div>
          </div>

          {/* Nights */}
          <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 hover:shadow-soft transition-all duration-300'>
            <div className='text-xs font-bold text-orange-600 uppercase tracking-wide mb-2'>
              Nights
            </div>
            <div className='text-lg font-bold text-orange-900'>
              {nights > 0 ? nights : 'N/A'}
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className='bg-gradient-to-r from-primary-50 to-primary-25 rounded-2xl p-6 mb-6 border-2 border-primary-200'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-sm font-bold text-primary-600 uppercase tracking-wide mb-1'>
                Total Amount
              </div>
              <div className='text-3xl font-black text-primary-900'>
                {selectedCurrencyData.symbol}
                {Math.round(convertedAmount).toLocaleString()}
              </div>
            </div>
            <div className='w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center'>
              <span className='text-2xl'>💰</span>
            </div>
          </div>
        </div>

        {/* Booking Date */}
        <div className='flex items-center justify-between text-sm text-primary-500 font-medium mb-6 px-4 py-3 bg-neutral-50 rounded-xl'>
          <div className='flex items-center gap-2'>
            <FaClock className='text-xs' />
            <span>Booked: {formatDate(booking.createdAt)}</span>
          </div>
          {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
            <span>Updated: {formatDate(booking.updatedAt)}</span>
          )}
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {booking.propertyId && (
            <button
              onClick={(e) => {
                e.stopPropagation() // Prevent card click
                onViewProperty(booking.propertyId)
              }}
              className='flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-primary-25 border-2 border-primary-200 rounded-xl hover:from-primary-100 hover:to-primary-50 hover:border-primary-300 transition-all duration-300 hover:scale-105 hover:shadow-medium md:relative md:z-10'
            >
              <FaEye className='text-sm' />
              View Property
            </button>
          )}

          {booking.status === 'pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation() // Prevent card click
                  onCancelBooking(booking)
                }}
                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-error-700 bg-gradient-to-r from-error-50 to-error-100 border-2 border-error-200 rounded-xl hover:from-error-100 hover:to-error-200 hover:border-error-300 transition-all duration-300 hover:scale-105 hover:shadow-medium md:relative md:z-10'
              >
                <FaTimesCircle className='text-sm' />
                Cancel Booking
              </button>
              <button
                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 border-2 border-primary-500 rounded-xl hover:from-primary-700 hover:to-primary-800 hover:border-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-strong transform active:scale-95 md:relative md:z-10'
                onClick={(e) => {
                  e.stopPropagation() // Prevent card click
                  navigate('/checkout', { state: { bookingData: booking } })
                }}
              >
                💳 Pay Now
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

BookingCard.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    status: PropTypes.string,
    propertyTitle: PropTypes.string,
    propertyLocation: PropTypes.string,
    propertyId: PropTypes.string,
    propertyImages: PropTypes.array,
    checkIn: PropTypes.string,
    checkOut: PropTypes.string,
    guests: PropTypes.number,
    totalAmount: PropTypes.number,
    currency: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onViewProperty: PropTypes.func.isRequired,
  onCancelBooking: PropTypes.func.isRequired,
}

const MyBookings = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, getBookings, cancelBooking } = useAPI()

  // Debug logging
  useEffect(() => {
    console.log('MyBookings - Auth state changed:', {
      isAuthenticated,
      user,
      hasUserId: !!user?.id,
      hasUserUid: !!user?.uid,
      hasUserEmail: !!user?.email,
    })
  }, [isAuthenticated, user])

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'confirmed', 'cancelled'

  // Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)

  // Handle cancel booking - open modal
  const handleCancelBookingClick = (booking) => {
    setBookingToCancel(booking)
    setCancelModalOpen(true)
  }

  // Confirm cancel booking
  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return

    try {
      setLoading(true)
      setCancelModalOpen(false)

      // Get the booking ID to cancel
      const bookingIdToCancel = bookingToCancel._id || bookingToCancel.id

      console.log('Attempting to cancel booking:', bookingIdToCancel)

      // Call API to cancel booking on the server
      await cancelBooking(bookingIdToCancel)

      console.log('Booking cancelled successfully on server')

      // Update the local state to mark ONLY the specific booking as cancelled
      setBookings((prevBookings) =>
        prevBookings.map((booking) => {
          const currentBookingId = booking._id || booking.id
          if (currentBookingId === bookingIdToCancel) {
            return { ...booking, status: 'cancelled' }
          }
          return booking
        })
      )

      toast.success('Booking cancelled successfully!')

      // If we're currently viewing pending bookings and this was a pending booking,
      // the filtering will automatically hide it since it's now cancelled
    } catch (error) {
      console.error('Error cancelling booking:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })

      // Provide more specific error messages
      let errorMessage = 'Failed to cancel booking. Please try again.'

      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to cancel this booking.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Booking not found.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
      setBookingToCancel(null)
    }
  }

  // Close cancel modal
  const closeCancelModal = () => {
    setCancelModalOpen(false)
    setBookingToCancel(null)
  }

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      console.log('MyBookings - Authentication check:', {
        isAuthenticated,
        user,
      })

      if (!isAuthenticated) {
        console.log(
          'MyBookings - User not authenticated, redirecting to signin'
        )
        navigate('/signin')
        return
      }

      // Check if user has required data (id, uid, or email)
      if (!user || (!user.id && !user.uid && !user.email)) {
        console.log('MyBookings - User data incomplete:', user)
        toast.error('Unable to load user data. Please try logging in again.')
        navigate('/signin')
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log('MyBookings - Fetching bookings for authenticated user')
        // getBookings automatically fetches for the authenticated user
        const userBookings = await getBookings()
        console.log('MyBookings - Received bookings:', userBookings)
        setBookings(userBookings || [])
      } catch (err) {
        console.error('Error fetching bookings:', err)
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        })

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to load bookings'
        setError(errorMessage)

        // Provide more specific error messages
        if (err.response?.status === 401) {
          toast.error('Authentication expired. Please log in again.')
          navigate('/signin')
        } else if (err.response?.status === 403) {
          toast.error('Access denied. Please check your permissions.')
        } else if (err.response?.status >= 500) {
          toast.error('Server error. Please try again later.')
        } else {
          toast.error(errorMessage)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, user, navigate, getBookings])

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true
    return booking.status?.toLowerCase() === filter.toLowerCase()
  })

  // Handle view property
  const handleViewProperty = (propertyId) => {
    navigate(`/listing/${propertyId}`)
  }

  // Get filter counts
  const getFilterCount = (status) => {
    if (status === 'all') return bookings.length
    return bookings.filter(
      (b) => b.status?.toLowerCase() === status.toLowerCase()
    ).length
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-25'>
        <div className='text-center'>
          <FaHome className='text-primary-400 text-6xl mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-primary-800 mb-2'>
            Please Login
          </h2>
          <p className='text-primary-600 mb-6'>
            You need to be logged in to view your bookings.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className='bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300'
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-neutral-25 p-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center py-12'>
            <div className='w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-primary-600 text-lg'>Loading your bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-neutral-25 p-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center py-12'>
            <div className='text-error-500 text-6xl mb-4'>⚠️</div>
            <h3 className='text-xl font-semibold text-error-700 mb-2'>
              Error Loading Bookings
            </h3>
            <p className='text-error-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-25 to-white'>
      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancelBooking}
        bookingTitle={
          bookingToCancel?.propertyTitle ||
          `Booking #${
            bookingToCancel?._id?.substring(0, 8) ||
            bookingToCancel?.id?.substring(0, 8) ||
            'N/A'
          }`
        }
      />

      {/* Modern Header */}
      <div className='bg-white/90 backdrop-blur-md border-b border-primary-100 sticky top-0 z-40'>
        <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-6'>
            <div className='flex items-center gap-6'>
              <button
                onClick={() => navigate('/listings')}
                className='flex items-center gap-3 px-4 py-2 text-primary-700 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 rounded-xl border-2 border-primary-200 hover:border-primary-300 transition-all duration-300 hover:scale-105 hover:shadow-soft'
              >
                <FaArrowLeft className='text-sm' />
                <span className='font-semibold'>Back to Listings</span>
              </button>
              <div className='h-8 w-px bg-gradient-to-b from-transparent via-primary-300 to-transparent'></div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='text-right'>
                <h1 className='text-2xl font-bold text-primary-900 mb-1'>
                  My Bookings
                </h1>
                <p className='text-sm text-primary-600 font-medium'>
                  Manage your reservations and payments
                </p>
              </div>
              <div className='w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-medium'>
                <FaCalendarAlt className='text-white text-xl' />
              </div>
              <div className='px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-25 border-2 border-primary-200 rounded-xl ml-4'>
                <span className='text-sm font-bold text-primary-800'>
                  {bookings.length}{' '}
                  {bookings.length === 1 ? 'Booking' : 'Bookings'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Modern Filter Tabs */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-medium border-2 border-primary-200 mb-8 inline-flex overflow-hidden'>
          {[
            {
              key: 'all',
              label: 'All Bookings',
              count: getFilterCount('all'),
              icon: FaHome,
            },
            {
              key: 'pending',
              label: 'Pending',
              count: getFilterCount('pending'),
              icon: FaHourglassHalf,
            },
            {
              key: 'confirmed',
              label: 'Confirmed',
              count: getFilterCount('confirmed'),
              icon: FaCheckCircle,
            },
            {
              key: 'cancelled',
              label: 'Cancelled',
              count: getFilterCount('cancelled'),
              icon: FaTimesCircle,
            },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 ${
                  filter === tab.key
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-strong border-2 border-primary-400'
                    : 'text-primary-700 hover:text-primary-900 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-25 border-2 border-transparent hover:border-primary-200'
                }`}
              >
                <Icon
                  className={`text-sm transition-transform duration-300 ${
                    filter === tab.key ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                <span>{tab.label}</span>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-black ${
                    filter === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-100 text-primary-700 group-hover:bg-primary-200'
                  }`}
                >
                  {tab.count}
                </div>
              </button>
            )
          })}
        </div>

        {/* Modern Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex items-center justify-center py-20'
          >
            <div className='text-center bg-white rounded-3xl p-12 shadow-intense border-2 border-primary-200'>
              <div className='relative w-20 h-20 mx-auto mb-8'>
                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 animate-spin'></div>
                <div className='absolute inset-2 rounded-full bg-white flex items-center justify-center'>
                  <FaHourglassHalf className='text-2xl text-primary-600 animate-bounce' />
                </div>
              </div>
              <h3 className='text-xl font-bold text-primary-900 mb-2'>
                Loading Your Bookings
              </h3>
              <p className='text-primary-600 font-medium'>
                Please wait while we fetch your reservation details...
              </p>
            </div>
          </motion.div>
        )}

        {/* Modern Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-gradient-to-br from-error-50 to-error-100 border-2 border-error-200 text-error-700 p-8 rounded-3xl shadow-strong'
          >
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl flex items-center justify-center flex-shrink-0'>
                <FaTimesCircle className='text-white text-xl' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-error-900 mb-2'>
                  Unable to Load Bookings
                </h3>
                <p className='text-error-700 mb-4 font-medium'>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className='px-6 py-3 bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white font-bold rounded-xl border-2 border-error-400 hover:border-error-500 transition-all duration-300 hover:scale-105 hover:shadow-strong'
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {/* Modern Empty State - No Bookings */}
        {!loading &&
          !error &&
          filteredBookings.length === 0 &&
          bookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center py-20'
            >
              <div className='bg-white rounded-3xl p-12 shadow-intense border-2 border-primary-200 max-w-2xl mx-auto'>
                <div className='w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-8'>
                  <FaCalendarAlt className='text-primary-500 text-4xl' />
                </div>
                <h3 className='text-3xl font-bold text-primary-900 mb-4'>
                  No Bookings Yet
                </h3>
                <p className='text-primary-600 text-lg mb-8 leading-relaxed'>
                  Ready to discover amazing places? Start exploring our curated
                  collection of properties and make your first booking!
                </p>
                <button
                  onClick={() => navigate('/listings')}
                  className='px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl border-2 border-primary-500 hover:from-primary-700 hover:to-primary-800 hover:border-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-strong transform active:scale-95'
                >
                  <span className='flex items-center gap-3'>
                    <FaHome className='text-lg' />
                    Explore Properties
                  </span>
                </button>
              </div>
            </motion.div>
          )}

        {/* Modern No Results for Filter */}
        {!loading &&
          !error &&
          filteredBookings.length === 0 &&
          bookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center py-16'
            >
              <div className='bg-white rounded-3xl p-10 shadow-strong border-2 border-primary-200 max-w-xl mx-auto'>
                <div className='w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <FaFilter className='text-primary-500 text-2xl' />
                </div>
                <h3 className='text-2xl font-bold text-primary-900 mb-3'>
                  No {filter !== 'all' ? filter : ''} bookings found
                </h3>
                <p className='text-primary-600 text-lg leading-relaxed'>
                  Try changing the filter above to see your other bookings.
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className='mt-6 px-6 py-3 bg-gradient-to-r from-primary-50 to-primary-25 text-primary-700 hover:text-primary-900 font-bold rounded-xl border-2 border-primary-200 hover:border-primary-300 transition-all duration-300 hover:scale-105'
                >
                  Show All Bookings
                </button>
              </div>
            </motion.div>
          )}

        {/* Bookings List */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking._id || booking.id || index}
                booking={booking}
                onViewProperty={handleViewProperty}
                onCancelBooking={handleCancelBookingClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
