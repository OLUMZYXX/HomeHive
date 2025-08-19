import { useEffect, useState } from 'react'
import AptWebP from '../../assets/Apt1.webp'
import Apt2WebP from '../../assets/Apt2.webp'
import Apt3WebP from '../../assets/Apt3.webp'
// Fallback properties to show if API fails or returns no properties
const fallbackProperties = [
  {
    id: 1,
    image: AptWebP,
    title: 'Luxury Downtown Apartment',
    location: 'Lagos, Nigeria',
    price: 250000,
    rating: 4.9,
    views: 127,
    amenities: ['wifi', 'car', 'pool'],
    category: 'FEATURED',
  },
  {
    id: 2,
    image: Apt2WebP,
    title: 'Modern City Residence',
    location: 'Abuja, Nigeria',
    price: 180000,
    rating: 4.8,
    views: 89,
    amenities: ['wifi', 'car'],
    category: 'POPULAR',
  },
  {
    id: 3,
    image: Apt3WebP,
    title: 'Elegant Waterfront Suite',
    location: 'Port Harcourt, Nigeria',
    price: 320000,
    rating: 4.9,
    views: 156,
    amenities: ['wifi', 'pool'],
    category: 'LUXURY',
  },
  {
    id: 4,
    image: Apt2WebP,
    title: 'Cozy Urban Getaway',
    location: 'Ibadan, Nigeria',
    price: 150000,
    rating: 4.7,
    views: 73,
    amenities: ['wifi'],
    category: 'BUDGET',
  },
]
import { HiStar, HiLocationMarker, HiHeart, HiArrowRight } from 'react-icons/hi'
import { FaWifi, FaCar, FaSwimmingPool } from 'react-icons/fa'
import { propertiesAPI, favoritesAPI } from '../../services/api'
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  AnimatedButton,
  FloatingElement,
} from '../common/AnimatedComponents'

const amenityIcons = {
  wifi: FaWifi,
  car: FaCar,
  pool: FaSwimmingPool,
}

