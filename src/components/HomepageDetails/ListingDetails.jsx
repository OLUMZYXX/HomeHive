// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { CiSearch } from 'react-icons/ci'
import livingroom from '../../assets/livning room.jpg'
import bedroom from '../../assets/bedroom.jpg'
import dining from '../../assets/dining.jpg'
import kitchen from '../../assets/kitchen.jpg'
import home from '../../assets/homeexterior.jpg'
import { RiEarthLine } from 'react-icons/ri'
import { RxHamburgerMenu } from 'react-icons/rx'
import {
  FaBath,
  FaBed,
  FaCar,
  FaParking,
  FaRegUserCircle,
  FaShower,
  FaTv,
  FaUtensils,
  FaWifi,
} from 'react-icons/fa'
import { FaStar } from 'react-icons/fa'
import { FaRegShareFromSquare } from 'react-icons/fa6'
import { CiHeart } from 'react-icons/ci'
import { IoHomeOutline } from 'react-icons/io5'
import { WiStars } from 'react-icons/wi'
import { CiMoneyCheck1 } from 'react-icons/ci'
import { MdOutlineCalendarToday } from 'react-icons/md'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { FaRegFlag } from 'react-icons/fa6'
import Footer from '../Footer/Footer'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import { AiFillHeart } from 'react-icons/ai'
import { userAuth } from '../../../firebaseConfig'
import { navigateToHome } from '../../utils/navigation'
import useScrollToTop from '../../hooks/useScrollToTop'

const listingData = [
  {
    id: 1,
    name: 'Luxury Banana Island Villa',
    location: 'Banana Island, Lagos',
    text: '4-6 guests · Entire Villa · 5 beds · 3 bath',
    amenities: ['Wifi', 'Kitchen', 'Free Parking', 'Pool', 'Security'],
    rating: 4.9,
    reviewCount: 312,
    priceUSD: 325,
    image: livingroom,
    badge: 'Superhost',
    category: 'luxury',
  },
  {
    id: 2,
    name: 'Modern Lekki Apartment',
    location: 'Lekki Phase 1, Lagos',
    text: '2-4 guests · Entire Apartment · 3 beds · 2 bath',
    amenities: ['Wifi', 'Kitchen', 'Gym', 'Security'],
    rating: 4.8,
    reviewCount: 156,
    priceUSD: 180,
    image: home,
    badge: 'Popular',
    category: 'apartment',
  },
  {
    id: 3,
    name: 'Cozy Victoria Island Studio',
    location: 'Victoria Island, Lagos',
    text: '1-2 guests · Studio · 1 bed · 1 bath',
    amenities: ['Wifi', 'Kitchen', 'AC'],
    rating: 4.7,
    reviewCount: 89,
    priceUSD: 120,
    image: bedroom,
    badge: 'Great Value',
    category: 'studio',
  },
]

