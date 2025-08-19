// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaMoneyBillAlt } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { AiFillPropertySafety } from 'react-icons/ai'
import { HiChevronDown } from 'react-icons/hi'
import { toast } from 'sonner'
import { useAPI } from '../../contexts/APIContext'

const Location = () => {
  const navigate = useNavigate()
  const { searchProperties, getProperties, loading } = useAPI()

  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [availableLocations, setAvailableLocations] = useState([])

  // Static fallback locations (memoized to avoid dependency issues)
  const defaultLocations = useMemo(
    () => [
      'Abuja, Nigeria',
      'Lagos, Nigeria',
      'Port Harcourt, Nigeria',
      'Ibadan, Nigeria',
      'Abeokuta, Nigeria',
    ],
    []
  )

  const propertyTypes = ['Apartment', 'Villa', 'Condo', 'Studio', 'House']

  // More realistic price ranges (converted to numbers for backend)
  const priceRanges = [
    { label: '₦50,000 - ₦150,000', min: 50000, max: 150000 },
    { label: '₦150,000 - ₦300,000', min: 150000, max: 300000 },
    { label: '₦300,000 - ₦500,000', min: 300000, max: 500000 },
    { label: '₦500,000 - ₦750,000', min: 500000, max: 750000 },
    { label: '₦750,000+', min: 750000, max: null },
  ]

  // Fetch available locations from properties on component mount
  useEffect(() => {
    const fetchAvailableLocations = async () => {
      try {
        const properties = await getProperties({ limit: 1000 }) // Get all to extract locations
        const locations = [
          ...new Set(
            properties
              .map(
                (property) =>
                  property.location || property.city || property.address
              )
              .filter(Boolean)
          ),
        ]
        setAvailableLocations(
          locations.length > 0 ? locations : defaultLocations
        )
      } catch (error) {
        console.error('Error fetching locations:', error)
        setAvailableLocations(defaultLocations)
      }
    }

    fetchAvailableLocations()
  }, [getProperties, defaultLocations])

  const handleSearch = async () => {
    // At least one field must be filled
    if (!location && !propertyType && !priceRange && !searchKeyword) {
      toast.error('Missing Information', {
        description: 'Please fill at least one field to search',
        duration: 4000,
      })
      return
    }

    setIsSearching(true)

    try {
      // Parse price range
      let selectedPriceRange = null
      if (priceRange) {
        selectedPriceRange = priceRanges.find(
          (range) => range.label === priceRange
        )
        if (!selectedPriceRange) {
          throw new Error('Invalid price range selected')
        }
      }

      // Prepare search criteria for backend
      const searchCriteria = {
        // Add all non-empty search parameters
        ...(location && { location: location }),
        ...(propertyType && { propertyType: propertyType.toLowerCase() }),
        ...(selectedPriceRange && {
          minPrice: selectedPriceRange.min,
          ...(selectedPriceRange.max && { maxPrice: selectedPriceRange.max }),
        }),
        ...(searchKeyword && {
          search: searchKeyword.trim(),
          // Search in multiple fields
          searchFields: ['title', 'description', 'amenities', 'address'],
        }),
        // Additional filters
        available: true, // Only show available properties
        status: 'active', // Only show active listings
      }

      console.log('Search criteria:', searchCriteria) // Debug log

      // Call backend search API
      const searchResults = await searchProperties(searchCriteria)

      // Ensure searchResults is an array
      const results = Array.isArray(searchResults) ? searchResults : []

      // Show success message with results count
      if (results.length > 0) {
        toast.success('Search Complete', {
          description: `Found ${results.length} properties matching your criteria`,
          duration: 3000,
        })
      } else {
        toast.info('No Results Found', {
          description:
            'No properties match your search criteria. Try adjusting your filters.',
          duration: 4000,
        })
      }

      // Navigate to results page with search results
      const queryParams = new URLSearchParams({
        ...(location && { location }),
        ...(propertyType && { propertyType }),
        ...(priceRange && { priceRange }),
        ...(searchKeyword && { keyword: searchKeyword }),
        resultsCount: results.length.toString(),
      }).toString()

      navigate(`/homepage?${queryParams}`, {
        state: {
          searchResults: results,
          searchCriteria,
        },
      })
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search Failed', {
        description:
          error.message || 'Unable to search properties. Please try again.',
        duration: 4000,
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleQuickSearch = async (quickSearchType) => {
    try {
      let searchCriteria = {}

      switch (quickSearchType) {
        case 'lagos-apartments':
          setLocation('Lagos, Nigeria')
          setPropertyType('Apartment')
          setPriceRange('₦150,000 - ₦300,000')
          setSearchKeyword('') // Clear keyword for quick search
          searchCriteria = {
            location: 'Lagos, Nigeria',
            propertyType: 'apartment',
            minPrice: 150000,
            maxPrice: 300000,
            available: true,
            status: 'active',
          }
          break
        case 'luxury-villas':
          setPropertyType('Villa')
          setPriceRange('₦500,000 - ₦750,000')
          setSearchKeyword('luxury') // Add relevant keyword
          searchCriteria = {
            propertyType: 'villa',
            minPrice: 500000,
            maxPrice: 750000,
            search: 'luxury',
            searchFields: ['title', 'description', 'amenities'],
            available: true,
            status: 'active',
          }
          break
        case 'budget-options':
          setPriceRange('₦50,000 - ₦150,000')
          setSearchKeyword('budget') // Add relevant keyword
          searchCriteria = {
            minPrice: 50000,
            maxPrice: 150000,
            search: 'budget affordable',
            searchFields: ['title', 'description'],
            available: true,
            status: 'active',
          }
          break
        default:
          return
      }

      // If we have enough criteria, perform search
      if (
        searchCriteria.location ||
        searchCriteria.propertyType ||
        (searchCriteria.minPrice && searchCriteria.maxPrice)
      ) {
        setIsSearching(true)
        const searchResults = await searchProperties(searchCriteria)

        // Ensure searchResults is an array
        const results = Array.isArray(searchResults) ? searchResults : []

        if (results.length > 0) {
          toast.success('Quick Search Complete', {
            description: `Found ${results.length} properties`,
            duration: 3000,
          })
        } else {
          toast.info('No Results Found', {
            description:
              'No properties match this quick search. Try a different option.',
            duration: 3000,
          })
        }

        navigate(`/homepage?quick=${quickSearchType}`, {
          state: {
            searchResults: results,
            searchCriteria,
          },
        })
        setIsSearching(false)
      }
    } catch (error) {
      console.error('Quick search error:', error)
      toast.error('Quick Search Failed', {
        description:
          'Unable to perform quick search. Please try manual search.',
        duration: 4000,
      })
      setIsSearching(false)
    }
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
            {/* Keyword Search - Full Width */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-primary-700 mb-2'>
                Search by keyword (optional)
              </label>
              <div className='relative'>
                <div className='flex items-center bg-primary-50 border-2 border-primary-200 hover:border-primary-300 focus-within:border-primary-500 rounded-xl p-4 transition-all duration-300'>
                  <FaSearch className='text-primary-600 text-lg mr-3 flex-shrink-0' />
                  <input
                    type='text'
                    placeholder='e.g., "luxury apartment", "swimming pool", "city center"...'
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className='flex-1 bg-transparent text-primary-800 placeholder-primary-500 focus:outline-none font-medium'
                  />
                </div>
              </div>
            </div>

            {/* Main Search Filters */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>
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
                      {availableLocations.map((loc) => (
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
                        <option key={price.label} value={price.label}>
                          {price.label}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className='text-primary-600 text-lg ml-2 flex-shrink-0' />
                  </div>
                </div>
              </div>

              {/* Search Button - Full Width */}
            </div>

            <div className='mt-6'>
              <button
                onClick={handleSearch}
                disabled={isSearching || loading}
                className={`w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 ${
                  isSearching || loading
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                {isSearching || loading ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FaSearch className='text-lg' />
                    <span>Search Properties</span>
                  </>
                )}
              </button>
            </div>

            {/* Increased spacing between form and quick actions */}
            <div className='mt-6 pt-4 border-t border-primary-200'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-sm font-medium text-primary-700'>
                  Quick search:
                </span>
                <button
                  onClick={() => handleQuickSearch('lagos-apartments')}
                  disabled={isSearching || loading}
                  className='px-4 py-2 bg-primary-100 hover:bg-primary-200 disabled:bg-primary-50 disabled:text-primary-400 text-primary-800 text-sm font-medium rounded-full transition-colors duration-300'
                >
                  Lagos Apartments
                </button>
                <button
                  onClick={() => handleQuickSearch('luxury-villas')}
                  disabled={isSearching || loading}
                  className='px-4 py-2 bg-primary-100 hover:bg-primary-200 disabled:bg-primary-50 disabled:text-primary-400 text-primary-800 text-sm font-medium rounded-full transition-colors duration-300'
                >
                  Luxury Villas
                </button>
                <button
                  onClick={() => handleQuickSearch('budget-options')}
                  disabled={isSearching || loading}
                  className='px-4 py-2 bg-primary-100 hover:bg-primary-200 disabled:bg-primary-50 disabled:text-primary-400 text-primary-800 text-sm font-medium rounded-full transition-colors duration-300'
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
