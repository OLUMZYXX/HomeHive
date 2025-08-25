import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'
import { HiMail, HiLockClosed } from 'react-icons/hi'
import loginImg from '../../assets/login.jpg'
import { toast } from '../../utils/toast.jsx'
import { navigateToHome } from '../../utils/navigation'
import useScrollToTop from '../../hooks/useScrollToTop'
import { useAPI } from '../../contexts/APIContext'
import { FcGoogle } from 'react-icons/fc'
import GoogleAuth from '../../config/googleAuth'

const Login = () => {
  // Use scroll to top hook
  useScrollToTop()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, googleAuth } = useAPI()

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location)
  }

  const isPasswordValid = (password) => password.length >= 6
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!isPasswordValid(password)) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password, false) // false for regular user

      toast.success(`Welcome back!`, {
        description: 'Login successful! Redirecting you now...',
        duration: 3000,
      })

      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
      localStorage.removeItem('redirectAfterLogin')
      setTimeout(() => navigate(redirectPath), 1500)
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Invalid email or password. Please try again.'
      setError(errorMessage)
      toast.error('Authentication Error', {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      console.log('🔄 Starting Google login process...')

      // Initialize and sign in with Google
      await GoogleAuth.initialize()
      console.log('✅ Google Auth initialized')

      const googleUser = await GoogleAuth.signIn()
      console.log('✅ Google user signed in:', googleUser.email)

      // Send to backend for authentication/registration
      const result = await googleAuth(googleUser.idToken, {
        email: googleUser.email,
        name: googleUser.name,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.id,
        isHost: false, // Explicitly set for user authentication
      })
      console.log('✅ Backend authentication successful:', result)

      toast.success(
        'Google login successful! Redirecting you now...',
        `Welcome ${googleUser.name}!`,
        { autoClose: 3000 }
      )
      console.log('✅ Toast notification shown')

      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
      localStorage.removeItem('redirectAfterLogin')
      console.log('🔄 Redirecting to:', redirectPath)
      setTimeout(() => navigate(redirectPath), 1500)
    } catch (error) {
      console.error('❌ Google login error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      const errorMessage =
        error.message || 'Google login failed. Please try again.'
      toast.error(errorMessage, 'Authentication Error', { autoClose: 4000 })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4'>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className='absolute top-6 left-6 flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors duration-300 font-medium'
      >
        <FaArrowLeft className='text-sm' />
        <span>Back to Home</span>
      </button>

      {/* Main Container */}
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-strong overflow-hidden border border-primary-100'>
        <div className='grid grid-cols-1 lg:grid-cols-2 min-h-[600px]'>
          {/* Left Side: Image & Branding */}
          <div className='relative bg-gradient-to-br from-primary-800 to-primary-900 p-8 lg:p-12 hidden lg:flex flex-col justify-center items-center text-white'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10'>
              <img
                src={loginImg}
                alt='Background'
                className='w-full h-full object-cover'
                loading='lazy'
                decoding='async'
                width={1920}
                height={1080}
              />
            </div>

            {/* Content */}
            <div className='relative z-10 text-center space-y-8'>
              <div>
                <h1 className='font-NotoSans text-4xl lg:text-5xl font-bold mb-4'>
                  Welcome to
                  <span className='block text-transparent bg-gradient-to-r from-primary-200 to-white bg-clip-text'>
                    Homehive
                  </span>
                </h1>
                <p className='text-xl text-primary-100 leading-relaxed'>
                  Discover exceptional accommodations and create unforgettable
                  memories
                </p>
              </div>

              {/* Stats removed as requested */}

              {/* Testimonial */}
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                <p className='text-primary-100 italic mb-3'>
                  &ldquo;The best accommodation platform I&#39;ve ever used.
                  Exceptional service and quality!&rdquo;
                </p>
                <div className='text-sm text-primary-200'>
                  - Sarah J., Verified Guest
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className='p-8 lg:p-12 flex flex-col justify-center'>
            <div className='max-w-md mx-auto w-full space-y-8'>
              {/* Header */}
              <div className='text-center space-y-3'>
                <h2 className='font-NotoSans text-3xl lg:text-4xl font-bold text-primary-900'>
                  Welcome Back
                </h2>
                <p className='text-lg text-primary-600'>
                  Sign in to your account to continue
                </p>
              </div>

              {/* Form */}
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
                  <button className='text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors duration-300'>
                    Forgot your password?
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className='space-y-4'>
                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className='w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl border border-primary-200 hover:border-primary-300 shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3'
                >
                  {isLoading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    'Sign In'
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
                  className='w-full bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-primary-800 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-soft hover:shadow-medium'
                >
                  <FcGoogle className='w-6 h-6' />
                  <span>
                    {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className='text-center pt-6 border-t border-primary-200'>
                <p className='text-primary-600'>
                  Don&#39;t have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className='text-primary-800 hover:text-primary-900 font-semibold transition-colors duration-300'
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
