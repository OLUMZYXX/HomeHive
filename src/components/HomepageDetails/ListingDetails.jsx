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
// import { use } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// import { getAuth } from 'firebase/auth'
import { IoIosArrowBack } from 'react-icons/io'
import { AiFillHeart } from 'react-icons/ai'
import { userAuth } from '../../../firebaseConfig'

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
  const auth = userAuth
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = userAuth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [auth])
  const navigate = useNavigate()
  const { id } = useParams()
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
        autoClose: 3000, // Closes after 3 seconds
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
          <h2 className='text-2xl font-bold mb-2 text-primary-800'>
            Property not found
          </h2>
          <p className='text-primary-600 mb-4'>
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

      {/* Enhanced Navbar */}
      <div className='bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-50'>
        <div className='flex items-center justify-between mx-auto relative px-4 py-4 md:px-10'>
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

          {/* Enhanced Search Bar (Centered) */}
          <div className='hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 bg-white border-2 border-primary-200 rounded-full px-6 py-3 shadow-soft hover:shadow-medium transition-all duration-300'>
            <input
              type='text'
              placeholder='Start Your Search'
              className='text-primary-800 font-medium text-sm outline-none w-48 bg-transparent placeholder-primary-400'
            />
            <div className='bg-gradient-to-r from-primary-800 to-primary-700 rounded-full p-2 ml-4'>
              <CiSearch className='text-xl text-white w-6 h-6 flex items-center justify-center cursor-pointer' />
            </div>
          </div>

          {/* Enhanced Right Section */}
          <div className='hidden md:flex items-center gap-6'>
            <h1 className='text-lg font-semibold text-primary-700 hover:text-primary-900 cursor-pointer transition-colors duration-300'>
              Become a Host
            </h1>
            <button className='p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
              <RiEarthLine className='text-xl text-primary-600' />
            </button>

            <div className='flex items-center gap-3'>
              <button className='p-3 hover:bg-primary-50 rounded-full transition-all duration-300'>
                <RxHamburgerMenu className='text-xl text-primary-600' />
              </button>

              {user ? (
                <div className='flex items-center gap-4'>
                  <div className='relative'>
                    <img
                      src={user.photoURL}
                      alt='User'
                      className='w-12 h-12 rounded-full object-cover ring-2 ring-primary-200 hover:ring-primary-300 transition-all duration-300'
                    />
                    <div className='absolute -top-1 -right-1 w-4 h-4 bg-accent-green-500 rounded-full border-2 border-white'></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105'
                  >
                    Logout
                  </button>
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

      {/* Enhanced Listing Details */}
      <div className='container mx-auto px-4 md:px-8 mt-8'>
        {/* Enhanced Header Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-6 mb-8'>
          <div className='flex items-center space-x-4 mb-6'>
            <button
              onClick={() => navigate(-1)}
              className='p-3 hover:bg-primary-100 rounded-full transition-all duration-300 border border-primary-200'
            >
              <IoIosArrowBack className='text-2xl text-primary-700' />
            </button>
            <h1 className='font-NotoSans text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
              {home ? home.name : 'Property Details'}
            </h1>
          </div>

          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 bg-accent-amber-50 px-3 py-2 rounded-full'>
                <FaStar className='text-accent-amber-500 text-lg' />
                <span className='font-bold text-primary-800'>
                  {home ? home.rating : '-'}
                </span>
              </div>
              <p className='text-primary-700 font-medium underline hover:text-primary-900 cursor-pointer transition-colors duration-300'>
                {home ? `${home.reviewCount} reviews` : ''}
              </p>
              <p className='text-primary-600 font-medium'>
                {home ? home.location : ''}
              </p>
            </div>

            <div className='flex items-center gap-6'>
              <button className='flex items-center gap-2 bg-white/80 hover:bg-white px-4 py-3 rounded-xl border border-primary-200 hover:border-primary-300 transition-all duration-300 shadow-soft hover:shadow-medium'>
                <FaRegShareFromSquare className='text-primary-600' />
                <span className='font-semibold text-primary-700'>Share</span>
              </button>

              <button
                className='flex items-center gap-2 bg-white/80 hover:bg-white px-4 py-3 rounded-xl border border-primary-200 hover:border-primary-300 transition-all duration-300 shadow-soft hover:shadow-medium'
                onClick={handleClick}
              >
                <div className='relative'>
                  <CiHeart
                    className={`w-6 h-6 text-primary-600 transition-all duration-300 ease-in-out ${
                      isFilled ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <AiFillHeart
                    className={`w-6 h-6 text-error-500 absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                      animating
                        ? 'animate-popup'
                        : isFilled
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                </div>
                <span className='font-semibold text-primary-700'>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Listing Images */}
        {home && (
          <div className='mb-10'>
            <div className='flex flex-col md:flex-row gap-4 rounded-2xl overflow-hidden shadow-strong'>
              {/* Large Image on the Left */}
              <div className='flex-1'>
                <img
                  src={home.image}
                  alt={home.name}
                  className='w-full h-full object-cover min-h-[400px] hover:scale-105 transition-transform duration-500'
                />
              </div>
              {/* Grid of 4 demo images on the Right */}
              <div className='flex-1 grid grid-cols-2 gap-2'>
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

        {/* Enhanced Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10'>
          {/* Left Content - Takes 2 columns */}
          <div className='lg:col-span-2'>
            <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-8'>
              {/* Property Info Section */}
              <div className='flex items-start justify-between mb-8'>
                <div>
                  <h1 className='font-NotoSans text-2xl md:text-3xl font-bold text-primary-800 mb-2'>
                    {home ? home.text : 'Entire Rental unit'}
                  </h1>
                  <p className='text-primary-600 font-medium'>
                    {home ? home.location : ''}
                  </p>
                </div>

                {/* Enhanced Host Info */}
                {hostInfo && (
                  <div className='flex flex-col items-center bg-primary-50 rounded-2xl p-4 border border-primary-200'>
                    <img
                      src={hostInfo.avatar}
                      alt={hostInfo.name}
                      className='w-16 h-16 rounded-full object-cover ring-3 ring-primary-200 mb-2'
                    />
                    <span className='text-sm font-bold text-primary-800'>
                      {hostInfo.name}
                    </span>
                    <span className='text-xs bg-accent-blue-100 text-accent-blue-700 px-2 py-1 rounded-full font-medium'>
                      {hostInfo.badge}
                    </span>
                  </div>
                )}
              </div>

              <hr className='border-primary-200 mb-8' />

              {/* Enhanced Features Section */}
              <div className='space-y-6 mb-8'>
                <div className='flex items-center gap-4 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-3xl text-primary-600 bg-white p-3 rounded-xl shadow-soft'>
                    <IoHomeOutline />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-lg'>
                      {home
                        ? home.category.charAt(0).toUpperCase() +
                          home.category.slice(1)
                        : 'Entire home'}
                    </h3>
                    <p className='text-primary-600'>
                      {home
                        ? home.text
                        : 'You will have the apartment to yourself'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-3xl text-primary-600 bg-white p-3 rounded-xl shadow-soft'>
                    <WiStars />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-lg'>
                      Enhanced Clean
                    </h3>
                    <p className='text-primary-600'>
                      This Host committed to enhanced cleaning process
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-3xl text-primary-600 bg-white p-3 rounded-xl shadow-soft'>
                    <CiMoneyCheck1 />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-lg'>
                      Self check-in
                    </h3>
                    <p className='text-primary-600'>
                      Check yourself in with the keypad
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300'>
                  <div className='text-3xl text-primary-600 bg-white p-3 rounded-xl shadow-soft'>
                    <MdOutlineCalendarToday />
                  </div>
                  <div>
                    <h3 className='font-bold text-primary-800 text-lg'>
                      Free cancellation before Feb 25
                    </h3>
                  </div>
                </div>
              </div>

              <hr className='border-primary-200 mb-8' />

              {/* Enhanced Description */}
              <div className='bg-gradient-to-r from-primary-25 to-neutral-50 p-6 rounded-xl border border-primary-200'>
                <p className='text-primary-700 leading-relaxed'>
                  {home
                    ? `Badge: ${home.badge}`
                    : 'Come and stay in this superb duplex T2, in the heart of the historic center of Bordeaux. Spacious and bright, in a real Bordeaux building in exposed stone, you will enjoy all the charms of the city thanks to its ideal location. Close to many shops, bars and restaurants, you can access the apartment by tram A and C and bus routes 27 and 44'}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Price/Booking Card - Takes 1 column */}
          <div className='lg:col-span-1'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-primary-200 sticky top-24'>
              {/* Enhanced Price & Ratings Section */}
              <div className='flex items-center justify-between mb-6'>
                <h1 className='font-NotoSans text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
                  {home ? `$${home.priceUSD}` : '$75'}
                  <span className='text-lg text-primary-600'>/night</span>
                </h1>
                <div className='flex items-center gap-2 bg-accent-amber-50 px-3 py-2 rounded-full'>
                  <FaStar className='text-accent-amber-500' />
                  <span className='font-bold text-primary-800'>
                    {home ? home.rating : '5.0'}
                  </span>
                  <span className='text-sm text-primary-600'>
                    ({home ? home.reviewCount : '5'})
                  </span>
                </div>
              </div>

              {/* Enhanced Check-in Form */}
              <div className='space-y-4 mb-6'>
                <div className='grid grid-cols-2 gap-2 border-2 border-primary-200 rounded-xl overflow-hidden hover:border-primary-300 transition-colors duration-300'>
                  <div className='p-4 border-r border-primary-200 bg-primary-25 hover:bg-primary-50 transition-colors duration-300'>
                    <label className='text-xs font-bold text-primary-700 uppercase tracking-wide'>
                      Check-in
                    </label>
                    <input
                      type='date'
                      className='w-full mt-1 bg-transparent text-primary-800 font-medium outline-none'
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className='p-4 bg-primary-25 hover:bg-primary-50 transition-colors duration-300'>
                    <label className='text-xs font-bold text-primary-700 uppercase tracking-wide'>
                      Check-out
                    </label>
                    <input
                      type='date'
                      className='w-full mt-1 bg-transparent text-primary-800 font-medium outline-none'
                      value={checkout}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                <div className='border-2 border-primary-200 rounded-xl p-4 bg-primary-25 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300'>
                  <label className='text-xs font-bold text-primary-700 uppercase tracking-wide'>
                    Guests
                  </label>
                  <div className='flex items-center justify-between mt-1'>
                    <input
                      type='number'
                      className='bg-transparent text-primary-800 font-medium outline-none flex-1'
                      placeholder='2 guests'
                      value={guest}
                      onChange={(e) => setGuest(e.target.value)}
                    />
                    <RiArrowDropDownLine className='text-3xl text-primary-600' />
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
                className='w-full bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-4 rounded-xl font-bold text-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mb-4'
                onClick={handleReservation}
              >
                Reserve
              </button>

              <p className='text-sm text-primary-600 text-center mb-6'>
                You won't be charged yet
              </p>

              {/* Enhanced Amenities */}
              {home && (
                <div>
                  <h3 className='font-bold text-primary-800 mb-4'>
                    What's included
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {home.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className='bg-primary-100 hover:bg-primary-200 text-primary-800 px-3 py-2 rounded-full text-sm font-semibold transition-colors duration-300 cursor-default'
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
        <div className='flex items-center justify-end mb-8'>
          <button className='flex items-center gap-3 text-primary-600 hover:text-primary-800 transition-colors duration-300 bg-white/80 hover:bg-white px-4 py-3 rounded-xl border border-primary-200 hover:border-primary-300 shadow-soft hover:shadow-medium'>
            <FaRegFlag className='text-lg' />
            <span className='font-semibold'>Report this Listing</span>
          </button>
        </div>

        {/* Enhanced Bedroom Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-8 mb-10'>
          <h2 className='font-NotoSans text-3xl font-bold text-primary-800 mb-6'>
            Where you'll sleep
          </h2>
          <div className='flex flex-col md:flex-row gap-6 items-start'>
            <img
              src={bedroom}
              alt='bedroom'
              className='w-full md:w-96 h-64 object-cover rounded-2xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02]'
            />
            <div className='flex-1'>
              <h3 className='font-bold text-2xl text-primary-800 mb-2'>
                Bedroom
              </h3>
              <p className='text-primary-600 font-medium'>1 queen size bed</p>
            </div>
          </div>
        </div>

        {/* Enhanced Amenities Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-8 mb-10'>
          <h2 className='font-NotoSans text-3xl font-bold text-primary-800 mb-8'>
            What this place offers
          </h2>

          {/* Enhanced Grid Layout for Amenities */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaWifi className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>Wifi</p>
            </div>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaShower className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>Shower</p>
            </div>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaBath className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>Bath</p>
            </div>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaTv className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>TV</p>
            </div>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaBed className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>Bed</p>
            </div>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaCar className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>Car</p>
            </div>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaParking className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>Parking</p>
            </div>
            <div className='flex items-center gap-3 p-4 bg-primary-25 rounded-xl hover:bg-primary-50 transition-colors duration-300 border border-primary-200'>
              <FaUtensils className='text-2xl text-primary-600' />
              <p className='font-medium text-primary-800'>Kitchen</p>
            </div>
          </div>
        </div>

        {/* Enhanced Location Section */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft p-8 mb-10'>
          <h2 className='font-NotoSans text-3xl font-bold text-primary-800 mb-6'>
            Where you'll be
          </h2>

          <div className='rounded-2xl overflow-hidden shadow-medium border border-primary-200 mb-6'>
            {mapSrc && (
              <iframe
                src={mapSrc}
                width='100%'
                height='400px'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Map location'
                className='hover:opacity-90 transition-opacity duration-300'
              />
            )}
          </div>

          <div className='bg-gradient-to-r from-primary-25 to-neutral-50 p-6 rounded-xl border border-primary-200'>
            <h3 className='font-NotoSans text-2xl font-bold text-primary-800 mb-3'>
              {home ? home.location : 'Location'}
            </h3>
            <p className='text-primary-700 leading-relaxed'>
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
        className='mt-16'
      />

      <Footer />
    </div>
  )
}

export default ListingDetails
