import header1 from '../../assets/header1.jpg'
import header from '../../assets/header.jpg'
import { useNavigate } from 'react-router-dom'
import { HiArrowRight, HiCheckCircle, HiPlay } from 'react-icons/hi'

const Header = () => {
  const navigate = useNavigate()

  const handleExploreClick = () => {
    navigate('/signin')
  }

  const handleLearnMore = () => {
    document
      .getElementById('testimonial')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className='relative py-20 lg:py-32 bg-white overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_1000px]'>
      {/* Geometric Background Pattern */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100 to-transparent opacity-60'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-primary-50 transform rotate-45 -translate-x-32 translate-y-32'></div>
        <div className='absolute top-20 right-20 w-32 h-32 bg-neutral-100 rounded-full opacity-40'></div>
      </div>

      <div className='relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center'>
          {/* Content Section - Takes more space */}
          <div className='lg:col-span-7 space-y-10'>
            {/* Announcement Banner - Consistent Text */}
            <div className='inline-flex items-center gap-3 bg-gradient-to-r from-primary-100 to-primary-50 border border-primary-200 rounded-2xl px-6 py-3 shadow-soft'>
              <div className='w-2 h-2 bg-success-500 rounded-full animate-pulse'></div>
              <span className='text-base font-semibold text-primary-800'>
                New Properties Added Weekly
              </span>
              <HiArrowRight className='text-primary-600 text-base' />
            </div>

            {/* Main Heading - Consistent Typography */}
            <div className='space-y-6'>
              <h1 className='font-NotoSans leading-[1.1]'>
                <span className='block text-4xl sm:text-5xl lg:text-6xl font-black text-primary-900'>
                  Find
                </span>
                <span className='block text-4xl sm:text-5xl lg:text-6xl font-light text-primary-600 -mt-2'>
                  Your Dream
                </span>
                <span className='block text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 bg-clip-text -mt-2'>
                  Accommodation
                </span>
              </h1>

              {/* Decorative Line */}
              <div className='flex items-center gap-4'>
                <div className='w-16 h-1 bg-primary-800 rounded-full'></div>
                <div className='w-8 h-1 bg-primary-600 rounded-full'></div>
                <div className='w-4 h-1 bg-primary-400 rounded-full'></div>
              </div>
            </div>

            {/* Description with Consistent Style */}
            <div className='space-y-6'>
              <p className='text-lg lg:text-xl text-primary-700 font-medium leading-relaxed max-w-2xl'>
                Experience luxury redefined with our handpicked collection of
                premium accommodations
                <span className='text-primary-900 font-semibold'>
                  {' '}
                  designed for discerning travelers.
                </span>
              </p>

              {/* Key Features - Consistent Text */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100'>
                  <HiCheckCircle className='text-success-600 text-xl flex-shrink-0' />
                  <div>
                    <div className='font-semibold text-primary-900 text-base'>
                      Verified Quality
                    </div>
                    <div className='text-primary-600 text-base'>
                      Every property inspected
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100'>
                  <HiCheckCircle className='text-success-600 text-xl flex-shrink-0' />
                  <div>
                    <div className='font-semibold text-primary-900 text-base'>
                      Best Price Promise
                    </div>
                    <div className='text-primary-600 text-base'>
                      Guaranteed lowest rates
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section - Different Style */}
            <div className='space-y-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={handleExploreClick}
                  className='group relative overflow-hidden bg-primary-900 text-white font-bold py-5 px-10 rounded-2xl shadow-strong hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left'></div>
                  <span className='relative flex items-center justify-center gap-3'>
                    Start Exploring
                    <HiArrowRight className='text-xl group-hover:translate-x-2 transition-transform duration-300' />
                  </span>
                </button>

                <button
                  onClick={handleLearnMore}
                  className='group flex items-center gap-3 text-primary-800 font-semibold py-5 px-6 hover:bg-primary-50 rounded-2xl transition-all duration-300'
                >
                  <div className='w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors duration-300'>
                    <HiPlay className='text-primary-800 text-lg ml-1' />
                  </div>
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Trust Indicators - Consistent Text */}
              <div className='flex flex-wrap items-center gap-8 pt-4'>
                <div className='text-center'>
                  <div className='text-2xl font-black text-primary-900'>
                    500+
                  </div>
                  <div className='text-base text-primary-600 font-medium'>
                    Premium Properties
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-black text-primary-900'>
                    98%
                  </div>
                  <div className='text-base text-primary-600 font-medium'>
                    Satisfaction Rate
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-black text-primary-900'>
                    24/7
                  </div>
                  <div className='text-base text-primary-600 font-medium'>
                    Concierge Service
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section - Compact but Impactful */}
          <div className='lg:col-span-5 relative'>
            {/* Image Stack Layout */}
            <div className='relative h-[600px] lg:h-[700px]'>
              {/* Main Large Image */}
              <div className='absolute inset-0 w-4/5 h-3/4 ml-auto'>
                <div className='relative w-full h-full group'>
                  <div className='absolute inset-0 bg-primary-900 rounded-3xl transform rotate-2 opacity-10 group-hover:rotate-1 transition-transform duration-700'></div>
                  <img
                    src={header}
                    alt='Luxury accommodation showcase'
                    className='relative w-full h-full object-cover rounded-3xl shadow-xl transform group-hover:scale-105 transition-transform duration-700 z-10'
                    loading='lazy'
                    decoding='async'
                    width={1200}
                    height={800}
                  />

                  {/* Overlay Content - Consistent Text */}
                  <div className='absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-medium z-20'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-bold text-primary-900 text-base'>
                          Luxury Suite
                        </div>
                        <div className='text-primary-600 text-base'>
                          Starting from ₦500K/night
                        </div>
                      </div>
                      <div className='text-xl'>⭐</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Smaller Image */}
              <div className='absolute bottom-0 left-0 w-3/5 h-2/5'>
                <div className='relative w-full h-full group'>
                  <div className='absolute inset-0 bg-neutral-800 rounded-2xl transform -rotate-3 opacity-10 group-hover:-rotate-1 transition-transform duration-700'></div>
                  <img
                    src={header1}
                    alt='Comfortable accommodation space'
                    className='relative w-full h-full object-cover rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-700 z-10'
                    loading='lazy'
                    decoding='async'
                    width={800}
                    height={600}
                  />

                  {/* Small Badge - Consistent Text */}
                  <div className='absolute -top-3 -right-3 bg-primary-800 text-white text-sm font-bold px-3 py-2 rounded-full shadow-medium z-20'>
                    FEATURED
                  </div>
                </div>
              </div>

              {/* Floating Stats Card - Consistent Text */}
              <div className='absolute top-8 left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-medium border border-primary-100 animate-fadeIn'>
                <div className='text-center'>
                  <div className='text-xl font-black text-primary-900'>4.9</div>
                  <div className='text-base text-primary-600 font-medium'>
                    Guest Rating
                  </div>
                  <div className='flex justify-center mt-1'>
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i} className='text-amber-400 text-base'>
                        {star}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geometric Accents */}
              <div className='absolute top-20 right-4 w-6 h-6 bg-primary-600 rounded-full opacity-60'></div>
              <div className='absolute bottom-32 right-8 w-4 h-4 bg-primary-800 rounded-full opacity-40'></div>
              <div className='absolute top-1/2 left-4 w-2 h-8 bg-primary-400 rounded-full opacity-30'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header
