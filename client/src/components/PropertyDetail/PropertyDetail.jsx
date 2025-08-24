import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAPI } from '../../contexts/APIContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import {
  FaStar,
  FaHeart,
  FaShare,
  FaMapMarkerAlt,
  FaUsers,
  FaBed,
  FaBath,
  FaWifi,
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaUtensils,
  FaSnowflake,
  FaDumbbell,
  FaPaw,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { toast } from 'sonner'
import PropTypes from 'prop-types'

// Date picker component
const DatePicker = ({ label, value, onChange, min, disabled, error }) => {
  return (
    <div className='flex flex-col'>
      <label className='text-sm font-semibold text-primary-700 mb-2'>
        {label}
      </label>
      <input
        type='date'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        disabled={disabled}
        className={`w-full p-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
          error
            ? 'border-error-300 focus:border-error-500 bg-error-50'
            : disabled
            ? 'border-neutral-200 bg-neutral-100 text-neutral-400'
            : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
        }`}
      />
      {error && (
        <p className='text-error-500 text-sm mt-1 flex items-center gap-1'>
          <FaExclamationTriangle className='text-xs' />
          {error}
        </p>
      )}
    </div>
  )
}

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
}

// Guest counter component
const GuestCounter = ({ guests, onGuestsChange, maxGuests = 10 }) => {
  const decrementGuests = () => {
    if (guests > 1) {
      onGuestsChange(guests - 1)
    }
  }

  const incrementGuests = () => {
    if (guests < maxGuests) {
      onGuestsChange(guests + 1)
    }
  }

  return (
    <div className='flex flex-col'>
      <label className='text-sm font-semibold text-primary-700 mb-2'>
        Guests
      </label>
      <div className='flex items-center justify-between p-3 border-2 border-primary-200 rounded-xl'>
        <button
          type='button'
          onClick={decrementGuests}
          disabled={guests <= 1}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            guests <= 1
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-primary-200 hover:bg-primary-300 text-primary-700'
          }`}
        >
          -
        </button>
        <span className='font-semibold text-primary-800'>
          {guests} {guests === 1 ? 'Guest' : 'Guests'}
        </span>
        <button
          type='button'
          onClick={incrementGuests}
          disabled={guests >= maxGuests}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            guests >= maxGuests
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-primary-200 hover:bg-primary-300 text-primary-700'
          }`}
        >
          +
        </button>
      </div>
    </div>
  )
}

