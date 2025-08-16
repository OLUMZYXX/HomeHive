import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

const PageLoader = ({ children, duration = 3000 }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingVariant, setLoadingVariant] = useState('full')
  const location = useLocation()

  useEffect(() => {
    // Pages to exclude from loading
    const excludedPaths = [
      '/login',
      '/create-account',
      '/host-login',
      '/host-create-account',
    ]

    // Check if current page should be excluded
    if (excludedPaths.includes(location.pathname)) {
      setIsLoading(false)
      return
    }

    // Determine loading variant based on page and visit status
    const isHomePage =
      location.pathname === '/' || location.pathname === '/home'
    const isFirstVisit = !sessionStorage.getItem('hasVisited')

    if (isHomePage && (isFirstVisit || performance.navigation.type === 1)) {
      // Home page on first visit or refresh - show full loading
      setLoadingVariant('full')
      sessionStorage.setItem('hasVisited', 'true')
    } else {
      // Other pages or subsequent home visits - show spinner only
      setLoadingVariant('spinner')
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, location.pathname])

  const FullLoadingContent = () => (
    <div className='flex flex-col items-center space-y-8'>
      {/* HomeHive Logo with Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='text-center'
      >
        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent'>
          HomeHive
        </h1>
        <p className='text-neutral-600 text-sm md:text-base mt-2 font-medium'>
          Your perfect stay awaits
        </p>
      </motion.div>

      {/* Animated Loading Spinner */}
      <div className='relative'>
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className='w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full'
        />

        {/* Inner Pulse */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute inset-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-20'
        />
      </div>

      {/* Loading Dots */}
      <div className='flex space-x-2'>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
            className='w-2 h-2 bg-primary-500 rounded-full'
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className='text-neutral-600 text-sm font-medium tracking-wide'
      >
        Loading your experience...
      </motion.p>
    </div>
  )

  const SpinnerOnlyContent = () => (
    <div className='flex items-center justify-center'>
      {/* Enhanced Visible Spinner with Background */}
      <div className='relative p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-primary-200/50'>
        {/* Outer Ring - More visible */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className='w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full'
        />

        {/* Inner Glow - Enhanced */}
        <motion.div
          animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute inset-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-20 blur-sm'
        />

        {/* Center dot for better visibility */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full'
        />
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence mode='wait'>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed inset-0 z-[9999] flex items-center justify-center ${
              loadingVariant === 'full'
                ? 'bg-white/95 backdrop-blur-sm'
                : 'bg-transparent backdrop-blur-md'
            }`}
          >
            {loadingVariant === 'full' ? (
              <FullLoadingContent />
            ) : (
              <SpinnerOnlyContent />
            )}

            {/* Background Pattern (only for full loading) */}
            {loadingVariant === 'full' && (
              <div className='absolute inset-0 opacity-5'>
                <div
                  className='absolute inset-0'
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23475569' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Always visible but blurred during loading */}
      <div
        className={`transition-all duration-500 ${
          isLoading
            ? 'blur-md opacity-60 pointer-events-none'
            : 'blur-none opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  )
}

PageLoader.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
}

export default PageLoader
