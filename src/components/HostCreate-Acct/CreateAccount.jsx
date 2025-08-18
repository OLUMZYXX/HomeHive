import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa'
import { HiMail, HiLockClosed } from 'react-icons/hi'
import { HiUser } from 'react-icons/hi2'
import { navigateToHome } from '../../utils/navigation'
import useScrollToTop from '../../hooks/useScrollToTop'
import { toast } from 'sonner'

const Createacct = () => {
  // Use scroll to top hook
  useScrollToTop()

  const navigate = useNavigate()
  const location = useLocation()

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
  }
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  // Validate Email
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Validate Password Strength
  const isPasswordValid = (password) => {
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    )
  }

  // Handle Create Account
  const handleCreateAccount = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isEmailValid(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (!isPasswordValid(password)) {
      newErrors.password =
        'Password must be at least 8 characters with uppercase and number'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success('Host account created successfully! Welcome to HomeHive!', {
        duration: 4000,
        className: 'text-sm font-medium',
      })
      setTimeout(() => {
        navigate('/host-dashboard')
      }, 1000)
    } catch {
      toast.error('Failed to create account. Please try again.', {
        duration: 3000,
        className: 'text-sm font-medium',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccessMessage('Google sign up successful! Redirecting...')
      setTimeout(() => {
        navigate('/host-dashboard')
      }, 1000)
    } catch {
      setErrors({ submit: 'Google sign up failed. Please try again.' })
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

      {/* Back Button - Improved Mobile Layout */}
      <button
        onClick={() => navigate('/hostlogin')}
        className='absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 md:gap-3 text-primary-600 hover:text-primary-800 bg-neutral-25/80 backdrop-blur-md px-3 py-2.5 md:px-4 md:py-3 rounded-2xl md:rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300 font-medium z-10 border border-neutral-200/20 text-sm md:text-base'
      >
        <FaArrowLeft className='text-sm md:text-sm' />
        <span className='hidden sm:inline text-sm md:text-base'>
          Back to Login
        </span>
        <span className='sm:hidden text-sm'>Back</span>
      </button>

      {/* Main Container */}
      <div className='min-h-screen flex items-center justify-center p-4 relative z-10'>
        <div className='w-full max-w-2xl mx-auto'>
          <div className='grid lg:grid-cols-1 gap-8 items-center'>
            {/* Sign Up Card */}
            <div className='w-full max-w-2xl mx-auto'>
              {/* Mobile Logo */}
              <div className='text-center mb-8'>
                <div
                  className='flex items-center justify-center gap-4 mb-4 cursor-pointer group'
                  onClick={handleHomeNavigation}
                >
                  <div className='w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300'>
                    <HiUser className='text-neutral-25 text-2xl group-hover:scale-110 transition-transform duration-300' />
                  </div>
                  <div>
                    <h1 className='text-2xl font-NotoSans font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300'>
                      Homehive
                    </h1>
                    <p className='text-primary-500 font-medium text-sm'>
                      Host Portal
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign Up Card - Enhanced Mobile Layout */}
              <div className='bg-neutral-25/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-strong border border-neutral-200/20 p-4 sm:p-6 lg:p-8 relative'>
                {/* Card Header */}
                <div className='text-center mb-6 sm:mb-8'>
                  <div className='inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-accent-blue-50 border border-primary-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4'>
                    <HiUser className='text-primary-600 text-xs sm:text-sm' />
                    <span className='text-xs sm:text-sm font-medium text-primary-700'>
                      Host Sign Up
                    </span>
                  </div>
                  <h2 className='text-xl sm:text-2xl font-NotoSans font-bold text-primary-800 mb-1.5 sm:mb-2'>
                    Create Host Account
                  </h2>
                  <p className='text-sm sm:text-base text-primary-600'>
                    Join our community and start hosting today
                  </p>
                </div>

                {/* Sign Up Form - Enhanced Mobile Layout */}
                <form
                  onSubmit={handleCreateAccount}
                  className='space-y-4 sm:space-y-6'
                >
                  {/* Name Fields */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                    <div className='space-y-1.5 sm:space-y-2'>
                      <label
                        htmlFor='firstName'
                        className='text-sm sm:text-sm font-semibold text-primary-700 flex items-center gap-1.5 sm:gap-2'
                      >
                        <HiUser className='text-primary-500 text-sm' />
                        First Name
                      </label>
                      <input
                        type='text'
                        id='firstName'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-neutral-25/80 placeholder-primary-400 ${
                          errors.firstName
                            ? 'border-error-300 focus:border-error-500 bg-error-50/50'
                            : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
                        }`}
                        placeholder='Enter first name'
                      />
                      {errors.firstName && (
                        <p className='text-error-600 text-sm flex items-center gap-2 mt-1'>
                          <span className='text-xs'>⚠️</span>
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className='space-y-1.5 sm:space-y-2'>
                      <label
                        htmlFor='lastName'
                        className='text-sm sm:text-sm font-semibold text-primary-700 flex items-center gap-1.5 sm:gap-2'
                      >
                        <HiUser className='text-primary-500 text-sm' />
                        Last Name
                      </label>
                      <input
                        type='text'
                        id='lastName'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-neutral-25/80 placeholder-primary-400 ${
                          errors.lastName
                            ? 'border-error-300 focus:border-error-500 bg-error-50/50'
                            : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
                        }`}
                        placeholder='Enter last name'
                      />
                      {errors.lastName && (
                        <p className='text-error-600 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mt-1'>
                          <span className='text-xs'>⚠️</span>
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className='space-y-1.5 sm:space-y-2'>
                    <label
                      htmlFor='email'
                      className='text-sm sm:text-sm font-semibold text-primary-700 flex items-center gap-1.5 sm:gap-2'
                    >
                      <HiMail className='text-primary-500 text-sm' />
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-neutral-25/80 placeholder-primary-400 ${
                        errors.email
                          ? 'border-error-300 focus:border-error-500 bg-error-50/50'
                          : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
                      }`}
                      placeholder='Enter your email address'
                    />
                    {errors.email && (
                      <p className='text-error-600 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mt-1'>
                        <span className='text-xs'>⚠️</span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                    <div className='space-y-1.5 sm:space-y-2'>
                      <label
                        htmlFor='password'
                        className='text-sm sm:text-sm font-semibold text-primary-700 flex items-center gap-1.5 sm:gap-2'
                      >
                        <HiLockClosed className='text-primary-500 text-sm' />
                        Password
                      </label>
                      <div className='relative'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-3 py-3 sm:px-4 sm:py-4 pr-10 sm:pr-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-neutral-25/80 placeholder-primary-400 ${
                            errors.password
                              ? 'border-error-300 focus:border-error-500 bg-error-50/50'
                              : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
                          }`}
                          placeholder='Create password'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors duration-200'
                        >
                          {showPassword ? (
                            <FaEyeSlash className='text-base sm:text-lg' />
                          ) : (
                            <FaEye className='text-base sm:text-lg' />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className='text-error-600 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mt-1'>
                          <span className='text-xs'>⚠️</span>
                          {errors.password}
                        </p>
                      )}
                      <div className='text-xs text-primary-500 mt-1.5 sm:mt-2'>
                        Must be 8+ characters with uppercase and number
                      </div>
                    </div>
                    <div className='space-y-1.5 sm:space-y-2'>
                      <label
                        htmlFor='confirmPassword'
                        className='text-sm sm:text-sm font-semibold text-primary-700 flex items-center gap-1.5 sm:gap-2'
                      >
                        <HiLockClosed className='text-primary-500 text-sm' />
                        Confirm Password
                      </label>
                      <div className='relative'>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id='confirmPassword'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full px-3 py-3 sm:px-4 sm:py-4 pr-10 sm:pr-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 bg-neutral-25/80 placeholder-primary-400 ${
                            errors.confirmPassword
                              ? 'border-error-300 focus:border-error-500 bg-error-50/50'
                              : 'border-primary-200 focus:border-primary-500 hover:border-primary-300'
                          }`}
                          placeholder='Confirm password'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className='absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors duration-200'
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className='text-base sm:text-lg' />
                          ) : (
                            <FaEye className='text-base sm:text-lg' />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className='text-error-600 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mt-1'>
                          <span className='text-xs'>⚠️</span>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms Checkbox - Enhanced Mobile Layout */}
                  <div className='flex items-start gap-2.5 sm:gap-3 pt-2'>
                    <div className='relative mt-0.5'>
                      <input
                        type='checkbox'
                        id='agreeTerms'
                        className='peer sr-only'
                        checked={agreeTerms}
                        onChange={() => setAgreeTerms(!agreeTerms)}
                      />
                      <div className='w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-300 rounded peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all duration-200 flex items-center justify-center'>
                        {agreeTerms && (
                          <svg
                            className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-25'
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
                    <label
                      htmlFor='agreeTerms'
                      className='text-xs sm:text-sm text-primary-600 cursor-pointer leading-relaxed'
                    >
                      I agree to the{' '}
                      <a
                        href='/terms'
                        className='text-primary-700 hover:text-primary-800 font-semibold underline'
                      >
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a
                        href='/privacy'
                        className='text-primary-700 hover:text-primary-800 font-semibold underline'
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className='text-error-600 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2'>
                      <span className='text-xs'>⚠️</span>
                      {errors.terms}
                    </p>
                  )}

                  {/* Submit Button - Enhanced Mobile Layout */}
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`w-full py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold text-neutral-25 transition-all duration-300 transform relative overflow-hidden ${
                      isLoading
                        ? 'bg-primary-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 hover:scale-[1.02] active:scale-[0.98] shadow-medium hover:shadow-strong'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center gap-2 sm:gap-3 ${
                        isLoading ? 'opacity-0' : 'opacity-100'
                      } transition-opacity duration-300`}
                    >
                      <HiUser className='text-base sm:text-lg' />
                      <span>Create Host Account</span>
                    </div>
                    {isLoading && (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-5 h-5 sm:w-6 sm:h-6 border-2 border-neutral-25/30 border-t-neutral-25 rounded-full animate-spin'></div>
                      </div>
                    )}
                  </button>

                  {/* Divider */}
                  <div className='relative my-6 sm:my-8'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-primary-200'></div>
                    </div>
                    <div className='relative flex justify-center text-xs sm:text-sm'>
                      <span className='px-3 sm:px-4 bg-neutral-25 text-primary-500 font-medium'>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign Up - Enhanced Mobile Layout */}
                  <button
                    type='button'
                    onClick={handleGoogleSignUp}
                    disabled={isGoogleLoading}
                    className='w-full py-3 sm:py-4 px-3 sm:px-4 text-sm sm:text-base border-2 border-primary-200 hover:border-primary-300 rounded-lg sm:rounded-xl font-semibold text-primary-700 bg-neutral-25 hover:bg-primary-50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-soft hover:shadow-medium'
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className='w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <img
                          src='https://www.google.com/favicon.ico'
                          alt='Google'
                          className='w-4 h-4 sm:w-5 sm:h-5'
                        />
                        <span>Sign up with Google</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Error/Success Messages - Enhanced Mobile Layout */}
                {errors.submit && (
                  <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-error-50 border border-error-200 rounded-lg sm:rounded-xl'>
                    <p className='text-error-700 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2'>
                      <span className='text-base sm:text-lg'>❌</span>
                      {errors.submit}
                    </p>
                  </div>
                )}

                {successMessage && (
                  <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-success-50 border border-success-200 rounded-lg sm:rounded-xl'>
                    <p className='text-success-700 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2'>
                      <span className='text-base sm:text-lg'>✅</span>
                      {successMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Sign In Link - Enhanced Mobile Layout */}
              <div className='mt-6 sm:mt-8 text-center p-4 sm:p-6 bg-primary-50/80 rounded-xl sm:rounded-2xl border border-primary-100'>
                <p className='text-xs sm:text-sm text-primary-600 mb-2 sm:mb-3'>
                  Already have a host account?
                </p>
                <button
                  onClick={() => navigate('/hostlogin')}
                  className='text-sm sm:text-base text-primary-600 hover:text-primary-800 font-semibold transition-colors duration-200 hover:underline'
                >
                  Sign in to your account →
                </button>
              </div>

              {/* Footer Links - Enhanced Mobile Layout */}
              <div className='mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4'>
                <div className='flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-primary-500'>
                  <a
                    href='/privacy'
                    className='hover:text-primary-700 transition-colors duration-200'
                  >
                    Privacy Policy
                  </a>
                  <span className='text-primary-300'>•</span>
                  <a
                    href='/terms'
                    className='hover:text-primary-700 transition-colors duration-200'
                  >
                    Terms of Service
                  </a>
                  <span className='text-primary-300'>•</span>
                  <a
                    href='/partner-help'
                    className='hover:text-primary-700 transition-colors duration-200'
                  >
                    Help Center
                  </a>
                </div>
                <p className='text-xs text-primary-400'>
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

export default Createacct