const ListingDetails = () => {
  // Use scroll to top hook
  useScrollToTop()

  const auth = userAuth
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = userAuth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [auth])
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  // Smart navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
  }
  // Parse id safely
  const homeId = parseInt(id, 10)
  const home = listingData.find((l) => l.id === homeId)
  // Host info (for demo)
  const hostInfo = home
    ? {
        name:
          home.category === 'luxury'
            ? 'Adaobi Okafor'
            : home.category === 'apartment'
            ? 'Chinedu Balogun'
            : 'Tolu Adebayo',
        avatar:
          'https://randomuser.me/api/portraits/men/' + (home.id + 10) + '.jpg',
        badge: home.badge,
      }
    : null
  // Map location (for demo)
  const mapSrc = home
    ? home.location.includes('Banana Island')
      ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.0162195101557!2d3.4312!3d6.4541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4e2e2e2e2e2%3A0x514be3c08c83e989!2sBanana%20Island!5e0!3m2!1sen!2sng!4v1739368327046!5m2!1sen!2sng'
      : home.location.includes('Lekki')
      ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.0162195101557!2d3.4846!3d6.4361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4e2e2e2e2e2%3A0x514be3c08c83e989!2sLekki%20Phase%201!5e0!3m2!1sen!2sng!4v1739368327046!5m2!1sen!2sng'
      : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.0162195101557!2d3.4196!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4e2e2e2e2e2%3A0x514be3c08c83e989!2sVictoria%20Island!5e0!3m2!1sen!2sng!4v1739368327046!5m2!1sen!2sng'
    : ''
  const handleLogout = async () => {
    await userAuth.signOut(userAuth)
  }
  const [checkIn, setCheckIn] = useState('')
  const [checkout, setCheckOut] = useState('')
  const [guest, setGuest] = useState('')
  const [error, setError] = useState('')
  const [isFilled, setIsFilled] = useState(false)
  const [animating, setIsAnimating] = useState(false)
  const handleClick = () => {
    if (!isFilled) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
        setIsFilled(true)
      }, 300)
    } else {
      setIsFilled(false)
    }
  }

  const handleReservation = () => {
    if (!checkIn || !checkout || !guest) {
      toast.error('Please fill in check-in, check-out, and number of guests.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    toast.success(`Reservation successful! 🎉 `, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => navigate('/cart'),
    })
    setCheckIn('')
    setCheckOut('')
    setGuest('')
    setError('')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-25 via-neutral-50 to-primary-100'>
      {/* Fallback if home not found */}
      {!home && (
        <div className='px-4 py-10 text-center bg-white rounded-2xl shadow-medium mx-4 mt-10'>
          <h2 className='text-xl md:text-2xl font-bold mb-2 text-primary-800'>
            Property not found
          </h2>
          <p className='text-primary-600 mb-4 text-sm md:text-base'>
            The listing you requested does not exist.
          </p>
          <button
            className='bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105'
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      )}

      {/* Enhanced Mobile-First Navbar */}
      <div className='bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-50'>
        <div className='flex items-center justify-between px-4 py-3 md:px-10 md:py-4'>
          {/* Mobile: Logo and Title */}
          <div className='flex items-center gap-2 md:gap-4'>
            <HomeHiveLogo
              className='w-12 h-12 sm:w-16 sm:h-16 object-contain transition-transform duration-200 group-hover:scale-105 cursor-pointer'
              alt='Homehive Logo'
              onClick={handleHomeNavigation}
            />
            <h1
              className='font-NotoSans text-lg md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity duration-300'
              onClick={handleHomeNavigation}
            >
              Homehive
            </h1>
          </div>

          {/* Desktop: Search Bar (Hidden on mobile) */}
          <div className='hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2 bg-white border-2 border-primary-200 rounded-full px-6 py-3 shadow-soft hover:shadow-medium transition-all duration-300'>
            <input
              type='text'
              placeholder='Start Your Search'
              className='text-primary-800 font-medium text-sm outline-none w-48 bg-transparent placeholder-primary-400'
            />
            <div className='bg-gradient-to-r from-primary-800 to-primary-700 rounded-full p-2 ml-4'>
              <CiSearch className='text-xl text-white w-6 h-6 flex items-center justify-center cursor-pointer' />
            </div>
          </div>

          {/* Mobile: Hamburger + User (Simplified) */}
          <div className='flex items-center gap-2 md:hidden'>
            <button className='p-2 hover:bg-primary-50 rounded-full transition-all duration-300'>
              <RxHamburgerMenu className='text-xl text-primary-600' />
            </button>
            {user ? (
              <img
                src={user.photoURL}
                alt='User'
                className='w-8 h-8 rounded-full object-cover ring-2 ring-primary-200'
              />
            ) : (
              <button className='p-2 hover:bg-primary-50 rounded-full transition-all duration-300'>
                <FaRegUserCircle className='text-xl text-primary-600' />
              </button>
            )}
          </div>

          {/* Desktop: Full Right Section */}
          <div className='hidden md:flex items-center gap-4 lg:gap-6'>
            <h1 className='text-base lg:text-lg font-semibold text-primary-700 hover:text-primary-900 cursor-pointer transition-colors duration-300'>
              Become a Host
            </h1>
            <button className='p-2 lg:p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
              <RiEarthLine className='text-lg lg:text-xl text-primary-600' />
            </button>

            <div className='flex items-center gap-3'>
              <button className='p-2 lg:p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
                <RxHamburgerMenu className='text-lg lg:text-xl text-primary-600' />
              </button>

              {user ? (
                <div className='flex items-center gap-3 lg:gap-4'>
                  <div className='relative'>
                    <img
                      src={user.photoURL}
                      alt='User'
                      className='w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-primary-200 hover:ring-primary-300 transition-all duration-300'
                    />
                    <div className='absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-accent-green-500 rounded-full border-2 border-white'></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-2 px-4 lg:py-3 lg:px-6 rounded-full font-semibold text-sm lg:text-base transition-all duration-300 transform hover:scale-105'
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button className='p-2 lg:p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
                  <FaRegUserCircle className='text-xl lg:text-2xl text-primary-600' />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Below navbar on mobile) */}
        <div className='md:hidden px-4 pb-3'>
          <div className='flex items-center bg-white border-2 border-primary-200 rounded-full px-4 py-2 shadow-soft'>
            <input
              type='text'
              placeholder='Start Your Search'
              className='text-primary-800 font-medium text-sm outline-none flex-1 bg-transparent placeholder-primary-400'
            />
            <div className='bg-gradient-to-r from-primary-800 to-primary-700 rounded-full p-2 ml-2'>
              <CiSearch className='text-white w-4 h-4' />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Listing Details */}
      <div className='max-w-[1400px] mx-auto px-4 mt-4 md:mt-8'>
        {/* Enhanced Header Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft p-4 md:p-6 mb-6 md:mb-8'>
          <div className='flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6'>
            <button
              onClick={() => navigate(-1)}
              className='p-2 md:p-3 hover:bg-primary-100 rounded-full transition-all duration-300 border border-primary-200'
            >
              <IoIosArrowBack className='text-xl md:text-2xl text-primary-700' />
            </button>
            <h1 className='font-NotoSans text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent line-clamp-2'>
              {home ? home.name : 'Property Details'}
            </h1>
          </div>

          {/* Mobile: Stack vertically */}
          <div className='space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6'>
            <div className='flex flex-wrap items-center gap-3 md:gap-4'>
              <div className='flex items-center gap-2 bg-accent-amber-50 px-3 py-2 rounded-full'>
                <FaStar className='text-accent-amber-500 text-sm md:text-lg' />
                <span className='font-bold text-primary-800 text-sm md:text-base'>
                  {home ? home.rating : '-'}
                </span>
              </div>
              <p className='text-primary-700 font-medium underline hover:text-primary-900 cursor-pointer transition-colors duration-300 text-sm md:text-base'>
                {home ? `${home.reviewCount} reviews` : ''}
              </p>
              <p className='text-primary-600 font-medium text-sm md:text-base'>
                {home ? home.location : ''}
              </p>
            </div>

            <div className='flex items-center gap-3 md:gap-6'>
              <button className='flex items-center gap-2 bg-white/80 hover:bg-white px-3 md:px-4 py-2 md:py-3 rounded-xl border border-primary-200 hover:border-primary-300 transition-all duration-300 shadow-soft hover:shadow-medium'>
                <FaRegShareFromSquare className='text-primary-600 text-sm md:text-base' />
                <span className='font-semibold text-primary-700 text-sm md:text-base'>
                  Share
                </span>
              </button>

              <button
                className='flex items-center gap-2 bg-white/80 hover:bg-white px-3 md:px-4 py-2 md:py-3 rounded-xl border border-primary-200 hover:border-primary-300 transition-all duration-300 shadow-soft hover:shadow-medium'
                onClick={handleClick}
              >
                <div className='relative'>
                  <CiHeart
                    className={`w-5 h-5 md:w-6 md:h-6 text-primary-600 transition-all duration-300 ease-in-out ${
                      isFilled ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <AiFillHeart
                    className={`w-5 h-5 md:w-6 md:h-6 text-error-500 absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                      animating
                        ? 'animate-popup'
                        : isFilled
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                </div>
                <span className='font-semibold text-primary-700 text-sm md:text-base'>
                  Save
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Listing Images */}
        {home && (
          <div className='mb-8 md:mb-10'>
            <div className='flex flex-col md:flex-row gap-2 md:gap-4 rounded-xl md:rounded-2xl overflow-hidden shadow-strong'>
              {/* Large Image on the Left */}
              <div className='flex-1'>
                <img
                  src={home.image}
                  alt={home.name}
                  className='w-full h-64 md:h-full object-cover min-h-[300px] md:min-h-[400px] hover:scale-105 transition-transform duration-500'
                />
              </div>
              {/* Grid of 4 demo images on the Right - Hidden on small mobile */}
              <div className='hidden sm:grid flex-1 grid-cols-2 gap-2'>
                <img
                  src={bedroom}
                  alt='Bedroom'
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                />
                <img
                  src={dining}
                  alt='Dining'
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                />
                <img
                  src={kitchen}
                  alt='Kitchen'
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                />
                <img
                  src={home.image}
                  alt={home.name}
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Main Content Grid - Mobile First */}
        <div className='space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 mb-10'>
          {/* Left Content - Takes 2 columns on desktop */}
          <div className='lg:col-span-2'>
            <div className='bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft p-6 md:p-8'>
              {/* Property Info Section */}
              <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0'>
                <div className='flex-1'>
                  <h1 className='font-NotoSans text-xl md:text-2xl lg:text-3xl font-bold text-primary-800 mb-2'>
                    {home ? home.text : 'Entire Rental unit'}
                  </h1>
                  <p className='text-primary-600 font-medium text-sm md:text-base'>
                    {home ? home.location : ''}
                  </p>
                </div>

                {/* Enhanced Host Info - Stack on mobile */}
                {hostInfo && (
                  <div className='flex md:flex-col items-center md:items-center bg-primary-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-primary-200 self-start'>
                    <img
                      src={hostInfo.avatar}
                      alt={hostInfo.name}
                      className='w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-2 md:ring-3 ring-primary-200 mr-3 md:mr-0 md:mb-2'
                    />
                    <div className='text-left md:text-center'>
                      <span className='text-sm md:text-sm font-bold text-primary-800 block'>
                        {hostInfo.name}
                      </span>
                      <span className='text-xs bg-accent-blue-100 text-accent-blue-700 px-2 py-1 rounded-full font-medium'>
                        {hostInfo.badge}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <hr className='border-primary-200 mb-6 md:mb-8' />

              {/* Enhanced Features Section */}
              <div className='space-y-4 md:space-y-6 mb-6 md:mb-8'>
                <div className='flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-2xl md:text-3xl text-primary-600 bg-white p-2 md:p-3 rounded-xl shadow-soft'>
                    <IoHomeOutline />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-base md:text-lg'>
                      {home
                        ? home.category.charAt(0).toUpperCase() +
                          home.category.slice(1)
                        : 'Entire home'}
                    </h3>
                    <p className='text-primary-600 text-sm md:text-base'>
                      {home
                        ? home.text
                        : 'You will have the apartment to yourself'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-2xl md:text-3xl text-primary-600 bg-white p-2 md:p-3 rounded-xl shadow-soft'>
                    <WiStars />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-base md:text-lg'>
                      Enhanced Clean
                    </h3>
                    <p className='text-primary-600 text-sm md:text-base'>
                      This Host committed to enhanced cleaning process
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-2xl md:text-3xl text-primary-600 bg-white p-2 md:p-3 rounded-xl shadow-soft'>
                    <CiMoneyCheck1 />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-base md:text-lg'>
                      Self check-in
                    </h3>
                    <p className='text-primary-600 text-sm md:text-base'>
                      Check yourself in with the keypad
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-2xl md:text-3xl text-primary-600 bg-white p-2 md:p-3 rounded-xl shadow-soft'>
                    <MdOutlineCalendarToday />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-base md:text-lg'>
                      Free cancellation before Feb 25
                    </h3>
                  </div>
                </div>
              </div>

              <hr className='border-primary-200 mb-6 md:mb-8' />

              {/* Enhanced Description */}
              <div className='bg-gradient-to-r from-primary-25 to-neutral-50 p-4 md:p-6 rounded-xl border border-primary-200'>
                <p className='text-primary-700 leading-relaxed text-sm md:text-base'>
                  {home
                    ? `Badge: ${home.badge}`
                    : 'Come and stay in this superb duplex T2, in the heart of the historic center of Bordeaux. Spacious and bright, in a real Bordeaux building in exposed stone, you will enjoy all the charms of the city thanks to its ideal location. Close to many shops, bars and restaurants, you can access the apartment by tram A and C and bus routes 27 and 44'}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Price/Booking Card - Full width on mobile */}
          <div className='lg:col-span-1'>
            <div className='bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-strong p-4 md:p-6 border border-primary-200 lg:sticky lg:top-24'>
              {/* Enhanced Price & Ratings Section */}
              <div className='flex items-center justify-between mb-4 md:mb-6'>
                <h1 className='font-NotoSans text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
                  {home ? `$${home.priceUSD}` : '$75'}
                  <span className='text-sm md:text-lg text-primary-600'>
                    /night
                  </span>
                </h1>
                <div className='flex items-center gap-2 bg-accent-amber-50 px-2 md:px-3 py-1 md:py-2 rounded-full'>
                  <FaStar className='text-accent-amber-500 text-sm md:text-base' />
                  <span className='font-bold text-primary-800 text-sm md:text-base'>
                    {home ? home.rating : '5.0'}
                  </span>
                  <span className='text-xs md:text-sm text-primary-600'>
                    ({home ? home.reviewCount : '5'})
                  </span>
                </div>
              </div>

              {/* Enhanced Check-in Form */}
              <div className='space-y-3 md:space-y-4 mb-4 md:mb-6'>
                <div className='grid grid-cols-2 gap-1 md:gap-2 border-2 border-primary-200 rounded-xl overflow-hidden hover:border-primary-300 transition-colors duration-300'>
                  <div className='p-3 md:p-4 bg-primary-25 hover:bg-primary-50 transition-colors duration-300'>
                    <label className='text-xs font-bold text-primary-700 uppercase tracking-wide'>
                      Check-in
                    </label>
                    <input
                      type='date'
                      className='w-full mt-1 bg-transparent text-primary-800 font-medium outline-none text-sm md:text-base'
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className='p-3 md:p-4 bg-primary-25 hover:bg-primary-50 transition-colors duration-300'>
                    <label className='text-xs font-bold text-primary-700 uppercase tracking-wide'>
                      Check-out
                    </label>
                    <input
                      type='date'
                      className='w-full mt-1 bg-transparent text-primary-800 font-medium outline-none text-sm md:text-base'
                      value={checkout}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                <div className='border-2 border-primary-200 rounded-xl p-3 md:p-4 bg-primary-25 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300'>
                  <label className='text-xs font-bold text-primary-700 uppercase tracking-wide'>
                    Guests
                  </label>
                  <div className='flex items-center justify-between mt-1'>
                    <input
                      type='number'
                      className='bg-transparent text-primary-800 font-medium outline-none flex-1 text-sm md:text-base'
                      placeholder='2 guests'
                      value={guest}
                      onChange={(e) => setGuest(e.target.value)}
                    />
                    <RiArrowDropDownLine className='text-2xl md:text-3xl text-primary-600' />
                  </div>
                </div>
              </div>

              {error && (
                <div className='bg-error-50 border border-error-200 rounded-xl p-3 mb-4'>
                  <p className='text-error-700 text-sm font-medium'>{error}</p>
                </div>
              )}

              {/* Enhanced Reservation Button */}
              <button
                className='w-full bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mb-3 md:mb-4'
                onClick={handleReservation}
              >
                Reserve
              </button>

              <p className='text-sm text-primary-600 text-center mb-4 md:mb-6'>
                You won't be charged yet
              </p>

              {/* Enhanced Amenities */}
              {home && (
                <div>
                  <h3 className='font-bold text-primary-800 mb-3 md:mb-4 text-sm md:text-base'>
                    What's included
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {home.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className='bg-primary-100 hover:bg-primary-200 text-primary-800 px-2 md:px-3 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-colors duration-300 cursor-default'
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Report Section */}
        <div className='flex items-center justify-center md:justify-end mb-6 md:mb-8'>
          <button className='flex items-center gap-2 md:gap-3 text-primary-600 hover:text-primary-800 transition-colors duration-300 bg-white/80 hover:bg-white px-3 md:px-4 py-2 md:py-3 rounded-xl border border-primary-200 hover:border-primary-300 shadow-soft hover:shadow-medium'>
            <FaRegFlag className='text-base md:text-lg' />
            <span className='font-semibold text-sm md:text-base'>
              Report this Listing
            </span>
          </button>
        </div>

        {/* Enhanced Bedroom Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft p-6 md:p-8 mb-8 md:mb-10'>
          <h2 className='font-NotoSans text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6'>
            Where you'll sleep
          </h2>
          <div className='flex flex-col md:flex-row gap-4 md:gap-6 items-start'>
            <img
              src={bedroom}
              alt='bedroom'
              className='w-full md:w-96 h-48 md:h-64 object-cover rounded-xl md:rounded-2xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02]'
            />
            <div className='flex-1'>
              <h3 className='font-bold text-xl md:text-2xl text-primary-800 mb-2'>
                Bedroom
              </h3>
              <p className='text-primary-600 font-medium text-sm md:text-base'>
                1 queen size bed
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Amenities Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft p-6 md:p-8 mb-8 md:mb-10'>
          <h2 className='font-NotoSans text-2xl md:text-3xl font-bold text-primary-800 mb-6 md:mb-8'>
            What this place offers
          </h2>

          {/* Enhanced Grid Layout for Amenities - Mobile responsive */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6'>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaWifi className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                Wifi
              </p>
            </div>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaShower className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                Shower
              </p>
            </div>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaBath className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                Bath
              </p>
            </div>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaTv className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                TV
              </p>
            </div>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaBed className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                Bed
              </p>
            </div>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaCar className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                Car
              </p>
            </div>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaParking className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                Parking
              </p>
            </div>
            <div className='flex items-center gap-3 p-3 md:p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaUtensils className='text-xl md:text-2xl text-primary-600 flex-shrink-0' />
              <p className='font-medium text-primary-800 text-sm md:text-base'>
                Kitchen
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Location Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft p-6 md:p-8 mb-8 md:mb-10'>
          <h2 className='font-NotoSans text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6'>
            Where you'll be
          </h2>

          <div className='rounded-xl md:rounded-2xl overflow-hidden shadow-medium border border-primary-200 mb-4 md:mb-6'>
            {mapSrc && (
              <iframe
                src={mapSrc}
                width='100%'
                height='300'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Map location'
                className='hover:opacity-90 transition-opacity duration-300 md:h-96'
              />
            )}
          </div>

          <div className='bg-gradient-to-r from-primary-25 to-neutral-50 p-4 md:p-6 rounded-xl border border-primary-200'>
            <h3 className='font-NotoSans text-lg md:text-2xl font-bold text-primary-800 mb-2 md:mb-3'>
              {home ? home.location : 'Location'}
            </h3>
            <p className='text-primary-700 leading-relaxed text-sm md:text-base'>
              {home
                ? `Explore the vibrant area of ${home.location}. Enjoy local attractions, restaurants, and more! This location offers excellent access to public transportation, shopping centers, and entertainment venues.`
                : 'Location details not available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Toast Container */}
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
        className='mt-16 md:mt-20'
      />

      <Footer />
    </div>
  )
}

export default ListingDetails
