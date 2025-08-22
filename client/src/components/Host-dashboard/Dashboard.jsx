import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  FaHome,
  FaCamera,
  FaMapMarkerAlt,
  FaWifi,
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaUtensils,
  FaSnowflake,
  FaDumbbell,
  FaPaw,
  FaGamepad,
  FaBuilding,
  FaWarehouse,
  FaBed,
  FaGlobe,
  FaChevronDown,
  FaCheck,
  FaCog,
  FaSignOutAlt,
  FaCouch,
  FaParking,
  FaHotTub,
  FaShieldAlt,
  FaWheelchair,
  FaDollarSign,
  FaMinus,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaChartArea,
  FaChartBar,
  FaArrowUp,
} from 'react-icons/fa'
import {
  HiHome,
  HiOfficeBuilding,
  HiLocationMarker,
  HiPhotograph,
  HiClipboardList,
  HiCog,
  HiOutlineChartBar,
  HiMenu,
} from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  ComposedChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Bar,
} from 'recharts'
import { ButtonTooltip, InfoTooltip } from '../common/Tooltip'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { useAPI } from '../../contexts/APIContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  validateTextLength,
  getTextValidationClasses,
  getTextValidationTextClasses,
} from '../../utils/textUtils'

import PropTypes from 'prop-types'
import HostBookingManagement from './HostBookingManagement'

