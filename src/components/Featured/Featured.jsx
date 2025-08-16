import AptWebP from '../../assets/Apt1.webp'
import Apt2WebP from '../../assets/Apt2.webp'
import Apt3WebP from '../../assets/Apt3.webp'
import { HiStar, HiLocationMarker, HiHeart, HiArrowRight } from 'react-icons/hi'
import { FaWifi, FaCar, FaSwimmingPool } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Featured = () => {
  const properties = [
    {
      id: 1,
      image: AptWebP,
      title: 'Luxury Downtown Apartment',
      location: 'Lagos, Nigeria',
      price: '₦250,000',
      rating: 4.9,
      reviews: 127,
      amenities: [FaWifi, FaCar, FaSwimmingPool],
      badge: 'FEATURED',
      badgeColor: 'bg-amber-500',
    },
    {
      id: 2,
      image: Apt2WebP,
      title: 'Modern City Residence',
      location: 'Abuja, Nigeria',
      price: '₦180,000',
      rating: 4.8,
      reviews: 89,
      amenities: [FaWifi, FaCar],
      badge: 'POPULAR',
      badgeColor: 'bg-primary-800',
    },
    {
      id: 3,
      image: Apt3WebP,
      title: 'Elegant Waterfront Suite',
      location: 'Port Harcourt, Nigeria',
      price: '₦320,000',
      rating: 4.9,
      reviews: 156,
      amenities: [FaWifi, FaSwimmingPool],
      badge: 'LUXURY',
      badgeColor: 'bg-success-600',
    },
    {
      id: 4,
      image: Apt2WebP,
      title: 'Cozy Urban Getaway',
      location: 'Ibadan, Nigeria',
      price: '₦150,000',
      rating: 4.7,
      reviews: 73,
      amenities: [FaWifi],
      badge: 'BUDGET',
      badgeColor: 'bg-info-600',
    },
  ]

  return (
    <section className='py-10 lg:py-14 bg-gradient-to-br from-neutral-25 via-white to-primary-50 relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_1000px]'>
      {/* Background Decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-32 right-20 w-48 h-48 bg-primary-100 rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute bottom-32 left-20 w-40 h-40 bg-neutral-100 rounded-full opacity-30 blur-2xl'></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'
      >
        {/* Header Section */}
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
            <button
              onClick={() =>
                document
                  .getElementById('accomodation')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className='group bg-primary-800 hover:bg-primary-900 text-white font-semibold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 flex items-center gap-3'
            >
              View All Properties
              <HiArrowRight className='text-lg group-hover:translate-x-1 transition-transform duration-300' />
            </button>
          </div>
        </div>
        {/* Properties Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {properties.map((property) => (
            <div
              key={property.id}
              className='group bg-white rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-primary-100'
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
                  className={`absolute top-4 left-4 ${property.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-medium`}
                >
                  {property.badge}
                </div>
                {/* Heart Icon */}
                <button className='absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:bg-white transition-all duration-300 group'>
                  <HiHeart className='text-primary-600 text-lg hover:text-error-500 transition-colors duration-300' />
                </button>
                {/* Overlay Content */}
                <div className='absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0'>
                  <div className='flex items-center gap-2 mb-2'>
                    {property.amenities.map((Amenity, index) => (
                      <div
                        key={index}
                        className='w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center'
                      >
                        <Amenity className='text-primary-700 text-sm' />
                      </div>
                    ))}
                  </div>
                  <button className='w-full bg-primary-800 hover:bg-primary-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm'>
                    Quick Book
                  </button>
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
                      ({property.reviews})
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-black text-primary-900'>
                      {property.price}
                    </div>
                    <div className='text-sm text-primary-600'>per night</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom CTA */}
        {/* <div className='mt-16 text-center'>
          <div className='bg-white/80 backdrop-blur-sm border-2 border-primary-200 rounded-3xl p-8 lg:p-12 shadow-medium'>
            <h3 className='font-NotoSans text-2xl lg:text-3xl font-bold text-primary-800 mb-4'>
              Can&#39;t Find What You&#39;re Looking For?
            </h3>
            <p className='text-lg text-primary-600 mb-8 max-w-2xl mx-auto'>
              Our team of accommodation specialists is here to help you find the
              perfect stay tailored to your specific needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() =>
                  document
                    .getElementById('accomodation')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className='group relative overflow-hidden bg-primary-900 text-white font-bold py-5 px-10 rounded-2xl shadow-strong hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left'></div>
                <span className='relative flex items-center justify-center gap-3'>
                  Search All Properties
                </span>
              </button>
              <button className='border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105'>
                Contact Specialist
              </button>
            </div>
          </div>
        </div> */}
      </motion.div>
    </section>
  )
}

export default Featured