const Featured = () => {
  const [properties, setProperties] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const featuredRes = await propertiesAPI.getFeaturedRandom(8)
        setProperties(featuredRes.images || featuredRes.showcase || [])
        const favRes = await favoritesAPI.getFavorites()
        setFavorites(
          favRes.favorites ? favRes.favorites.map((f) => f.propertyId) : []
        )
      } catch {
        setError('Failed to load featured properties.')
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleLike = async (propertyId) => {
    try {
      if (favorites.includes(propertyId)) {
        await favoritesAPI.removeFromFavorites(propertyId)
        setFavorites(favorites.filter((id) => id !== propertyId))
      } else {
        await favoritesAPI.addToFavorites(propertyId)
        setFavorites([...favorites, propertyId])
      }
    } catch {
      // Optionally show toast
    }
  }

  return (
    <section className='py-10 lg:py-14 bg-gradient-to-br from-neutral-25 via-white to-primary-50 relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_1000px]'>
      {/* Background Decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <FloatingElement
          direction='y'
          distance={20}
          duration={6}
          className='absolute top-32 right-20 w-48 h-48 bg-primary-100 rounded-full opacity-20 blur-3xl'
        />
        <FloatingElement
          direction='x'
          distance={15}
          duration={8}
          className='absolute bottom-32 left-20 w-40 h-40 bg-neutral-100 rounded-full opacity-30 blur-2xl'
        />
      </div>

      <div className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        {/* Header Section */}
        <ScrollReveal direction='up' delay={0.2}>
          <div className='flex flex-col lg:flex-row items-center justify-between mb-16 gap-8'>
            <div className='text-center lg:text-left'>
              <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-soft'>
                <HiStar className='text-amber-500 text-sm' />
                <span className='text-sm font-medium text-primary-700'>
                  Top Rated Properties
                </span>
              </div>
              <h2 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-800 mb-4'>
                Discover Top-Rated
                <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text block sm:inline sm:ml-3'>
                  Accommodations
                </span>
              </h2>
              <p className='text-lg text-primary-600 leading-relaxed max-w-2xl'>
                Handpicked properties with exceptional ratings and reviews from
                verified guests
              </p>
            </div>
            <div className='flex-shrink-0'>
              <AnimatedButton
                onClick={() =>
                  document
                    .getElementById('accomodation')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className='group bg-primary-800 hover:bg-primary-900 text-white font-semibold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 flex items-center gap-3'
              >
                View All Properties
                <HiArrowRight className='text-lg group-hover:translate-x-1 transition-transform duration-300' />
              </AnimatedButton>
            </div>
          </div>
        </ScrollReveal>
        {/* Properties Grid */}
        <StaggerContainer
          staggerDelay={0.2}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
        >
          {loading ? (
            <div className='col-span-4 text-center py-12 text-primary-600'>
              Loading featured properties...
            </div>
          ) : error || properties.length === 0 ? (
            fallbackProperties.map((property) => (
              <StaggerItem key={property.id}>
                <AnimatedCard
                  className='group bg-white rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 overflow-hidden border border-primary-100'
                  hoverScale={1.03}
                  hoverY={-12}
                >
                  {/* Image Container */}
                  <div className='relative overflow-hidden'>
                    <img
                      src={property.image}
                      alt={property.title}
                      loading='lazy'
                      decoding='async'
                      className='w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110'
                      width={512}
                      height={256}
                      srcSet={`${property.image} 1x, ${property.image} 2x`}
                    />
                    {/* Badge */}
                    <div
                      className={`absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-medium`}
                    >
                      {property.category}
                    </div>
                    {/* Heart Icon */}
                    <AnimatedButton
                      className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:bg-white transition-all duration-300 group`}
                      onClick={() => handleLike(property.id)}
                      aria-label={
                        favorites.includes(property.id) ? 'Unlike' : 'Like'
                      }
                    >
                      <HiHeart
                        className={`text-lg transition-colors duration-300 ${
                          favorites.includes(property.id)
                            ? 'text-error-500'
                            : 'text-primary-600 hover:text-error-500'
                        }`}
                      />
                    </AnimatedButton>
                    {/* Overlay Content */}
                    <div className='absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0'>
                      <div className='flex items-center gap-2 mb-2'>
                        {(property.amenities || []).map(
                          (amenity, amenityIndex) => {
                            const Icon = amenityIcons[amenity.toLowerCase()]
                            return Icon ? (
                              <div
                                key={amenityIndex}
                                className='w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center'
                              >
                                <Icon className='text-primary-700 text-sm' />
                              </div>
                            ) : null
                          }
                        )}
                      </div>
                      <AnimatedButton className='w-full bg-primary-800 hover:bg-primary-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm'>
                        Quick Book
                      </AnimatedButton>
                    </div>
                  </div>
                  {/* Content */}
                  <div className='p-6 space-y-4'>
                    <div>
                      <h3 className='font-NotoSans text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-800 transition-colors duration-300'>
                        {property.title}
                      </h3>
                      <div className='flex items-center gap-2 text-primary-600 mb-3'>
                        <HiLocationMarker className='text-sm flex-shrink-0' />
                        <span className='text-base'>{property.location}</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <HiStar className='text-amber-400 text-lg' />
                        <span className='font-semibold text-primary-900'>
                          {property.rating}
                        </span>
                        <span className='text-primary-600 text-sm'>
                          ({property.views})
                        </span>
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-black text-primary-900'>
                          ₦{property.price?.toLocaleString() || 'N/A'}
                        </div>
                        <div className='text-sm text-primary-600'>
                          per night
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))
          ) : (
            properties.map((property) => (
              <StaggerItem key={property.id || property.propertyId}>
                <AnimatedCard
                  className='group bg-white rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 overflow-hidden border border-primary-100'
                  hoverScale={1.03}
                  hoverY={-12}
                >
                  {/* Image Container */}
                  <div className='relative overflow-hidden'>
                    <img
                      src={property.url || property.image || AptWebP}
                      alt={property.title}
                      loading='lazy'
                      decoding='async'
                      className='w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110'
                      width={512}
                      height={256}
                      srcSet={`${
                        property.url || property.image || AptWebP
                      } 1x, ${property.url || property.image || AptWebP} 2x`}
                    />
                    {/* Badge */}
                    <div
                      className={`absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-medium`}
                    >
                      {property.category || 'FEATURED'}
                    </div>
                    {/* Heart Icon */}
                    <AnimatedButton
                      className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:bg-white transition-all duration-300 group`}
                      onClick={() =>
                        handleLike(property.propertyId || property.id)
                      }
                      aria-label={
                        favorites.includes(property.propertyId || property.id)
                          ? 'Unlike'
                          : 'Like'
                      }
                    >
                      <HiHeart
                        className={`text-lg transition-colors duration-300 ${
                          favorites.includes(property.propertyId || property.id)
                            ? 'text-error-500'
                            : 'text-primary-600 hover:text-error-500'
                        }`}
                      />
                    </AnimatedButton>
                    {/* Overlay Content */}
                    <div className='absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0'>
                      <div className='flex items-center gap-2 mb-2'>
                        {(property.amenities || []).map(
                          (amenity, amenityIndex) => {
                            const Icon = amenityIcons[amenity.toLowerCase()]
                            return Icon ? (
                              <div
                                key={amenityIndex}
                                className='w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center'
                              >
                                <Icon className='text-primary-700 text-sm' />
                              </div>
                            ) : null
                          }
                        )}
                      </div>
                      <AnimatedButton className='w-full bg-primary-800 hover:bg-primary-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm'>
                        Quick Book
                      </AnimatedButton>
                    </div>
                  </div>
                  {/* Content */}
                  <div className='p-6 space-y-4'>
                    <div>
                      <h3 className='font-NotoSans text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-800 transition-colors duration-300'>
                        {property.title}
                      </h3>
                      <div className='flex items-center gap-2 text-primary-600 mb-3'>
                        <HiLocationMarker className='text-sm flex-shrink-0' />
                        <span className='text-base'>{property.location}</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <HiStar className='text-amber-400 text-lg' />
                        <span className='font-semibold text-primary-900'>
                          {property.rating}
                        </span>
                        <span className='text-primary-600 text-sm'>
                          ({property.totalReviews || property.views || 0})
                        </span>
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-black text-primary-900'>
                          ₦{property.price?.toLocaleString() || 'N/A'}
                        </div>
                        <div className='text-sm text-primary-600'>
                          per night
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default Featured
