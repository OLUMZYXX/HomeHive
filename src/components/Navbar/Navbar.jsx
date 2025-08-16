import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { CiSearch } from 'react-icons/ci'
import { RxHamburgerMenu } from 'react-icons/rx'
import { IoClose } from 'react-icons/io5'
import { onAuthStateChanged } from 'firebase/auth'
import { userAuth } from '../../../firebaseConfig'
import { navigateToHome } from '../../utils/navigation'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(true)

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
    {
      name: 'Home',
      action: handleHomeNavigation,
    },
    { name: 'Accommodations', action: () => scrollToSection('accomodation') },
    { name: 'Testimonials', action: () => scrollToSection('testimonial') },
    { name: 'Bookings', action: handleBookingClick },
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
                        className='text-gray-700 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap'
                      >
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
              <RxHamburgerMenu className='text-2xl text-gray-700' />
            )}
          </button>

          {/* Desktop Auth Buttons */}
          <div className='hidden lg:flex items-center gap-4'>
            <button
              onClick={navigateToHost}
              className='px-6 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-full transition-all duration-200 hover:scale-105'
            >
              Become a Host
            </button>

            {user ? (
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden'>
                  <img
                    src={user.photoURL}
                    alt='User'
                    className='w-full h-full object-cover'
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className='px-6 py-2.5 text-base font-medium bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all duration-200 hover:scale-105'
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <Link
                  to='/signin'
                  className='px-6 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-800 rounded-full transition-all duration-200 hover:scale-105'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  className='px-6 py-2.5 text-base font-medium bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all duration-200 hover:scale-105'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className='lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg'>
            <div className='p-6'>
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className='mb-6'>
                <div className='flex items-center bg-gray-50 rounded-full border-2 border-gray-200 px-4 py-3'>
                  <input
                    type='text'
                    placeholder='Search accommodations...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='flex-1 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none'
                  />
                  <button type='submit' className='ml-2 p-1'>
                    <CiSearch className='text-xl text-gray-600' />
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <ul className='space-y-4 mb-6'>
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={link.action}
                      className='block w-full text-left text-lg font-medium text-gray-700 hover:text-gray-900 py-2'
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      navigateToHost()
                      setMenuOpen(false)
                    }}
                    className='block w-full text-left text-lg font-medium text-gray-700 hover:text-gray-900 py-2'
                  >
                    Become a Host
                  </button>
                </li>
              </ul>

              {/* Mobile Auth Buttons */}
              <div className='space-y-3 pt-4 border-t border-gray-200'>
                {user ? (
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3 py-2'>
                      <div className='w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden'>
                        <img
                          src={user.photoURL}
                          alt='User'
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <span className='text-gray-700 font-medium'>
                        Welcome back!
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className='w-full text-center text-lg font-medium bg-gray-800 text-white py-3 px-6 rounded-full hover:bg-gray-900 transition-colors duration-200'
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <Link
                      to='/signin'
                      onClick={() => setMenuOpen(false)}
                      className='block w-full text-center text-lg font-medium text-gray-700 border-2 border-gray-800 py-3 px-6 rounded-full hover:bg-gray-50 transition-colors duration-200'
                    >
                      Login
                    </Link>
                    <Link
                      to='/signup'
                      onClick={() => setMenuOpen(false)}
                      className='block w-full text-center text-lg font-medium bg-gray-800 text-white py-3 px-6 rounded-full hover:bg-gray-900 transition-colors duration-200'
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
