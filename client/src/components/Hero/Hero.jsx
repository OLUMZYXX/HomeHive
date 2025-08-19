'use client'
import { useState, useEffect, useCallback } from 'react'
import heroimg from '../../assets/heroimg.png'
import { useNavigate } from 'react-router-dom'
import {
  HiArrowRight,
  HiLocationMarker,
  HiStar,
  HiRefresh,
} from 'react-icons/hi'
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  AnimatedButton,
  FloatingElement,
} from '../common/AnimatedComponents'
import { useAPI } from '../../contexts/APIContext'

const Hero = () => {
  const navigate = useNavigate()
  const { getPremiumImages } = useAPI()

  // State for image rotation
  const [currentImage, setCurrentImage] = useState(heroimg)
  const [premiumImages, setPremiumImages] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Fetch premium images on component mount
  const fetchPremiumImages = useCallback(async () => {
    try {
      setIsLoading(true)
      setImageError(false)

      const response = await getPremiumImages()

      if (
        response &&
        response.images &&
        Array.isArray(response.images) &&
        response.images.length > 0
      ) {
        // Filter valid images
        const validImages = response.images.filter((img) => {
          const imageUrl = img.imageUrl || img.url || img
          return (
            imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== ''
          )
        })

        if (validImages.length > 0) {
          setPremiumImages(validImages)
          const firstImage = validImages[0]
          setCurrentImage(firstImage.imageUrl || firstImage.url || firstImage)
          setImageIndex(0)
          console.log(`Loaded ${validImages.length} premium images`)
          return
        }
      }

      // No premium images available, keep default
      console.log('No premium images available, using default')
      setCurrentImage(heroimg)
      setPremiumImages([])
    } catch (error) {
      console.error('Error fetching premium images:', error)
      // Fallback to default image on error
      setCurrentImage(heroimg)
      setPremiumImages([])
      setImageError(true)
    } finally {
      setIsLoading(false)
    }
  }, [getPremiumImages])

  // Retry fetching premium images
  const retryFetchImages = useCallback(() => {
    if (!isLoading) {
      fetchPremiumImages()
    }
  }, [fetchPremiumImages, isLoading])

  // Setup image rotation
  useEffect(() => {
    fetchPremiumImages()
  }, [fetchPremiumImages])

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (premiumImages.length > 1) {
      const interval = setInterval(() => {
        setImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % premiumImages.length
          const nextImage = premiumImages[nextIndex]
          setCurrentImage(nextImage.imageUrl || nextImage.url || nextImage)
          return nextIndex
        })
      }, 5000) // 5 seconds

      return () => clearInterval(interval)
    }
  }, [premiumImages])

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageError(true)
    setCurrentImage(heroimg) // Fallback to default image
  }, [])

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
          <ScrollReveal
            direction='left'
            delay={0.2}
            className='flex flex-col justify-center space-y-8 text-center lg:text-left order-2 lg:order-1'
          >
            {/* Badge */}
            <ScrollReveal direction='up' delay={0.4}>
              <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 w-fit mx-auto lg:mx-0 shadow-soft'>
                <HiLocationMarker className='text-primary-600 text-sm' />
                <span className='text-sm font-medium text-primary-700'>
                  Premium Accommodations
                </span>
              </div>
            </ScrollReveal>

            {/* Main Heading */}
            <ScrollReveal direction='up' delay={0.6}>
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
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction='up' delay={0.8}>
              <p className='text-lg sm:text-xl lg:text-2xl text-primary-600 leading-relaxed max-w-2xl mx-auto lg:mx-0'>
                Discover exceptional accommodations tailored to your needs.
                Experience comfort, luxury, and memorable stays with our curated
                collection.
              </p>
            </ScrollReveal>

            {/* Stats Row */}
            <StaggerContainer
              staggerDelay={0.15}
              className='flex flex-wrap justify-center lg:justify-start gap-8 py-4'
            >
              <StaggerItem className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-primary-800'>
                  500+
                </div>
                <div className='text-sm text-primary-600'>Properties</div>
              </StaggerItem>
              <StaggerItem className='text-center'>
                <div className='flex items-center justify-center gap-1'>
                  <span className='text-2xl sm:text-3xl font-bold text-primary-800'>
                    4.9
                  </span>
                  <HiStar className='text-amber-400 text-lg' />
                </div>
                <div className='text-sm text-primary-600'>Rating</div>
              </StaggerItem>
              <StaggerItem className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-primary-800'>
                  10K+
                </div>
                <div className='text-sm text-primary-600'>Happy Guests</div>
              </StaggerItem>
            </StaggerContainer>

            {/* CTA Buttons */}
            <ScrollReveal direction='up' delay={1.0}>
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <AnimatedButton
                  onClick={handleExploreClick}
                  className='group bg-primary-800 hover:bg-primary-900 text-white font-semibold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px]'
                >
                  Explore Stays
                  <HiArrowRight className='text-lg group-hover:translate-x-1 transition-transform duration-300' />
                </AnimatedButton>

                <AnimatedButton
                  onClick={handleLearnMore}
                  className='border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 min-w-[200px]'
                >
                  Learn More
                </AnimatedButton>
              </div>
            </ScrollReveal>

            {/* Trust Indicators */}
            <StaggerContainer
              staggerDelay={0.1}
              className='flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4'
            >
              <StaggerItem className='flex items-center gap-2 text-sm text-primary-600'>
                <div className='w-2 h-2 bg-success-500 rounded-full'></div>
                <span>Instant Booking</span>
              </StaggerItem>
              <StaggerItem className='flex items-center gap-2 text-sm text-primary-600'>
                <div className='w-2 h-2 bg-success-500 rounded-full'></div>
                <span>24/7 Support</span>
              </StaggerItem>
              <StaggerItem className='flex items-center gap-2 text-sm text-primary-600'>
                <div className='w-2 h-2 bg-success-500 rounded-full'></div>
                <span>Best Price Guarantee</span>
              </StaggerItem>
            </StaggerContainer>
          </ScrollReveal>

          {/* Right Image Section */}
          <ScrollReveal
            direction='right'
            delay={0.3}
            className='relative order-1 lg:order-2 flex justify-center lg:justify-end'
          >
            {/* Main Image Container */}
            <div className='relative group'>
              {/* Background Decoration */}
              <div className='absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-3xl transform rotate-6 opacity-20 group-hover:rotate-3 transition-transform duration-500'></div>

              {/* Image */}
              <div className='relative bg-white p-3 rounded-3xl shadow-strong'>
                {isLoading && (
                  <div className='absolute inset-0 flex items-center justify-center bg-white rounded-2xl z-10'>
                    <div className='flex flex-col items-center space-y-4'>
                      <div className='w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin'></div>
                      <p className='text-sm text-primary-600'>
                        Loading premium images...
                      </p>
                    </div>
                  </div>
                )}

                <img
                  src={currentImage}
                  alt='Beautiful accommodation showcasing comfort and luxury'
                  className='w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto rounded-2xl object-cover transform group-hover:scale-105 transition-transform duration-700'
                  loading='eager'
                  decoding='async'
                  width={1024}
                  height={768}
                  onError={handleImageError}
                  style={{
                    opacity: isLoading ? 0.3 : 1,
                    transition: 'opacity 0.5s ease-in-out',
                  }}
                />

                {/* Premium Badge with Refresh */}
                {premiumImages.length > 0 && !imageError && (
                  <ScrollReveal direction='scale' delay={0.8}>
                    <div className='absolute top-4 right-4 flex items-center space-x-2'>
                      <div className='bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-medium'>
                        ✨ Premium Host
                      </div>
                      <button
                        onClick={retryFetchImages}
                        disabled={isLoading}
                        className='bg-white/90 backdrop-blur-sm text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50'
                        title='Refresh premium images'
                      >
                        <HiRefresh
                          className={`text-sm ${
                            isLoading ? 'animate-spin' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </ScrollReveal>
                )}

                {/* Image Counter */}
                {premiumImages.length > 1 && (
                  <div className='absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium'>
                    {imageIndex + 1} / {premiumImages.length}
                  </div>
                )}

                {/* Error Badge with Retry */}
                {imageError && (
                  <div className='absolute top-4 left-4 bg-red-100 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs'>
                    <div className='flex items-center space-x-2'>
                      <span>Server error - using fallback</span>
                      <button
                        onClick={retryFetchImages}
                        disabled={isLoading}
                        className='text-red-700 hover:text-red-800 underline font-medium disabled:opacity-50'
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {/* Floating Cards */}
                <ScrollReveal direction='scale' delay={1.2}>
                  <div className='absolute -top-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-medium'>
                    <div className='flex items-center gap-3'>
                      <div className='w-3 h-3 bg-success-500 rounded-full animate-pulse'></div>
                      <span className='text-sm font-medium text-primary-800'>
                        Available Now
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction='scale' delay={1.4}>
                  <div className='absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-medium'>
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
                </ScrollReveal>
              </div>
            </div>

            {/* Floating Elements */}
            <FloatingElement
              direction='y'
              distance={15}
              duration={4}
              className='absolute top-20 right-10 w-20 h-20 bg-primary-100 rounded-full opacity-60 hidden lg:block'
            />
            <FloatingElement
              direction='x'
              distance={10}
              duration={5}
              className='absolute bottom-32 left-8 w-16 h-16 bg-neutral-100 rounded-full opacity-40 hidden lg:block'
            />
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <ScrollReveal direction='up' delay={1.6}>
          <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
            <div className='w-6 h-10 border-2 border-primary-300 rounded-full flex justify-center'>
              <div className='w-1 h-3 bg-primary-600 rounded-full mt-2 animate-pulse'></div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default Hero