GuestCounter.propTypes = {
  guests: PropTypes.number.isRequired,
  onGuestsChange: PropTypes.func.isRequired,
  maxGuests: PropTypes.number,
}

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    getProperty,
    isAuthenticated,
    user,
    createBooking,
    checkBookingAvailability,
  } = useAPI()
  const { convertFromCurrency, selectedCurrencyData } = useCurrency()

  // Property state
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Image gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  })
  const [bookingErrors, setBookingErrors] = useState({})
  const [bookingLoading, setBookingLoading] = useState(false)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)

  // Calculate booking details
  const calculateBookingDetails = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut || !property) {
      return { nights: 0, totalAmount: 0, pricePerNight: 0 }
    }

    const checkIn = new Date(bookingForm.checkIn)
    const checkOut = new Date(bookingForm.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

    // Get base price - handle multiple possible field names
    let basePrice = 0
    if (property.pricePerNight) basePrice = property.pricePerNight
    else if (property.price) basePrice = property.price
    else if (property.nightlyRate) basePrice = property.nightlyRate
    else basePrice = 0

    console.log('💰 Base price from property:', basePrice)
    console.log('📊 Property currency:', property.currency || 'NGN')

    // Convert price to selected currency - get numeric value
    const convertedPrice = convertFromCurrency(
      basePrice,
      property.currency || 'NGN'
    )

    // Parse the converted price to handle comma formatting
    const pricePerNight =
      typeof convertedPrice === 'string'
        ? parseFloat(convertedPrice.replace(/,/g, ''))
        : convertedPrice

    console.log('🔄 Converted price per night:', pricePerNight)

    const totalAmount = nights * pricePerNight

    return { nights, totalAmount, pricePerNight }
  }

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('🔍 Fetching property with ID:', id)

        // Add validation for property ID
        if (!id || id === 'undefined' || id === 'null') {
          throw new Error('Invalid property ID')
        }

        const propertyData = await getProperty(id)

        if (!propertyData) {
          throw new Error('Property not found')
        }

        console.log('✅ Property loaded successfully:', propertyData.title)
        console.log('💰 Property data:', {
          title: propertyData.title,
          price: propertyData.price,
          pricePerNight: propertyData.pricePerNight,
          currency: propertyData.currency,
          id: propertyData.id || propertyData._id,
          maxGuests: propertyData.maxGuests || propertyData.guests,
        })
        setProperty(propertyData)
      } catch (err) {
        console.error('❌ Error fetching property:', err)
        const errorMessage = err.message || 'Failed to load property'
        setError(errorMessage)

        // If it's a timeout error, provide specific message
        if (err.message?.includes('timeout')) {
          setError(
            'Request timed out. Please check your connection and try again.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProperty()
    } else {
      setError('No property ID provided')
      setLoading(false)
    }
  }, [id, getProperty])

  // Validate booking form
  const validateBookingForm = () => {
    const errors = {}
    const today = new Date().toISOString().split('T')[0]

    if (!bookingForm.checkIn) {
      errors.checkIn = 'Check-in date is required'
    } else if (bookingForm.checkIn < today) {
      errors.checkIn = 'Check-in date cannot be in the past'
    }

    if (!bookingForm.checkOut) {
      errors.checkOut = 'Check-out date is required'
    } else if (bookingForm.checkOut <= bookingForm.checkIn) {
      errors.checkOut = 'Check-out date must be after check-in date'
    }

    if (bookingForm.guests < 1) {
      errors.guests = 'At least 1 guest is required'
    } else if (
      property &&
      bookingForm.guests > (property.maxGuests || property.guests || 10)
    ) {
      errors.guests = `Maximum ${
        property.maxGuests || property.guests || 10
      } guests allowed`
    }

    return errors
  }

  // Check availability
  const handleCheckAvailability = async () => {
    const validationErrors = validateBookingForm()
    setBookingErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the form errors before checking availability')
      return
    }

    try {
      setAvailabilityLoading(true)
      setBookingErrors({}) // Clear previous errors

      console.log(
        '🔍 Checking availability for property:',
        property._id || property.id
      )
      console.log('📅 Dates:', {
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
      })

      const response = await checkBookingAvailability(
        property._id || property.id,
        bookingForm.checkIn,
        bookingForm.checkOut
      )

      console.log('✅ Availability response:', response)

      if (response && response.available === true) {
        toast.success('Property is available for these dates! ✅')
        setBookingErrors({}) // Clear errors on success
      } else {
        const errorMessage =
          response?.message || 'Property is not available for these dates'
        toast.error(errorMessage)
        setBookingErrors({ general: errorMessage })
      }
    } catch (err) {
      console.error('❌ Availability check error:', err)
      console.error('📄 Error response:', err.response?.data)
      console.error('🔢 Error status:', err.response?.status)

      let errorMessage = 'Failed to check availability'

      if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Invalid request parameters'
      } else if (err.response?.status === 404) {
        errorMessage = 'Property not found'
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to check availability'
      }

      toast.error(errorMessage)
      setBookingErrors({ general: errorMessage })
    } finally {
      setAvailabilityLoading(false)
    }
  }

  // Handle Book Now - Navigate to checkout
  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue booking')
      navigate('/signin')
      return
    }

    // Validate form before proceeding to checkout
    const validationErrors = validateBookingForm()
    if (Object.keys(validationErrors).length > 0) {
      setBookingErrors(validationErrors)
      toast.error('Please fix the form errors before proceeding')
      return
    }

    const { nights, totalAmount, pricePerNight } = calculateBookingDetails()

    if (!pricePerNight || pricePerNight <= 0) {
      toast.error('Unable to calculate booking price. Please try again.')
      return
    }

    // Create booking data for checkout
    const checkoutBookingData = {
      propertyId: property._id || property.id,
      propertyTitle: property.title,
      propertyImage: property.images?.[0],
      propertyLocation: `${
        property.address?.city || property.location?.city
      }, ${property.address?.state || property.location?.state}`,
      checkIn: bookingForm.checkIn,
      checkOut: bookingForm.checkOut,
      guests: bookingForm.guests,
      nights,
      pricePerNight: Math.round(pricePerNight),
      totalAmount: Math.round(totalAmount),
      currency: selectedCurrencyData?.code || 'NGN',
      currencySymbol: selectedCurrencyData?.symbol || '\u20a6',
    }

    // Navigate to checkout with booking data
    navigate('/checkout', {
      state: {
        bookingData: checkoutBookingData,
        fromProperty: property._id || property.id,
      },
    })
  }

  // Handle booking submission
  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to make a booking')
      navigate('/signin')
      return
    }

    // Debugging: Log booking form values
    console.log('Booking form values before validation:', bookingForm)

    // Validate form fields
    const validationErrors = validateBookingForm()
    if (Object.keys(validationErrors).length > 0) {
      setBookingErrors(validationErrors)
      toast.error('Please fix the form errors before proceeding')
      return
    }

    // Ensure `checkIn` and `checkOut` are populated
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      toast.error('Check-in and Check-out dates are required')
      setBookingErrors({
        checkIn: !bookingForm.checkIn ? 'Check-in date is required' : undefined,
        checkOut: !bookingForm.checkOut
          ? 'Check-out date is required'
          : undefined,
      })
      return
    }

    try {
      setBookingLoading(true)
      setBookingErrors({}) // Clear previous errors

      console.log('🔍 Pre-checking availability before booking...')

      // Show user that we're checking availability
      toast.loading('Checking availability...', { id: 'availability-check' })

      let availabilityCheck
      try {
        availabilityCheck = await checkBookingAvailability(
          property._id || property.id,
          bookingForm.checkIn,
          bookingForm.checkOut
        )
      } catch (availabilityError) {
        console.error('❌ Availability check failed:', availabilityError)
        toast.dismiss('availability-check')
        toast.error('Failed to check availability. Please try again.')
        setBookingErrors({
          general: 'Failed to check availability. Please try again.',
        })
        setBookingLoading(false)
        return
      }

      console.log('📋 Availability check result:', availabilityCheck)

      // Dismiss the loading toast
      toast.dismiss('availability-check')

      if (!availabilityCheck || !availabilityCheck.available) {
        const errorMessage =
          availabilityCheck?.message ||
          'Property is not available for these dates'
        toast.error(errorMessage)
        setBookingErrors({ general: errorMessage })
        setBookingLoading(false) // Reset loading state
        return
      }

      // Show success for availability
      toast.success('Dates available! Processing booking...', {
        duration: 2000,
      })

      const { nights, totalAmount, pricePerNight } = calculateBookingDetails()

      if (!pricePerNight || pricePerNight <= 0) {
        toast.error('Unable to calculate booking price. Please try again.')
        setBookingErrors({ general: 'Invalid price calculation' })
        setBookingLoading(false) // Reset loading state
        return
      }

      console.log('🎯 Creating booking with data:', {
        propertyId: property._id || property.id,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: bookingForm.guests,
        nights,
        totalAmount,
        pricePerNight,
      })

      const bookingData = {
        propertyId: property._id || property.id,
        propertyTitle: property.title,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: bookingForm.guests,
        totalAmount: Math.round(totalAmount),
        nights,
        status: 'pending', // Set as pending until payment
        userEmail: user?.email, // Include user email
      }

      // Create pending booking
      const result = await createBooking(bookingData)
      console.log('✅ Pending booking created successfully:', result)

      toast.success('Booking reserved! You can pay later from My Bookings.', {
        duration: 3000,
      })

      // Reset form on success
      setBookingForm({
        checkIn: '',
        checkOut: '',
        guests: 1,
      })
      setBookingErrors({}) // Clear any remaining errors

      // Navigate to My Bookings page
      navigate('/my-bookings')
    } catch (err) {
      console.error('❌ Booking creation error:', err)
      console.error('📄 Error response:', err.response?.data)
      console.error('🔢 Error status:', err.response?.status)

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create booking'

      toast.error(errorMessage)
      setBookingErrors({ general: errorMessage })
    } finally {
      setBookingLoading(false)
    }
  }

  // Image navigation
  const nextImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  // Amenity icons mapping
  const amenityIcons = {
    'Wi-Fi': FaWifi,
    TV: FaTv,
    Parking: FaCar,
    Pool: FaSwimmingPool,
    Kitchen: FaUtensils,
    AC: FaSnowflake,
    Gym: FaDumbbell,
    'Pet-friendly': FaPaw,
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white'>
        <div className='text-center max-w-md mx-auto px-4'>
          <div className='relative'>
            <div className='animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6'></div>
            <div className='absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary-300 animate-ping mx-auto'></div>
          </div>
          <h3 className='text-xl font-semibold text-primary-900 mb-2'>
            Loading Property Details
          </h3>
          <p className='text-primary-600'>
            Please wait while we fetch the property information...
          </p>
          <div className='flex justify-center space-x-1 mt-4'>
            <div className='w-2 h-2 bg-primary-400 rounded-full animate-bounce'></div>
            <div
              className='w-2 h-2 bg-primary-500 rounded-full animate-bounce'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-2 h-2 bg-primary-600 rounded-full animate-bounce'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-error-50 to-white'>
        <div className='text-center max-w-lg mx-auto px-6'>
          <div className='bg-white rounded-2xl shadow-strong p-8 border border-error-100'>
            <div className='w-20 h-20 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <FaTimes className='text-error-600 text-3xl' />
            </div>
            <h2 className='text-2xl font-bold text-error-800 mb-3'>
              Property Not Found
            </h2>
            <p className='text-error-600 mb-6 leading-relaxed'>
              {error ||
                "We couldn't find the property you're looking for. It may have been removed or the link might be incorrect."}
            </p>
            <div className='space-y-3'>
              <button
                onClick={() => navigate('/listings')}
                className='w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong'
              >
                View All Properties
              </button>
              <button
                onClick={() => window.location.reload()}
                className='w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-6 py-3 rounded-xl font-medium transition-all duration-300'
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { nights, totalAmount, pricePerNight } = calculateBookingDetails()

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-25 to-white'>
      {/* Enhanced Header */}
      <div className='bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-40'>
        <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <button
              onClick={() => navigate('/listings')}
              className='flex items-center gap-3 text-primary-600 hover:text-primary-800 transition-all duration-300 font-medium group'
            >
              <div className='w-10 h-10 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center transition-colors duration-300'>
                <FaArrowLeft className='text-sm' />
              </div>
              <span>Back to Properties</span>
            </button>

            <div className='flex items-center gap-3'>
              <button className='w-10 h-10 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center justify-center transition-colors duration-300'>
                <FaShare className='text-neutral-600 text-sm' />
              </button>
              <button className='w-10 h-10 bg-error-100 hover:bg-error-200 rounded-xl flex items-center justify-center transition-colors duration-300'>
                <FaHeart className='text-error-600 text-sm' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Property Details */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Property Header */}
            <div className='bg-white rounded-2xl p-6 shadow-soft border border-primary-100'>
              <div className='mb-4'>
                <div className='flex items-center gap-2 text-primary-600 mb-2'>
                  <FaMapMarkerAlt className='text-sm' />
                  <span className='text-sm font-medium'>
                    {property.location?.city || property.address?.city},{' '}
                    {property.location?.state || property.address?.state}
                  </span>
                </div>
                <h1 className='text-3xl lg:text-4xl font-bold text-primary-900 mb-3 leading-tight'>
                  {property.title}
                </h1>
                <div className='flex items-center gap-6 flex-wrap'>
                  <div className='flex items-center gap-2'>
                    <FaStar className='text-amber-400 text-sm' />
                    <span className='font-bold text-primary-900'>
                      {property.averageRating || 'New'}
                    </span>
                    {property.totalReviews && (
                      <span className='text-primary-600'>
                        ({property.totalReviews} reviews)
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-4 text-sm text-primary-700'>
                    <span className='flex items-center gap-1'>
                      <FaUsers className='text-xs' />
                      {property.maxGuests || property.guests || 4} Guests
                    </span>
                    <span className='flex items-center gap-1'>
                      <FaBed className='text-xs' />
                      {property.bedrooms} Beds
                    </span>
                    <span className='flex items-center gap-1'>
                      <FaBath className='text-xs' />
                      {property.bathrooms} Baths
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className='bg-white rounded-2xl p-6 shadow-soft border border-primary-100'>
              <div className='relative rounded-2xl overflow-hidden group'>
                <div className='aspect-w-16 aspect-h-10'>
                  <img
                    src={
                      property.images?.[currentImageIndex] ||
                      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={property.title}
                    className='w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  {property.images?.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className='absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium transition-all duration-300 hover:scale-105'
                      >
                        <FaChevronLeft className='text-primary-600' />
                      </button>
                      <button
                        onClick={nextImage}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium transition-all duration-300 hover:scale-105'
                      >
                        <FaChevronRight className='text-primary-600' />
                      </button>
                    </>
                  )}
                  <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm'>
                    {currentImageIndex + 1} / {property.images?.length || 1}
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              {property.images?.length > 1 && (
                <div className='mt-4 flex gap-3 overflow-x-auto pb-2'>
                  {property.images.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? 'border-primary-500 scale-105'
                          : 'border-primary-200 hover:border-primary-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                    </button>
                  ))}
                  {property.images.length > 6 && (
                    <div className='flex-shrink-0 w-20 h-20 rounded-xl bg-primary-100 border-2 border-primary-200 flex items-center justify-center'>
                      <span className='text-primary-600 text-xs font-medium'>
                        +{property.images.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className='bg-white rounded-2xl p-6 shadow-soft border border-primary-100 space-y-6'>
              <div>
                <h3 className='text-2xl font-bold text-primary-900 mb-4'>
                  About this place
                </h3>
                <p className='text-primary-700 leading-relaxed text-base'>
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div>
                  <h3 className='text-2xl font-bold text-primary-900 mb-6'>
                    What this place offers
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {property.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity] || FaCheck
                      return (
                        <div
                          key={index}
                          className='flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-25 rounded-xl border border-primary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-soft'
                        >
                          <div className='w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center'>
                            <IconComponent className='text-primary-600 text-lg' />
                          </div>
                          <span className='text-primary-800 font-medium text-sm'>
                            {amenity}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Property Features */}
              <div>
                <h3 className='text-2xl font-bold text-primary-900 mb-6'>
                  Property Features
                </h3>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200 hover:shadow-medium transition-all duration-300'>
                    <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <FaUsers className='text-white text-xl' />
                    </div>
                    <div className='font-bold text-2xl text-blue-900 mb-1'>
                      {property.maxGuests || property.guests || 'N/A'}
                    </div>
                    <div className='text-sm text-blue-600 font-medium'>
                      Guests
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200 hover:shadow-medium transition-all duration-300'>
                    <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <FaBed className='text-white text-xl' />
                    </div>
                    <div className='font-bold text-2xl text-green-900 mb-1'>
                      {property.bedrooms || 'N/A'}
                    </div>
                    <div className='text-sm text-green-600 font-medium'>
                      Bedrooms
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200 hover:shadow-medium transition-all duration-300'>
                    <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <FaBath className='text-white text-xl' />
                    </div>
                    <div className='font-bold text-2xl text-purple-900 mb-1'>
                      {property.bathrooms || 'N/A'}
                    </div>
                    <div className='text-sm text-purple-600 font-medium'>
                      Bathrooms
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center border border-orange-200 hover:shadow-medium transition-all duration-300'>
                    <div className='w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <FaMapMarkerAlt className='text-white text-xl' />
                    </div>
                    <div className='font-bold text-lg text-orange-900 mb-1'>
                      {property.propertyType || property.type || 'N/A'}
                    </div>
                    <div className='text-sm text-orange-600 font-medium'>
                      Type
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl p-6 shadow-strong border border-primary-100 sticky top-24'>
              <div className='text-center mb-6'>
                <div className='text-4xl font-black text-primary-900'>
                  {selectedCurrencyData?.symbol || '₦'}
                  {pricePerNight && pricePerNight > 0
                    ? Math.round(pricePerNight).toLocaleString()
                    : '0'}
                </div>
                <div className='text-primary-600'>per night</div>
              </div>

              {/* Booking Form */}
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <DatePicker
                    label='Check-in'
                    value={bookingForm.checkIn}
                    onChange={(value) =>
                      setBookingForm((prev) => ({ ...prev, checkIn: value }))
                    }
                    min={new Date().toISOString().split('T')[0]}
                    error={bookingErrors.checkIn}
                  />
                  <DatePicker
                    label='Check-out'
                    value={bookingForm.checkOut}
                    onChange={(value) =>
                      setBookingForm((prev) => ({ ...prev, checkOut: value }))
                    }
                    min={
                      bookingForm.checkIn ||
                      new Date().toISOString().split('T')[0]
                    }
                    error={bookingErrors.checkOut}
                  />
                </div>

                <GuestCounter
                  guests={bookingForm.guests}
                  onGuestsChange={(value) =>
                    setBookingForm((prev) => ({ ...prev, guests: value }))
                  }
                  maxGuests={property.maxGuests || property.guests || 10}
                />

                {/* Booking Summary */}
                {nights > 0 && pricePerNight > 0 && (
                  <div className='bg-primary-50 p-4 rounded-xl space-y-2'>
                    <div className='flex justify-between text-primary-700'>
                      <span>
                        {selectedCurrencyData?.symbol || '₦'}
                        {Math.round(pricePerNight).toLocaleString()} × {nights}{' '}
                        nights
                      </span>
                      <span>
                        {selectedCurrencyData?.symbol || '₦'}
                        {Math.round(nights * pricePerNight).toLocaleString()}
                      </span>
                    </div>
                    <hr className='border-primary-200' />
                    <div className='flex justify-between font-bold text-primary-900'>
                      <span>Total</span>
                      <span>
                        {selectedCurrencyData?.symbol || '₦'}
                        {Math.round(totalAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {bookingErrors.general && (
                  <div className='bg-error-50 border border-error-200 text-error-600 p-3 rounded-xl text-sm flex items-center gap-2'>
                    <FaExclamationTriangle className='text-sm' />
                    {bookingErrors.general}
                  </div>
                )}

                {/* Action Buttons */}
                <div className='space-y-3'>
                  <button
                    onClick={handleCheckAvailability}
                    disabled={
                      availabilityLoading ||
                      !bookingForm.checkIn ||
                      !bookingForm.checkOut
                    }
                    className='w-full bg-neutral-100 hover:bg-neutral-200 text-primary-800 font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {availabilityLoading ? 'Checking...' : 'Check Availability'}
                  </button>

                  {/* Reserve Now - Direct booking */}
                  <button
                    onClick={handleBooking}
                    disabled={
                      bookingLoading ||
                      !bookingForm.checkIn ||
                      !bookingForm.checkOut
                    }
                    className='w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-strong transform hover:scale-105 active:scale-95'
                  >
                    {bookingLoading ? (
                      <div className='flex items-center justify-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Booking...
                      </div>
                    ) : (
                      'Reserve Now'
                    )}
                  </button>

                  {/* Book Now - Go to checkout */}
                  <button
                    onClick={handleBookNow}
                    disabled={
                      !bookingForm.checkIn ||
                      !bookingForm.checkOut ||
                      !isAuthenticated
                    }
                    className='w-full bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-900 hover:to-neutral-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-strong transform hover:scale-105 active:scale-95'
                  >
                    Book Now
                  </button>
                </div>

                {!isAuthenticated && (
                  <div className='text-center text-sm text-primary-600 bg-primary-50 p-3 rounded-xl'>
                    <button
                      onClick={() => navigate('/signin')}
                      className='text-accent-blue-600 hover:text-accent-blue-700 font-medium hover:underline'
                    >
                      Login
                    </button>
                    {' or '}
                    <button
                      onClick={() => navigate('/signup')}
                      className='text-accent-blue-600 hover:text-accent-blue-700 font-medium hover:underline'
                    >
                      Register
                    </button>
                    {' to book this property'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
