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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import image from '../../assets/Apt2.webp'
import { RxHamburgerMenu } from 'react-icons/rx'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { useNavigate } from 'react-router-dom'
import { userAuth } from '../../../firebaseConfig'

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
  const navigate = useNavigate()
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
  const [date, setDate] = useState('')
  const [editOpt, setEditOpt] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('full')

  const paymentOption = (method) => {
    setSelectedPayment(method)
    setShowCardDetails(method === 'Mastercard')
    if (method === 'PayPal')
      toast.info('Redirecting to PayPal...', {
        position: 'top-right',
        className: 'bg-info-50 text-info-800',
      })
    if (method === 'Paystack')
      toast.info('Redirecting to Paystack...', {
        position: 'top-right',
        className: 'bg-info-50 text-info-800',
      })
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
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        className='mt-16'
      />

      {/* Enhanced Navbar */}
      <div className='bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-50'>
        <div className='flex items-center justify-between mx-auto relative px-4 py-4 md:px-16'>
          {/* Logo Section */}
          <div className='flex items-center gap-4'>
            <HomeHiveLogo
              className='cursor-pointer w-16 h-16 md:w-20 md:h-20 transition-transform duration-300 hover:scale-110'
              alt='Homehive Logo'
            />
            <h1 className='font-NotoSans text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 bg-clip-text text-transparent'>
              Homehive
            </h1>
          </div>

          {/* Right Section */}
          <div className='hidden md:flex items-center gap-6'>
            <h1 className='text-lg font-semibold text-primary-700 hover:text-primary-900 cursor-pointer transition-colors duration-300'>
              Become a Host
            </h1>
            <div className='flex items-center gap-3'>
              <button className='p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
                <RxHamburgerMenu className='text-xl text-primary-600' />
              </button>

              {user ? (
                <div className='relative'>
                  <img
                    src={user.photoURL}
                    alt='User'
                    className='w-12 h-12 rounded-full object-cover ring-2 ring-primary-200 hover:ring-primary-300 transition-all duration-300'
                  />
                  <div className='absolute -top-1 -right-1 w-4 h-4 bg-accent-green-500 rounded-full border-2 border-white'></div>
                </div>
              ) : (
                <button className='p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
                  <FaRegUserCircle className='text-2xl text-primary-600' />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className='container mx-auto px-4 md:px-8'>
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-6 mt-8 mb-8'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => navigate(-1)}
              className='p-3 hover:bg-primary-100 rounded-full transition-all duration-300 border border-primary-200'
            >
              <IoIosArrowBack className='text-2xl text-primary-700' />
            </button>
            <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
              Complete Your Booking
            </h1>
          </div>
        </div>

        {/* Enhanced Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12'>
          {/* Left Side: Booking Details - Takes 2 columns */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Trip Details Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-primary-200'>
              <div className='flex items-center gap-3 mb-6'>
                <FaCalendarAlt className='text-2xl text-primary-600' />
                <h2 className='text-2xl font-bold text-primary-800'>
                  Your Trip Details
                </h2>
              </div>

              <div className='space-y-6'>
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
                        {date || 'Select a date'}
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
                          Select Date
                        </label>
                        <input
                          type='date'
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
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
                          onChange={(e) => setGuest(e.target.value)}
                          className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
                          min={1}
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
                        Pay ₦241,210 now
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
                    ₦129,760 due today, ₦111,450 due next month
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
            <button className='w-full bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-5 rounded-2xl font-bold text-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3'>
              <FaShieldAlt />
              Request to Book
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
                      ₦20,000 × 5 nights
                    </span>
                    <span className='font-bold text-primary-800'>₦100,000</span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                    <span className='text-primary-700 underline'>
                      Cleaning fee
                    </span>
                    <span className='font-bold text-primary-800'>₦5,000</span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                    <span className='text-primary-700 underline'>
                      Service fee
                    </span>
                    <span className='font-bold text-primary-800'>₦15,000</span>
                  </div>

                  <div className='flex justify-between items-center p-3 bg-primary-25 rounded-xl'>
                    <span className='text-primary-700 underline'>Taxes</span>
                    <span className='font-bold text-primary-800'>₦210</span>
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
                    ₦120,210
                  </span>
                </div>
                <p className='text-sm text-primary-600 mt-2'>
                  Includes all fees and taxes
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

        {/* Additional Security Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-8 border border-primary-200 mb-8'>
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
