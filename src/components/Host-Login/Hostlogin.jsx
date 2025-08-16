import React, { useState } from 'react'
import HomeHiveLogo from '../../assets/HomeHiveLogo'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaArrowLeft, FaChevronDown } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { HiMail, HiLockClosed, HiHome } from 'react-icons/hi'

const Hostlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('NG')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const navigate = useNavigate()

  const countries = [
    { code: 'NG', name: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
    {
      code: 'US',
      name: 'United States',
      flag: 'https://flagcdn.com/w40/us.png',
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      flag: 'https://flagcdn.com/w40/gb.png',
    },
    { code: 'CA', name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
    { code: 'AU', name: 'Australia', flag: 'https://flagcdn.com/w40/au.png' },
    { code: 'DE', name: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
    { code: 'FR', name: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'ES', name: 'Spain', flag: 'https://flagcdn.com/w40/es.png' },
    { code: 'IT', name: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
    { code: 'BR', name: 'Brazil', flag: 'https://flagcdn.com/w40/br.png' },
    { code: 'MX', name: 'Mexico', flag: 'https://flagcdn.com/w40/mx.png' },
    { code: 'JP', name: 'Japan', flag: 'https://flagcdn.com/w40/jp.png' },
    { code: 'KR', name: 'South Korea', flag: 'https://flagcdn.com/w40/kr.png' },
    { code: 'IN', name: 'India', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'CN', name: 'China', flag: 'https://flagcdn.com/w40/cn.png' },
  ]

  const selectedCountryData = countries.find(
    (country) => country.code === selectedCountry
  )

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = (password) =>
    password.length >= 8 && /[A-Z]/.test(password)

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!isPasswordValid(password)) {
      setError(
        'Password must be at least 8 characters long and contain an uppercase letter.'
      )
      return
    }

    setError('')
    setIsLoading(true)

    try {
      // Add your host login logic here
      console.log('Host login:', { email, password })
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // Navigate to host dashboard
        navigate('/host-dashboard')
      }, 1500)
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      console.log('Google host login')
      setTimeout(() => {
        setIsGoogleLoading(false)
        navigate('/host-dashboard')
      }, 1500)
    } catch {
      console.error('Google login failed')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest('.country-selector')) {
        setShowCountryDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showCountryDropdown])

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50'>
      {/* Modern Navbar */}
      <nav className='bg-white/95 backdrop-blur-md shadow-soft border-b border-primary-100'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='max-w-6xl mx-auto flex items-center justify-between'>
            {/* Logo */}
            <div
              className='flex items-center gap-4 cursor-pointer group'
              onClick={() => navigate('/host')}
            >
              <div className='relative'>
                <HomeHiveLogo
                  className='w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110'
                  alt='Homehive Logo'
                />
              </div>
              <div>
                <h1 className='font-NotoSans text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
                  Homehive
                </h1>
                <div className='text-sm text-primary-600 font-medium'>
                  Host Login
                </div>
              </div>
            </div>

            {/* Country Selector */}
            <div className='relative country-selector'>
              <button
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className='hidden md:flex items-center gap-3 bg-primary-50 border-2 border-primary-200 hover:border-primary-300 rounded-xl px-4 py-3 hover:bg-primary-100 transition-all duration-300 min-w-[140px]'
              >
                <img
                  src={selectedCountryData?.flag}
                  alt={`${selectedCountryData?.name} Flag`}
                  className='w-6 h-4 object-cover rounded-sm'
                />
                <span className='text-sm font-medium text-primary-800'>
                  {selectedCountryData?.code}
                </span>
                <FaChevronDown
                  className={`text-primary-600 text-sm transition-transform duration-300 ${
                    showCountryDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Country Dropdown */}
              {showCountryDropdown && (
                <div className='absolute top-full right-0 mt-2 w-64 bg-white border-2 border-primary-200 rounded-xl shadow-strong z-50 max-h-80 overflow-y-auto'>
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code)
                        setShowCountryDropdown(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors duration-300 text-left ${
                        selectedCountry === country.code ? 'bg-primary-100' : ''
                      }`}
                    >
                      <img
                        src={country.flag}
                        alt={`${country.name} Flag`}
                        className='w-6 h-4 object-cover rounded-sm'
                      />
                      <span className='text-sm font-medium text-primary-800'>
                        {country.name}
                      </span>
                      <span className='text-xs text-primary-600 ml-auto'>
                        {country.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate('/host')}
        className='absolute top-28 left-6 flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors duration-300 font-medium'
      >
        <FaArrowLeft className='text-sm' />
        <span>Back to Host</span>
      </button>

      {/* Main Content */}
      <div className='flex items-center justify-center min-h-[calc(100vh-96px)] px-4 py-12'>
        <div className='w-full max-w-md'>
          {/* Login Card */}
          <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-strong border border-primary-100 p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='inline-flex items-center gap-2 bg-primary-100 border border-primary-200 rounded-full px-4 py-2 mb-6'>
                <HiHome className='text-primary-600 text-sm' />
                <span className='text-sm font-medium text-primary-700'>
                  Host Login
                </span>
              </div>

              <h2 className='font-NotoSans text-3xl font-bold text-primary-900 mb-3'>
                Welcome Back
              </h2>
              <p className='text-lg text-primary-600'>
                Sign in to manage your properties
              </p>
            </div>

            {/* Login Form */}
            <div className='space-y-6'>
              {/* Email Input */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-primary-700'>
                  Email Address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <HiMail className='h-5 w-5 text-primary-400' />
                  </div>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400'
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-primary-700'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <HiLockClosed className='h-5 w-5 text-primary-400' />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full pl-12 pr-12 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-4 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className='h-5 w-5 text-primary-500 hover:text-primary-700 transition-colors duration-300' />
                    ) : (
                      <FaEye className='h-5 w-5 text-primary-500 hover:text-primary-700 transition-colors duration-300' />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className='bg-error-50 border border-error-200 rounded-xl p-3'>
                  <p className='text-error-700 text-sm'>{error}</p>
                </div>
              )}

              {/* Forgot Password */}
              <div className='text-right'>
                <Link
                  to='/forgot-password'
                  className='text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors duration-300'
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Login Buttons */}
            <div className='space-y-4 mt-8'>
              {/* Email Login Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className='w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3'
              >
                {isLoading ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In to Host Portal'
                )}
              </button>

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-primary-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-primary-500 font-medium'>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className='w-full bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-primary-800 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 shadow-soft hover:shadow-medium'
              >
                {isGoogleLoading ? (
                  <>
                    <div className='w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <FcGoogle className='text-xl' />
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Create Account Link */}
            <div className='text-center mt-8 pt-6 border-t border-primary-200'>
              <p className='text-primary-600'>
                New to hosting?{' '}
                <button
                  onClick={() => navigate('/host-signup')}
                  className='text-primary-800 hover:text-primary-900 font-semibold transition-colors duration-300'
                >
                  Create Host Account
                </button>
              </p>
            </div>
          </div>

          {/* Help Links */}
          <div className='mt-8 text-center space-y-4'>
            <p className='text-sm text-primary-600'>
              Need help with your property or dashboard?
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/partner-help'
                className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300 text-sm'
              >
                Visit Partner Help
              </Link>
              <Link
                to='/partner-community'
                className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300 text-sm'
              >
                Partner Community
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className='mt-12 text-center'>
            <div className='text-xs text-primary-500 space-y-2'>
              <p>
                By signing in, you agree to Homehive's{' '}
                <Link
                  to='/terms'
                  className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300'
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  to='/privacy'
                  className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300'
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <p>© 2025 Homehive™. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hostlogin
