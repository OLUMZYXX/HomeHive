// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import {
  FaCheck,
  FaRegUserCircle,
  FaCreditCard,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaLock,
} from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'
import { RiArrowDropDownLine, RiSecurePaymentLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import image from '../../assets/Apt2.webp'
import { RxHamburgerMenu } from 'react-icons/rx'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { useNavigate, useLocation } from 'react-router-dom'
import { userAuth } from '../../../firebaseConfig'
import { navigateToHome } from '../../utils/navigation'
import useScrollToTop from '../../hooks/useScrollToTop'

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Nigeria',
]

const Cart = () => {
  // Use scroll to top hook
  useScrollToTop()

  const navigate = useNavigate()
  const location = useLocation()

  // Smart navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
  }
  const [open, setOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState({
    name: 'PayPal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  })
  const [showCardDetails, setShowCardDetails] = useState(false)
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

  const [guest, setGuest] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
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

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      toast.error('Invalid Date', {
        description: 'Check-in date cannot be in the past',
        duration: 4000,
      })
      return
    }

    if (checkOutDate <= checkInDate) {
      toast.error('Invalid Date Range', {
        description: 'Check-out date must be after check-in date',
        duration: 4000,
      })
      return
    }

    if (!guest || guest < 1) {
      toast.error('Guest Information Required', {
        description: 'Please specify the number of guests',
        duration: 4000,
      })
      return
    }

    if (guest > 10) {
      toast.error('Guest Limit Exceeded', {
        description: 'Maximum 10 guests allowed',
        duration: 4000,
      })
      return
    }

    if (selectedPayment.name === 'Mastercard' && showCardDetails) {
      // Validate card details
      if (
        !billingDetails.cardNumber ||
        !billingDetails.expiryDate ||
        !billingDetails.cvv
      ) {
        toast.error('Card Information Required', {
          description: 'Please fill in all card details',
          duration: 4000,
        })
        return
      }

      if (
        !billingDetails.name ||
        !billingDetails.address ||
        !billingDetails.city
      ) {
        toast.error('Billing Information Required', {
          description: 'Please fill in all billing information',
          duration: 4000,
        })
        return
      }
    }

    // Start loading
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Process booking
      toast.success('Booking Confirmed! 🎉', {
        description: 'Your booking request has been submitted successfully',
        duration: 4000,
        action: {
          label: 'View Details',
          onClick: () => console.log('View booking details'),
        },
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

  const paymentOption = (method) => {
    setSelectedPayment(method)
    setShowCardDetails(method === 'Mastercard')
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

  const auth = userAuth
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = userAuth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [auth])

  const toggleDropdown = () => {
    setOpen((prev) => !prev)
  }

  const handleSelectPayment = (option) => {
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

    const pricePerNight = 20000 // ₦20,000 per night
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
      name: 'Mastercard',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg',
    },
    {
      name: 'PayPal',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    },
    {
      name: 'Paystack',
      logo: 'https://cdn.brandfetch.io/idM5mrwtDs/w/800/h/782/theme/dark/symbol.png?c=1dxbfHSJFAPEGdCLU4o5B',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-25 via-neutral-50 to-primary-100'>
      {/* Enhanced Navbar */}
      <div className='bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-50'>
        <div className='flex items-center justify-between mx-auto relative px-4 py-4 md:px-16'>
          {/* Logo Section */}
          <div className='flex items-center gap-4'>
            <HomeHiveLogo
              className='w-12 h-12 sm:w-16 sm:h-16 object-contain transition-transform duration-200 group-hover:scale-105 cursor-pointer'
              alt='Homehive Logo'
              onClick={handleHomeNavigation}
            />
            <h1
              className='font-NotoSans text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity duration-300'
              onClick={handleHomeNavigation}
            >
              Homehive
            </h1>
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-3 md:gap-6'>
            <h1 className='hidden md:block text-lg font-semibold text-primary-700 hover:text-primary-900 cursor-pointer transition-colors duration-300'>
              Become a Host
            </h1>
            <div className='flex items-center gap-2 md:gap-3'>
              <button className='p-2 md:p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
                <RxHamburgerMenu className='text-lg md:text-xl text-primary-600' />
              </button>

              {user ? (
                <div className='relative'>
                  <img
                    src={user.photoURL}
                    alt='User'
                    className='w-8 h-8 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-primary-200 hover:ring-primary-300 transition-all duration-300'
                  />
                  <div className='absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-accent-green-500 rounded-full border-2 border-white'></div>
                </div>
              ) : (
                <button className='p-2 md:p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
                  <FaRegUserCircle className='text-xl md:text-2xl text-primary-600' />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
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
            {/* Trip Details Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-soft p-4 sm:p-6 lg:p-8 border border-primary-200'>
              <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
                <FaCalendarAlt className='text-lg sm:text-xl lg:text-2xl text-primary-600' />
                <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-primary-800'>
                  Your Trip Details
                </h2>
              </div>

              <div className='space-y-4 sm:space-y-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-primary-25 rounded-xl border border-primary-200 gap-3 sm:gap-4'>
                  <div className='flex items-center gap-3 sm:gap-4'>
                    <div className='p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-soft flex-shrink-0'>
                      <FaCalendarAlt className='text-sm sm:text-base text-primary-600' />
                    </div>
                    <div>
                      <p className='text-xs sm:text-sm font-semibold text-primary-700 uppercase tracking-wide'>
                        Dates
                      </p>
                      <p className='text-sm sm:text-base font-bold text-primary-800'>
                        {checkIn && checkOut
                          ? `${checkIn} - ${checkOut}`
                          : 'Select dates'}
                      </p>
                    </div>
                  </div>
                  <button
                    className='text-primary-600 hover:text-primary-800 font-semibold underline transition-colors duration-300 text-sm sm:text-base self-start sm:self-center'
                    onClick={() => setEditOpt(!editOpt)}
                  >
                    Edit
                  </button>
                </div>

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
                        Pay ₦{pricing.total?.toLocaleString()} now
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
                    ₦{Math.floor(pricing.total * 0.6)?.toLocaleString()} due
                    today, ₦{Math.floor(pricing.total * 0.4)?.toLocaleString()}{' '}
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
              <div className='grid grid-cols-3 gap-4 mb-6'>
                {paymentOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPayment(option)}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-medium ${
                      selectedPayment.name === option.name
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={option.logo}
                      alt={`${option.name} Logo`}
                      className='w-full h-8 object-contain'
                    />
                  </button>
                ))}
              </div>

              {/* Selected Payment Method */}
              <div
                className='border-2 border-primary-200 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-primary-300 transition-all duration-300 bg-primary-25'
                onClick={toggleDropdown}
              >
                <div className='flex items-center gap-4'>
                  <img
                    src={selectedPayment.logo}
                    alt='Selected Logo'
                    className='w-12 h-6 object-contain'
                  />
                  <span className='text-lg font-bold text-primary-800'>
                    {selectedPayment.name}
                  </span>
                  <div className='flex items-center gap-1 text-accent-green-600'>
                    <FaLock className='text-sm' />
                    <span className='text-xs font-medium'>Secure</span>
                  </div>
                </div>
                <RiArrowDropDownLine
                  className={`text-4xl text-primary-600 transition-transform duration-300 ${
                    open ? 'rotate-180' : ''
                  }`}
                />
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

            {/* Enhanced Book Button */}
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
                  Request to Book
                </>
              )}
            </button>
          </div>

          {/* Right Side: Enhanced Cart Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-primary-200 sticky top-24'>
              {/* Property Image and Info */}
              <div className='mb-6'>
                <img
                  src={image}
                  alt='Apartment'
                  className='rounded-2xl w-full h-48 object-cover shadow-medium mb-4 hover:shadow-strong transition-all duration-300'
                />
                <div className='space-y-2'>
                  <h3 className='text-xl font-bold text-primary-800'>
                    Luxury Banana Island Villa
                  </h3>
                  <p className='text-primary-600 font-medium'>
                    Entire villa in Lagos
                  </p>
                  <div className='flex items-center gap-2'>
                    <span className='bg-accent-blue-100 text-accent-blue-700 px-3 py-1 rounded-full text-sm font-bold'>
                      Superhost
                    </span>
                    <div className='flex items-center gap-1 text-accent-amber-500'>
                      <span className='text-lg'>★</span>
                      <span className='font-bold text-primary-800'>4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className='border-primary-200 mb-6' />

              {/* Enhanced Price Breakdown */}
              <div className='space-y-4 mb-6'>
                <h3 className='text-xl font-bold text-primary-800'>
                  Price Details
                </h3>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                    <span className='text-primary-700 underline'>
                      ₦{pricing.pricePerNight?.toLocaleString()} ×{' '}
                      {pricing.nights}{' '}
                      {pricing.nights === 1 ? 'night' : 'nights'}
                    </span>
                    <span className='font-bold text-primary-800'>
                      ₦{pricing.basePrice?.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                    <span className='text-primary-700 underline'>
                      Cleaning fee
                    </span>
                    <span className='font-bold text-primary-800'>
                      ₦{pricing.cleaningFee?.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                    <span className='text-primary-700 underline'>
                      Service fee
                    </span>
                    <span className='font-bold text-primary-800'>
                      ₦{pricing.serviceFee?.toLocaleString()}
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                    <span className='text-primary-700 underline'>Taxes</span>
                    <span className='font-bold text-primary-800'>
                      ₦{pricing.taxes?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <hr className='border-primary-200 mb-6' />

              {/* Enhanced Total */}
              <div className='bg-gradient-to-r from-primary-100 to-primary-50 p-4 rounded-xl border border-primary-200'>
                <div className='flex justify-between items-center'>
                  <span className='text-xl font-bold text-primary-800'>
                    Total (NGN)
                  </span>
                  <span className='text-2xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
                    ₦{pricing.total?.toLocaleString()}
                  </span>
                </div>
                <p className='text-sm text-primary-600 mt-2'>
                  Includes all fees and taxes
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

export default Cart
