// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { userAuth, userProvider } from '../../../firebaseConfig'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaShieldAlt,
  FaUsers,
  FaClock,
} from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { HiUser, HiMail, HiLockClosed, HiSparkles } from 'react-icons/hi'
import HomeHiveLogo from '../../assets/HomeHiveLogo'

const Createacct = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const navigate = useNavigate()

  // Validate Email
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Validate Password
  const isPasswordValid = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password)
  }

  // Handle account creation
  const handleCreateAccount = async () => {
    if (!firstName || !lastName) {
      setError('Please enter your first and last name.')
      return
    }

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

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const { user } = await createUserWithEmailAndPassword(
        userAuth,
        email,
        password
      )
      toast.success(`Account created successfully! Welcome, ${user.email}!`)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      setError(error.message)
      toast.error('Account creation failed. Try again.')
      console.error('Create account error:', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      const result = await signInWithPopup(userAuth, userProvider)
      toast.success(`Welcome ${result.user.displayName}!`)
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      toast.error('Google sign up failed. Try again.')
      console.error('Google sign up error:', error.message)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-25 via-neutral-50 to-primary-100'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        className='mt-16'
      />

      {/* Enhanced Header */}
      <header className='bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='max-w-6xl mx-auto flex items-center justify-between'>
            {/* Logo */}
            <div
              className='flex items-center gap-4 cursor-pointer group'
              onClick={() => navigate('/')}
            >
              <HomeHiveLogo
                className='w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm'
                alt='Homehive Logo'
              />
              <div>
                <h1 className='font-NotoSans text-3xl font-bold bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 bg-clip-text text-transparent'>
                  Homehive
                </h1>
                <div className='text-sm text-primary-600 font-medium'>
                  Join our community
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/signin')}
              className='flex items-center gap-3 text-primary-700 hover:text-primary-900 bg-white/80 hover:bg-white px-4 py-3 rounded-xl border border-primary-200 hover:border-primary-300 transition-all duration-300 font-semibold shadow-soft hover:shadow-medium'
            >
              <FaArrowLeft className='text-sm' />
              <span className='hidden sm:inline'>Back to Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-4xl'>
          {/* Welcome Section */}
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-2xl px-6 py-3 mb-8 shadow-soft'>
              <HiSparkles className='text-primary-600 text-lg' />
              <span className='text-lg font-bold text-primary-800'>
                Join Homehive Today
              </span>
            </div>

            <h1 className='font-NotoSans text-4xl sm:text-6xl font-bold text-primary-800 mb-6'>
              Welcome to
              <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text block sm:inline sm:ml-3'>
                Your New Home
              </span>
            </h1>

            <p className='text-xl text-primary-600 leading-relaxed max-w-3xl mx-auto'>
              Discover amazing places to stay, connect with great hosts, and
              create unforgettable memories around the world
            </p>
          </div>

          {/* Benefits Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-primary-200 text-center hover:shadow-medium transition-all duration-300 transform hover:scale-105'>
              <div className='w-16 h-16 bg-accent-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <FaShieldAlt className='text-accent-green-600 text-2xl' />
              </div>
              <h3 className='font-bold text-primary-900 mb-3 text-lg'>
                Trusted & Secure
              </h3>
              <p className='text-primary-600'>
                Your safety and security are our top priorities with verified
                listings
              </p>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-primary-200 text-center hover:shadow-medium transition-all duration-300 transform hover:scale-105'>
              <div className='w-16 h-16 bg-accent-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <FaUsers className='text-accent-blue-600 text-2xl' />
              </div>
              <h3 className='font-bold text-primary-900 mb-3 text-lg'>
                Global Community
              </h3>
              <p className='text-primary-600'>
                Join millions of travelers and hosts from around the world
              </p>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-primary-200 text-center hover:shadow-medium transition-all duration-300 transform hover:scale-105'>
              <div className='w-16 h-16 bg-accent-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <FaClock className='text-accent-amber-600 text-2xl' />
              </div>
              <h3 className='font-bold text-primary-900 mb-3 text-lg'>
                24/7 Support
              </h3>
              <p className='text-primary-600'>
                Get help whenever you need it with our round-the-clock support
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-strong border border-primary-200 p-8 max-w-2xl mx-auto'>
            {/* Form Header */}
            <div className='text-center mb-8'>
              <h2 className='font-NotoSans text-3xl font-bold text-primary-900 mb-3'>
                Create Your Account
              </h2>
              <p className='text-lg text-primary-600'>
                Start your journey with us in just a few steps
              </p>
            </div>

            {/* Form */}
            <div className='space-y-6'>
              {/* Name Inputs */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='block text-sm font-bold text-primary-700 uppercase tracking-wide'>
                    First Name
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <HiUser className='h-5 w-5 text-primary-400' />
                    </div>
                    <input
                      type='text'
                      placeholder='First name'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className='w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 bg-primary-25 hover:bg-primary-50'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-bold text-primary-700 uppercase tracking-wide'>
                    Last Name
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <HiUser className='h-5 w-5 text-primary-400' />
                    </div>
                    <input
                      type='text'
                      placeholder='Last name'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className='w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 bg-primary-25 hover:bg-primary-50'
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className='space-y-2'>
                <label className='block text-sm font-bold text-primary-700 uppercase tracking-wide'>
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
                    className='w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 bg-primary-25 hover:bg-primary-50'
                  />
                </div>
              </div>

              {/* Password Inputs */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='block text-sm font-bold text-primary-700 uppercase tracking-wide'>
                    Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <HiLockClosed className='h-5 w-5 text-primary-400' />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Create password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='w-full pl-12 pr-12 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 bg-primary-25 hover:bg-primary-50'
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

                <div className='space-y-2'>
                  <label className='block text-sm font-bold text-primary-700 uppercase tracking-wide'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <HiLockClosed className='h-5 w-5 text-primary-400' />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='w-full pl-12 pr-12 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400 bg-primary-25 hover:bg-primary-50'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-4 flex items-center'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className='h-5 w-5 text-primary-500 hover:text-primary-700 transition-colors duration-300' />
                      ) : (
                        <FaEye className='h-5 w-5 text-primary-500 hover:text-primary-700 transition-colors duration-300' />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className='bg-error-50 border-2 border-error-200 rounded-xl p-4'>
                  <p className='text-error-700 font-medium'>{error}</p>
                </div>
              )}

              {/* Password Requirements */}
              <div className='bg-info-50 border-2 border-info-200 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-info-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-info-600 text-lg'>💡</span>
                  </div>
                  <p className='text-info-700 font-medium'>
                    Password must be at least 8 characters long and contain an
                    uppercase letter.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className='space-y-4 mt-8'>
              {/* Create Account Button */}
              <button
                onClick={handleCreateAccount}
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 disabled:from-primary-400 disabled:to-primary-400 text-white font-bold py-5 px-6 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3'
              >
                {isLoading ? (
                  <>
                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Create My Account</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t-2 border-primary-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-6 bg-white text-primary-600 font-bold text-lg'>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <button
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className='w-full bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-primary-800 font-bold py-5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3 shadow-soft hover:shadow-medium'
              >
                {isGoogleLoading ? (
                  <>
                    <div className='w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FcGoogle className='text-2xl' />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className='text-center mt-8 pt-6 border-t-2 border-primary-200'>
              <p className='text-primary-600 text-lg'>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/signin')}
                  className='text-primary-800 hover:text-primary-900 font-bold transition-colors duration-300 underline'
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Terms Footer */}
          <div className='text-center mt-8'>
            <p className='text-primary-500 max-w-2xl mx-auto leading-relaxed'>
              By creating an account, you agree to our{' '}
              <button className='text-primary-700 hover:text-primary-900 font-semibold transition-colors duration-300 underline'>
                Terms of Service
              </button>{' '}
              and{' '}
              <button className='text-primary-700 hover:text-primary-900 font-semibold transition-colors duration-300 underline'>
                Privacy Policy
              </button>
              . We&#39;re committed to protecting your data and privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Createacct
