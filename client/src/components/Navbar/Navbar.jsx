import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { CiSearch } from 'react-icons/ci'
// ...existing code...
import { IoClose } from 'react-icons/io5'
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaHeart,
  FaHome,
  FaBook,
  FaStar,
} from 'react-icons/fa'
import { onAuthStateChanged } from 'firebase/auth'
import { userAuth } from '../../config/firebaseConfig'
import { navigateToHome } from '../../utils/navigation'
import { AnimatedButton } from '../common/AnimatedComponents'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(true)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
    setMenuOpen(false)
  }

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(userAuth, (currentUser) => {
      setUser(currentUser)
    })
    return unsubscribe
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
      await userAuth.signOut()
      setMenuOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleBookingClick = (e) => {
    e.preventDefault()
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/homepage')
      navigate('/signin')
      return
    }
    navigate('/homepage', { state: { smoothScroll: true } })
    setMenuOpen(false)
  }

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search functionality here
      console.log('Searching for:', searchQuery)
      setIsSearching(false)
      setSearchQuery('')
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
            {menuOpen ? <IoClose className='text-2xl text-gray-700' /> : <></>}
          </button>

          {/* Desktop Auth Buttons */}
          <div className='hidden lg:flex items-center gap-4'>
            <AnimatedButton
              onClick={navigateToHost}
              className='px-6 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-full transition-all duration-200'
            >
              Become a Host
            </AnimatedButton>

            {user ? (
              <div className='relative flex items-center gap-4'>
                <button
                  className='w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 overflow-hidden relative focus:outline-none'
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-label='Profile menu'
                >
                  <img
                    src={user.photoURL}
                    alt='User'
                    className='w-full h-full object-cover'
                  />
                  {/* Dot indicator when logged in */}
                  <span className='absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white'></span>
                </button>
                <button
                  onClick={handleLogout}
                  className='bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-2 px-4 lg:py-3 lg:px-6 rounded-full font-semibold text-sm lg:text-base transition-all duration-300 transform hover:scale-105'
                >
                  Logout
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
          {profileMenuOpen && (
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
                    <img
                      src={user.photoURL}
                      alt='User'
                      className='w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-medium'
                    />
                    {/* Enhanced status indicator */}
                    <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white shadow-sm'>
                      <div className='w-full h-full bg-success-400 rounded-full animate-ping opacity-75'></div>
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-semibold text-neutral-800 text-lg truncate'>
                      {user.displayName || 'User'}
                    </div>
                    <div className='text-sm text-neutral-500 truncate'>
                      {user.email}
                    </div>
                    <div className='inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-success-100 text-success-700 text-xs font-medium rounded-full'>
                      <div className='w-1.5 h-1.5 bg-success-500 rounded-full'></div>
                      Active
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
                  <button className='w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2'>
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

                  <button className='w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2'>
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

                  <button className='w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2'>
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

                {/* Logout Section */}
                {/* Logout button removed from dropdown for consistency */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
