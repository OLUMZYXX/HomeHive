// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from 'react'
import Navbar from '../Navbar/Navbar'
import {
  FaCheck,
  FaCreditCard,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaLock,
  FaMapMarkerAlt,
  FaArrowLeft,
} from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'
import { RiArrowDropDownLine, RiSecurePaymentLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import image from '../../assets/Apt2.webp'
import { useNavigate, useLocation } from 'react-router-dom'
import useScrollToTop from '../../hooks/useScrollToTop'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useAPI } from '../../contexts/APIContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeCheckoutForm from './StripeCheckoutForm'

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_51QOGwYEnTmUaGP9VnrZNGgFiKqaHLLZaHqcKINQKOTFVRNsLIYWKOJo3oq6MWfPgPNAW4q8vGgGcJaBkdwTjd4H800YxNE4LVA'
)

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Nigeria',
]

const Checkout = () => {
  // Use scroll to top hook
  useScrollToTop()

  const navigate = useNavigate()
  const location = useLocation()
  const { formatPrice, convertFromCurrency, selectedCurrency } = useCurrency()
  const { createBooking, checkBookingAvailability } = useAPI()

  const [open, setOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState({
    name: 'Stripe',
    logo: '',
  })
  const [showCardDetails, setShowCardDetails] = useState(false) // Don't show manual card details by default (Stripe has its own form)
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showStripePayment, setShowStripePayment] = useState(true) // Show Stripe form by default since Stripe is pre-selected
  const [billingDetails, setBillingDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })

  // Get booking data from PropertyDetail navigation
  const bookingData = location.state?.bookingData
  const [checkIn, setCheckIn] = useState(bookingData?.checkIn || '')
  const [checkOut, setCheckOut] = useState(bookingData?.checkOut || '')
  const [guest, setGuest] = useState(bookingData?.guests || 1)
  const [home, setHome] = useState({
    title: bookingData?.propertyTitle || 'Property',
    image: bookingData?.propertyImage || image,
    location: bookingData?.propertyLocation || 'Location',
  })

  // Use booking data pricing
  const originalPrice = bookingData?.pricePerNight || 20000
  const originalCurrency = bookingData?.currency || 'NGN'
  const userSelectedCurrency = selectedCurrency
  const nights = bookingData?.nights || 1
  const totalAmount = bookingData?.totalAmount || originalPrice * nights

  // Convert price to user's selected currency if different from property currency
  const pricePerNight = originalPrice

  // If no booking data, redirect back
  useEffect(() => {
    if (!bookingData) {
      toast.error('No booking data found')
      navigate('/listings')
    }
  }, [bookingData, navigate])
  const [editOpt, setEditOpt] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('full')
  const [isLoading, setIsLoading] = useState(false)

  const handleBooking = async () => {
    // Validation
    if (!checkIn || !checkOut) {
      toast.error('Missing Dates', {
        description: 'Please select check-in and check-out dates',
        duration: 4000,
      })
      return
    }

    // Validate payment method is selected
    if (!selectedPayment?.name) {
      toast.error('Payment Method Required', {
        description: 'Please select a payment provider',
        duration: 4000,
      })
      return
    }

    // Validate card details for Mastercard only (Stripe handles its own validation)
    if (selectedPayment.name === 'Mastercard' && showCardDetails) {
      if (
        !billingDetails.cardNumber ||
        !billingDetails.expiryDate ||
        !billingDetails.cvv ||
        !billingDetails.name
      ) {
        toast.error('Card Details Required', {
          description: 'Please fill in all card details',
          duration: 4000,
        })
        return
      }
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      toast.error('Terms & Conditions', {
        description: 'Please accept the terms and conditions',
        duration: 4000,
      })
      return
    }

    setIsLoading(true)

    try {
      // Process different payment methods
      if (selectedPayment.name === 'Stripe') {
        console.log(
          'Processing Stripe payment - form should already be visible'
        )
        // Stripe form is already visible, just validate that it's filled
        toast.error('Complete Payment', {
          description:
            'Please fill in your card details in the Stripe form below',
          duration: 4000,
        })
        setIsLoading(false)
        return
      }

      // For other payment methods, redirect accordingly
      if (selectedPayment.name === 'PayPal') {
        toast.info('Redirecting to PayPal', {
          description: 'You will be redirected to PayPal to complete payment',
          duration: 3000,
        })
        // Simulate PayPal redirect - replace with actual PayPal integration
        setTimeout(() => {
          toast.success('Booking Successful!', {
            description: 'Payment processed successfully via PayPal',
            duration: 4000,
          })
          navigate('/my-bookings')
        }, 2000)
        return
      }

      if (selectedPayment.name === 'Paystack') {
        toast.info('Redirecting to Paystack', {
          description: 'You will be redirected to Paystack to complete payment',
          duration: 3000,
        })
        // Simulate Paystack redirect - replace with actual Paystack integration
        setTimeout(() => {
          toast.success('Booking Successful!', {
            description: 'Payment processed successfully via Paystack',
            duration: 4000,
          })
          navigate('/my-bookings')
        }, 2000)
        return
      }

      // For Mastercard (manual card processing)
      if (selectedPayment.name === 'Mastercard') {
        // Simulate card processing
        toast.info('Processing Payment', {
          description: 'Processing your card payment...',
          duration: 3000,
        })

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast.success('Booking Successful!', {
          description: 'Payment processed successfully',
          duration: 4000,
        })

        // Reset form after success
        setCheckIn('')
        setCheckOut('')
        setGuest(1)
        setBillingDetails({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          name: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        })

        navigate('/my-bookings')
      }
    } catch (err) {
      console.error('Booking error:', err)
      toast.error('Booking Failed', {
        description: 'Unable to process your booking. Please try again.',
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle successful Stripe payment
  const handleStripePaymentSuccess = (paymentIntent) => {
    setShowStripePayment(false)
    setIsLoading(false)

    toast.success('Booking Successful!', {
      description: 'Payment processed successfully via Stripe',
      duration: 4000,
    })

    // Reset form after success
    setCheckIn('')
    setCheckOut('')
    setGuest(1)
    setBillingDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    })
    setTermsAccepted(false)

    // Navigate to my bookings
    setTimeout(() => {
      navigate('/my-bookings')
    }, 1000)
  }

  const paymentOption = (method) => {
    console.log('paymentOption called with method:', method)
    setShowCardDetails(method === 'Mastercard') // Only show manual card details for Mastercard

    // Show Stripe payment form immediately when Stripe is selected
    if (method === 'Stripe') {
      console.log('Stripe selected, showing payment form immediately')
      setShowStripePayment(true)
      toast.info('Payment Method', {
        description: 'Stripe selected. Enter your payment details below.',
        duration: 3000,
      })
    } else {
      // Hide Stripe form when other methods are selected
      setShowStripePayment(false)
    }

    if (method === 'PayPal') {
      toast.info('Payment Method', {
        description: 'Redirecting to PayPal...',
        duration: 3000,
      })
    }
    if (method === 'Paystack') {
      toast.info('Payment Method', {
        description: 'Redirecting to Paystack...',
        duration: 3000,
      })
    }
  }

  const toggleDropdown = () => {
    setOpen((prev) => !prev)
  }

  const handleSelectPayment = (option) => {
    console.log('handleSelectPayment called with:', option)
    setSelectedPayment(option)
    setOpen(false)
    paymentOption(option.name)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim()
      setBillingDetails((prev) => ({
        ...prev,
        [name]: formatted,
      }))
    }
    // Format expiry date as MM/YY
    else if (name === 'expiryDate') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substr(0, 5)
      setBillingDetails((prev) => ({
        ...prev,
        [name]: formatted,
      }))
    }
    // Format CVV (numbers only)
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substr(0, 4)
      setBillingDetails((prev) => ({
        ...prev,
        [name]: formatted,
      }))
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Calculate number of nights and pricing
  const calculatePricing = () => {
    if (!checkIn || !checkOut) return { nights: 0, basePrice: 0, total: 0 }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

    if (nights <= 0) return { nights: 0, basePrice: 0, total: 0 }

    const basePrice = pricePerNight * nights
    const cleaningFee = 5000
    const serviceFee = 15000
    const taxes = 210
    const total = basePrice + cleaningFee + serviceFee + taxes

    return {
      nights,
      basePrice,
      cleaningFee,
      serviceFee,
      taxes,
      total,
      pricePerNight,
    }
  }

  const pricing = calculatePricing()

  const paymentOptions = [
    {
      name: 'Stripe',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCA0MCAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNS4xMSA2LjczQzI0LjkgNi4xNSAyNC4zNCA1Ljc3IDIzLjY5IDUuNzdDMjIuMzkgNS43NyAyMS40NCA2LjcxIDIxLjQ0IDguMTRDMjEuNDQgMTAuMjEgMjIuNzMgMTAuOTMgMjQuMTkgMTAuOTNDMjQuOCAxMC45MyAyNS4zNSAxMC43OCAyNS43NyAxMC41M1Y5LjE0SDI0LjAzVjguMDlIMjdWMTJIMjUuOTNWMTEuNTRDMjUuNDkgMTEuODEgMjQuODYgMTEuOTcgMjQuMDcgMTEuOTdDMjEuNDEgMTEuOTcgMTkuNDUgMTAuMDggMTkuNDUgNy45M0MxOS40NSA1Ljc4IDIxLjQ3IDMuODkgMjMuODIgMy44OUMyNS4xOCAzLjg5IDI2LjMxIDQuNTUgMjYuODYgNS42NEwyNS4xMSA2LjczWiIgZmlsbD0iIzYzNTJGRiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE3LjUgMy45M0MxNS45NyAzLjkzIDE0Ljc1IDUuMTQgMTQuNzUgNi42N1Y3LjkzQzE0Ljc1IDEwLjA4IDE2LjcgMTEuOTcgMTkuMzYgMTEuOTdDMjAuMTUgMTEuOTcgMjAuNzggMTEuODEgMjEuMjIgMTEuNTRWMTJIMjIuMjlWMy45M0gxNy41Wk0yMC4xNiA1LjY4VjYuNjdDMjAuMTYgNy41MiAxOS40OCA4LjIgMTguNjMgOC4yUzE3LjEgNy41MiAxNy4xIDYuNjdWNS42OEMxNy4xIDQuODMgMTcuNzggNC4xNSAxOC42MyA0LjE1UzIwLjE2IDQuODMgMjAuMTYgNS42OFoiIGZpbGw9IiM2MzUyRkYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCA0MCAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHA+',
    },
    {
      name: 'Mastercard',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNFQjAwMUIiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRkE1MDAiLz4KPHBhdGggZD0iTTIwIDEyYzAgLTUuNTIyIDQuNDc4IC0xMCAxMCAtMTBzMTAgNC40NzggMTAgMTBzLTQuNDc4IDEwIC0xMCAxMHMtMTAgLTQuNDc4IC0xMCAtMTB6IiBmaWxsPSIjRkZBNTAwIi8+Cjwvc3ZnPg==',
    },
    {
      name: 'PayPal',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHA+UGF5UGFsPC9wPgo8L3N2Zz4=',
    },
    {
      name: 'Paystack',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHA+UGF5c3RhY2s8L3A+Cjwvc3ZnPg==',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-25 via-neutral-50 to-primary-100 pt-20'>
      {/* Shared Navbar Component */}
      <Navbar />

      {/* Enhanced Header */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]'>
        <div className='bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-soft p-4 sm:p-6 mt-4 sm:mt-8 mb-4 sm:mb-8'>
          <div className='flex items-center space-x-3 sm:space-x-4'>
            <button
              onClick={() => navigate(-1)}
              className='p-2 sm:p-3 hover:bg-primary-100 rounded-full transition-all duration-300 border border-primary-200 flex-shrink-0'
            >
              <IoIosArrowBack className='text-lg sm:text-2xl text-primary-700' />
            </button>
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
              Complete Your Booking
            </h1>
          </div>
        </div>

        {/* Enhanced Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-8 sm:pb-12'>
          {/* Left Side: Booking Details - Takes 2 columns */}
          <div className='lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8'>
            {/* Trip Details Card - Reorganized with Dates First */}
            <div className='bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-soft p-4 sm:p-6 lg:p-8 border border-primary-200'>
              <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
                <FaCalendarAlt className='text-lg sm:text-xl lg:text-2xl text-primary-600' />
                <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-primary-800'>
                  Your Trip Details
                </h2>
              </div>

              <div className='space-y-4 sm:space-y-6'>
                {/* Dates Section - Now First and Matching Guest Layout */}
                <div className='flex items-center justify-between p-4 bg-primary-25 rounded-xl border border-primary-200'>
                  <div className='flex items-center gap-4'>
                    <div className='p-3 bg-white rounded-xl shadow-soft'>
                      <FaCalendarAlt className='text-primary-600' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-primary-700 uppercase tracking-wide'>
                        Dates
                      </p>
                      <p className='font-bold text-primary-800'>
                        {checkIn && checkOut
                          ? `${new Date(checkIn).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })} - ${new Date(checkOut).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                              }
                            )}`
                          : 'Select dates'}
                      </p>
                    </div>
                  </div>
                  <button
                    className='text-primary-600 hover:text-primary-800 font-semibold underline transition-colors duration-300'
                    onClick={() => setEditOpt(!editOpt)}
                  >
                    Edit
                  </button>
                </div>

                {/* Guests Section - Now Matching Dates Layout */}
                <div className='flex items-center justify-between p-4 bg-primary-25 rounded-xl border border-primary-200'>
                  <div className='flex items-center gap-4'>
                    <div className='p-3 bg-white rounded-xl shadow-soft'>
                      <FaUsers className='text-primary-600' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-primary-700 uppercase tracking-wide'>
                        Guests
                      </p>
                      <p className='font-bold text-primary-800'>
                        {guest} {guest === 1 ? 'guest' : 'guests'}
                      </p>
                    </div>
                  </div>
                  <button
                    className='text-primary-600 hover:text-primary-800 font-semibold underline transition-colors duration-300'
                    onClick={() => setEditOpt(!editOpt)}
                  >
                    Edit
                  </button>
                </div>

                {/* Edit Options */}
                <AnimatePresence>
                  {editOpt && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className='space-y-4 bg-gradient-to-r from-primary-25 to-neutral-50 p-6 rounded-xl border border-primary-200'
                    >
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2 uppercase tracking-wide'>
                          Check-in Date
                        </label>
                        <input
                          type='date'
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                          style={{
                            fontSize: '16px',
                            minHeight: '44px',
                          }}
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2 uppercase tracking-wide'>
                          Check-out Date
                        </label>
                        <input
                          type='date'
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={
                            checkIn || new Date().toISOString().split('T')[0]
                          }
                          max={
                            new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() + 1
                              )
                            )
                              .toISOString()
                              .split('T')[0]
                          }
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                          style={{
                            fontSize: '16px',
                            minHeight: '44px',
                          }}
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2 uppercase tracking-wide'>
                          Number of Guests
                        </label>
                        <input
                          type='number'
                          value={guest}
                          onChange={(e) =>
                            setGuest(
                              Math.max(
                                1,
                                Math.min(10, parseInt(e.target.value) || 1)
                              )
                            )
                          }
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                          min={1}
                          max={10}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Property Image Card - Now Second */}
            <div className='bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-soft p-4 sm:p-6 lg:p-8 border border-primary-200'>
              <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
                <div className='p-2 bg-primary-100 rounded-lg'>
                  <svg
                    className='w-5 h-5 text-primary-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-primary-800'>
                  Your Accommodation
                </h2>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
                <div className='flex-shrink-0'>
                  <img
                    src={home.image || image}
                    alt={home.name || 'Accommodation'}
                    className='w-full sm:w-48 h-48 sm:h-32 object-cover rounded-xl shadow-medium hover:shadow-strong transition-all duration-300'
                  />
                </div>
                <div className='flex-1 space-y-3'>
                  <div>
                    <h3 className='text-xl font-bold text-primary-800 mb-1'>
                      {home.name || 'Accommodation'}
                    </h3>
                    <p className='text-primary-600 font-medium'>
                      {home.location || 'Location not specified'}
                    </p>
                    {/* Optionally show more details if available */}
                    {home.text && (
                      <p className='text-sm text-primary-500'>{home.text}</p>
                    )}
                  </div>

                  <div className='flex flex-wrap items-center gap-2'>
                    {home.badge && (
                      <span className='bg-accent-blue-100 text-accent-blue-700 px-3 py-1 rounded-full text-sm font-bold'>
                        {home.badge}
                      </span>
                    )}
                    {home.rating && (
                      <div className='flex items-center gap-1 bg-accent-amber-50 px-3 py-1 rounded-full'>
                        <span className='text-accent-amber-500 text-sm'>★</span>
                        <span className='font-bold text-primary-800 text-sm'>
                          {home.rating}
                        </span>
                        <span className='text-xs text-primary-600'>
                          ({home.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='flex flex-wrap gap-2 mt-3'>
                    {home.amenities &&
                      home.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className='bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium'
                        >
                          {amenity}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-primary-200'>
              <div className='flex items-center gap-3 mb-6'>
                <RiSecurePaymentLine className='text-2xl text-primary-600' />
                <h2 className='text-2xl font-bold text-primary-800'>
                  Choose Payment Method
                </h2>
              </div>

              <div className='space-y-4 mb-8'>
                <div
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'full'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-primary-200 bg-white hover:border-primary-300'
                  }`}
                  onClick={() => setPaymentMethod('full')}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                          paymentMethod === 'full'
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-primary-300'
                        }`}
                      >
                        {paymentMethod === 'full' && (
                          <div className='w-2 h-2 bg-white rounded-full mx-auto mt-0.5'></div>
                        )}
                      </div>
                      <span className='font-bold text-primary-800'>
                        Pay {formatPrice(pricing.total, userSelectedCurrency)}{' '}
                        now
                      </span>
                    </div>
                    <FaShieldAlt className='text-accent-green-500' />
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'split'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-primary-200 bg-white hover:border-primary-300'
                  }`}
                  onClick={() => setPaymentMethod('split')}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                          paymentMethod === 'split'
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-primary-300'
                        }`}
                      >
                        {paymentMethod === 'split' && (
                          <div className='w-2 h-2 bg-white rounded-full mx-auto mt-0.5'></div>
                        )}
                      </div>
                      <span className='font-bold text-primary-800'>
                        Pay part now, part later
                      </span>
                    </div>
                    <span className='text-sm bg-accent-blue-100 text-accent-blue-700 px-2 py-1 rounded-full font-medium'>
                      No extra fees
                    </span>
                  </div>
                  <p className='text-sm text-primary-600 ml-7'>
                    {formatPrice(
                      Math.floor(pricing.total * 0.6),
                      userSelectedCurrency
                    )}{' '}
                    due today,{' '}
                    {formatPrice(
                      Math.floor(pricing.total * 0.4),
                      userSelectedCurrency
                    )}{' '}
                    due next month
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Provider Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-primary-200'>
              <div className='flex items-center gap-3 mb-6'>
                <FaCreditCard className='text-2xl text-primary-600' />
                <h2 className='text-2xl font-bold text-primary-800'>
                  Select Payment Provider
                </h2>
              </div>

              {/* Payment Options Grid */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                {paymentOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('Payment option clicked:', option.name)
                      handleSelectPayment(option)
                    }}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-medium flex items-center justify-center gap-3 ${
                      selectedPayment.name === option.name
                        ? 'border-primary-500 bg-primary-50 shadow-medium'
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        selectedPayment.name === option.name
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-primary-300'
                      }`}
                    >
                      {selectedPayment.name === option.name && (
                        <div className='w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5'></div>
                      )}
                    </div>
                    <span
                      className={`font-semibold ${
                        selectedPayment.name === option.name
                          ? 'text-primary-700'
                          : 'text-primary-600'
                      }`}
                    >
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Payment Method Display */}
              <div className='bg-primary-25 p-4 rounded-xl border border-primary-200'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-primary-500 bg-primary-500`}
                    >
                      <div className='w-2 h-2 bg-white rounded-full mx-auto mt-0.5'></div>
                    </div>
                    <span className='font-bold text-primary-800'>
                      {selectedPayment.name} Selected
                    </span>
                    <div className='flex items-center gap-1 text-accent-green-600'>
                      <FaLock className='text-sm' />
                      <span className='text-xs font-medium'>Secure</span>
                    </div>
                  </div>
                  <FaCheck className='text-primary-600' />
                </div>
              </div>

              {/* Enhanced Dropdown Animation */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className='mt-2 bg-white border-2 border-primary-200 rounded-xl shadow-strong overflow-hidden'
                  >
                    {paymentOptions.map((option, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-4 cursor-pointer hover:bg-primary-50 p-4 border-b border-primary-100 last:border-b-0 transition-all duration-200'
                        onClick={() => handleSelectPayment(option)}
                      >
                        <img
                          src={option.logo}
                          alt={`${option.name} Logo`}
                          className='w-12 h-6 object-contain'
                        />
                        <span className='text-lg font-medium text-primary-800 flex-1'>
                          {option.name}
                        </span>
                        {selectedPayment.name === option.name && (
                          <FaCheck className='text-accent-green-500 text-lg' />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Card Details Form */}
              <AnimatePresence>
                {showCardDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className='mt-8 space-y-6 bg-gradient-to-r from-primary-25 to-neutral-50 p-6 rounded-xl border border-primary-200'
                  >
                    <h3 className='text-xl font-bold text-primary-800 mb-4'>
                      Card Details
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          Card Number
                        </label>
                        <input
                          type='text'
                          name='cardNumber'
                          placeholder='1234 5678 9012 3456'
                          value={billingDetails.cardNumber}
                          onChange={handleInputChange}
                          maxLength={19}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          Expiry Date
                        </label>
                        <input
                          type='text'
                          name='expiryDate'
                          placeholder='MM/YY'
                          value={billingDetails.expiryDate}
                          onChange={handleInputChange}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          CVV
                        </label>
                        <input
                          type='text'
                          name='cvv'
                          placeholder='123'
                          value={billingDetails.cvv}
                          onChange={handleInputChange}
                          maxLength={4}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                    </div>

                    <h3 className='text-xl font-bold text-primary-800 mt-6 mb-4'>
                      Billing Address
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          Name on Card
                        </label>
                        <input
                          type='text'
                          name='name'
                          placeholder='John Doe'
                          value={billingDetails.name}
                          onChange={handleInputChange}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          Address
                        </label>
                        <input
                          type='text'
                          name='address'
                          placeholder='123 Main Street'
                          value={billingDetails.address}
                          onChange={handleInputChange}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          City
                        </label>
                        <input
                          type='text'
                          name='city'
                          placeholder='Lagos'
                          value={billingDetails.city}
                          onChange={handleInputChange}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          State
                        </label>
                        <input
                          type='text'
                          name='state'
                          placeholder='Lagos State'
                          value={billingDetails.state}
                          onChange={handleInputChange}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          Zip Code
                        </label>
                        <input
                          type='text'
                          name='zip'
                          placeholder='100001'
                          value={billingDetails.zip}
                          onChange={handleInputChange}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-bold text-primary-700 mb-2'>
                          Country
                        </label>
                        <select
                          name='country'
                          value={billingDetails.country}
                          onChange={handleInputChange}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                        >
                          <option value=''>Select Country</option>
                          {countries.map((country, index) => (
                            <option key={index} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Terms and Conditions */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-primary-200'>
              <div className='flex items-start gap-3'>
                <input
                  type='checkbox'
                  id='terms'
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className='mt-1 h-4 w-4 text-primary-600 border-2 border-primary-300 rounded focus:ring-primary-500'
                />
                <label htmlFor='terms' className='text-sm text-primary-700'>
                  I agree to the{' '}
                  <button
                    type='button'
                    className='text-primary-600 hover:text-primary-800 underline font-medium'
                    onClick={() => window.open('/terms', '_blank')}
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type='button'
                    className='text-primary-600 hover:text-primary-800 underline font-medium'
                    onClick={() => window.open('/privacy', '_blank')}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>

            {/* Stripe Payment Form - Show when user clicks confirm & pay for Stripe */}
            <AnimatePresence>
              {(() => {
                console.log('Stripe form condition check:', {
                  showStripePayment,
                  selectedPaymentName: selectedPayment.name,
                  shouldShow:
                    showStripePayment && selectedPayment.name === 'Stripe',
                })
                return showStripePayment && selectedPayment.name === 'Stripe'
              })() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-primary-200'
                >
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm
                      bookingData={{
                        ...bookingData,
                        checkIn,
                        checkOut,
                        guests: guest,
                        totalAmount:
                          bookingData?.totalAmount || originalPrice * nights,
                        userEmail: 'user@example.com', // You might need to get this from auth context
                      }}
                      onPaymentSuccess={handleStripePaymentSuccess}
                    />
                  </Elements>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Book Button */}
            {!showStripePayment && (
              <button
                className='w-full bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 disabled:from-primary-300 disabled:to-primary-300 text-white py-5 rounded-2xl font-bold text-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:scale-100 disabled:cursor-not-allowed'
                onClick={handleBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    {selectedPayment.name === 'Stripe'
                      ? 'Confirm Booking Details'
                      : 'Confirm & Pay'}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right Side: Enhanced Cart Summary - Mobile First Order */}
          <div className='lg:col-span-1'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-primary-200 sticky top-24'>
              {/* Dates Section - First on Mobile */}
              <div className='mb-6 lg:hidden'>
                <div className='flex items-center gap-3 mb-4'>
                  <FaCalendarAlt className='text-lg text-primary-600' />
                  <h3 className='text-lg font-bold text-primary-800'>
                    Trip Dates
                  </h3>
                </div>
                <div className='bg-primary-25 p-4 rounded-xl'>
                  <p className='text-sm font-semibold text-primary-700 uppercase tracking-wide mb-1'>
                    Your Stay
                  </p>
                  <p className='font-bold text-primary-800'>
                    {checkIn && checkOut
                      ? `${new Date(checkIn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })} - ${new Date(checkOut).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`
                      : 'Select your dates'}
                  </p>
                  {pricing.nights > 0 && (
                    <p className='text-sm text-primary-600 mt-1'>
                      {pricing.nights}{' '}
                      {pricing.nights === 1 ? 'night' : 'nights'} · {guest}{' '}
                      {guest === 1 ? 'guest' : 'guests'}
                    </p>
                  )}
                </div>
              </div>

              {/* Property Image and Info - Second on Mobile, First on Desktop */}
              <div className='mb-6'>
                <img
                  src={home.image || image}
                  alt={home.name || 'Accommodation'}
                  className='rounded-2xl w-full h-48 object-cover shadow-medium mb-4 hover:shadow-strong transition-all duration-300'
                />
                <div className='space-y-2'>
                  <h3 className='text-xl font-bold text-primary-800'>
                    {home.name || 'Accommodation'}
                  </h3>
                  <p className='text-primary-600 font-medium'>
                    {home.location || 'Location not specified'}
                  </p>
                  {home.badge && (
                    <span className='bg-accent-blue-100 text-accent-blue-700 px-3 py-1 rounded-full text-sm font-bold'>
                      {home.badge}
                    </span>
                  )}
                  {home.rating && (
                    <div className='flex items-center gap-1 text-accent-amber-500'>
                      <span className='text-lg'>★</span>
                      <span className='font-bold text-primary-800'>
                        {home.rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dates Section - Hidden on Mobile, Shown on Desktop */}
                <div className='hidden lg:block mt-4 bg-primary-25 p-4 rounded-xl'>
                  <div className='flex items-center gap-2 mb-2'>
                    <FaCalendarAlt className='text-primary-600' />
                    <p className='text-sm font-semibold text-primary-700 uppercase tracking-wide'>
                      Trip Dates
                    </p>
                  </div>
                  <p className='font-bold text-primary-800'>
                    {checkIn && checkOut
                      ? `${new Date(checkIn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })} - ${new Date(checkOut).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}`
                      : 'Select your dates'}
                  </p>
                  {pricing.nights > 0 && (
                    <p className='text-sm text-primary-600 mt-1'>
                      {pricing.nights}{' '}
                      {pricing.nights === 1 ? 'night' : 'nights'} · {guest}{' '}
                      {guest === 1 ? 'guest' : 'guests'}
                    </p>
                  )}
                </div>
              </div>

              <hr className='border-primary-200 mb-6' />

              {/* Enhanced Price Breakdown - Last */}
              <div className='space-y-4 mb-6'>
                <h3 className='text-xl font-bold text-primary-800'>
                  Price Details
                </h3>

                {pricing.nights > 0 ? (
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                      <span className='text-primary-700 underline'>
                        {formatPrice(
                          pricing.pricePerNight,
                          userSelectedCurrency
                        )}{' '}
                        × {pricing.nights}{' '}
                        {pricing.nights === 1 ? 'night' : 'nights'}
                      </span>
                      <span className='font-bold text-primary-800'>
                        {formatPrice(pricing.basePrice, userSelectedCurrency)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                      <span className='text-primary-700 underline'>
                        Cleaning fee
                      </span>
                      <span className='font-bold text-primary-800'>
                        {formatPrice(pricing.cleaningFee, userSelectedCurrency)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                      <span className='text-primary-700 underline'>
                        Service fee
                      </span>
                      <span className='font-bold text-primary-800'>
                        {formatPrice(pricing.serviceFee, userSelectedCurrency)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                      <span className='text-primary-700 underline'>Taxes</span>
                      <span className='font-bold text-primary-800'>
                        {formatPrice(pricing.taxes, userSelectedCurrency)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className='bg-primary-25 p-4 rounded-xl text-center'>
                    <p className='text-primary-600'>
                      Select dates to see pricing details
                    </p>
                  </div>
                )}
              </div>

              <hr className='border-primary-200 mb-6' />

              {/* Enhanced Total */}
              <div className='bg-gradient-to-r from-primary-100 to-primary-50 p-4 rounded-xl border border-primary-200'>
                <div className='flex justify-between items-center'>
                  <span className='text-xl font-bold text-primary-800'>
                    Total ({userSelectedCurrency})
                  </span>
                  <span className='text-2xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
                    {pricing.total > 0
                      ? formatPrice(pricing.total, userSelectedCurrency)
                      : formatPrice(0, userSelectedCurrency)}
                  </span>
                </div>
                <p className='text-sm text-primary-600 mt-2'>
                  {pricing.total > 0
                    ? 'Includes all fees and taxes'
                    : 'Select dates to calculate total'}
                  {pricing.nights > 0
                    ? ` for ${pricing.nights} ${
                        pricing.nights === 1 ? 'night' : 'nights'
                      }`
                    : ''}
                </p>
              </div>

              {/* Trust Indicators */}
              <div className='mt-6 space-y-3'>
                <div className='flex items-center gap-3 text-sm text-primary-600'>
                  <FaShieldAlt className='text-accent-green-500' />
                  <span>Your payment information is secure</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-primary-600'>
                  <FaLock className='text-accent-green-500' />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-primary-600'>
                  <FaCheck className='text-accent-green-500' />
                  <span>Free cancellation for 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Security Section - Hidden on mobile */}
        <div className='hidden md:block bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-primary-200 mb-8'>
          <div className='text-center'>
            <h3 className='text-2xl font-bold text-primary-800 mb-4'>
              Secure & Protected Booking
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='flex flex-col items-center p-4 bg-primary-25 rounded-xl'>
                <div className='p-4 bg-accent-green-100 rounded-full mb-3'>
                  <FaShieldAlt className='text-2xl text-accent-green-600' />
                </div>
                <h4 className='font-bold text-primary-800 mb-2'>
                  Safe Payment
                </h4>
                <p className='text-sm text-primary-600 text-center'>
                  Your payment is protected by industry-leading security
                </p>
              </div>

              <div className='flex flex-col items-center p-4 bg-primary-25 rounded-xl'>
                <div className='p-4 bg-accent-blue-100 rounded-full mb-3'>
                  <FaCalendarAlt className='text-2xl text-accent-blue-600' />
                </div>
                <h4 className='font-bold text-primary-800 mb-2'>
                  Flexible Booking
                </h4>
                <p className='text-sm text-primary-600 text-center'>
                  Free cancellation and date changes available
                </p>
              </div>

              <div className='flex flex-col items-center p-4 bg-primary-25 rounded-xl'>
                <div className='p-4 bg-accent-amber-100 rounded-full mb-3'>
                  <FaUsers className='text-2xl text-accent-amber-600' />
                </div>
                <h4 className='font-bold text-primary-800 mb-2'>
                  24/7 Support
                </h4>
                <p className='text-sm text-primary-600 text-center'>
                  Our customer support team is here to help anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className='bg-gradient-to-r from-primary-25 to-neutral-50 rounded-2xl p-6 border border-primary-200 text-center'>
          <p className='text-sm text-primary-700 leading-relaxed'>
            By selecting the button below, I agree to the{' '}
            <span className='font-semibold text-primary-800 underline cursor-pointer hover:text-primary-900 transition-colors duration-300'>
              Host&#39;s House Rules
            </span>
            ,{' '}
            <span className='font-semibold text-primary-800 underline cursor-pointer hover:text-primary-900 transition-colors duration-300'>
              Ground rules for guests
            </span>
            ,{' '}
            <span className='font-semibold text-primary-800 underline cursor-pointer hover:text-primary-900 transition-colors duration-300'>
              Homehive&#39;s Rebooking and Refund Policy
            </span>
            , and that Homehive can{' '}
            <span className='font-semibold text-primary-800 underline cursor-pointer hover:text-primary-900 transition-colors duration-300'>
              charge my payment method
            </span>{' '}
            if I&#39;m responsible for damage.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Checkout