// Enhanced Currency Selector Component
const CurrencySelector = ({
  selectedCurrency,
  onCurrencyChange,
  currencies,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCurrencyData = currencies.find(
    (c) => c.code === selectedCurrency
  )

  return (
    <div className='relative'>
      <label className='block text-sm font-bold text-primary-700 mb-2'>
        <FaGlobe className='inline mr-2' />
        Select Currency
      </label>

      {/* Currency Selector Button */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full p-3 md:p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-300 bg-white hover:bg-primary-25 flex items-center justify-between'
      >
        <div className='flex items-center gap-2 md:gap-3'>
          <span className='text-xl md:text-2xl'>
            {selectedCurrencyData?.flag}
          </span>
          <div className='text-left'>
            <div className='font-bold text-primary-800 flex items-center gap-2 text-sm md:text-base'>
              {selectedCurrencyData?.symbol} {selectedCurrencyData?.code}
            </div>
            <div className='text-xs md:text-sm text-primary-600'>
              {selectedCurrencyData?.name}
            </div>
          </div>
        </div>
        <FaChevronDown
          className={`text-lg md:text-xl text-primary-400 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary-200 rounded-xl shadow-strong z-50 overflow-hidden animate-slideDown'>
          <div className='p-2'>
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type='button'
                onClick={() => {
                  onCurrencyChange(currency.code)
                  setIsOpen(false)
                }}
                className={`w-full p-3 md:p-4 rounded-xl transition-all duration-300 hover:bg-primary-50 flex items-center gap-2 md:gap-3 text-left ${
                  selectedCurrency === currency.code
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'border-2 border-transparent'
                }`}
              >
                <span className='text-xl md:text-2xl'>{currency.flag}</span>
                <div className='flex-1'>
                  <div className='font-bold text-primary-800 flex items-center gap-2 text-sm md:text-base'>
                    {currency.symbol} {currency.code}
                    {selectedCurrency === currency.code && (
                      <FaCheck className='text-primary-500 text-base md:text-lg' />
                    )}
                  </div>
                  <div className='text-xs md:text-sm text-primary-600 mb-1'>
                    {currency.name}
                  </div>
                  <div className='text-xs text-primary-500'>
                    {currency.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}

CurrencySelector.propTypes = {
  selectedCurrency: PropTypes.string.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      flag: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
}

const Dashboard = () => {
  const navigate = useNavigate()
  const {
    user,
    isAuthenticated,
    logout: apiLogout,
    loading,
    hostProperties,
    getHostProperties,
    getHostStats,
    updateProperty,
    createProperty,
    getCurrentUser,
    error,
  } = useAPI()

  // Restore authentication and fetch host properties on dashboard load
  useEffect(() => {
    const restoreAuthAndFetch = async () => {
      const token = localStorage.getItem('homehive_access_token')
      if (token) {
        // Always try to refresh token and rehydrate user
        try {
          // Dynamically import TokenManager to avoid circular import
          const { TokenManager } = await import('../../services/jwtAuthService')
          await TokenManager.refreshTokenIfNeeded()
          await getCurrentUser()

          // Wait a bit for auth state to update, then fetch properties if user is host
          setTimeout(async () => {
            const userData = TokenManager.getUserData()
            if (userData?.role === 'host') {
              console.log('🏠 Dashboard: Fetching host properties...')
              await getHostProperties()
            }
          }, 100)
        } catch (err) {
          console.error('Authentication restoration failed:', err)
          // If token is invalid, user will be logged out by context
        }
      } else {
        // No token, redirect to login if trying to access dashboard
        navigate('/hostlogin')
      }
    }
    restoreAuthAndFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [activeTab, setActiveTab] = useState('overview')
  const [currentStep, setCurrentStep] = useState(1)
  const [chartType, setChartType] = useState('area') // 'area' or 'bar'
  const [isScrolled, setIsScrolled] = useState(false)
  const [hostStats, setHostStats] = useState({
    totalListings: 0,
    totalBookings: 0,
    monthlyEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
  })
  const [statsLoading, setStatsLoading] = useState(false)

  // Function to fetch host statistics
  const fetchHostStats = useCallback(async () => {
    if (!user?.uid || user.role !== 'host') return

    try {
      setStatsLoading(true)
      const stats = await getHostStats(user.uid)
      setHostStats({
        totalListings: stats.totalListings || hostProperties?.length || 0,
        totalBookings: stats.totalBookings || 0,
        monthlyEarnings: stats.monthlyEarnings || 0,
        averageRating: stats.averageRating || 0,
        totalReviews: stats.totalReviews || 0,
      })
    } catch (error) {
      console.error('Error fetching host stats:', error)
      // Use fallback data
      setHostStats({
        totalListings: hostProperties?.length || 0,
        totalBookings: 0,
        monthlyEarnings: 0,
        averageRating: 0,
        totalReviews: 0,
      })
    } finally {
      setStatsLoading(false)
    }
  }, [user, hostProperties, getHostStats])

  // Fetch stats when user or properties change
  useEffect(() => {
    if (user?.uid && user.role === 'host' && hostProperties) {
      fetchHostStats()
    }
  }, [user, hostProperties, fetchHostStats])
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    placeType: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    amenities: [],
    images: [],
    mainImageIndex: 0,
    pricePerNight: '',
    currency: 'NGN',
  })

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false)
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileMenuOpen])

  // Authentication handlers
  const handleLogout = async () => {
    try {
      await apiLogout()
      toast.success('Logged out successfully')
      setProfileMenuOpen(false)
      navigate('/hostlogin')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  // Property handlers
  const handlePublishProperty = async (propertyId, currentStatus) => {
    try {
      const newActiveStatus = currentStatus === 'active' ? false : true

      await updateProperty(propertyId, { isActive: newActiveStatus })

      // Refresh the properties list to show the updated status
      await getHostProperties()

      toast.success(
        newActiveStatus
          ? '✅ Property published successfully! Your listing is now live and visible to guests.'
          : '⏸️ Property unpublished successfully! Your listing is now hidden from guests.',
        {
          description: newActiveStatus
            ? 'Guests can now discover and book your property.'
            : "Your property won't appear in search results.",
          duration: 4000,
        }
      )
    } catch (error) {
      console.error('Error updating property status:', error)
      toast.error('Failed to update property status. Please try again.')
    }
  }

  // Render the Host Dashboard Navbar
  const renderNavbar = () => (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-strong'
          : 'bg-white shadow-soft'
      }`}
    >
      <div className='container mx-auto px-3 sm:px-4 py-4 max-w-[1400px]'>
        <div className='flex items-center justify-between'>
          {/* Logo Section */}
          <div className='flex items-center gap-3'>
            {/* Logo */}
            <HomeHiveLogo className='w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-200 hover:scale-105' />
            <div>
              <h1 className='font-NotoSans text-lg sm:text-xl lg:text-2xl font-bold text-primary-800'>
                Host Dashboard
              </h1>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200'
          >
            {mobileMenuOpen ? (
              <IoClose className='text-2xl text-primary-700' />
            ) : (
              <HiMenu className='text-2xl text-primary-700' />
            )}
          </button>

          {/* Desktop User Section */}
          <div className='hidden lg:flex items-center gap-4'>
            {user && isAuthenticated ? (
              <div className='relative flex items-center gap-3'>
                {/* User Profile Button */}
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className='flex items-center gap-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl px-4 py-2 transition-all duration-300'
                >
                  {user.profilePicture || user.photoURL ? (
                    <img
                      src={user.profilePicture || user.photoURL}
                      alt='Host Profile'
                      className='w-8 h-8 rounded-full object-cover'
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className='w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm'
                    style={{
                      display:
                        user.profilePicture || user.photoURL ? 'none' : 'flex',
                    }}
                  >
                    {(user.displayName || user.firstName || user.email || 'H')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className='text-left'>
                    <div className='text-primary-900 text-sm font-medium'>
                      {user.displayName || user.firstName || 'Host'}
                    </div>
                    <div className='text-primary-600 text-xs'>
                      {user.role === 'host'
                        ? 'Host Account'
                        : 'Dashboard Access'}
                    </div>
                  </div>
                  <FaChevronDown className='text-primary-600 text-xs' />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      ref={profileMenuRef}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className='absolute top-full right-0 mt-2 w-80 bg-white border border-primary-200 rounded-2xl shadow-strong z-50 overflow-hidden'
                    >
                      {/* User Info Section */}
                      <div className='px-6 py-4 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-primary-100'>
                        <div className='flex items-center gap-4'>
                          <div className='relative'>
                            {user.profilePicture || user.photoURL ? (
                              <img
                                src={user.profilePicture || user.photoURL}
                                alt='Host Profile'
                                className='w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-medium'
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div
                              className='w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white shadow-medium'
                              style={{
                                display:
                                  user.profilePicture || user.photoURL
                                    ? 'none'
                                    : 'flex',
                              }}
                            >
                              {(
                                user.displayName ||
                                user.firstName ||
                                user.email ||
                                'H'
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white shadow-sm'>
                              <div className='w-full h-full bg-success-400 rounded-full animate-ping opacity-75'></div>
                            </div>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='font-semibold text-primary-900 text-lg truncate'>
                              {user.displayName || user.firstName || 'Host'}
                            </div>
                            <div className='text-sm text-primary-600 truncate'>
                              {user.email}
                            </div>
                            <div className='inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full'>
                              <div className='w-1.5 h-1.5 bg-primary-500 rounded-full'></div>
                              Host Active
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className='py-2'>
                        <button
                          onClick={() => {
                            setActiveTab('settings')
                            setProfileMenuOpen(false)
                          }}
                          className='w-full flex items-center gap-3 px-6 py-3 text-primary-700 hover:bg-primary-50 hover:text-primary-900 transition-colors duration-200'
                        >
                          <div className='w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center'>
                            <FaCog className='text-primary-600 text-sm' />
                          </div>
                          <div className='flex-1 text-left'>
                            <div className='font-medium text-sm'>Settings</div>
                            <div className='text-xs text-primary-500'>
                              Account preferences
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={handleLogout}
                          disabled={loading}
                          className={`w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 group ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className='w-9 h-9 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center'>
                            <FaSignOutAlt className='text-red-600 text-sm' />
                          </div>
                          <div className='flex-1 text-left'>
                            <div className='font-medium text-sm'>
                              {loading ? 'Logging out...' : 'Sign Out'}
                            </div>
                            <div className='text-xs text-red-500'>
                              End your session
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => navigate('/hostlogin')}
                  className='text-primary-700 hover:text-primary-900 px-4 py-2 rounded-xl font-medium transition-colors duration-300'
                >
                  Host Login
                </button>
                <button
                  onClick={() => navigate('/host-signup')}
                  className='bg-primary-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-900 transition-colors duration-300'
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='lg:hidden mt-4 border-t border-primary-200 pt-4'
            >
              {user && isAuthenticated ? (
                <div className='space-y-4'>
                  {/* User Profile - Mobile */}
                  <div className='flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-lg'>
                    {user.profilePicture || user.photoURL ? (
                      <img
                        src={user.profilePicture || user.photoURL}
                        alt='Host Profile'
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm'>
                        {(
                          user.displayName ||
                          user.firstName ||
                          user.email ||
                          'H'
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-primary-900 truncate'>
                        {user.displayName || user.firstName || 'Host'}
                      </div>
                      <div className='text-sm text-primary-600 truncate'>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Actions */}
                  <div className='space-y-2'>
                    <button
                      onClick={() => {
                        setActiveTab('settings')
                        setMobileMenuOpen(false)
                      }}
                      className='w-full flex items-center gap-3 px-4 py-3 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200'
                    >
                      <FaCog className='text-lg' />
                      <span className='font-medium'>Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <FaSignOutAlt className='text-lg' />
                      <span className='font-medium'>
                        {loading ? 'Logging out...' : 'Sign Out'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className='space-y-3'>
                  <button
                    onClick={() => navigate('/hostlogin')}
                    className='w-full px-4 py-3 text-primary-700 hover:text-primary-900 border border-primary-300 rounded-xl font-medium transition-all duration-200'
                  >
                    Host Login
                  </button>
                  <button
                    onClick={() => navigate('/host-signup')}
                    className='w-full px-4 py-3 bg-primary-800 text-white rounded-xl font-medium hover:bg-primary-900 transition-all duration-200'
                  >
                    Create Account
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )

  // Sample revenue and transaction data for charts
  const revenueData = [
    { month: 'Jan', revenue: 85000, bookings: 12, avgRate: 22000 },
    { month: 'Feb', revenue: 95000, bookings: 15, avgRate: 24000 },
    { month: 'Mar', revenue: 120000, bookings: 18, avgRate: 25000 },
    { month: 'Apr', revenue: 110000, bookings: 16, avgRate: 23000 },
    { month: 'May', revenue: 140000, bookings: 20, avgRate: 26000 },
    { month: 'Jun', revenue: 165000, bookings: 24, avgRate: 28000 },
    { month: 'Jul', revenue: 180000, bookings: 28, avgRate: 30000 },
    { month: 'Aug', revenue: 195000, bookings: 32, avgRate: 31000 },
    { month: 'Sep', revenue: 175000, bookings: 29, avgRate: 29000 },
    { month: 'Oct', revenue: 160000, bookings: 25, avgRate: 27000 },
    { month: 'Nov', revenue: 145000, bookings: 22, avgRate: 25000 },
    { month: 'Dec', revenue: 125000, bookings: 19, avgRate: 24000 },
  ]

  const transactionData = [
    {
      date: 'Aug 1',
      amount: 25000,
      property: 'Cozy Apartment',
      status: 'completed',
    },
    {
      date: 'Aug 3',
      amount: 32000,
      property: 'Modern Villa',
      status: 'completed',
    },
    {
      date: 'Aug 5',
      amount: 28000,
      property: 'Beach House',
      status: 'completed',
    },
    { date: 'Aug 8', amount: 30000, property: 'City Loft', status: 'pending' },
    {
      date: 'Aug 10',
      amount: 26000,
      property: 'Garden Suite',
      status: 'completed',
    },
    {
      date: 'Aug 12',
      amount: 35000,
      property: 'Luxury Condo',
      status: 'completed',
    },
    {
      date: 'Aug 15',
      amount: 29000,
      property: 'Riverside Cabin',
      status: 'completed',
    },
  ]

  const propertyRevenueData = [
    { name: 'Cozy Apartment', revenue: 450000, percentage: 28 },
    { name: 'Modern Villa', revenue: 380000, percentage: 24 },
    { name: 'Beach House', revenue: 320000, percentage: 20 },
    { name: 'City Loft', revenue: 280000, percentage: 18 },
    { name: 'Garden Suite', revenue: 160000, percentage: 10 },
  ]

  const chartColors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6',
    success: '#059669',
  }

  const currencies = [
    {
      code: 'NGN',
      name: 'Nigerian Naira',
      symbol: '₦',
      flag: '🇳🇬',
      description: "Nigeria's official currency",
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: '🇺🇸',
      description: 'United States Dollar',
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: '🇬🇧',
      description: 'Great Britain Pound Sterling',
    },
  ]

  const propertyTypes = [
    {
      id: 'apartment',
      name: 'Apartment',
      icon: HiOfficeBuilding,
      description: "A place that's part of a building",
    },
    {
      id: 'house',
      name: 'House',
      icon: HiHome,
      description: 'A standalone home',
    },
    {
      id: 'villa',
      name: 'Villa',
      icon: FaBuilding,
      description: 'Luxury property with premium amenities',
    },
    {
      id: 'condo',
      name: 'Condo',
      icon: FaWarehouse,
      description: 'Privately owned unit in a building',
    },
  ]

  const placeTypes = [
    {
      id: 'entire',
      name: 'Entire place',
      icon: FaHome,
      description: 'Guests have the whole place to themselves',
    },
    {
      id: 'private',
      name: 'Private room',
      icon: FaBed,
      description: 'Guests have a private room in a home',
    },
    {
      id: 'shared',
      name: 'Shared room',
      icon: FaCouch,
      description: 'Guests sleep in a room shared with others',
    },
  ]

  const amenities = [
    { id: 'wifi', name: 'WiFi', icon: FaWifi, category: 'Popular' },
    { id: 'tv', name: 'TV', icon: FaTv, category: 'Popular' },
    { id: 'kitchen', name: 'Kitchen', icon: FaUtensils, category: 'Popular' },
    {
      id: 'parking',
      name: 'Free parking',
      icon: FaParking,
      category: 'Popular',
    },
    { id: 'pool', name: 'Pool', icon: FaSwimmingPool, category: 'Standout' },
    { id: 'gym', name: 'Gym', icon: FaDumbbell, category: 'Standout' },
    { id: 'hottub', name: 'Hot tub', icon: FaHotTub, category: 'Standout' },
    {
      id: 'ac',
      name: 'Air conditioning',
      icon: FaSnowflake,
      category: 'Popular',
    },
    {
      id: 'security',
      name: 'Security cameras',
      icon: FaShieldAlt,
      category: 'Safety',
    },
    { id: 'pets', name: 'Pet friendly', icon: FaPaw, category: 'Unique' },
    {
      id: 'gaming',
      name: 'Gaming console',
      icon: FaGamepad,
      category: 'Unique',
    },
    {
      id: 'wheelchair',
      name: 'Wheelchair accessible',
      icon: FaWheelchair,
      category: 'Safety',
    },
  ]

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HiOutlineChartBar },
    { id: 'listings', name: 'My Listings', icon: HiHome },
    { id: 'bookings', name: 'Bookings', icon: FaCalendarAlt },
    { id: 'create', name: 'Create Listing', icon: HiPhotograph },
    { id: 'analytics', name: 'Analytics', icon: HiClipboardList },
    { id: 'settings', name: 'Settings', icon: HiCog },
  ]

  const steps = [
    { id: 1, name: 'Property Details', icon: HiHome },
    { id: 2, name: 'Photos & Description', icon: HiPhotograph },
    { id: 3, name: 'Location & Amenities', icon: HiLocationMarker },
    { id: 4, name: 'Pricing & Rules', icon: FaDollarSign },
  ]

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }))
  }

  // Track uploaded image URLs separately from local files
  const [uploadedImageUrls, setUploadedImageUrls] = useState([])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    console.log('📤 Files selected:', files.length)

    if (files.length === 0) {
      console.log('❌ No files selected')
      return
    }

    // Convert files to base64 and add to form data
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    }

    try {
      toast.info('Processing images...')
      console.log('🚀 Converting images to base64...')

      const base64Images = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file)
          return {
            data: base64,
            name: file.name,
            type: file.type,
            size: file.size,
          }
        })
      )

      console.log('✅ Images converted to base64:', base64Images.length)

      // Add images to form data
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
        mainImageIndex: prev.images.length === 0 ? 0 : prev.mainImageIndex,
      }))

      // Also add to uploaded URLs for immediate use
      setUploadedImageUrls((prev) => {
        const newUrls = [...prev, ...base64Images.map((img) => img.data)]
        console.log('📊 Updated uploadedImageUrls:', newUrls.length)
        return newUrls
      })

      toast.success('📸 Images processed successfully!', {
        description: `${base64Images.length} image${
          base64Images.length > 1 ? 's' : ''
        } ready for your listing.`,
        duration: 3000,
      })
      console.log('✅ Images processed successfully')
    } catch (error) {
      console.error('❌ Image processing error:', error)
      toast.error('Failed to process images. Please try again.')
    }

    // Clear the file input so the same files can be selected again if needed
    e.target.value = ''
  }

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const newImages = prev.images.filter(
        (_, index) => index !== indexToRemove
      )
      let newMainImageIndex = prev.mainImageIndex

      // Adjust main image index if necessary
      if (indexToRemove === prev.mainImageIndex) {
        // If we're removing the main image, set the first remaining image as main
        newMainImageIndex = newImages.length > 0 ? 0 : 0
      } else if (indexToRemove < prev.mainImageIndex) {
        // If we're removing an image before the main image, decrease the main index
        newMainImageIndex = prev.mainImageIndex - 1
      }

      return {
        ...prev,
        images: newImages,
        mainImageIndex: newMainImageIndex,
      }
    })

    // Also remove from uploadedImageUrls if it exists
    setUploadedImageUrls((prev) => {
      const newUrls = [...prev]
      newUrls.splice(indexToRemove, 1)
      return newUrls
    })

    toast.success('Image removed successfully')
  }

  const handleCurrencyChange = (currencyCode) => {
    setFormData((prev) => ({
      ...prev,
      currency: currencyCode,
    }))
  }

  // Transform form data to match backend schema
  const transformFormDataForAPI = async (formData) => {
    console.log('🔄 Transforming form data for API...')
    console.log('📋 formData.images:', formData.images)
    console.log('☁️  uploadedImageUrls:', uploadedImageUrls)
    console.log('📊 formData.images.length:', formData.images.length)
    console.log('📊 uploadedImageUrls.length:', uploadedImageUrls.length)

    // Handle base64 images - extract data strings from image objects
    let imageUrls = []

    if (formData.images && formData.images.length > 0) {
      imageUrls = formData.images
        .map((image) => {
          if (typeof image === 'object' && image.data) {
            // This is a base64 image object
            return image.data
          } else if (typeof image === 'string') {
            // This is already a URL/base64 string
            return image
          }
          return null
        })
        .filter(Boolean)
    }

    // Fallback to uploadedImageUrls if available
    if (imageUrls.length === 0 && uploadedImageUrls.length > 0) {
      imageUrls = [...uploadedImageUrls]
    }

    console.log('📊 Final imageUrls after processing:', imageUrls.length)

    // Reorder so main image is first
    if (
      formData.mainImageIndex >= 0 &&
      formData.mainImageIndex < imageUrls.length
    ) {
      const mainImg = imageUrls[formData.mainImageIndex]
      imageUrls = [
        mainImg,
        ...imageUrls.filter((img, idx) => idx !== formData.mainImageIndex),
      ]
    }

    // If no images provided, use a default property image
    if (!imageUrls || imageUrls.length === 0) {
      console.log('⚠️  No images available, using default image')
      imageUrls = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      ]
    }

    console.log(
      '✅ Final imageUrls for property creation:',
      imageUrls.length,
      'images'
    )
    return {
      title: formData.title,
      description: formData.description,
      type: formData.propertyType,
      price: parseFloat(formData.pricePerNight) || 0,
      currency: formData.currency,
      address: {
        city: formData.location || 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
      },
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      amenities: formData.amenities,
      images: imageUrls,
      hostId: user?.id || user?._id || 'temp-host-id',
      hostName: user?.displayName || user?.firstName || 'Host',
    }
  }

  // Validate form data
  const validateFormData = (formData) => {
    const errors = []

    if (!formData.title.trim()) {
      errors.push('Property title is required')
    }

    const descriptionValidation = validateTextLength(
      formData.description.trim(),
      50,
      500
    )
    if (!descriptionValidation.isValid) {
      errors.push(descriptionValidation.message)
    }

    if (!formData.propertyType) {
      errors.push('Property type is required')
    }

    if (!formData.pricePerNight || formData.pricePerNight <= 0) {
      errors.push('Valid price per night is required')
    }

    if (!formData.location.trim()) {
      errors.push('Property location is required')
    }

    return errors
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6 md:space-y-8'>
            <div>
              <h3 className='text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6'>
                What type of property do you have?
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-4'>
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        propertyType: type.id,
                      }))
                    }
                    className={`p-4 sm:p-5 md:p-6 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-left hover:shadow-medium ${
                      formData.propertyType === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className='flex items-center gap-3 sm:gap-4 md:gap-4'>
                      <div
                        className={`p-3 sm:p-3 md:p-3 rounded-xl ${
                          formData.propertyType === type.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-primary-100 text-primary-600'
                        }`}
                      >
                        <type.icon className='text-2xl sm:text-3xl md:text-3xl' />
                      </div>
                      <div>
                        <h4 className='font-bold text-primary-800 text-lg sm:text-xl md:text-xl'>
                          {type.name}
                        </h4>
                        <p className='text-primary-600 text-base sm:text-base md:text-base'>
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className='text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6'>
                What will guests have access to?
              </h3>
              <div className='grid grid-cols-1 gap-3 md:gap-4'>
                {placeTypes.map((place) => (
                  <button
                    key={place.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, placeType: place.id }))
                    }
                    className={`p-4 sm:p-5 md:p-6 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-left hover:shadow-medium ${
                      formData.placeType === place.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className='flex items-center gap-3 sm:gap-4 md:gap-4'>
                      <div
                        className={`p-3 sm:p-3 md:p-3 rounded-xl ${
                          formData.placeType === place.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-primary-100 text-primary-600'
                        }`}
                      >
                        <place.icon className='text-2xl sm:text-3xl md:text-3xl' />
                      </div>
                      <div>
                        <h4 className='font-bold text-primary-800 text-lg md:text-xl'>
                          {place.name}
                        </h4>
                        <p className='text-primary-600 text-base md:text-base'>
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
                <label className='block text-base md:text-lg font-bold text-primary-700 mb-2'>
                  Bedrooms
                </label>
                <div className='flex items-center gap-4'>
                  <ButtonTooltip content='Decrease bedrooms'>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          bedrooms: Math.max(1, prev.bedrooms - 1),
                        }))
                      }
                      className='p-3 sm:p-3 md:p-2 border border-primary-300 rounded-full hover:bg-primary-50 min-w-[44px] min-h-[44px] flex items-center justify-center'
                    >
                      <FaMinus className='text-primary-600 text-base sm:text-lg' />
                    </button>
                  </ButtonTooltip>
                  <span className='text-lg sm:text-xl md:text-2xl font-bold text-primary-800 w-8 sm:w-8 text-center'>
                    {formData.bedrooms}
                  </span>
                  <ButtonTooltip content='Increase bedrooms'>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          bedrooms: prev.bedrooms + 1,
                        }))
                      }
                      className='p-3 sm:p-3 md:p-2 border border-primary-300 rounded-full hover:bg-primary-50 min-w-[44px] min-h-[44px] flex items-center justify-center'
                    >
                      <FaPlus className='text-primary-600 text-base sm:text-lg' />
                    </button>
                  </ButtonTooltip>
                </div>
              </div>

              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
                <label className='block text-sm font-bold text-primary-700 mb-2'>
                  Bathrooms
                </label>
                <div className='flex items-center gap-4'>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bathrooms: Math.max(1, prev.bathrooms - 1),
                      }))
                    }
                    className='p-3 md:p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaMinus className='text-primary-600 text-lg' />
                  </button>
                  <span className='text-xl md:text-2xl font-bold text-primary-800 w-8 text-center'>
                    {formData.bathrooms}
                  </span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bathrooms: prev.bathrooms + 1,
                      }))
                    }
                    className='p-3 md:p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaPlus className='text-primary-600 text-lg' />
                  </button>
                </div>
              </div>

              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
                <label className='block text-sm font-bold text-primary-700 mb-2'>
                  Max Guests
                </label>
                <div className='flex items-center gap-4'>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        maxGuests: Math.max(1, prev.maxGuests - 1),
                      }))
                    }
                    className='p-3 md:p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaMinus className='text-primary-600 text-lg' />
                  </button>
                  <span className='text-xl md:text-2xl font-bold text-primary-800 w-8 text-center'>
                    {formData.maxGuests}
                  </span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        maxGuests: prev.maxGuests + 1,
                      }))
                    }
                    className='p-3 md:p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaPlus className='text-primary-600 text-lg' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='space-y-6 md:space-y-8'>
            <div>
              <h3 className='text-xl md:text-2xl font-bold text-primary-800 mb-4 md:mb-6'>
                Share photos of your space
              </h3>
              <div className='border-2 border-dashed border-primary-300 rounded-xl md:rounded-2xl p-6 md:p-8 text-center bg-primary-25 hover:bg-primary-50 transition-colors duration-300'>
                <FaCamera className='text-5xl md:text-6xl text-primary-400 mx-auto mb-4' />
                <h4 className='text-lg md:text-xl font-bold text-primary-800 mb-2'>
                  Upload your photos
                </h4>
                <p className='text-primary-600 mb-4 text-sm md:text-base'>
                  Choose at least 5 photos that showcase your space
                </p>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                  id='photo-upload'
                  tabIndex={-1}
                  autoComplete='off'
                />
                <label
                  htmlFor='photo-upload'
                  className='inline-block bg-primary-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold cursor-pointer hover:bg-primary-900 transition-colors duration-300 text-sm md:text-base'
                >
                  Choose Photos
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6'>
                  {formData.images.map((image, index) => {
                    // Handle different image formats
                    let previewUrl
                    if (typeof image === 'object' && image.data) {
                      // Base64 image object
                      previewUrl = image.data
                    } else if (typeof image === 'string') {
                      // Already a URL or base64 string
                      previewUrl = image
                    } else if (image instanceof File) {
                      // File object
                      previewUrl = URL.createObjectURL(image)
                    } else {
                      // Fallback to uploaded URL
                      previewUrl = uploadedImageUrls[index] || image
                    }

                    return (
                      <div key={index} className='relative group'>
                        <img
                          src={previewUrl}
                          alt={`Upload ${index + 1}`}
                          className={`w-full h-32 md:h-40 object-cover rounded-xl ${
                            formData.mainImageIndex === index
                              ? 'ring-4 ring-primary-500'
                              : ''
                          }`}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              mainImageIndex: index,
                            }))
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <span
                          className={`absolute bottom-2 left-2 bg-primary-700 text-white px-2 py-1 rounded-full text-xs font-bold ${
                            formData.mainImageIndex === index
                              ? ''
                              : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {formData.mainImageIndex === index
                            ? 'Main Image'
                            : 'Set as Main'}
                        </span>
                        <button className='absolute top-2 right-2 bg-error-500 text-white p-1 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <FaTrash className='text-sm md:text-base' />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <label className='block text-sm font-bold text-primary-700 mb-2'>
                Property Title
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder='Give your place a catchy title'
                className='w-full p-3 md:p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-primary-700 mb-2'>
                Description
                <span className='text-primary-500 text-xs ml-2'>
                  ({formData.description.length}/500 characters)
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.length <= 500) {
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                }}
                placeholder='Describe your space, what makes it special, and what guests can expect... (Maximum 500 characters)'
                rows={6}
                maxLength={500}
                className={`w-full p-3 md:p-4 border-2 rounded-xl focus:outline-none transition-colors duration-300 resize-none ${getTextValidationClasses(
                  validateTextLength(formData.description, 50, 500).status
                )}`}
              />
              {(() => {
                const validation = validateTextLength(
                  formData.description,
                  50,
                  500
                )
                return validation.status !== 'success' ||
                  formData.description.length > 450 ? (
                  <p
                    className={`text-xs mt-1 ${getTextValidationTextClasses(
                      validation.status
                    )}`}
                  >
                    {validation.message}
                  </p>
                ) : null
              })()}
            </div>
          </div>
        )

      case 3:
        return (
          <div className='space-y-6 md:space-y-8'>
            <div>
              <h3 className='text-xl md:text-2xl font-bold text-primary-800 mb-4 md:mb-6'>
                Where is your place located?
              </h3>
              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
                <label className='block text-sm font-bold text-primary-700 mb-2'>
                  Address
                </label>
                <input
                  type='text'
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder='Enter your property address'
                  className='w-full p-3 md:p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 mb-4'
                />

                <div className='bg-primary-25 border-2 border-primary-200 rounded-xl h-48 md:h-64 flex items-center justify-center'>
                  <div className='text-center'>
                    <FaMapMarkerAlt className='text-4xl md:text-5xl text-primary-400 mx-auto mb-2' />
                    <p className='text-primary-600 text-sm md:text-base'>
                      Interactive map will appear here
                    </p>
                    <p className='text-xs md:text-sm text-primary-500'>
                      Drag the pin to your exact location
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6'>
                What amenities do you offer?
              </h3>

              {['Popular', 'Standout', 'Safety', 'Unique'].map((category) => (
                <div key={category} className='mb-6 md:mb-8'>
                  <h4 className='text-lg md:text-xl font-bold text-primary-700 mb-3 md:mb-4'>
                    {category} amenities
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4'>
                    {amenities
                      .filter((amenity) => amenity.category === category)
                      .map((amenity) => (
                        <button
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`p-3 sm:p-4 md:p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-medium ${
                            formData.amenities.includes(amenity.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-primary-200 bg-white hover:border-primary-300'
                          }`}
                        >
                          <div className='flex flex-col items-center text-center'>
                            <div
                              className={`p-2 sm:p-3 md:p-3 rounded-xl mb-2 ${
                                formData.amenities.includes(amenity.id)
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-primary-100 text-primary-600'
                              }`}
                            >
                              <amenity.icon className='text-xl sm:text-2xl md:text-2xl' />
                            </div>
                            <span className='text-sm sm:text-base md:text-base font-medium text-primary-800 leading-tight'>
                              {amenity.name}
                            </span>
                            {formData.amenities.includes(amenity.id) && (
                              <FaCheck className='text-primary-500 mt-1 text-base sm:text-lg' />
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className='space-y-6 md:space-y-8'>
            {/* Enhanced Currency Selector */}
            <div>
              <h3 className='text-xl md:text-2xl font-bold text-primary-800 mb-4 md:mb-6'>
                Choose your pricing currency
              </h3>
              <div className='max-w-md'>
                <CurrencySelector
                  selectedCurrency={formData.currency}
                  onCurrencyChange={handleCurrencyChange}
                  currencies={currencies}
                />
              </div>
            </div>

            <div>
              <h3 className='text-xl md:text-2xl font-bold text-primary-800 mb-4 md:mb-6 flex items-center gap-2'>
                Set your price
                <InfoTooltip content='Set a competitive price based on similar properties in your area. You can always adjust this later.'>
                  <span className='text-primary-400 cursor-help'>ℹ️</span>
                </InfoTooltip>
              </h3>
              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-4'>
                  <div className='flex items-center gap-2 bg-primary-50 px-3 md:px-4 py-2 rounded-xl border border-primary-200'>
                    <span className='text-xl md:text-2xl'>
                      {
                        currencies.find((c) => c.code === formData.currency)
                          ?.flag
                      }
                    </span>
                    <span className='font-bold text-primary-800 text-sm md:text-base'>
                      {
                        currencies.find((c) => c.code === formData.currency)
                          ?.code
                      }
                    </span>
                  </div>
                  <span className='text-primary-600 font-medium text-sm md:text-base'>
                    Price per night in{' '}
                    {currencies.find((c) => c.code === formData.currency)?.name}
                  </span>
                </div>
                <div className='relative'>
                  <span className='absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-primary-400 text-xl md:text-2xl font-bold'>
                    {
                      currencies.find((c) => c.code === formData.currency)
                        ?.symbol
                    }
                  </span>
                  <input
                    type='number'
                    value={formData.pricePerNight}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricePerNight: e.target.value,
                      }))
                    }
                    placeholder='0'
                    className='w-full pl-12 md:pl-16 pr-3 md:pr-4 py-3 md:py-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 text-xl md:text-2xl font-bold'
                  />
                </div>
                <div className='mt-4 p-3 md:p-4 bg-primary-25 rounded-xl border border-primary-200'>
                  <div className='flex items-start gap-3'>
                    <div className='w-6 h-6 md:w-8 md:h-8 bg-info-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <span className='text-info-600 text-base md:text-lg'>
                        💡
                      </span>
                    </div>
                    <div>
                      <p className='text-xs md:text-sm font-medium text-primary-700 mb-1'>
                        Pricing Tips
                      </p>
                      <p className='text-xs text-primary-600'>
                        Research similar properties in your area. You can always
                        adjust your price later based on demand.
                      </p>
                    </div>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6'>
                    {formData.images.map((image, index) => {
                      let previewUrl = ''
                      // Handle base64 image objects
                      if (image && typeof image === 'object' && image.data) {
                        previewUrl = image.data
                      } else if (image instanceof File) {
                        previewUrl = URL.createObjectURL(image)
                      } else if (typeof image === 'string') {
                        previewUrl = image.startsWith('data:') ? image : image
                      }

                      return (
                        <div key={index} className='relative group'>
                          <img
                            src={previewUrl}
                            alt={`Upload ${index + 1}`}
                            className={`w-full h-32 md:h-40 object-cover rounded-xl ${
                              formData.mainImageIndex === index
                                ? 'ring-4 ring-primary-500'
                                : ''
                            }`}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                mainImageIndex: index,
                              }))
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                          <span
                            className={`absolute bottom-2 left-2 bg-primary-700 text-white px-2 py-1 rounded-full text-xs font-bold ${
                              formData.mainImageIndex === index
                                ? ''
                                : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {formData.mainImageIndex === index
                              ? 'Main Image'
                              : 'Set as Main'}
                          </span>
                          <button
                            className='absolute top-2 right-2 bg-error-500 text-white p-1 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveImage(index)
                            }}
                          >
                            <FaTrash className='text-sm md:text-base' />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
                <h4 className='font-bold text-primary-800 mb-3 md:mb-4 text-sm md:text-base'>
                  Weekly Discount
                </h4>
                <div className='flex items-center gap-3 md:gap-4'>
                  <input
                    type='number'
                    placeholder='0'
                    className='flex-1 p-2 md:p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none text-sm md:text-base'
                  />
                  <span className='text-primary-600 font-medium text-sm md:text-base'>
                    % off
                  </span>
                </div>
                <p className='text-xs text-primary-500 mt-2'>
                  Encourage longer stays with a weekly discount
                </p>
              </div>

              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
                <h4 className='font-bold text-primary-800 mb-3 md:mb-4 text-sm md:text-base'>
                  Monthly Discount
                </h4>
                <div className='flex items-center gap-3 md:gap-4'>
                  <input
                    type='number'
                    placeholder='0'
                    className='flex-1 p-2 md:p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none text-sm md:text-base'
                  />
                  <span className='text-primary-600 font-medium text-sm md:text-base'>
                    % off
                  </span>
                </div>
                <p className='text-xs text-primary-500 mt-2'>
                  Attract long-term guests with monthly savings
                </p>
              </div>
            </div>

            <div className='bg-primary-25 p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200'>
              <h4 className='text-lg md:text-xl font-bold text-primary-800 mb-3 md:mb-4'>
                Review your listing
              </h4>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
                <div>
                  <h5 className='font-semibold text-primary-700 mb-2 text-sm md:text-base'>
                    Property Details
                  </h5>
                  <ul className='space-y-1 text-primary-600 text-xs md:text-sm'>
                    <li>
                      Type:{' '}
                      {
                        propertyTypes.find(
                          (t) => t.id === formData.propertyType
                        )?.name
                      }
                    </li>
                    <li>
                      Access:{' '}
                      {
                        placeTypes.find((p) => p.id === formData.placeType)
                          ?.name
                      }
                    </li>
                    <li>Bedrooms: {formData.bedrooms}</li>
                    <li>Bathrooms: {formData.bathrooms}</li>
                    <li>Max Guests: {formData.maxGuests}</li>
                    <li className='font-medium text-primary-800'>
                      Price:{' '}
                      {
                        currencies.find((c) => c.code === formData.currency)
                          ?.symbol
                      }
                      {formData.pricePerNight || '0'} {formData.currency}/night
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className='font-semibold text-primary-700 mb-2 text-sm md:text-base'>
                    Amenities ({formData.amenities.length})
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {formData.amenities.slice(0, 6).map((amenityId) => {
                      const amenity = amenities.find((a) => a.id === amenityId)
                      return (
                        <span
                          key={amenityId}
                          className='bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs'
                        >
                          {amenity?.name}
                        </span>
                      )
                    })}
                  </div>

                  <div className='mt-4'>
                    <h5 className='font-semibold text-primary-700 mb-2 text-sm md:text-base'>
                      Currency & Pricing
                    </h5>
                    <div className='flex items-center gap-2'>
                      <span className='text-base md:text-lg'>
                        {
                          currencies.find((c) => c.code === formData.currency)
                            ?.flag
                        }
                      </span>
                      <span className='text-xs md:text-sm text-primary-600'>
                        {
                          currencies.find((c) => c.code === formData.currency)
                            ?.name
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  } // End renderStepContent function

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className='space-y-4 sm:space-y-6 md:space-y-8'>
            <div className='bg-gradient-to-r from-primary-800 to-primary-600 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white'>
              <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4'>
                Welcome back, Host!
              </h2>
              <p className='text-lg sm:text-xl md:text-2xl opacity-90 mb-3 sm:mb-4 md:mb-6'>
                Ready to share your space with the world?
              </p>
              <ButtonTooltip content='Start creating your first property listing'>
                <button
                  onClick={() => setActiveTab('create')}
                  className='bg-white text-primary-800 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-primary-50 transition-colors duration-300 text-base sm:text-lg md:text-lg'
                >
                  Create New Listing
                </button>
              </ButtonTooltip>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
              <div className='bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm sm:text-base md:text-base font-medium'>
                      Total Listings
                    </p>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800'>
                      {hostProperties?.length || 0}
                    </p>
                  </div>
                  <FaHome className='text-lg sm:text-xl md:text-2xl text-primary-400' />
                </div>
              </div>

              <div className='bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm sm:text-base md:text-base font-medium'>
                      Total Bookings
                    </p>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800'>
                      {statsLoading ? '...' : hostStats.totalBookings}
                    </p>
                  </div>
                  <FaCalendarAlt className='text-lg sm:text-xl md:text-2xl text-primary-400' />
                </div>
              </div>

              <div className='bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm sm:text-base md:text-base font-medium'>
                      Monthly Earnings
                    </p>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800'>
                      {statsLoading
                        ? '...'
                        : `₦${hostStats.monthlyEarnings.toLocaleString()}`}
                    </p>
                  </div>
                  <FaDollarSign className='text-lg sm:text-xl md:text-2xl text-primary-400' />
                </div>
              </div>

              <div className='bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm sm:text-base md:text-base font-medium'>
                      Average Rating
                    </p>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800'>
                      {statsLoading
                        ? '...'
                        : hostStats.averageRating > 0
                        ? hostStats.averageRating.toFixed(1)
                        : 'N/A'}
                    </p>
                  </div>
                  <FaCheck className='text-lg sm:text-xl md:text-2xl text-primary-400' />
                </div>
              </div>
            </div>

            {/* Property Listings - API DATA */}
            <div className='mt-8 space-y-4'>
              {error && (
                <div className='text-error-600 bg-error-50 p-3 rounded-lg'>
                  Error loading properties: {error.message || error.toString()}
                </div>
              )}
              {hostProperties?.length === 0 && !error ? (
                <div className='text-primary-600 p-3'>
                  No properties found. Create your first listing!
                </div>
              ) : (
                <>
                  {/* Debug: Log properties being rendered in overview */}
                  {console.log(
                    '📊 Overview: Rendering properties:',
                    hostProperties
                  )}
                  {hostProperties?.map((property) => (
                    <div
                      key={property._id || property.id}
                      className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'
                    >
                      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6'>
                        <div className='w-16 h-16 md:w-24 md:h-24 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden'>
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={
                                typeof property.images[0] === 'object' &&
                                property.images[0].data
                                  ? property.images[0].data
                                  : property.images[0]
                              }
                              alt={property.title}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <FaHome className='text-2xl md:text-3xl text-primary-600' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-lg md:text-xl font-bold text-primary-800 mb-2'>
                            {property.title}
                          </h3>
                          <p className='text-primary-600 mb-2 text-sm md:text-base'>
                            {property.bedrooms} beds • {property.bathrooms}{' '}
                            baths{property.area && ` • ${property.area} m²`}
                          </p>
                          <div className='flex flex-wrap items-center gap-3 md:gap-4'>
                            <span className='bg-accent-green-100 text-accent-green-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium'>
                              {property.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className='text-primary-600 text-xs md:text-sm'>
                              {property.currency || '₦'}
                              {property.price}/night
                            </span>
                            <span className='text-primary-500 text-xs md:text-sm'>
                              {property.type}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center gap-2 self-start sm:self-center'>
                          <ButtonTooltip content='View listing details'>
                            <button className='p-3 md:p-2 text-primary-600 hover:bg-primary-50 rounded-lg'>
                              <FaEye className='text-base md:text-lg' />
                            </button>
                          </ButtonTooltip>
                          <ButtonTooltip content='Edit listing'>
                            <button className='p-3 md:p-2 text-primary-600 hover:bg-primary-50 rounded-lg'>
                              <FaEdit className='text-base md:text-lg' />
                            </button>
                          </ButtonTooltip>
                          <ButtonTooltip
                            content='Delete listing'
                            variant='error'
                          >
                            <button className='p-3 md:p-2 text-error-600 hover:bg-error-50 rounded-lg'>
                              <FaTrash className='text-base md:text-lg' />
                            </button>
                          </ButtonTooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )

      case 'bookings':
        return (
          <div className='space-y-6 md:space-y-8'>
            <HostBookingManagement />
          </div>
        )

      case 'listings':
        return (
          <div className='space-y-4 md:space-y-6'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <h2 className='text-2xl md:text-3xl font-bold text-primary-800'>
                My Listings
              </h2>
              <button
                onClick={() => setActiveTab('create')}
                className='bg-primary-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-primary-900 transition-colors duration-300 text-base md:text-lg'
              >
                Add New Listing
              </button>
            </div>

            {hostProperties?.length === 0 ? (
              <div className='bg-white p-6 rounded-xl border border-primary-200 text-center'>
                <FaHome className='text-4xl text-primary-400 mx-auto mb-4' />
                <h3 className='text-lg font-bold text-primary-800 mb-2'>
                  No listings yet
                </h3>
                <p className='text-primary-600 mb-4'>
                  Start by creating your first property listing
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className='bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-900 transition-colors duration-300'
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                {/* Debug: Log properties being rendered */}
                {console.log(
                  '🏠 Dashboard: Rendering host properties:',
                  hostProperties
                )}
                {console.log(
                  '🔢 Dashboard: Properties count:',
                  hostProperties?.length
                )}
                {hostProperties?.map((property) => (
                  <div
                    key={property._id || property.id}
                    className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'
                  >
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6'>
                      <div className='w-16 h-16 md:w-24 md:h-24 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden'>
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={
                              typeof property.images[0] === 'object' &&
                              property.images[0].data
                                ? property.images[0].data
                                : property.images[0]
                            }
                            alt={property.title}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <FaHome className='text-2xl md:text-3xl text-primary-600' />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg md:text-xl font-bold text-primary-800 mb-2'>
                          {property.title}
                        </h3>
                        <p className='text-primary-600 mb-2 text-sm md:text-base'>
                          {property.bedrooms} beds • {property.bathrooms} baths
                          {property.area && ` • ${property.area} m²`}
                        </p>
                        <div className='flex flex-wrap items-center gap-3 md:gap-4'>
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                              property.isActive
                                ? 'bg-accent-green-100 text-accent-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {property.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className='text-primary-600 text-xs md:text-sm'>
                            {property.currency || '₦'}
                            {property.price}/night
                          </span>
                          <span className='text-primary-500 text-xs md:text-sm'>
                            {property.type}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 self-start sm:self-center'>
                        <ButtonTooltip
                          content={
                            property.isActive
                              ? 'Deactivate listing'
                              : 'Activate listing'
                          }
                        >
                          <button
                            onClick={() =>
                              handlePublishProperty(
                                property._id || property.id,
                                property.isActive ? 'active' : 'inactive'
                              )
                            }
                            className={`p-3 md:p-2 rounded-lg transition-colors duration-200 ${
                              property.isActive
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <FaGlobe className='text-base md:text-lg' />
                          </button>
                        </ButtonTooltip>
                        <ButtonTooltip content='View listing details'>
                          <button className='p-3 md:p-2 text-primary-600 hover:bg-primary-50 rounded-lg'>
                            <FaEye className='text-base md:text-lg' />
                          </button>
                        </ButtonTooltip>
                        <ButtonTooltip content='Edit listing'>
                          <button className='p-3 md:p-2 text-primary-600 hover:bg-primary-50 rounded-lg'>
                            <FaEdit className='text-base md:text-lg' />
                          </button>
                        </ButtonTooltip>
                        <ButtonTooltip content='Delete listing' variant='error'>
                          <button className='p-3 md:p-2 text-error-600 hover:bg-error-50 rounded-lg'>
                            <FaTrash className='text-base md:text-lg' />
                          </button>
                        </ButtonTooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'create':
        return (
          <div className='space-y-6 md:space-y-8'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <h2 className='text-2xl md:text-3xl font-bold text-primary-800'>
                Create New Listing
              </h2>
              <div className='text-sm md:text-base text-primary-600'>
                Step {currentStep} of {steps.length}
              </div>
            </div>

            {/* Step Progress */}
            <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
              <div className='flex items-center justify-between mb-4'>
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 md:gap-3 ${
                      index !== steps.length - 1 ? 'flex-1' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
                        currentStep >= step.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-primary-100 text-primary-400'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <FaCheck className='text-sm md:text-base' />
                      ) : (
                        <step.icon className='text-sm md:text-base' />
                      )}
                    </div>
                    <div className='hidden sm:block'>
                      <div
                        className={`font-medium text-xs md:text-sm ${
                          currentStep >= step.id
                            ? 'text-primary-800'
                            : 'text-primary-400'
                        }`}
                      >
                        {step.name}
                      </div>
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        className={`hidden sm:block flex-1 h-0.5 ml-3 md:ml-4 ${
                          currentStep > step.id
                            ? 'bg-primary-500'
                            : 'bg-primary-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4'>
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-colors duration-300 text-sm md:text-base ${
                  currentStep === 1
                    ? 'bg-primary-100 text-primary-400 cursor-not-allowed'
                    : 'bg-primary-200 text-primary-800 hover:bg-primary-300'
                }`}
              >
                Previous
              </button>
              <button
                onClick={async () => {
                  if (currentStep === steps.length) {
                    // Validate form data before submitting
                    const validationErrors = validateFormData(formData)
                    if (validationErrors.length > 0) {
                      toast.error(
                        `⚠️ Please complete all required fields: ${validationErrors.join(
                          ', '
                        )}`,
                        {
                          description:
                            'All fields must be filled before publishing.',
                          duration: 5000,
                        }
                      )
                      return
                    }

                    try {
                      toast.info('📝 Publishing your listing...', {
                        description:
                          'Please wait while we create your property listing.',
                        duration: 2000,
                      })
                      console.log('Starting publish process...')
                      console.log('Current formData:', formData)

                      // Transform form data to match backend schema
                      const propertyData = await transformFormDataForAPI(
                        formData
                      )
                      console.log('Transformed property data:', propertyData)

                      // Check if we have valid property data
                      if (!propertyData || !propertyData.title) {
                        throw new Error('Invalid property data generated')
                      }

                      const result = await createProperty(propertyData)
                      console.log('Property creation result:', result)

                      // Refresh properties list
                      await getHostProperties()

                      // Show success message
                      toast.success(
                        '🎉 Listing published successfully! Your property is now live.',
                        {
                          description:
                            'Guests can now discover and book your property.',
                          duration: 5000,
                        }
                      )
                      console.log('Property published successfully!')

                      // Switch to overview tab
                      setActiveTab('overview')

                      // Reset form and uploaded images
                      setFormData({
                        title: '',
                        description: '',
                        propertyType: '',
                        placeType: '',
                        location: '',
                        bedrooms: 1,
                        bathrooms: 1,
                        maxGuests: 1,
                        amenities: [],
                        images: [],
                        mainImageIndex: 0,
                        pricePerNight: '',
                        currency: 'NGN',
                      })
                      setUploadedImageUrls([])
                      setCurrentStep(1)
                    } catch (error) {
                      console.error('Failed to create property:', error)
                      console.error('Error details:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                      })

                      let errorMessage = 'Failed to publish listing'

                      if (error.response) {
                        // Server responded with error
                        if (error.response.status === 401) {
                          errorMessage =
                            'Authentication failed. Please log in again.'
                        } else if (error.response.status === 400) {
                          errorMessage =
                            error.response.data?.message ||
                            'Invalid property data'
                        } else if (error.response.status === 500) {
                          errorMessage = 'Server error. Please try again later.'
                        } else {
                          errorMessage =
                            error.response.data?.message ||
                            'Unknown server error'
                        }
                      } else if (error.message.includes('Network Error')) {
                        errorMessage =
                          'Network error. Please check your connection and server status.'
                      } else {
                        errorMessage = error.message
                      }

                      toast.error(errorMessage, {
                        description:
                          'Please check your connection and try again.',
                        duration: 5000,
                      })
                    }
                  } else {
                    setCurrentStep(Math.min(steps.length, currentStep + 1))
                  }
                }}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-colors duration-300 text-sm md:text-base ${
                  currentStep === steps.length
                    ? 'bg-success-500 text-white hover:bg-success-600'
                    : 'bg-primary-800 text-white hover:bg-primary-900'
                }`}
              >
                {currentStep === steps.length ? 'Publish Listing' : 'Next'}
              </button>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className='space-y-4 md:space-y-6'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <h2 className='text-2xl md:text-3xl font-bold text-primary-800'>
                Analytics Dashboard
              </h2>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 md:px-4 py-2 rounded-xl font-medium transition-colors duration-300 text-sm md:text-base flex items-center gap-2 ${
                    chartType === 'area'
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-primary-600 hover:bg-primary-100'
                  }`}
                >
                  <FaChartArea className='text-sm' />
                  Revenue
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 md:px-4 py-2 rounded-xl font-medium transition-colors duration-300 text-sm md:text-base flex items-center gap-2 ${
                    chartType === 'bar'
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-primary-600 hover:bg-primary-100'
                  }`}
                >
                  <FaChartBar className='text-sm' />
                  Performance
                </button>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
              <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6'>
                <h3 className='text-lg md:text-xl font-bold text-primary-800 mb-2 sm:mb-0'>
                  {chartType === 'area'
                    ? 'Revenue Trend'
                    : 'Performance Metrics'}
                </h3>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-3 md:px-4 py-2 rounded-xl font-medium transition-colors duration-300 text-sm md:text-base flex items-center gap-2 ${
                      chartType === 'area'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-primary-600 hover:bg-primary-100'
                    }`}
                  >
                    <FaChartArea className='text-sm' />
                    Revenue
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 md:px-4 py-2 rounded-xl font-medium transition-colors duration-300 text-sm md:text-base flex items-center gap-2 ${
                      chartType === 'bar'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-primary-600 hover:bg-primary-100'
                    }`}
                  >
                    <FaChartBar className='text-sm' />
                    Performance
                  </button>
                </div>
              </div>

              {/* Dynamic Chart Legend */}
              <div className='flex items-center gap-4 text-sm mb-4'>
                {chartType === 'area' ? (
                  <>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                      <span className='text-primary-600'>Revenue</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                      <span className='text-primary-600'>Bookings</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-amber-500 rounded-full'></div>
                      <span className='text-primary-600'>Avg Rate</span>
                    </div>
                  </>
                )}
              </div>

              <div className='h-64 sm:h-80 md:h-96'>
                <ResponsiveContainer width='100%' height='100%'>
                  {chartType === 'area' ? (
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id='revenueGradient'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor={chartColors.primary}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset='95%'
                            stopColor={chartColors.primary}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                      <XAxis
                        dataKey='month'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value) => [
                          `₦${value.toLocaleString()}`,
                          'Revenue',
                        ]}
                      />
                      <Area
                        type='monotone'
                        dataKey='revenue'
                        stroke={chartColors.primary}
                        strokeWidth={3}
                        fill='url(#revenueGradient)'
                        name='revenue'
                      />
                    </AreaChart>
                  ) : (
                    <ComposedChart data={revenueData}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                      <XAxis
                        dataKey='month'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        yAxisId='left'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        yAxisId='right'
                        orientation='right'
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value, name) => [
                          name === 'bookings'
                            ? value
                            : `₦${value.toLocaleString()}`,
                          name === 'bookings' ? 'Bookings' : 'Avg Rate',
                        ]}
                      />
                      <Legend />
                      <Bar
                        yAxisId='left'
                        dataKey='bookings'
                        fill={chartColors.primary}
                        radius={[4, 4, 0, 0]}
                        name='Bookings'
                      />
                      <Line
                        yAxisId='right'
                        type='monotone'
                        dataKey='avgRate'
                        stroke={chartColors.accent}
                        strokeWidth={3}
                        name='Avg Rate'
                      />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transaction Analytics Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
              {/* Recent Transactions */}
              <div className='lg:col-span-2 bg-white p-4 sm:p-6 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6'>
                  <h3 className='text-lg md:text-xl font-bold text-primary-800 mb-2 sm:mb-0'>
                    Recent Transactions
                  </h3>
                  <button className='text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors self-start sm:self-auto'>
                    View All →
                  </button>
                </div>

                <div className='space-y-3 sm:space-y-4'>
                  {transactionData.map((transaction, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 sm:p-4 bg-primary-25/50 rounded-lg border border-primary-100'
                    >
                      <div className='flex items-center gap-3 sm:gap-4 min-w-0 flex-1'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                          <FaHome className='text-primary-600 text-lg sm:text-xl' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h4 className='font-bold text-primary-800 text-sm sm:text-base truncate'>
                            {transaction.property}
                          </h4>
                          <p className='text-primary-600 text-xs sm:text-sm'>
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <p className='font-bold text-primary-800 text-sm sm:text-base'>
                          ₦{transaction.amount.toLocaleString()}
                        </p>
                        <div
                          className={`flex items-center justify-end gap-1 text-xs ${
                            transaction.status === 'completed'
                              ? 'text-green-600'
                              : 'text-amber-600'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              transaction.status === 'completed'
                                ? 'bg-green-500'
                                : 'bg-amber-500'
                            }`}
                          ></div>
                          <span className='capitalize'>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Revenue Distribution */}
              <div className='bg-white p-4 sm:p-6 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <h3 className='text-lg md:text-xl font-bold text-primary-800 mb-4 sm:mb-6'>
                  Revenue by Property
                </h3>

                <div className='h-48 sm:h-64 mb-4'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={propertyRevenueData}
                        cx='50%'
                        cy='50%'
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey='percentage'
                      >
                        {propertyRevenueData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              Object.values(chartColors)[
                                index % Object.values(chartColors).length
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `₦${props.payload.revenue.toLocaleString()}`,
                          'Revenue',
                        ]}
                        labelFormatter={(label) => `${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className='space-y-2'>
                  {propertyRevenueData.slice(0, 4).map((property, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between text-sm'
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{
                            backgroundColor: Object.values(chartColors)[index],
                          }}
                        ></div>
                        <span className='text-primary-700 truncate'>
                          {property.name.length > 12
                            ? `${property.name.slice(0, 12)}...`
                            : property.name}
                        </span>
                      </div>
                      <span className='font-medium text-primary-800'>
                        {property.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <h4 className='font-bold text-primary-800 mb-2 text-base md:text-lg'>
                  Occupancy Rate
                </h4>
                <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800'>
                  78%
                </p>
                <div className='flex items-center gap-2 mt-2'>
                  <FaArrowUp className='text-green-500 text-sm' />
                  <p className='text-sm md:text-base text-green-600 font-medium'>
                    ↑ 12% from last month
                  </p>
                </div>
              </div>

              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <h4 className='font-bold text-primary-800 mb-2 text-base md:text-lg'>
                  Average Daily Rate
                </h4>
                <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800'>
                  ₦28k
                </p>
                <div className='flex items-center gap-2 mt-2'>
                  <FaArrowUp className='text-green-500 text-sm' />
                  <p className='text-sm md:text-base text-green-600 font-medium'>
                    ↑ 8% from last month
                  </p>
                </div>
              </div>

              <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
                <h4 className='font-bold text-primary-800 mb-2 text-base md:text-lg'>
                  Guest Rating
                </h4>
                <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800'>
                  4.8
                </p>
                <div className='flex items-center gap-2 mt-2'>
                  <div className='flex text-amber-400'>{'★'.repeat(5)}</div>
                  <p className='text-sm md:text-base text-primary-600'>
                    (124 reviews)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className='space-y-4 md:space-y-6'>
            <h2 className='text-xl md:text-2xl font-bold text-primary-800'>
              Account Settings
            </h2>

            <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
              <h3 className='text-lg md:text-xl font-bold text-primary-800 mb-3 md:mb-4'>
                Profile Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    placeholder='John'
                    className='w-full p-2 md:p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none text-sm md:text-base'
                  />
                </div>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    placeholder='Doe'
                    className='w-full p-2 md:p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none text-sm md:text-base'
                  />
                </div>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    placeholder='john@example.com'
                    className='w-full p-2 md:p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none text-sm md:text-base'
                  />
                </div>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    placeholder='+234 800 000 0000'
                    className='w-full p-2 md:p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none text-sm md:text-base'
                  />
                </div>
              </div>
              <button className='mt-4 md:mt-6 bg-primary-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-primary-900 transition-colors duration-300 text-sm md:text-base'>
                Update Profile
              </button>
            </div>

            <div className='bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary-200 shadow-soft'>
              <h3 className='text-lg md:text-xl font-bold text-primary-800 mb-3 md:mb-4'>
                Notification Preferences
              </h3>
              <div className='space-y-3 md:space-y-4'>
                {[
                  'Email notifications for new bookings',
                  'SMS alerts for urgent messages',
                  'Weekly performance reports',
                  'Marketing emails and updates',
                ].map((notification, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between gap-4'
                  >
                    <span className='text-primary-700 text-sm md:text-base flex-1'>
                      {notification}
                    </span>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        defaultChecked={index < 2}
                      />
                      <div className="w-9 h-5 md:w-11 md:h-6 bg-primary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  } // End renderTabContent function

  // Main Dashboard component return
  return (
    <>
      {/* Host Dashboard Navbar */}
      {renderNavbar()}

      {/* Main Dashboard Content */}
      <div className='min-h-screen bg-gradient-to-br from-primary-25 via-neutral-50 to-primary-100 pt-20'>
        <div className='container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-[1400px]'>
          <div className='mb-4 sm:mb-6 md:mb-8'>
            <h1 className='text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent mb-1 sm:mb-1 md:mb-2'>
              Host Dashboard
            </h1>
            <p className='text-primary-600 text-base sm:text-lg md:text-xl'>
              Manage your properties and grow your hosting business
            </p>
          </div>

          <div className='bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft border border-primary-200 p-1 sm:p-1.5 md:p-2 mb-6 md:mb-8'>
            <div className='flex space-x-1 sm:space-x-1.5 md:space-x-2 overflow-x-auto scrollbar-hide'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-sm sm:text-base md:text-lg min-w-0 flex-1 sm:flex-none ${
                    activeTab === tab.id
                      ? 'bg-primary-800 text-white shadow-medium'
                      : 'text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <tab.icon className='text-xl sm:text-2xl md:text-xl flex-shrink-0' />
                  <span className='text-sm sm:text-base md:text-lg md:inline leading-tight sm:leading-normal'>
                    {tab.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className='transition-all duration-300'>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  )
} // Close Dashboard component function

export default Dashboard
