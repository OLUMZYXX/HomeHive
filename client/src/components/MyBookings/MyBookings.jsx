import React, { useState, useEffect } from 'react'
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

// Individual booking card component
const BookingCard = ({ booking, onViewProperty }) => {
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

  const nights = calculateNights()
  const convertedAmount = booking.totalAmount
    ? convertFromCurrency(booking.totalAmount, booking.currency || 'NGN')
    : 0

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
              {booking.propertyTitle ||
                `Booking #${booking.id?.substring(0, 8) || 'N/A'}`}
            </h3>
            {booking.propertyLocation && (
              <div className='flex items-center gap-1 text-primary-600 text-sm'>
                <FaMapMarkerAlt className='text-xs' />
                <span>{booking.propertyLocation}</span>
              </div>
            )}
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

        {/* Total Amount */}
        <div className='bg-neutral-50 rounded-lg p-3 mb-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-primary-600'>Total Amount</span>
            <span className='text-lg font-bold text-primary-800'>
              {selectedCurrencyData.symbol}
              {Math.round(convertedAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Booking Date */}
        <div className='flex items-center justify-between text-xs text-primary-500 mb-4'>
          <span>Booked on: {formatDate(booking.createdAt)}</span>
          {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
            <span>Updated: {formatDate(booking.updatedAt)}</span>
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          {booking.propertyId && (
            <button
              onClick={() => onViewProperty(booking.propertyId)}
              className='flex items-center gap-2 px-4 py-2 text-sm text-accent-blue-600 bg-accent-blue-50 hover:bg-accent-blue-100 rounded-lg transition-colors duration-300'
            >
              <FaEye className='text-xs' />
              View Property
            </button>
          )}

          {booking.status === 'pending' && (
            <button className='flex items-center gap-2 px-4 py-2 text-sm text-error-600 bg-error-50 hover:bg-error-100 rounded-lg transition-colors duration-300'>
              <FaTimesCircle className='text-xs' />
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const MyBookings = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, getBookings } = useAPI()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'confirmed', 'cancelled'

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !user?.uid) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setError(null)

        // This would call the API to get user bookings
        const userBookings = await getBookings(user.uid)
        setBookings(userBookings || [])
      } catch (err) {
        console.error('Error fetching bookings:', err)
        setError(err.message || 'Failed to load bookings')
        toast.error('Failed to load your bookings')
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
            onClick={() => navigate('/login')}
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
    <div className='min-h-screen bg-neutral-25'>
      {/* Header */}
      <div className='bg-white shadow-soft'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigate('/listings')}
                className='flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors duration-300'
              >
                <FaArrowLeft />
                <span>Back to Listings</span>
              </button>
              <div className='h-6 w-px bg-neutral-300'></div>
              <h1 className='text-xl font-semibold text-primary-900'>
                My Bookings
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Filter Tabs */}
        <div className='bg-white rounded-xl p-1 shadow-soft border border-primary-200 mb-6 inline-flex'>
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
                  ? 'bg-primary-600 text-white shadow-medium'
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
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
              <p className='text-gray-600'>Loading your bookings...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className='bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg'>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='mt-2 text-red-600 hover:text-red-800 underline text-sm'
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
            <div className='text-center py-12'>
              <FaCalendarAlt className='text-primary-400 text-6xl mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-primary-800 mb-2'>
                No bookings yet
              </h3>
              <p className='text-primary-600 mb-6'>
                Start exploring amazing properties and make your first booking!
              </p>
              <button
                onClick={() => navigate('/listings')}
                className='bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300'
              >
                Explore Properties
              </button>
            </div>
          )}

        {/* No Results for Filter */}
        {!loading &&
          !error &&
          filteredBookings.length === 0 &&
          bookings.length > 0 && (
            <div className='text-center py-8'>
              <FaCalendarAlt className='text-primary-400 text-4xl mx-auto mb-3' />
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
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id || index}
                booking={booking}
                onViewProperty={handleViewProperty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
