import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa'
import { HiMail, HiLockClosed } from 'react-icons/hi'
import { HiHome } from 'react-icons/hi2'
import { navigateToHome } from '../../utils/navigation'
import useScrollToTop from '../../hooks/useScrollToTop'
import { toast } from 'sonner'

const Hostlogin = () => {
  // Use scroll to top hook
  useScrollToTop()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
  }

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = (password) =>
    password.length >= 8 && /[A-Z]/.test(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Basic validation
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!isEmailValid(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (!isPasswordValid(password)) {
      newErrors.password =
        'Password must be at least 8 characters long and contain an uppercase letter'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    // Simulate API call
    try {
      console.log('Host login:', { email, password })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Login successful! Redirecting to host dashboard...', {
        duration: 2000,
        className: 'text-sm font-medium',
      })
      setTimeout(() => {
        navigate('/host-dashboard')
      }, 1000)
    } catch {
      toast.error('Login failed. Please check your credentials.', {
        duration: 3000,
        className: 'text-sm font-medium',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      console.log('Google host login')
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Google login successful! Welcome back!', {
        duration: 2000,
        className: 'text-sm font-medium',
      })
      setTimeout(() => {
        setIsGoogleLoading(false)
        navigate('/host-dashboard')
      }, 1000)
    } catch {
      console.error('Google login failed')
      toast.error('Google login failed. Please try again.', {
        duration: 3000,
        className: 'text-sm font-medium',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100 relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary-200/10 to-primary-600/20'></div>
        <div className='absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23475569" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30'></div>
      </div>

      {/* Back Button - Improved Text Size */}
      <button
        onClick={() => navigate('/host')}
        className='absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 md:gap-3 text-primary-600 hover:text-primary-800 bg-neutral-25/80 backdrop-blur-md px-3 py-2.5 md:px-4 md:py-3 rounded-2xl md:rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300 font-medium z-10 border border-neutral-200/20 text-sm md:text-base'
      >
        <FaArrowLeft className='text-sm md:text-sm' />
        <span className='hidden sm:inline text-sm md:text-base'>
          Back to Host
        </span>
        <span className='sm:hidden text-sm'>Back</span>
      </button>

      {/* Main Container - Improved Mobile Spacing */}
      <div className='min-h-screen flex items-center justify-center p-4 pt-20 md:pt-4 relative z-10'>
        <div className='w-full max-w-6xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-8 md:gap-12 items-center'>
            {/* Left Side - Branding */}
            <div className='hidden lg:block text-center space-y-8'>
              <div className='space-y-6'>
                {/* Logo */}
                <div
                  className='flex items-center justify-center gap-4 mb-8 cursor-pointer group'
                  onClick={handleHomeNavigation}
                >
                  <div className='w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300'>
                    <HiHome className='text-neutral-25 text-3xl group-hover:scale-110 transition-transform duration-300' />
                  </div>
                  <div>
                    <h1 className='text-4xl font-NotoSans font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300'>
                      Homehive
                    </h1>
                    <p className='text-primary-500 font-medium'>Host Portal</p>
                  </div>
                </div>

                {/* Hero Content */}
                <div className='space-y-6'>
                  <h2 className='text-3xl font-NotoSans font-bold text-primary-800 leading-tight'>
                    Manage Your Properties
                    <br />
                    <span className='bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent'>
                      Like a Pro
                    </span>
                  </h2>
                  <p className='text-lg text-primary-600 leading-relaxed max-w-md mx-auto'>
                    Access your dashboard, track bookings, manage listings, and
                    grow your hosting business with our comprehensive platform.
                  </p>
                </div>

                {/* Features */}
                <div className='grid grid-cols-2 gap-6 pt-8'>
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-accent-blue-50 rounded-xl mx-auto flex items-center justify-center'>
                      <span className='text-accent-blue-600 text-xl'>📊</span>
                    </div>
                    <h3 className='font-semibold text-primary-800'>
                      Analytics
                    </h3>
                    <p className='text-sm text-primary-600'>
                      Track your earnings
                    </p>
                  </div>
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-success-50 rounded-xl mx-auto flex items-center justify-center'>
                      <span className='text-success-600 text-xl'>🏠</span>
                    </div>
                    <h3 className='font-semibold text-primary-800'>Listings</h3>
                    <p className='text-sm text-primary-600'>
                      Manage properties
                    </p>
                  </div>
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-accent-blue-50 rounded-xl mx-auto flex items-center justify-center'>
                      <span className='text-accent-blue-600 text-xl'>📅</span>
                    </div>
                    <h3 className='font-semibold text-primary-800'>Bookings</h3>
                    <p className='text-sm text-primary-600'>
                      View reservations
                    </p>
                  </div>
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-warning-50 rounded-xl mx-auto flex items-center justify-center'>
                      <span className='text-warning-600 text-xl'>💬</span>
                    </div>
                    <h3 className='font-semibold text-primary-800'>Messages</h3>
                    <p className='text-sm text-primary-600'>
                      Guest communications
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className='w-full max-w-md mx-auto lg:mx-0'>
              {/* Mobile Logo - Better Text Sizing */}
              <div className='lg:hidden text-center mb-6 md:mb-8'>
                <div
                  className='flex flex-col items-center gap-3 mb-4 cursor-pointer group'
                  onClick={handleHomeNavigation}
                >
                  <div className='w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300'>
                    <HiHome className='text-neutral-25 text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300' />
                  </div>
                  <div className='text-center'>
                    <h1 className='text-2xl sm:text-3xl font-NotoSans font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300'>
                      Homehive
                    </h1>
                    <p className='text-primary-500 font-medium text-sm sm:text-base mt-1'>
                      Host Portal
                    </p>
                  </div>
                </div>

                {/* Mobile Welcome Text - Larger */}
                <div className='mt-4 mb-6'>
                  <h2 className='text-xl sm:text-2xl font-semibold text-primary-800 mb-2'>
                    Welcome Back, Host!
                  </h2>
                  <p className='text-base sm:text-lg text-primary-600'>
                    Sign in to manage your properties
                  </p>
                </div>
              </div>

              {/* Login Card - Balanced Form Sizing */}
              <div className='bg-neutral-25/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-strong border border-neutral-200/20 p-6 md:p-8 relative'>
                {/* Card Header - Better Text Sizing */}
                <div className='text-center mb-6 md:mb-8'>
                  <div className='inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-accent-blue-50 border border-primary-200 rounded-full px-4 py-2 md:px-5 md:py-2.5 mb-4 md:mb-5'>
                    <HiHome className='text-primary-600 text-sm md:text-base' />
                    <span className='text-sm md:text-base font-medium text-primary-700'>
                      Host Login
                    </span>
                  </div>
                  <h2 className='text-2xl md:text-3xl font-NotoSans font-bold text-primary-800 mb-3 lg:block hidden'>
                    Welcome Back
                  </h2>
                  <p className='text-primary-600 text-base md:text-lg lg:block hidden'>
                    Sign in to your host dashboard
                  </p>
                </div>

                {/* Login Form - Balanced Form and Text Sizes */}
                <form
                  onSubmit={handleSubmit}
                  className='space-y-5 md:space-y-6'
                >
                  {/* Email Field - Better Proportions */}
                  <div className='space-y-2'>
                    <label
                      htmlFor='email'
                      className='text-base md:text-lg font-semibold text-primary-700 flex items-center gap-2'
                    >
                      <HiMail className='text-primary-500 text-base md:text-lg' />
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3.5 md:py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-neutral-25/80 placeholder-primary-400 text-base md:text-lg ${
                        errors.email
                          ? 'border-error-300 focus:border-error-500 bg-error-50/50'
                          : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
                      }`}
                      placeholder='Enter your email address'
                      style={{
                        fontSize: '16px', // Prevents zoom on iOS
                        minHeight: '50px', // Better touch target
                      }}
                    />
                    {errors.email && (
                      <p className='text-error-600 text-sm md:text-base flex items-center gap-2 mt-2'>
                        <span className='text-sm'>⚠️</span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field - Better Proportions */}
                  <div className='space-y-2'>
                    <label
                      htmlFor='password'
                      className='text-base md:text-lg font-semibold text-primary-700 flex items-center gap-2'
                    >
                      <HiLockClosed className='text-primary-500 text-base md:text-lg' />
                      Password
                    </label>
                    <div className='relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3.5 md:py-4 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-neutral-25/80 placeholder-primary-400 text-base md:text-lg ${
                          errors.password
                            ? 'border-error-300 focus:border-error-500 bg-error-50/50'
                            : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
                        }`}
                        placeholder='Enter your password'
                        style={{
                          fontSize: '16px', // Prevents zoom on iOS
                          minHeight: '50px', // Better touch target
                        }}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors duration-200 p-1'
                      >
                        {showPassword ? (
                          <FaEyeSlash className='text-xl md:text-2xl' />
                        ) : (
                          <FaEye className='text-xl md:text-2xl' />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className='text-error-600 text-sm md:text-base flex items-center gap-2 mt-2'>
                        <span className='text-sm'>⚠️</span>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password - Fixed Flexbox Layout */}
                  <div className='flex items-center justify-between pt-3 gap-4'>
                    <label className='flex items-center gap-3 cursor-pointer group flex-shrink-0'>
                      <div className='relative'>
                        <input
                          type='checkbox'
                          className='peer sr-only'
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <div className='w-5 h-5 border-2 border-primary-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all duration-200 flex items-center justify-center'>
                          {rememberMe && (
                            <svg
                              className='w-3 h-3 text-white'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className='text-base md:text-lg text-primary-600 group-hover:text-primary-800 transition-colors duration-200 font-medium whitespace-nowrap'>
                        Remember me
                      </span>
                    </label>
                    <button
                      type='button'
                      className='text-base md:text-lg text-primary-600 hover:text-primary-800 font-semibold transition-colors duration-200 hover:underline flex-shrink-0'
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button - Better Proportions */}
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`w-full py-4 md:py-5 rounded-xl font-semibold text-neutral-25 transition-all duration-300 transform relative overflow-hidden text-base md:text-lg ${
                      isLoading
                        ? 'bg-neutral-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 hover:scale-[1.02] active:scale-[0.98] shadow-medium hover:shadow-strong'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center gap-3 ${
                        isLoading ? 'opacity-0' : 'opacity-100'
                      } transition-opacity duration-300`}
                    >
                      <HiHome className='text-lg md:text-xl' />
                      <span>Sign In to Dashboard</span>
                    </div>
                    {isLoading && (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-6 h-6 md:w-7 md:h-7 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      </div>
                    )}
                  </button>

                  {/* Divider - Better Spacing */}
                  <div className='relative my-7 md:my-8'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-primary-200'></div>
                    </div>
                    <div className='relative flex justify-center text-base md:text-lg'>
                      <span className='px-4 bg-neutral-25 text-primary-500 font-medium'>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Login - Better Button Size */}
                  <button
                    type='button'
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className='w-full py-4 md:py-5 px-4 border-2 border-primary-200 hover:border-primary-300 rounded-xl font-semibold text-primary-700 bg-neutral-25 hover:bg-primary-50 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-soft hover:shadow-medium text-base md:text-lg'
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className='w-5 h-5 md:w-6 md:h-6 border-2 border-slate-600 border-t-transparent rounded-full animate-spin'></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <img
                          src='https://www.google.com/favicon.ico'
                          alt='Google'
                          className='w-5 h-5 md:w-6 md:h-6'
                        />
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Sign Up Link - Better Text Size */}
                <div className='mt-7 md:mt-8 text-center p-5 md:p-6 bg-primary-50/80 rounded-2xl border border-primary-100'>
                  <p className='text-primary-600 mb-3 text-base md:text-lg'>
                    New to hosting with us?
                  </p>
                  <button
                    onClick={() => navigate('/host-signup')}
                    className='text-primary-600 hover:text-primary-800 font-semibold transition-colors duration-200 hover:underline text-base md:text-lg'
                  >
                    Create your host account →
                  </button>
                </div>

                {/* Success/Error Messages */}
                {errors.submit && (
                  <div className='mt-4 p-4 bg-error-50 border border-error-200 rounded-xl'>
                    <p className='text-error-700 text-sm flex items-center gap-2'>
                      <span className='text-lg'>❌</span>
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Links - Better Text Size */}
              <div className='mt-6 md:mt-8 text-center space-y-3 md:space-y-4'>
                <div className='flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm md:text-base text-primary-500'>
                  <a
                    href='/privacy'
                    className='hover:text-primary-700 transition-colors duration-200'
                  >
                    Privacy Policy
                  </a>
                  <span className='text-primary-300 hidden sm:inline'>•</span>
                  <a
                    href='/terms'
                    className='hover:text-primary-700 transition-colors duration-200'
                  >
                    Terms of Service
                  </a>
                  <span className='text-primary-300 hidden sm:inline'>•</span>
                  <a
                    href='/partner-help'
                    className='hover:text-primary-700 transition-colors duration-200'
                  >
                    Help Center
                  </a>
                </div>
                <p className='text-xs md:text-sm text-primary-400'>
                  © 2024 Homehive. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hostlogin
