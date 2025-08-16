// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaMoneyBillAlt } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { AiFillPropertySafety } from 'react-icons/ai'
import { HiChevronDown } from 'react-icons/hi'
import { toast } from 'sonner'

const Location = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const locations = [
    'Abuja, Nigeria',
    'Lagos, Nigeria',
    'Port Harcourt, Nigeria',
    'Ibadan, Nigeria',
    'Abeokuta, Nigeria',
  ]

  const propertyTypes = ['Apartment', 'Villa', 'Condo', 'Studio']
  const priceRanges = [
    '₦100,000-₦200,000',
    '₦300,000-₦400,000',
    '₦500,000-₦600,000',
  ]

  const handleSearch = async () => {
    if (!location || !propertyType || !priceRange) {
      toast.error('Missing Information', {
        description: 'Please fill all fields to search',
        duration: 4000,
      })
      return
    }

    setIsSearching(true)

    setTimeout(() => {
      const queryParams = new URLSearchParams({
        location,
        propertyType,
        priceRange,
      }).toString()
      navigate(`/homepage?${queryParams}`)
      setIsSearching(false)
    }, 1000)
  }

  return (
    <section
      className='py-2 lg:py-4 bg-gradient-to-br from-primary-50 via-white to-neutral-50'
      id='accomodation'
    >
      <div className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        <div className='grid grid-cols-1 gap-6 items-start'>
          {/* Header */}
          <div className='text-center space-y-2 mb-8'>
            <h2 className='font-NotoSans text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-800'>
              Find Your Perfect
              <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text block sm:inline sm:ml-3'>
                Accommodation
              </span>
            </h2>
            <p className='text-lg text-primary-600 max-w-2xl mx-auto'>
              Search through our premium collection of accommodations tailored
              to your needs
            </p>
          </div>
          {/* Search Form */}
          <div className='bg-white/90 backdrop-blur-sm border-2 border-primary-200 rounded-3xl p-6 lg:p-8 shadow-strong'>
            {/* Increased gap between fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
              {/* Location Dropdown */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-primary-700'>
                  Location
                </label>
                <div className='relative'>
                  <div className='flex items-center bg-primary-50 border-2 border-primary-200 hover:border-primary-300 focus-within:border-primary-500 rounded-xl p-4 transition-all duration-300'>
                    <FaLocationDot className='text-primary-600 text-lg mr-3 flex-shrink-0' />
                    <select
                      className='flex-1 bg-transparent text-primary-800 focus:outline-none cursor-pointer font-medium appearance-none'
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value='' disabled>
                        Choose location
                      </option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className='text-primary-600 text-lg ml-2 flex-shrink-0' />
                  </div>
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-primary-700'>
                  Property Type
                </label>
                <div className='relative'>
                  <div className='flex items-center bg-primary-50 border-2 border-primary-200 hover:border-primary-300 focus-within:border-primary-500 rounded-xl p-4 transition-all duration-300'>
                    <AiFillPropertySafety className='text-primary-600 text-lg mr-3 flex-shrink-0' />
                    <select
                      className='flex-1 bg-transparent text-primary-800 focus:outline-none cursor-pointer font-medium appearance-none'
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      <option value='' disabled>
                        Select type
                      </option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className='text-primary-600 text-lg ml-2 flex-shrink-0' />
                  </div>
                </div>
              </div>

              {/* Price Range Dropdown */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-primary-700'>
                  Price Range
                </label>
                <div className='relative'>
                  <div className='flex items-center bg-primary-50 border-2 border-primary-200 hover:border-primary-300 focus-within:border-primary-500 rounded-xl p-4 transition-all duration-300'>
                    <FaMoneyBillAlt className='text-primary-600 text-lg mr-3 flex-shrink-0' />
                    <select
                      className='flex-1 bg-transparent text-primary-800 focus:outline-none cursor-pointer font-medium appearance-none'
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option value='' disabled>
                        Select budget
                      </option>
                      {priceRanges.map((price) => (
                        <option key={price} value={price}>
                          {price}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className='text-primary-600 text-lg ml-2 flex-shrink-0' />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-transparent'>
                  Search
                </label>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className={`w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 ${
                    isSearching ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FaSearch className='text-lg' />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Increased spacing between form and quick actions */}
            <div className='mt-6 pt-4 border-t border-primary-200'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-sm font-medium text-primary-700'>
                  Quick search:
                </span>
                <button
                  onClick={() => {
                    setLocation('Lagos, Nigeria')
                    setPropertyType('Apartment')
                    setPriceRange('₦300,000-₦400,000')
                  }}
                  className='px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 text-sm font-medium rounded-full transition-colors duration-300'
                >
                  Lagos Apartments
                </button>
                <button
                  onClick={() => {
                    setPropertyType('Villa')
                    setPriceRange('₦500,000-₦600,000')
                  }}
                  className='px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 text-sm font-medium rounded-full transition-colors duration-300'
                >
                  Luxury Villas
                </button>
                <button
                  onClick={() => {
                    setPriceRange('₦100,000-₦200,000')
                  }}
                  className='px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 text-sm font-medium rounded-full transition-colors duration-300'
                >
                  Budget Options
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
