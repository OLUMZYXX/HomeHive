'use client'
import heroimg from '../../assets/heroimg.png'
import { useNavigate } from 'react-router-dom'
import { HiArrowRight, HiLocationMarker, HiStar } from 'react-icons/hi'

const Hero = () => {
  const navigate = useNavigate()

  const handleExploreClick = () => {
    navigate('/signin')
  }

  const handleLearnMore = () => {
    document
      .getElementById('accomodation')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className='relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 overflow-hidden'>
      {/* Background Decorative Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-50 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-neutral-100 rounded-full opacity-50 blur-3xl'></div>
      </div>

      <div className='relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-32 pb-16 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]'>
          {/* Left Content Section */}
          <div className='flex flex-col justify-center space-y-8 text-center lg:text-left order-2 lg:order-1'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 w-fit mx-auto lg:mx-0 shadow-soft'>
              <HiLocationMarker className='text-primary-600 text-sm' />
              <span className='text-sm font-medium text-primary-700'>
                Premium Accommodations
              </span>
            </div>

            {/* Main Heading */}
            <div className='space-y-4'>
              <h1 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight'>
                <span className='text-primary-800'>Gateway to your</span>
                <br />
                <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text'>
                  Perfect Stay
                </span>
              </h1>

              <div className='w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-800 mx-auto lg:mx-0 rounded-full'></div>
            </div>

            {/* Description */}
            <p className='text-lg sm:text-xl lg:text-2xl text-primary-600 leading-relaxed max-w-2xl mx-auto lg:mx-0'>
              Discover exceptional accommodations tailored to your needs.
              Experience comfort, luxury, and memorable stays with our curated
              collection.
            </p>

            {/* Stats Row */}
            <div className='flex flex-wrap justify-center lg:justify-start gap-8 py-4'>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-primary-800'>
                  500+
                </div>
                <div className='text-sm text-primary-600'>Properties</div>
              </div>
              <div className='text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <span className='text-2xl sm:text-3xl font-bold text-primary-800'>
                    4.9
                  </span>
                  <HiStar className='text-amber-400 text-lg' />
                </div>
                <div className='text-sm text-primary-600'>Rating</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-primary-800'>
                  10K+
                </div>
                <div className='text-sm text-primary-600'>Happy Guests</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
              <button
                onClick={handleExploreClick}
                className='group bg-primary-800 hover:bg-primary-900 text-white font-semibold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 min-w-[200px]'
              >
                Explore Stays
                <HiArrowRight className='text-lg group-hover:translate-x-1 transition-transform duration-300' />
              </button>

              <button
                onClick={handleLearnMore}
                className='border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 min-w-[200px]'
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4'>
              <div className='flex items-center gap-2 text-sm text-primary-600'>
                <div className='w-2 h-2 bg-success-500 rounded-full'></div>
                <span>Instant Booking</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-primary-600'>
                <div className='w-2 h-2 bg-success-500 rounded-full'></div>
                <span>24/7 Support</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-primary-600'>
                <div className='w-2 h-2 bg-success-500 rounded-full'></div>
                <span>Best Price Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className='relative order-1 lg:order-2 flex justify-center lg:justify-end'>
            {/* Main Image Container */}
            <div className='relative group'>
              {/* Background Decoration */}
              <div className='absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-3xl transform rotate-6 opacity-20 group-hover:rotate-3 transition-transform duration-500'></div>

              {/* Image */}
              <div className='relative bg-white p-3 rounded-3xl shadow-strong'>
                <img
                  src={heroimg}
                  alt='Beautiful accommodation showcasing comfort and luxury'
                  className='w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto rounded-2xl object-cover transform group-hover:scale-105 transition-transform duration-700'
                  loading='eager'
                  decoding='async'
                  width={1024}
                  height={768}
                />

                {/* Floating Cards */}
                <div className='absolute -top-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-medium animate-fadeIn'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 bg-success-500 rounded-full animate-pulse'></div>
                    <span className='text-sm font-medium text-primary-800'>
                      Available Now
                    </span>
                  </div>
                </div>

                <div className='absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-medium animate-fadeIn animation-delay-300'>
                  <div className='flex items-center gap-2'>
                    <HiStar className='text-amber-400 text-lg' />
                    <span className='text-sm font-bold text-primary-800'>
                      4.9
                    </span>
                    <span className='text-xs text-primary-600'>
                      (2.1k reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className='absolute top-20 right-10 w-20 h-20 bg-primary-100 rounded-full opacity-60 animate-pulse hidden lg:block'></div>
            <div className='absolute bottom-32 left-8 w-16 h-16 bg-neutral-100 rounded-full opacity-40 animate-pulse animation-delay-500 hidden lg:block'></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <div className='w-6 h-10 border-2 border-primary-300 rounded-full flex justify-center'>
            <div className='w-1 h-3 bg-primary-600 rounded-full mt-2 animate-pulse'></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
