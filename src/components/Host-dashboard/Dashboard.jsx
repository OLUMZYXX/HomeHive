import React, { useState } from 'react'
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
  FaHotTub,
  FaParking,
  FaShieldAlt,
  FaWheelchair,
  FaPlus,
  FaMinus,
  FaCheck,
  FaBuilding,
  FaWarehouse,
  FaBed,
  FaCouch,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronDown,
  FaGlobe,
} from 'react-icons/fa'
import {
  HiHome,
  HiOfficeBuilding,
  HiLocationMarker,
  HiPhotograph,
  HiClipboardList,
  HiCog,
  HiOutlineChartBar,
} from 'react-icons/hi'

import PropTypes from 'prop-types'

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
        className='w-full p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-300 bg-white hover:bg-primary-25 flex items-center justify-between'
      >
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>{selectedCurrencyData?.flag}</span>
          <div className='text-left'>
            <div className='font-bold text-primary-800 flex items-center gap-2'>
              {selectedCurrencyData?.symbol} {selectedCurrencyData?.code}
            </div>
            <div className='text-sm text-primary-600'>
              {selectedCurrencyData?.name}
            </div>
          </div>
        </div>
        <FaChevronDown
          className={`text-primary-400 transition-transform duration-300 ${
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
                className={`w-full p-4 rounded-xl transition-all duration-300 hover:bg-primary-50 flex items-center gap-3 text-left ${
                  selectedCurrency === currency.code
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'border-2 border-transparent'
                }`}
              >
                <span className='text-2xl'>{currency.flag}</span>
                <div className='flex-1'>
                  <div className='font-bold text-primary-800 flex items-center gap-2'>
                    {currency.symbol} {currency.code}
                    {selectedCurrency === currency.code && (
                      <FaCheck className='text-primary-500 text-sm' />
                    )}
                  </div>
                  <div className='text-sm text-primary-600 mb-1'>
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
  const [activeTab, setActiveTab] = useState('overview')
  const [currentStep, setCurrentStep] = useState(1)
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
    pricePerNight: '',
    currency: 'NGN',
  })

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  const handleCurrencyChange = (currencyCode) => {
    setFormData((prev) => ({
      ...prev,
      currency: currencyCode,
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-8'>
            <div>
              <h3 className='text-2xl font-bold text-primary-800 mb-6'>
                What type of property do you have?
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        propertyType: type.id,
                      }))
                    }
                    className={`p-6 border-2 rounded-2xl transition-all duration-300 text-left hover:shadow-medium ${
                      formData.propertyType === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className='flex items-center gap-4'>
                      <div
                        className={`p-3 rounded-xl ${
                          formData.propertyType === type.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-primary-100 text-primary-600'
                        }`}
                      >
                        <type.icon className='text-2xl' />
                      </div>
                      <div>
                        <h4 className='font-bold text-primary-800 text-lg'>
                          {type.name}
                        </h4>
                        <p className='text-primary-600 text-sm'>
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className='text-2xl font-bold text-primary-800 mb-6'>
                What will guests have access to?
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                {placeTypes.map((place) => (
                  <button
                    key={place.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, placeType: place.id }))
                    }
                    className={`p-6 border-2 rounded-2xl transition-all duration-300 text-left hover:shadow-medium ${
                      formData.placeType === place.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className='flex items-center gap-4'>
                      <div
                        className={`p-3 rounded-xl ${
                          formData.placeType === place.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-primary-100 text-primary-600'
                        }`}
                      >
                        <place.icon className='text-2xl' />
                      </div>
                      <div>
                        <h4 className='font-bold text-primary-800 text-lg'>
                          {place.name}
                        </h4>
                        <p className='text-primary-600 text-sm'>
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-white p-6 rounded-2xl border border-primary-200'>
                <label className='block text-sm font-bold text-primary-700 mb-2'>
                  Bedrooms
                </label>
                <div className='flex items-center gap-4'>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bedrooms: Math.max(1, prev.bedrooms - 1),
                      }))
                    }
                    className='p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaMinus className='text-primary-600' />
                  </button>
                  <span className='text-2xl font-bold text-primary-800 w-8 text-center'>
                    {formData.bedrooms}
                  </span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bedrooms: prev.bedrooms + 1,
                      }))
                    }
                    className='p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaPlus className='text-primary-600' />
                  </button>
                </div>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200'>
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
                    className='p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaMinus className='text-primary-600' />
                  </button>
                  <span className='text-2xl font-bold text-primary-800 w-8 text-center'>
                    {formData.bathrooms}
                  </span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bathrooms: prev.bathrooms + 1,
                      }))
                    }
                    className='p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaPlus className='text-primary-600' />
                  </button>
                </div>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200'>
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
                    className='p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaMinus className='text-primary-600' />
                  </button>
                  <span className='text-2xl font-bold text-primary-800 w-8 text-center'>
                    {formData.maxGuests}
                  </span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        maxGuests: prev.maxGuests + 1,
                      }))
                    }
                    className='p-2 border border-primary-300 rounded-full hover:bg-primary-50'
                  >
                    <FaPlus className='text-primary-600' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='space-y-8'>
            <div>
              <h3 className='text-2xl font-bold text-primary-800 mb-6'>
                Share photos of your space
              </h3>
              <div className='border-2 border-dashed border-primary-300 rounded-2xl p-8 text-center bg-primary-25 hover:bg-primary-50 transition-colors duration-300'>
                <FaCamera className='text-5xl text-primary-400 mx-auto mb-4' />
                <h4 className='text-xl font-bold text-primary-800 mb-2'>
                  Upload your photos
                </h4>
                <p className='text-primary-600 mb-4'>
                  Choose at least 5 photos that showcase your space
                </p>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                  id='photo-upload'
                />
                <label
                  htmlFor='photo-upload'
                  className='inline-block bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-primary-900 transition-colors duration-300'
                >
                  Choose Photos
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
                  {formData.images.map((image, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className='w-full h-32 object-cover rounded-xl'
                      />
                      <button className='absolute top-2 right-2 bg-error-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <FaTrash className='text-sm' />
                      </button>
                    </div>
                  ))}
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
                className='w-full p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-primary-700 mb-2'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Describe your space, what makes it special, and what guests can expect...'
                rows={6}
                className='w-full p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 resize-none'
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className='space-y-8'>
            <div>
              <h3 className='text-2xl font-bold text-primary-800 mb-6'>
                Where is your place located?
              </h3>
              <div className='bg-white p-6 rounded-2xl border border-primary-200'>
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
                  className='w-full p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 mb-4'
                />

                <div className='bg-primary-25 border-2 border-primary-200 rounded-xl h-64 flex items-center justify-center'>
                  <div className='text-center'>
                    <FaMapMarkerAlt className='text-4xl text-primary-400 mx-auto mb-2' />
                    <p className='text-primary-600'>
                      Interactive map will appear here
                    </p>
                    <p className='text-sm text-primary-500'>
                      Drag the pin to your exact location
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-2xl font-bold text-primary-800 mb-6'>
                What amenities do you offer?
              </h3>

              {['Popular', 'Standout', 'Safety', 'Unique'].map((category) => (
                <div key={category} className='mb-8'>
                  <h4 className='text-lg font-bold text-primary-700 mb-4'>
                    {category} amenities
                  </h4>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {amenities
                      .filter((amenity) => amenity.category === category)
                      .map((amenity) => (
                        <button
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-medium ${
                            formData.amenities.includes(amenity.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-primary-200 bg-white hover:border-primary-300'
                          }`}
                        >
                          <div className='flex flex-col items-center text-center'>
                            <div
                              className={`p-3 rounded-xl mb-2 ${
                                formData.amenities.includes(amenity.id)
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-primary-100 text-primary-600'
                              }`}
                            >
                              <amenity.icon className='text-xl' />
                            </div>
                            <span className='text-sm font-medium text-primary-800'>
                              {amenity.name}
                            </span>
                            {formData.amenities.includes(amenity.id) && (
                              <FaCheck className='text-primary-500 mt-1' />
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
          <div className='space-y-8'>
            {/* Enhanced Currency Selector */}
            <div>
              <h3 className='text-2xl font-bold text-primary-800 mb-6'>
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
              <h3 className='text-2xl font-bold text-primary-800 mb-6'>
                Set your price
              </h3>
              <div className='bg-white p-6 rounded-2xl border border-primary-200'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl border border-primary-200'>
                    <span className='text-2xl'>
                      {
                        currencies.find((c) => c.code === formData.currency)
                          ?.flag
                      }
                    </span>
                    <span className='font-bold text-primary-800'>
                      {
                        currencies.find((c) => c.code === formData.currency)
                          ?.code
                      }
                    </span>
                  </div>
                  <span className='text-primary-600 font-medium'>
                    Price per night in{' '}
                    {currencies.find((c) => c.code === formData.currency)?.name}
                  </span>
                </div>

                <div className='relative'>
                  <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 text-2xl font-bold'>
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
                    className='w-full pl-16 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 text-2xl font-bold'
                  />
                </div>

                <div className='mt-4 p-4 bg-primary-25 rounded-xl border border-primary-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-info-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <span className='text-info-600 text-lg'>💡</span>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-primary-700 mb-1'>
                        Pricing Tips
                      </p>
                      <p className='text-xs text-primary-600'>
                        Research similar properties in your area. You can always
                        adjust your price later based on demand.
                      </p>
                    </div>
                  </div>
                </div>

                {formData.pricePerNight && (
                  <div className='mt-4 p-4 bg-gradient-to-r from-accent-green-50 to-accent-blue-50 rounded-xl border border-primary-200'>
                    <h5 className='font-bold text-primary-800 mb-2'>
                      Estimated Earnings
                    </h5>
                    <div className='space-y-1 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-primary-600'>Per night:</span>
                        <span className='font-bold text-primary-800'>
                          {
                            currencies.find((c) => c.code === formData.currency)
                              ?.symbol
                          }
                          {formData.pricePerNight}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-primary-600'>
                          Per week (7 nights):
                        </span>
                        <span className='font-bold text-primary-800'>
                          {
                            currencies.find((c) => c.code === formData.currency)
                              ?.symbol
                          }
                          {formData.pricePerNight * 7}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-primary-600'>
                          Per month (30 nights):
                        </span>
                        <span className='font-bold text-primary-800'>
                          {
                            currencies.find((c) => c.code === formData.currency)
                              ?.symbol
                          }
                          {formData.pricePerNight * 30}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white p-6 rounded-2xl border border-primary-200'>
                <h4 className='font-bold text-primary-800 mb-4'>
                  Weekly Discount
                </h4>
                <div className='flex items-center gap-4'>
                  <input
                    type='number'
                    placeholder='0'
                    className='flex-1 p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none'
                  />
                  <span className='text-primary-600 font-medium'>% off</span>
                </div>
                <p className='text-xs text-primary-500 mt-2'>
                  Encourage longer stays with a weekly discount
                </p>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200'>
                <h4 className='font-bold text-primary-800 mb-4'>
                  Monthly Discount
                </h4>
                <div className='flex items-center gap-4'>
                  <input
                    type='number'
                    placeholder='0'
                    className='flex-1 p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none'
                  />
                  <span className='text-primary-600 font-medium'>% off</span>
                </div>
                <p className='text-xs text-primary-500 mt-2'>
                  Attract long-term guests with monthly savings
                </p>
              </div>
            </div>

            <div className='bg-primary-25 p-6 rounded-2xl border border-primary-200'>
              <h4 className='text-xl font-bold text-primary-800 mb-4'>
                Review your listing
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h5 className='font-semibold text-primary-700 mb-2'>
                    Property Details
                  </h5>
                  <ul className='space-y-1 text-primary-600'>
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
                  <h5 className='font-semibold text-primary-700 mb-2'>
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
                    {formData.amenities.length > 6 && (
                      <span className='bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs'>
                        +{formData.amenities.length - 6} more
                      </span>
                    )}
                  </div>

                  <div className='mt-4'>
                    <h5 className='font-semibold text-primary-700 mb-2'>
                      Currency & Pricing
                    </h5>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg'>
                        {
                          currencies.find((c) => c.code === formData.currency)
                            ?.flag
                        }
                      </span>
                      <span className='text-sm text-primary-600'>
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
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className='space-y-8'>
            <div className='bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-8 text-white'>
              <h2 className='text-3xl font-bold mb-4'>Welcome back, Host!</h2>
              <p className='text-xl opacity-90 mb-6'>
                Ready to share your space with the world?
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className='bg-white text-primary-800 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors duration-300'
              >
                Create New Listing
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm font-medium'>
                      Total Listings
                    </p>
                    <p className='text-3xl font-bold text-primary-800'>3</p>
                  </div>
                  <FaHome className='text-2xl text-primary-400' />
                </div>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm font-medium'>
                      Total Bookings
                    </p>
                    <p className='text-3xl font-bold text-primary-800'>24</p>
                  </div>
                  <FaCalendarAlt className='text-2xl text-primary-400' />
                </div>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm font-medium'>
                      Monthly Earnings
                    </p>
                    <p className='text-3xl font-bold text-primary-800'>₦125k</p>
                  </div>
                  <FaDollarSign className='text-2xl text-primary-400' />
                </div>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-primary-600 text-sm font-medium'>
                      Rating
                    </p>
                    <p className='text-3xl font-bold text-primary-800'>4.8</p>
                  </div>
                  <FaCheck className='text-2xl text-primary-400' />
                </div>
              </div>
            </div>
          </div>
        )

      case 'listings':
        return (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-primary-800'>
                My Listings
              </h2>
              <button
                onClick={() => setActiveTab('create')}
                className='bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-900 transition-colors duration-300'
              >
                Add New Listing
              </button>
            </div>

            {[1, 2, 3].map((listing) => (
              <div
                key={listing}
                className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'
              >
                <div className='flex items-center gap-6'>
                  <div className='w-24 h-24 bg-primary-100 rounded-xl flex items-center justify-center'>
                    <FaHome className='text-2xl text-primary-600' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-bold text-primary-800 mb-2'>
                      Luxury Apartment in Victoria Island
                    </h3>
                    <p className='text-primary-600 mb-2'>
                      2 beds • 2 baths • Up to 4 guests
                    </p>
                    <div className='flex items-center gap-4'>
                      <span className='bg-accent-green-100 text-accent-green-700 px-3 py-1 rounded-full text-sm font-medium'>
                        Active
                      </span>
                      <span className='text-primary-600 text-sm'>
                        {
                          currencies.find((c) => c.code === formData.currency)
                            ?.symbol
                        }
                        25,000/night
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button className='p-2 text-primary-600 hover:bg-primary-50 rounded-lg'>
                      <FaEye />
                    </button>
                    <button className='p-2 text-primary-600 hover:bg-primary-50 rounded-lg'>
                      <FaEdit />
                    </button>
                    <button className='p-2 text-error-600 hover:bg-error-50 rounded-lg'>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'create':
        return (
          <div className='space-y-8'>
            <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
              <div className='flex items-center justify-between'>
                {steps.map((step, index) => (
                  <div key={step.id} className='flex items-center'>
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.id
                          ? 'bg-primary-800 border-primary-800 text-white'
                          : 'border-primary-300 text-primary-400'
                      }`}
                    >
                      {currentStep > step.id ? <FaCheck /> : <step.icon />}
                    </div>
                    <div className='ml-3 hidden md:block'>
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id
                            ? 'text-primary-800'
                            : 'text-primary-400'
                        }`}
                      >
                        Step {step.id}
                      </p>
                      <p
                        className={`text-xs ${
                          currentStep >= step.id
                            ? 'text-primary-600'
                            : 'text-primary-400'
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 mx-4 rounded-full ${
                          currentStep > step.id
                            ? 'bg-primary-800'
                            : 'bg-primary-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-white p-8 rounded-2xl border border-primary-200 shadow-soft'>
              {renderStepContent()}

              <div className='flex justify-between mt-8 pt-6 border-t border-primary-200'>
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className='px-6 py-3 border-2 border-primary-200 text-primary-700 rounded-xl font-semibold hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'
                >
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    className='px-6 py-3 bg-primary-800 text-white rounded-xl font-semibold hover:bg-primary-900 transition-colors duration-300'
                  >
                    Next Step
                  </button>
                ) : (
                  <button className='px-8 py-3 bg-gradient-to-r from-accent-green-600 to-accent-green-500 text-white rounded-xl font-semibold hover:from-accent-green-700 hover:to-accent-green-600 transition-all duration-300 transform hover:scale-105'>
                    Publish Listing
                  </button>
                )}
              </div>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-primary-800'>
              Analytics & Insights
            </h2>

            <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
              <h3 className='text-xl font-bold text-primary-800 mb-4'>
                Revenue Overview
              </h3>
              <div className='bg-primary-25 h-64 rounded-xl flex items-center justify-center'>
                <div className='text-center'>
                  <HiOutlineChartBar className='text-4xl text-primary-400 mx-auto mb-2' />
                  <p className='text-primary-600'>
                    Revenue chart will be displayed here
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
                <h4 className='font-bold text-primary-800 mb-2'>
                  Occupancy Rate
                </h4>
                <p className='text-3xl font-bold text-primary-800'>78%</p>
                <p className='text-sm text-accent-green-600'>
                  ↑ 12% from last month
                </p>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
                <h4 className='font-bold text-primary-800 mb-2'>
                  Average Daily Rate
                </h4>
                <p className='text-3xl font-bold text-primary-800'>₦22k</p>
                <p className='text-sm text-accent-green-600'>
                  ↑ 5% from last month
                </p>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
                <h4 className='font-bold text-primary-800 mb-2'>
                  Guest Rating
                </h4>
                <p className='text-3xl font-bold text-primary-800'>4.8</p>
                <p className='text-sm text-primary-600'>Based on 124 reviews</p>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-primary-800'>
              Account Settings
            </h2>

            <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
              <h3 className='text-xl font-bold text-primary-800 mb-4'>
                Profile Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    placeholder='John'
                    className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    placeholder='Doe'
                    className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    placeholder='john@example.com'
                    className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-bold text-primary-700 mb-2'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    placeholder='+234 800 000 0000'
                    className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none'
                  />
                </div>
              </div>
              <button className='mt-6 bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-900 transition-colors duration-300'>
                Update Profile
              </button>
            </div>

            <div className='bg-white p-6 rounded-2xl border border-primary-200 shadow-soft'>
              <h3 className='text-xl font-bold text-primary-800 mb-4'>
                Notification Preferences
              </h3>
              <div className='space-y-4'>
                {[
                  'Email notifications for new bookings',
                  'SMS alerts for urgent messages',
                  'Weekly performance reports',
                  'Marketing emails and updates',
                ].map((notification, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <span className='text-primary-700'>{notification}</span>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        defaultChecked={index < 2}
                      />
                      <div className="w-11 h-6 bg-primary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
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
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-25 via-neutral-50 to-primary-100'>
      <div className='container mx-auto px-4 py-8 max-w-[1400px]'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent mb-2'>
            Host Dashboard
          </h1>
          <p className='text-primary-600 text-lg'>
            Manage your properties and grow your hosting business
          </p>
        </div>

        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-primary-200 p-2 mb-8'>
          <div className='flex space-x-2 overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-800 text-white shadow-medium'
                    : 'text-primary-600 hover:bg-primary-50'
                }`}
              >
                <tab.icon className='text-lg' />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className='transition-all duration-300'>{renderTabContent()}</div>
      </div>
    </div>
  )
}

export default Dashboard
