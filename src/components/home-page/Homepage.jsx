import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FaRegUserCircle,
  FaStar,
  FaHeart,
  FaShare,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaHome,
  FaUsers,
  FaCalendarAlt,
} from 'react-icons/fa'
import { HiLocationMarker, HiHome, HiSparkles } from 'react-icons/hi'
import { RiEarthLine } from 'react-icons/ri'
import { RxHamburgerMenu } from 'react-icons/rx'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import Footer from '../Footer/Footer'
import { navigateToHome } from '../../utils/navigation'
import useScrollToTop from '../../hooks/useScrollToTop'

const Homepage = () => {
  // Use scroll to top hook
  useScrollToTop()

  const navigate = useNavigate()
  const location = useLocation()

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
  }

  // Fetch currency rates from a free API
  useEffect(() => {
    async function fetchRates() {
      try {
        // Using ExchangeRate.host (free, no API key required)
        const res = await fetch(
          'https://api.exchangerate.host/latest?base=USD&symbols=USD,NGN,GBP'
        )
        const data = await res.json()
        if (data && data.rates) {
          setExchangeRates({
            USD: data.rates.USD,
            NGN: data.rates.NGN,
            GBP: data.rates.GBP,
          })
        }
      } catch (err) {
        console.error('Failed to fetch currency rates', err)
      }
    }
    fetchRates()
  }, [])
  const [user, setUser] = useState(null)

  // Simulate user sign-in for demo
  const handleSignIn = () => {
    setUser({
      displayName: 'Akinwumi',
      photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    })
  }
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [favorites, setFavorites] = useState(new Set())
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)

  // Currency conversion rates
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    NGN: 1650,
    GBP: 0.79,
  })

  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ]

  const selectedCurrencyData = currencies.find(
    (curr) => curr.code === selectedCurrency
  )

  // Convert base USD price to selected currency
  const convertPrice = (usdPrice) => {
    const rate = exchangeRates[selectedCurrency] || 1
    const converted = Math.round(usdPrice * rate)
    if (selectedCurrency === 'NGN') return converted.toLocaleString()
    return converted.toString()
  }

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCurrencyDropdown && !event.target.closest('.currency-selector')) {
        setShowCurrencyDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showCurrencyDropdown])

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
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
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
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
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
      image:
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      badge: 'Great Value',
      category: 'studio',
    },
  ]

  const filters = [
    { id: 'all', name: 'All', icon: HiHome },
    { id: 'luxury', name: 'Luxury', icon: HiSparkles },
    { id: 'apartment', name: 'Apartments', icon: HiHome },
    { id: 'studio', name: 'Studios', icon: HiHome },
  ]

  const handleLogout = async () => {
    console.log('Logout clicked')
  }

  const handleClick = (listingId) => {
    navigate(`/listing/${listingId}`)
  }

  const hostNav = () => {
    console.log('Navigate to host page')
  }

  const reloadHomepage = () => {
    console.log('Reload homepage')
  }

  const toggleFavorite = (listingId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId)
    } else {
      newFavorites.add(listingId)
    }
    setFavorites(newFavorites)
  }

  const filteredListings =
    activeFilter === 'all'
      ? listingData
      : listingData.filter((listing) => listing.category === activeFilter)

  return (
    <div className='bg-white min-h-screen overflow-x-hidden'>
      {/* Enhanced Mobile-First Navbar */}
      <nav className='bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-50'>
        <div className='container mx-auto px-3 sm:px-6 lg:px-8 py-3 lg:py-4'>
          <div className='flex items-center justify-between gap-2 sm:gap-6'>
            {/* Logo - Mobile Optimized */}
            <div
              className='flex items-center gap-2 sm:gap-4 cursor-pointer group flex-shrink-0'
              onClick={handleHomeNavigation}
            >
              <HomeHiveLogo
                className='w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm'
                alt='Homehive Logo'
              />
              <h1 className='font-NotoSans text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 bg-clip-text text-transparent'>
                Homehive
              </h1>
            </div>

            {/* Enhanced Search Bar - Desktop with glassmorphism */}
            <div className='hidden lg:flex items-center bg-white/90 backdrop-blur-sm border-2 border-primary-200 rounded-2xl shadow-soft hover:shadow-medium hover:border-primary-300 transition-all duration-400 max-w-3xl flex-1 mx-8'>
              <div className='flex items-center flex-1'>
                {/* Where Section */}
                <div className='flex-1 px-6 py-4 border-r border-primary-200 hover:bg-primary-25/80 transition-colors duration-300 rounded-l-2xl'>
                  <div className='text-xs font-bold text-primary-700 mb-1 uppercase tracking-wide'>
                    Where
                  </div>
                  <input
                    type='text'
                    placeholder='Search destinations'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full bg-transparent text-primary-800 placeholder-primary-400 focus:outline-none text-sm font-medium'
                  />
                </div>

                {/* Check in Section */}
                <div className='px-6 py-4 border-r border-primary-200 hover:bg-primary-25/80 transition-colors duration-300 min-w-0 flex-shrink-0'>
                  <div className='text-xs font-bold text-primary-700 mb-1 uppercase tracking-wide'>
                    Check in
                  </div>
                  <div className='text-primary-500 text-sm font-medium whitespace-nowrap'>
                    Add dates
                  </div>
                </div>

                {/* Guests Section */}
                <div className='px-6 py-4 hover:bg-primary-25/80 transition-colors duration-300 rounded-r-2xl min-w-0 flex-shrink-0'>
                  <div className='text-xs font-bold text-primary-700 mb-1 uppercase tracking-wide'>
                    Guests
                  </div>
                  <div className='text-primary-500 text-sm font-medium whitespace-nowrap'>
                    Add guests
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className='p-2'>
                <button className='bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white p-4 rounded-xl shadow-medium transition-all duration-300 transform hover:scale-105 active:scale-95'>
                  <FaSearch className='text-lg' />
                </button>
              </div>
            </div>

            {/* Right Side - Mobile Optimized */}
            <div className='flex items-center gap-1 sm:gap-3 lg:gap-4 flex-shrink-0'>
              {/* Become a Host - Hidden on small screens */}
              <button
                onClick={hostNav}
                className='hidden md:block text-primary-700 hover:text-primary-900 hover:bg-white/80 font-semibold py-3 px-5 rounded-xl border border-transparent hover:border-primary-200 transition-all duration-300 whitespace-nowrap backdrop-blur-sm'
              >
                Become a Host
              </button>

              {/* Language Globe - Hidden on mobile */}
              <button className='hidden sm:block p-2 lg:p-3 hover:bg-white/80 rounded-xl transition-all duration-300 border border-transparent hover:border-primary-200 backdrop-blur-sm'>
                <RiEarthLine className='text-lg lg:text-xl text-primary-600' />
              </button>

              {/* Enhanced Currency Selector - Mobile Optimized */}
              <div className='relative currency-selector'>
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className='flex items-center gap-1 sm:gap-3 bg-white/80 backdrop-blur-sm border-2 border-primary-200 hover:border-primary-300 hover:bg-white/90 rounded-xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-300 shadow-soft hover:shadow-medium'
                >
                  <span className='font-bold text-primary-800 text-sm sm:text-lg'>
                    {selectedCurrencyData?.symbol}
                  </span>
                  <span className='hidden sm:block text-sm font-semibold text-primary-700'>
                    {selectedCurrency}
                  </span>
                  <FaChevronDown
                    className={`text-primary-600 text-xs transition-transform duration-300 ${
                      showCurrencyDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Enhanced Currency Dropdown with glassmorphism */}
                {showCurrencyDropdown && (
                  <div className='absolute top-full right-0 mt-3 w-48 sm:w-64 bg-white/95 backdrop-blur-md border-2 border-primary-200 rounded-2xl shadow-strong z-50 overflow-hidden animate-slideDown'>
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setSelectedCurrency(currency.code)
                          setShowCurrencyDropdown(false)
                        }}
                        className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 hover:bg-primary-50/80 transition-all duration-300 text-left border-b border-primary-100 last:border-b-0 ${
                          selectedCurrency === currency.code
                            ? 'bg-primary-100/80 border-primary-200'
                            : ''
                        }`}
                      >
                        <span className='text-lg sm:text-xl font-bold text-primary-800 w-6 sm:w-8 text-center'>
                          {currency.symbol}
                        </span>
                        <div className='flex-1'>
                          <div className='font-bold text-primary-900 text-sm'>
                            {currency.code}
                          </div>
                          <div className='text-xs text-primary-600 font-medium'>
                            {currency.name}
                          </div>
                        </div>
                        {selectedCurrency === currency.code && (
                          <div className='w-2 h-2 bg-primary-800 rounded-full'></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced User Menu - Mobile Optimized */}
              <div className='flex items-center gap-1 sm:gap-3'>
                <button className='p-2 lg:p-3 hover:bg-white/80 rounded-full transition-all duration-300 backdrop-blur-sm'>
                  <RxHamburgerMenu className='text-lg lg:text-xl text-primary-600' />
                </button>

                {user ? (
                  <div className='flex items-center gap-2 sm:gap-4'>
                    {/* User Profile Image - Mobile Optimized */}
                    <div className='relative'>
                      <img
                        src={user.photoURL}
                        alt='User Profile'
                        className='w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-primary-200 hover:ring-primary-300 transition-all duration-300 shadow-soft'
                      />
                      <div className='absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-accent-green-500 rounded-full border-2 border-white shadow-soft'></div>
                    </div>

                    {/* Logout Button - Hidden on mobile */}
                    <button
                      onClick={handleLogout}
                      className='hidden lg:flex items-center gap-2 bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 shadow-medium hover:shadow-strong transform hover:scale-105 active:scale-95'
                    >
                      <span>Logout</span>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className='flex items-center gap-2 sm:gap-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-4 py-2 sm:py-3 transition-all duration-300 cursor-pointer border border-primary-200 hover:border-primary-300 shadow-soft hover:shadow-medium'
                  >
                    <FaRegUserCircle className='text-lg sm:text-2xl text-primary-600' />
                    <span className='hidden sm:block text-sm font-semibold text-primary-700'>
                      Sign in
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Search Bar - Better Responsive Design */}
          <div className='lg:hidden mt-3 space-y-3'>
            {/* Main Search Input */}
            <div className='flex items-center bg-white/90 backdrop-blur-sm border-2 border-primary-200 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300'>
              <div className='flex-1 px-4 py-3'>
                <input
                  type='text'
                  placeholder='Where are you going?'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full bg-transparent text-primary-800 placeholder-primary-400 focus:outline-none font-medium'
                />
              </div>
              <button className='bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 text-white p-3 rounded-xl m-2 transition-all duration-300'>
                <FaSearch className='text-base' />
              </button>
            </div>

            {/* Quick Action Buttons - Mobile Only */}
            <div className='flex items-center gap-2 overflow-x-auto pb-1'>
              <button className='flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-primary-200 rounded-xl px-3 py-2 transition-all duration-300 hover:shadow-soft whitespace-nowrap flex-shrink-0'>
                <FaCalendarAlt className='text-primary-600 text-sm' />
                <span className='text-sm font-medium text-primary-700'>
                  Dates
                </span>
              </button>
              <button className='flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-primary-200 rounded-xl px-3 py-2 transition-all duration-300 hover:shadow-soft whitespace-nowrap flex-shrink-0'>
                <FaUsers className='text-primary-600 text-sm' />
                <span className='text-sm font-medium text-primary-700'>
                  Guests
                </span>
              </button>
              <button className='flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-primary-200 rounded-xl px-3 py-2 transition-all duration-300 hover:shadow-soft whitespace-nowrap flex-shrink-0'>
                <FaFilter className='text-primary-600 text-sm' />
                <span className='text-sm font-medium text-primary-700'>
                  Filters
                </span>
              </button>
              {/* Mobile Currency Quick Access */}
              <button className='sm:hidden flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-primary-200 rounded-xl px-3 py-2 transition-all duration-300 hover:shadow-soft whitespace-nowrap flex-shrink-0'>
                <span className='font-bold text-primary-800 text-sm'>
                  {selectedCurrencyData?.symbol}
                </span>
                <span className='text-sm font-medium text-primary-700'>
                  {selectedCurrency}
                </span>
              </button>
              {/* Mobile Host Button */}
              <button
                onClick={hostNav}
                className='md:hidden flex items-center gap-2 bg-primary-800 text-white rounded-xl px-3 py-2 transition-all duration-300 hover:bg-primary-900 whitespace-nowrap flex-shrink-0'
              >
                <FaHome className='text-sm' />
                <span className='text-sm font-medium'>Host</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className='w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8'>
        <div className='flex flex-col xl:flex-row gap-6 lg:gap-8'>
          {/* Left Content */}
          <div className='flex-1 min-w-0'>
            {/* Header with Filters */}
            <div className='mb-6'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4'>
                <div>
                  <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1'>
                    Available Properties
                  </h1>
                  <p className='text-sm sm:text-base text-primary-600'>
                    {filteredListings.length} amazing places to stay
                  </p>
                </div>

                <button className='flex items-center gap-2 border border-primary-200 rounded-full px-3 py-2 hover:border-primary-300 transition-colors duration-300 text-sm'>
                  <FaFilter className='text-primary-600 text-xs' />
                  <span className='font-medium text-primary-700'>Filters</span>
                </button>
              </div>

              {/* Category Filters - No Horizontal Scroll */}
              <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-2'>
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium min-w-0 ${
                      activeFilter === filter.id
                        ? 'bg-primary-800 text-white shadow-md'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    }`}
                  >
                    <filter.icon className='text-sm flex-shrink-0' />
                    <span className='truncate'>{filter.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            <div className='space-y-4 sm:space-y-6'>
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className='bg-white border border-primary-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 transform hover:-translate-y-1'
                >
                  <div className='flex flex-col lg:flex-row'>
                    {/* Image */}
                    <div className='lg:w-2/5 relative group'>
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className='w-full h-48 sm:h-56 lg:h-72 object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105'
                        onClick={() => handleClick(listing.id)}
                      />

                      {/* Badge */}
                      <div className='absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-primary-800 shadow-md'>
                        {listing.badge}
                      </div>

                      {/* Action Buttons */}
                      <div className='absolute top-3 right-3 flex gap-2'>
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                            favorites.has(listing.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/90 text-primary-600 hover:bg-white'
                          }`}
                        >
                          <FaHeart className='text-sm' />
                        </button>
                        <button className='w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:bg-white transition-all duration-300'>
                          <FaShare className='text-sm' />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className='lg:w-3/5 p-4 sm:p-6 lg:p-8 flex flex-col justify-between'>
                      <div className='space-y-3'>
                        <div>
                          <div className='flex items-center gap-1.5 mb-2'>
                            <HiLocationMarker className='text-primary-500 text-sm' />
                            <span className='text-primary-600 font-medium text-sm'>
                              {listing.location}
                            </span>
                          </div>
                          <h2
                            className='text-lg sm:text-xl lg:text-2xl font-bold text-primary-900 cursor-pointer hover:text-primary-800 transition-colors duration-300 leading-tight'
                            onClick={() => handleClick(listing.id)}
                          >
                            {listing.name}
                          </h2>
                        </div>

                        <p className='text-primary-600 text-sm sm:text-base leading-relaxed'>
                          {listing.text}
                        </p>

                        {/* Amenities */}
                        <div className='flex flex-wrap gap-1.5'>
                          {listing.amenities
                            .slice(0, 4)
                            .map((amenity, index) => (
                              <span
                                key={index}
                                className='bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium'
                              >
                                {amenity}
                              </span>
                            ))}
                          {listing.amenities.length > 4 && (
                            <span className='bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium'>
                              +{listing.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className='flex items-center justify-between mt-4 pt-3 border-t border-primary-100'>
                        <div className='flex items-center gap-2 sm:gap-3'>
                          <div className='flex items-center gap-1'>
                            <FaStar className='text-amber-400 text-sm' />
                            <span className='font-bold text-primary-900 text-sm'>
                              {listing.rating}
                            </span>
                          </div>
                          <span className='text-primary-600 text-xs sm:text-sm'>
                            ({listing.reviewCount} reviews)
                          </span>
                        </div>

                        <div className='text-right'>
                          <div className='text-lg sm:text-xl lg:text-2xl font-black text-primary-900'>
                            {selectedCurrencyData?.symbol}
                            {convertPrice(listing.priceUSD)}
                          </div>
                          <div className='text-primary-600 text-xs sm:text-sm'>
                            per night
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className='text-center mt-8 sm:mt-12'>
              <button className='bg-primary-800 hover:bg-primary-900 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 text-sm sm:text-base'>
                Load More Properties
              </button>
            </div>
          </div>

          {/* Right Sidebar - Map */}
          <div className='xl:w-2/5'>
            <div className='sticky top-24'>
              <div className='bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-soft'>
                <div className='p-6 border-b border-primary-100'>
                  <h3 className='text-xl font-bold text-primary-900 mb-2'>
                    Explore the Area
                  </h3>
                  <p className='text-primary-600'>
                    See all properties on the map
                  </p>
                </div>
                <div className='relative'>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.6254076347154!2d3.3792057!3d6.4281395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1640000000000!5m2!1sen!2sng'
                    width='100%'
                    height='500'
                    style={{ border: 0 }}
                    allowFullScreen
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    className='w-full'
                  ></iframe>

                  <div className='absolute top-4 left-4 right-4 flex justify-between'>
                    <button className='bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-primary-800 font-semibold shadow-md hover:bg-white transition-all duration-300'>
                      Show list
                    </button>
                    <button className='bg-primary-800 hover:bg-primary-900 text-white px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300'>
                      Search this area
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Homepage
