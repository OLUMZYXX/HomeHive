import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { CiSearch } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import { HiMenu } from 'react-icons/hi'
import {
  FaCog,
  FaSignOutAlt,
  FaHeart,
  FaHome,
  FaBook,
  FaStar,
} from 'react-icons/fa'
import { navigateToHome } from '../../utils/navigation'
import { AnimatedButton } from '../common/AnimatedComponents'
import { useAPI } from '../../contexts/APIContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import { TokenManager } from '../../services/jwtAuthService'
import { toast } from '../../utils/toast.jsx'

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout: apiLogout,
    loading,
    error,
    clearError,
  } = useAPI()
  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedCurrencyData,
    currencies,
  } = useCurrency()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(true)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
    setMenuOpen(false)
  }

  // Initialize token manager and check authentication status
  useEffect(() => {
    TokenManager.initialize()

    // Clear any previous errors when component mounts
    if (error) {
      clearError()
    }
  }, [error, clearError])

  // Error handling useEffect
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false)
      }

      // Close currency dropdown when clicking outside
      if (!event.target.closest('.currency-dropdown')) {
        setCurrencyDropdownOpen(false)
      }
    }
    if (profileMenuOpen || currencyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileMenuOpen, currencyDropdownOpen])

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false)
        setMenuOpen(false) // Close mobile menu when scrolling down
      } else {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Navigation handlers
  const navigateToHost = () => navigate('/Host')

  const handleLogout = async () => {
    try {
      await apiLogout()
      toast.success('Logged out successfully')
      setMenuOpen(false)
      setProfileMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  const handleBookingClick = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/listings')
      toast.info('Please log in to view your bookings')
      navigate('/signin')
      return
    }
    navigate('/listings', { state: { smoothScroll: true } })
    setMenuOpen(false)
  }

  const handleFavoritesClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/favorites')
      toast.info('Please log in to view your favorites')
      navigate('/signin')
      return
    }
    navigate('/favorites')
    setMenuOpen(false)
    setProfileMenuOpen(false)
  }

  const handleBookingsClick = () => {
    console.log('Navbar - Bookings clicked, authentication state:', {
      isAuthenticated,
      user,
    })

    if (!isAuthenticated) {
      console.log('Navbar - User not authenticated, redirecting to signin')
      localStorage.setItem('redirectAfterLogin', '/my-bookings')
      toast.info('Please log in to view your bookings')
      navigate('/signin')
      return
    }

    console.log('Navbar - User authenticated, navigating to my-bookings')
    navigate('/my-bookings')
    setMenuOpen(false)
    setProfileMenuOpen(false)
  }

  const handleSettingsClick = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to access settings')
      navigate('/signin')
      return
    }
    navigate('/profile/settings')
    setMenuOpen(false)
    setProfileMenuOpen(false)
  }

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      try {
        // Navigate to search results page with query
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setIsSearching(false)
        setSearchQuery('')
        setMenuOpen(false)
      } catch (error) {
        console.error('Search error:', error)
        toast.error('Search failed. Please try again.')
      }
    }
  }

  const closeSearch = () => {
    setIsSearching(false)
    setSearchQuery('')
  }

  const navLinks = [
    { name: 'Explore', icon: <FaHome />, action: handleHomeNavigation },
    {
      name: 'Listings',
      icon: <FaBook />,
      action: handleBookingClick,
    },
    {
      name: 'Reviews',
      icon: <FaStar />,
      action: () => scrollToSection('testimonial'),
    },
    // {
    //   name: 'Bookings',
    //   icon: <FaBook />,
    //   action: handleBookingClick,
    // },
    {
      name: 'Support',
      icon: <FaHeart />,
      action: () => scrollToSection('support'),
    },
  ]

  return (
    <nav
      className={`bg-white shadow-lg border-b border-gray-100 py-4 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        <div className='flex items-center justify-between'>
          {/* Logo Section */}
          <div
            className='flex items-center gap-3 cursor-pointer group'
            onClick={handleHomeNavigation}
          >
            <div className='flex-shrink-0'>
              <HomeHiveLogo
                className='w-12 h-12 sm:w-16 sm:h-16 object-contain transition-transform duration-200 group-hover:scale-105'
                alt='Homehive Logo'
              />
            </div>
            <h1 className='font-NotoSans text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-gray-700 transition-colors duration-200'>
              Homehive
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center'>
            {isSearching ? (
              <form
                onSubmit={handleSearch}
                className='flex items-center bg-gray-50 rounded-full border-2 border-gray-200 px-6 py-3 min-w-[400px]'
              >
                <input
                  type='text'
                  placeholder='Search accommodations...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-1 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none text-lg'
                  autoFocus
                />
                <button type='submit' className='ml-2 p-1'>
                  <CiSearch className='text-xl text-gray-600 hover:text-gray-800' />
                </button>
                <button
                  type='button'
                  onClick={closeSearch}
                  className='ml-2 p-1 text-gray-500 hover:text-gray-700'
                >
                  <IoClose className='text-xl' />
                </button>
              </form>
            ) : (
              <div className='flex items-center bg-gray-50 border-2 border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow duration-200'>
                <ul className='flex items-center gap-8 text-base font-medium'>
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={link.action}
                        className='flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap'
                      >
                        {link.icon}
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsSearching(true)}
                  className='ml-6 p-1 text-gray-600 hover:text-gray-800 transition-colors duration-200'
                >
                  <CiSearch className='text-2xl' />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
            aria-label='Toggle menu'
          >
            {menuOpen ? (
              <IoClose className='text-2xl text-gray-700' />
            ) : (
              <HiMenu className='text-2xl text-gray-700' />
            )}
          </button>

          {/* Desktop Auth Buttons */}
          <div className='hidden lg:flex items-center gap-4'>
            <AnimatedButton
              onClick={navigateToHost}
              className='px-6 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-full transition-all duration-200'
            >
              Become a Host
            </AnimatedButton>

            {user && isAuthenticated ? (
              <div className='relative flex items-center gap-4'>
                {/* Currency Selector */}
                <div className='relative currency-dropdown'>
                  <button
                    onClick={() =>
                      setCurrencyDropdownOpen(!currencyDropdownOpen)
                    }
                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-full transition-all duration-200'
                  >
                    <span className='text-lg'>
                      {selectedCurrencyData?.symbol}
                    </span>
                    <span className='hidden sm:block'>{selectedCurrency}</span>
                  </button>

                  {/* Currency Dropdown */}
                  <AnimatePresence>
                    {currencyDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className='absolute top-full right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-2xl shadow-strong z-50 overflow-hidden'
                      >
                        {currencies.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => {
                              setSelectedCurrency(currency.code)
                              setCurrencyDropdownOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200 text-left ${
                              selectedCurrency === currency.code
                                ? 'bg-gray-100 border-r-4 border-primary-500'
                                : ''
                            }`}
                          >
                            <span className='text-xl font-bold text-gray-800 w-8 text-center'>
                              {currency.symbol}
                            </span>
                            <div className='flex-1'>
                              <div className='font-bold text-gray-900 text-sm'>
                                {currency.code}
                              </div>
                              <div className='text-xs text-gray-600 font-medium'>
                                {currency.name}
                              </div>
                            </div>
                            {selectedCurrency === currency.code && (
                              <div className='w-2 h-2 bg-primary-800 rounded-full'></div>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  className='w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 overflow-hidden relative focus:outline-none'
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-label='Profile menu'
                >
                  {user.profilePicture || user.photoURL ? (
                    <img
                      src={user.profilePicture || user.photoURL}
                      alt='User Profile'
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className='w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg'
                    style={{
                      display:
                        user.profilePicture || user.photoURL ? 'none' : 'flex',
                    }}
                  >
                    {(user.displayName || user.firstName || user.email || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  {/* Status indicator for authenticated users */}
                  <span className='absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white'></span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className={`bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-2 px-4 lg:py-3 lg:px-6 rounded-full font-semibold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className='flex items-center gap-4'>
                <Link to='/signin' className='inline-block'>
                  <AnimatedButton className='px-6 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-800 rounded-full transition-all duration-200'>
                    Login
                  </AnimatedButton>
                </Link>
                <Link to='/signup' className='inline-block'>
                  <AnimatedButton className='px-6 py-2.5 text-base font-medium bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all duration-200'>
                    Sign Up
                  </AnimatedButton>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile Dropdown - Only one, properly positioned */}
        <AnimatePresence>
          {profileMenuOpen && user && isAuthenticated && (
            <motion.div
              ref={profileMenuRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ right: '2.5rem', top: '4.5rem' }}
              className='absolute w-96 bg-white/95 backdrop-blur-md border border-neutral-200/50 rounded-3xl shadow-strong z-50 overflow-hidden'
            >
              {/* Profile Header */}
              <div className='p-6 bg-gradient-to-r from-neutral-50 to-primary-50 border-b border-neutral-200/30'>
                <div className='flex items-center gap-4'>
                  <div className='relative'>
                    {user.profilePicture || user.photoURL ? (
                      <img
                        src={user.profilePicture || user.photoURL}
                        alt='User Profile'
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
                      {(user.displayName || user.firstName || user.email || 'U')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    {/* Enhanced status indicator */}
                    <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white shadow-sm'>
                      <div className='w-full h-full bg-success-400 rounded-full animate-ping opacity-75'></div>
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-semibold text-neutral-800 text-lg truncate'>
                      {user.displayName || user.firstName || 'User'}
                    </div>
                    <div className='text-sm text-neutral-500 truncate'>
                      {user.email}
                    </div>
                    <div className='inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-success-100 text-success-700 text-xs font-medium rounded-full'>
                      <div className='w-1.5 h-1.5 bg-success-500 rounded-full'></div>
                      {user.userType === 'host' ? 'Host' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className='py-2'>
                {/* Account Section */}
                <div className='px-2 pb-2'>
                  <div className='text-xs font-semibold text-neutral-400 uppercase tracking-wider px-4 py-2'>
                    Account
                  </div>
                  <button
                    onClick={handleSettingsClick}
                    className='w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2'
                  >
                    <div className='flex items-center justify-center w-9 h-9 bg-neutral-100 group-hover:bg-primary-100 rounded-xl transition-colors duration-200'>
                      <FaCog className='text-neutral-600 group-hover:text-primary-600 text-sm' />
                    </div>
                    <div className='flex-1 text-left'>
                      <div className='font-medium text-sm'>Settings</div>
                      <div className='text-xs text-neutral-500'>
                        Manage preferences
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleBookingsClick}
                    className='w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2'
                  >
                    <div className='flex items-center justify-center w-9 h-9 bg-neutral-100 group-hover:bg-accent-blue-100 rounded-xl transition-colors duration-200'>
                      <FaBook className='text-neutral-600 group-hover:text-accent-blue-600 text-sm' />
                    </div>
                    <div className='flex-1 text-left'>
                      <div className='font-medium text-sm'>My Bookings</div>
                      <div className='text-xs text-neutral-500'>
                        View reservations
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleFavoritesClick}
                    className='w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2'
                  >
                    <div className='flex items-center justify-center w-9 h-9 bg-neutral-100 group-hover:bg-accent-red-100 rounded-xl transition-colors duration-200'>
                      <FaHeart className='text-neutral-600 group-hover:text-accent-red-500 text-sm' />
                    </div>
                    <div className='flex-1 text-left'>
                      <div className='font-medium text-sm'>Favorites</div>
                      <div className='text-xs text-neutral-500'>
                        Saved properties
                      </div>
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className='my-2 mx-6 border-t border-neutral-200/50'></div>

                {/* Quick Actions */}
                <div className='px-2 pb-2'>
                  <div className='text-xs font-semibold text-neutral-400 uppercase tracking-wider px-4 py-2'>
                    Quick Actions
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className={`w-full group flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-2xl mx-2 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className='flex items-center justify-center w-9 h-9 bg-red-100 group-hover:bg-red-200 rounded-xl transition-colors duration-200'>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className='lg:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden'
            >
              <div className='px-4 py-4 space-y-4'>
                {/* Search Bar - Mobile */}
                <div className='relative'>
                  <form onSubmit={handleSearch} className='flex items-center'>
                    <input
                      type='text'
                      placeholder='Search accommodations...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                    />
                    <button
                      type='submit'
                      className='ml-2 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors duration-200'
                    >
                      <CiSearch className='text-xl' />
                    </button>
                  </form>
                </div>

                {/* Navigation Links - Mobile */}
                <div className='space-y-2'>
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={link.action}
                      className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg'
                    >
                      {link.icon}
                      <span className='font-medium'>{link.name}</span>
                    </button>
                  ))}

                  <button
                    onClick={navigateToHost}
                    className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg'
                  >
                    <FaHome />
                    <span className='font-medium'>Become a Host</span>
                  </button>
                </div>

                {/* Authentication Section - Mobile */}
                <div className='pt-4 border-t border-gray-200'>
                  {user && isAuthenticated ? (
                    <div className='space-y-4'>
                      {/* User Profile - Mobile */}
                      <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg'>
                        {user.profilePicture || user.photoURL ? (
                          <img
                            src={user.profilePicture || user.photoURL}
                            alt='User Profile'
                            className='w-10 h-10 rounded-full object-cover'
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className='w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm'
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
                            'U'
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-gray-900 truncate'>
                            {user.displayName || user.firstName || 'User'}
                          </div>
                          <div className='text-sm text-gray-500 truncate'>
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* User Actions - Mobile */}
                      <div className='space-y-2'>
                        <button
                          onClick={handleSettingsClick}
                          className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg'
                        >
                          <FaCog />
                          <span className='font-medium'>Settings</span>
                        </button>

                        <button
                          onClick={handleBookingsClick}
                          className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg'
                        >
                          <FaBook />
                          <span className='font-medium'>My Bookings</span>
                        </button>

                        <button
                          onClick={handleFavoritesClick}
                          className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg'
                        >
                          <FaHeart />
                          <span className='font-medium'>Favorites</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          disabled={loading}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <FaSignOutAlt />
                          <span className='font-medium'>
                            {loading ? 'Logging out...' : 'Sign Out'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      <Link to='/signin' className='block'>
                        <button
                          onClick={() => setMenuOpen(false)}
                          className='w-full px-6 py-3 text-gray-700 hover:text-gray-900 border-2 border-gray-800 rounded-full font-medium transition-all duration-200'
                        >
                          Login
                        </button>
                      </Link>
                      <Link to='/signup' className='block'>
                        <button
                          onClick={() => setMenuOpen(false)}
                          className='w-full px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 transition-all duration-200'
                        >
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
