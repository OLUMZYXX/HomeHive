import 'react'
import HomeHiveLogo from '../../assets/HomeHiveLogo'

import { FaCheck, FaChevronDown } from 'react-icons/fa'
import { useEffect, useState, useRef } from 'react'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { HiArrowRight, HiShieldCheck, HiStar, HiHome } from 'react-icons/hi'
import { FaSignOutAlt } from 'react-icons/fa'
import review from '../../assets/3d review.png'
import sync from '../../assets/sync2.png'
import search from '../../assets/searchvisible.png'
import img from '../../assets/livning room.jpg'
import img2 from '../../assets/home.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { hostAuth } from '../../config/firebaseConfig'
import { useAPI } from '../../contexts/APIContext'
import { toast } from '../../utils/toast.jsx'
import { motion, AnimatePresence } from 'framer-motion'

const Host = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  // Get API context for authentication
  const {
    user: apiUser,
    isAuthenticated,
    logout: apiLogout,
    loading,
  } = useAPI()

  const faqs = [
    {
      question: 'How does Homehive work?',
      answer: (
        <div className='space-y-4'>
          <p className='text-primary-600 leading-relaxed'>
            Homehive makes it easy for homeowners to list their properties and
            connect with guests. Here's how:
          </p>
          <div className='grid gap-4'>
            <div className='bg-primary-50 rounded-xl p-4'>
              <h4 className='font-bold text-primary-900 mb-2'>
                1. Create Your Listing
              </h4>
              <p className='text-primary-700'>
                Register, add photos, descriptions, and set your pricing.
              </p>
            </div>
            <div className='bg-primary-50 rounded-xl p-4'>
              <h4 className='font-bold text-primary-900 mb-2'>
                2. Set Preferences
              </h4>
              <p className='text-primary-700'>
                Choose availability, house rules, and booking preferences.
              </p>
            </div>
            <div className='bg-primary-50 rounded-xl p-4'>
              <h4 className='font-bold text-primary-900 mb-2'>
                3. Start Hosting
              </h4>
              <p className='text-primary-700'>
                Go live and start receiving bookings with secure payments.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      question: 'What happens if my property is damaged by a guest?',
      answer: (
        <p className='text-primary-600 leading-relaxed'>
          If a guest causes damage to your property, you have the option to
          request a damage deposit. This deposit acts as a safeguard, ensuring
          guests take responsibility for their stay. You can report issues using
          our misconduct reporting feature for assistance in resolving matters.
        </p>
      ),
    },
    {
      question: 'When will my home or property go online?',
      answer: (
        <p className='text-primary-600 leading-relaxed'>
          After completing your listing, you can make your property available
          for bookings immediately. In some cases, verification may be required
          before accepting reservations. During this process, you can explore
          our platform and get everything ready for your first guests.
        </p>
      ),
    },
  ]

  const benefits = [
    {
      title: 'Damage Protection',
      description:
        'Your property is covered in case of unexpected damages, ensuring peace of mind while hosting.',
    },
    {
      title: 'Set Your Own House Rules',
      description:
        'Clearly define your house rules—guests must agree before booking, giving you full control.',
    },
    {
      title: 'Flexible Booking Options',
      description:
        'Choose between instant bookings for quick reservations or manual approvals for more control.',
    },
    {
      title: 'Liability Coverage',
      description:
        'Get protection against liability claims from guests and neighbors, covering up to €/£/$1,000,000 per stay.',
    },
    {
      title: 'Secure & Reliable Payments',
      description:
        'Receive fast, fraud-protected payouts with our secure payment system, ensuring your earnings are safe.',
    },
    {
      title: 'Verified Guests',
      description:
        'We verify guest emails and payment details to ensure reliable and trustworthy bookings.',
    },
    {
      title: '24/7 Host Support',
      description:
        'Access round-the-clock support and manage your listings easily via our Homehive partner app.',
    },
  ]

  const features = [
    {
      icon: review,
      title: 'Showcase Your Reviews',
      description:
        'Bring your existing reviews with you! We import ratings from other platforms, so your listing starts with credibility.',
    },
    {
      icon: sync,
      title: 'Effortless Property Sync',
      description:
        'Easily import your property details and keep your availability automatically synced across platforms to prevent double bookings.',
    },
    {
      icon: search,
      title: 'Boost Your Visibility',
      description:
        'New hosts get a "Fresh Listing" badge, helping you stand out and attract more bookings.',
    },
  ]

  const testimonials = [
    {
      name: 'Emily Roberts',
      location: 'France-based host',
      text: 'The exposure my property got was amazing! I had bookings lined up faster than I expected, and the experience has been fantastic.',
      image: img,
    },
    {
      name: 'Nathan Kim',
      location: 'South Korea-based host',
      text: "I was worried about double bookings, but Homehive's sync feature worked flawlessly. My first guest booked within hours!",
      image: img2,
    },
    {
      name: 'Sophia Martinez',
      location: 'Spain-based host',
      text: 'I never imagined getting bookings so fast! Homehive made the process seamless, and I was hosting in no time.',
      image: img2,
    },
    {
      name: 'Liam Chen',
      location: 'Australia-based host',
      text: 'The platform is user-friendly, and syncing my calendar was a breeze. I had my first guest within the same day!',
      image: img,
    },
    {
      name: 'Olivia Dube',
      location: 'Canada-based host',
      text: 'Homehive made everything so simple. From listing to payments, the entire process was smooth, and I felt supported throughout.',
      image: img,
    },
    {
      name: 'Alex Carter',
      location: 'U.S.-based host',
      text: 'Setting up my listing was incredibly easy. Within an hour, I had multiple inquiries and my first confirmed guest!',
      image: img2,
    },
  ]

  useEffect(() => {
    // Check if we have an authenticated host from the API context
    if (apiUser && isAuthenticated && apiUser.userType === 'host') {
      setUser(apiUser)
    } else {
      // Fallback to Firebase auth for backward compatibility
      const unsubscribe = hostAuth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser && !apiUser) {
          setUser(firebaseUser)
        } else if (!firebaseUser && !apiUser) {
          setUser(null)
        }
      })
      return () => unsubscribe()
    }
  }, [apiUser, isAuthenticated])

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

  const hostSignIn = () => {
    setProfileMenuOpen(false)
    navigate('/hostlogin')
  }

  const hostSignUp = () => {
    setProfileMenuOpen(false)
    navigate('/host-signup')
  }

  const handleLogout = async () => {
    try {
      if (apiUser && isAuthenticated) {
        // Use API logout for authenticated users
        await apiLogout()
        toast.success('Logged out successfully')
      } else {
        // Fallback to Firebase logout
        await hostAuth.signOut()
      }
      setUser(null)
      setProfileMenuOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1'></div>
        </div>

        {/* Navbar */}
        <nav
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-primary-900/95 backdrop-blur-md shadow-strong'
              : 'bg-transparent'
          }`}
        >
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl py-4'>
            <div className='flex items-center justify-between'>
              <div
                className='flex items-center gap-3 cursor-pointer'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <HomeHiveLogo className='w-12 h-12 sm:w-16 sm:h-16 object-contain transition-transform duration-200 group-hover:scale-105' />
                <h1 className='font-NotoSans text-2xl lg:text-3xl font-bold text-white'>
                  Homehive
                </h1>
              </div>

              <div className='hidden md:flex items-center gap-4'>
                {user ? (
                  <div className='relative flex items-center gap-3'>
                    {/* User Profile Button */}
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className='flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300'
                    >
                      {user.photoURL || user.profilePicture ? (
                        <img
                          src={user.photoURL || user.profilePicture}
                          alt='Host Profile'
                          className='w-8 h-8 rounded-full object-cover'
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className='w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white font-semibold text-sm'
                        style={{
                          display:
                            user.photoURL || user.profilePicture
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
                      <div className='text-left'>
                        <div className='text-white text-sm font-medium'>
                          {user.displayName || user.firstName || 'Host'}
                        </div>
                        <div className='text-white/70 text-xs'>
                          Host Dashboard
                        </div>
                      </div>
                      <FaChevronDown className='text-white/70 text-xs' />
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
                          className='absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-strong z-50 overflow-hidden'
                        >
                          {/* User Info Section */}
                          <div className='px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100'>
                            <div className='flex items-center gap-3'>
                              <div className='relative'>
                                {user.photoURL || user.profilePicture ? (
                                  <img
                                    src={user.photoURL || user.profilePicture}
                                    alt='Host Profile'
                                    className='w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-medium'
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                      e.target.nextSibling.style.display =
                                        'flex'
                                    }}
                                  />
                                ) : null}
                                <div
                                  className='w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white shadow-medium'
                                  style={{
                                    display:
                                      user.photoURL || user.profilePicture
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
                                navigate('/host-dashboard')
                                setProfileMenuOpen(false)
                              }}
                              className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-900 transition-colors duration-200'
                            >
                              <div className='w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center'>
                                <HiHome className='text-primary-600 text-sm' />
                              </div>
                              <div className='flex-1 text-left'>
                                <div className='font-medium text-sm'>
                                  Dashboard
                                </div>
                                <div className='text-xs text-gray-500'>
                                  Manage properties
                                </div>
                              </div>
                            </button>

                            <button
                              onClick={handleLogout}
                              disabled={loading}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 group ${
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
                    {/* Host Login Button */}
                    <button
                      onClick={hostSignIn}
                      className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-white font-semibold hover:bg-white/20 transition-all duration-300'
                    >
                      Host Login
                    </button>

                    {/* Create Host Account Button */}
                    <button
                      onClick={hostSignUp}
                      className='bg-white text-primary-800 px-6 py-2 rounded-full font-semibold hover:bg-primary-50 transition-all duration-300'
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className='relative container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl pt-32 pb-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <div className='text-center lg:text-left space-y-8'>
              <div>
                <h1 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6'>
                  List your
                  <span className='block text-transparent bg-gradient-to-r from-primary-200 to-white bg-clip-text'>
                    Property
                  </span>
                  on Homehive
                </h1>
                <p className='text-xl lg:text-2xl text-primary-100 leading-relaxed'>
                  Whether hosting is your side hustle or your main business,
                  list your home on Homehive today and start earning
                  effortlessly.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <button
                  onClick={hostSignIn}
                  className='group bg-white text-primary-800 font-bold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3'
                >
                  Get Started Today
                  <HiArrowRight className='text-lg group-hover:translate-x-1 transition-transform duration-300' />
                </button>
              </div>
            </div>

            {/* Right Registration Card */}
            <div className='bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-strong border border-primary-200'>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-2xl font-bold text-primary-900 mb-4'>
                    Registration is Free
                  </h3>
                  <div className='space-y-3 text-primary-700'>
                    <div className='flex items-center gap-3'>
                      <FaCheck className='text-success-600 text-sm' />
                      <span>
                        45% of hosts get their first booking within a week
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <FaCheck className='text-success-600 text-sm' />
                      <span>
                        Choose between instant bookings and booking requests
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <FaCheck className='text-success-600 text-sm' />
                      <span>We'll facilitate payments for you</span>
                    </div>
                  </div>
                </div>

                <div className='border-t border-primary-200 pt-6'>
                  <h4 className='text-xl font-bold text-primary-900 mb-4'>
                    What you'll need
                  </h4>
                  <div className='space-y-2 text-primary-700'>
                    <p>• A clear photo of your property</p>
                    <p>• A clear photo of yourself</p>
                  </div>
                </div>

                <button
                  onClick={hostSignIn}
                  className='w-full bg-primary-800 hover:bg-primary-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3'
                >
                  Get Started
                  <MdOutlineArrowRightAlt className='text-xl' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-neutral-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-soft'>
              <HiShieldCheck className='text-primary-600 text-sm' />
              <span className='text-sm font-medium text-primary-700'>
                Host Protection
              </span>
            </div>
            <h2 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-800 mb-6'>
              List with
              <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text ml-3'>
                Peace of Mind
              </span>
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-primary-100'
              >
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <FaCheck className='text-success-600 text-lg' />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-primary-900 mb-2'>
                      {benefit.title}
                    </h3>
                    <p className='text-primary-600 leading-relaxed'>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center'>
            <button
              onClick={hostSignIn}
              className='bg-primary-800 hover:bg-primary-900 text-white font-bold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105'
            >
              List Your Property with Homehive
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-br from-neutral-100 to-primary-100'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl'>
          <div className='text-center mb-16'>
            <h2 className='font-NotoSans text-4xl sm:text-5xl font-bold text-primary-800 mb-6'>
              Get Noticed from Day One
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 text-center border border-primary-100'
              >
                <div className='w-32 h-32 mx-auto mb-6 flex items-center justify-center'>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className='w-full h-full object-contain'
                  />
                </div>
                <h3 className='text-xl font-bold text-primary-900 mb-4'>
                  {feature.title}
                </h3>
                <p className='text-primary-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className='text-center'>
            <button className='bg-primary-800 hover:bg-primary-900 text-white font-bold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105'>
              Import Your Listings
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-neutral-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-soft'>
              <HiStar className='text-amber-500 text-sm' />
              <span className='text-sm font-medium text-primary-700'>
                Host Stories
              </span>
            </div>
            <h2 className='font-NotoSans text-4xl sm:text-5xl font-bold text-primary-800 mb-6'>
              Real Stories from Homehive Hosts
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className='bg-white rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-primary-100'
              >
                <p className='text-primary-600 italic mb-6 leading-relaxed'>
                  "{testimonial.text}"
                </p>
                <div className='flex items-center gap-4'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                  <div>
                    <h4 className='font-bold text-primary-900'>
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-primary-600'>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center'>
            <button
              onClick={hostSignIn}
              className='bg-primary-800 hover:bg-primary-900 text-white font-bold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105'
            >
              Join Homehive Hosts
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-br from-neutral-100 to-primary-100'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl'>
          <div className='text-center mb-16'>
            <h2 className='font-NotoSans text-4xl sm:text-5xl font-bold text-primary-800 mb-6'>
              Your Questions Answered
            </h2>
          </div>

          <div className='max-w-4xl mx-auto space-y-6 mb-12'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl shadow-soft border border-primary-100 overflow-hidden'
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className='w-full px-6 py-6 text-left flex items-center justify-between hover:bg-primary-50 transition-colors duration-300'
                >
                  <h3 className='text-lg font-bold text-primary-900'>
                    {faq.question}
                  </h3>
                  <FaChevronDown
                    className={`text-primary-600 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-screen' : 'max-h-0'
                  }`}
                >
                  <div className='px-6 pb-6 border-t border-primary-100'>
                    <div className='pt-4'>{faq.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center space-y-6'>
            <p className='text-primary-600'>
              Still have questions? Find answers on our{' '}
              <Link
                to='/faq'
                className='text-primary-800 font-semibold hover:text-primary-900 transition-colors duration-300'
              >
                FAQ page
              </Link>
            </p>
            <button
              onClick={hostSignIn}
              className='bg-primary-800 hover:bg-primary-900 text-white font-bold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105'
            >
              Start Welcoming Guests
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className='bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16 lg:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='text-center lg:text-left'>
              <h2 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6'>
                List your property and start
                <span className='block text-transparent bg-gradient-to-r from-primary-200 to-white bg-clip-text'>
                  hosting with ease
                </span>
              </h2>
            </div>

            <div className='bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-strong'>
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-primary-900'>
                  Ready to Get Started?
                </h3>
                <div className='space-y-3 text-primary-700'>
                  <div className='flex items-center gap-3'>
                    <FaCheck className='text-success-600' />
                    <span>Registration is completely free</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FaCheck className='text-success-600' />
                    <span>45% of hosts get bookings within a week</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FaCheck className='text-success-600' />
                    <span>Secure payment processing included</span>
                  </div>
                </div>
                <button
                  onClick={hostSignIn}
                  className='w-full bg-primary-800 hover:bg-primary-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3'
                >
                  Get Started Now
                  <HiArrowRight className='text-xl' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-primary-900 text-white py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-screen-md xl:max-w-screen-xl'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>Explore</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    to='/trust-safety'
                    className='text-primary-200 hover:text-white transition-colors duration-300'
                  >
                    Trust and Safety
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-4'>Useful Links</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    to='/android'
                    className='text-primary-200 hover:text-white transition-colors duration-300'
                  >
                    Download for Android
                  </Link>
                </li>
                <li>
                  <Link
                    to='/ios'
                    className='text-primary-200 hover:text-white transition-colors duration-300'
                  >
                    Download for iOS
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-4'>Help and Communities</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    to='/partner-help'
                    className='text-primary-200 hover:text-white transition-colors duration-300'
                  >
                    Partner Help
                  </Link>
                </li>
                <li>
                  <Link
                    to='/community'
                    className='text-primary-200 hover:text-white transition-colors duration-300'
                  >
                    Partner Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-primary-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='text-primary-200 text-sm'>
              <Link
                to='/about'
                className='hover:text-white transition-colors duration-300 mr-4'
              >
                About us
              </Link>
              <Link
                to='/privacy'
                className='hover:text-white transition-colors duration-300'
              >
                Privacy and Cookie statement
              </Link>
            </div>
            <div className='text-primary-200 text-sm'>
              © 2025 Homehive. All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Host
