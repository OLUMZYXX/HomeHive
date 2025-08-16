// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { userAuth, userProvider } from '../../../firebaseConfig'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { HiUser, HiMail, HiLockClosed, HiHome } from 'react-icons/hi'
import HomeHiveLogo from '../../assets/HomeHiveLogo'

const CreateAccount = () => {
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
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50'>
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
      />

      {/* Header */}
      <header className='bg-white/95 backdrop-blur-md shadow-soft border-b border-primary-100'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='max-w-4xl mx-auto flex items-center justify-between'>
            {/* Logo */}
            <div
              className='flex items-center gap-4 cursor-pointer group'
              onClick={() => navigate('/')}
            >
              <HomeHiveLogo
                className='w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110'
                alt='Homehive Logo'
              />
              <div>
                <h1 className='font-NotoSans text-2xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent'>
                  Homehive
                </h1>
                <div className='text-xs text-primary-600 font-medium'>
                  Host Registration
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/hostlogin')}
              className='flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors duration-300 font-medium'
            >
              <FaArrowLeft className='text-sm' />
              <span className='hidden sm:inline'>Back to Host Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-2xl'>
          {/* Welcome Section */}
          {/* <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-soft'>
              <HiHome className='text-primary-600 text-sm' />
              <span className='text-sm font-medium text-primary-700'>
                Become a Host
              </span>
            </div>

            <h1 className='font-NotoSans text-4xl sm:text-5xl font-bold text-primary-800 mb-6'>
              Start Your
              <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text block sm:inline sm:ml-3'>
                Hosting Journey
              </span>
            </h1>

            <p className='text-xl text-primary-600 leading-relaxed max-w-3xl mx-auto'>
              Join thousands of successful hosts and start earning from your
              property today
            </p>
          </div> */}

          {/* Benefits Cards */}
          {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-primary-100 text-center'>
              <div className='w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                <FaCheck className='text-success-600 text-lg' />
              </div>
              <h3 className='font-bold text-primary-900 mb-2'>
                Verified Platform
              </h3>
              <p className='text-sm text-primary-600'>
                Secure and trusted by hosts worldwide
              </p>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-primary-100 text-center'>
              <div className='w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-700 font-bold text-lg'>24/7</span>
              </div>
              <h3 className='font-bold text-primary-900 mb-2'>Host Support</h3>
              <p className='text-sm text-primary-600'>
                Round-the-clock assistance when you need it
              </p>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-primary-100 text-center'>
              <div className='w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-amber-600 font-bold text-lg'>💰</span>
              </div>
              <h3 className='font-bold text-primary-900 mb-2'>Easy Earnings</h3>
              <p className='text-sm text-primary-600'>
                Start earning within your first week
              </p>
            </div>
          </div> */}

          {/* Registration Form */}
          <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-strong border border-primary-100 p-8'>
            {/* Form Header */}
            <div className='text-center mb-8'>
              <h2 className='font-NotoSans text-3xl font-bold text-primary-900 mb-3'>
                Create Your Host Account
              </h2>
              <p className='text-lg text-primary-600'>
                Get started in just a few minutes
              </p>
            </div>

            {/* Form */}
            <div className='space-y-6'>
              {/* Name Inputs */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-primary-700'>
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
                      className='w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-primary-700'>
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
                      className='w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400'
                    />
                  </div>
                </div>
              </div>

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

              {/* Password Inputs */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
                      placeholder='Create password'
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

                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-primary-700'>
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
                      className='w-full pl-12 pr-12 py-4 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-primary-800 placeholder-primary-400'
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
                <div className='bg-error-50 border border-error-200 rounded-xl p-4'>
                  <p className='text-error-700 text-sm font-medium'>{error}</p>
                </div>
              )}

              {/* Password Requirements */}
              <div className='bg-info-50 border border-info-200 rounded-xl p-4'>
                <p className='text-info-700 text-sm'>
                  💡 Password must be at least 8 characters long and contain an
                  uppercase letter.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className='space-y-4 mt-8'>
              {/* Create Account Button */}
              <button
                onClick={handleCreateAccount}
                disabled={isLoading}
                className='w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-bold py-4 px-6 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3'
              >
                {isLoading ? (
                  <>
                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Host Account'
                )}
              </button>

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-primary-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-primary-500 font-medium'>
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <button
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className='w-full bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-primary-800 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 shadow-soft hover:shadow-medium'
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
            <div className='text-center mt-8 pt-6 border-t border-primary-200'>
              <p className='text-primary-600'>
                Already have a host account?{' '}
                <button
                  onClick={() => navigate('/hostlogin')}
                  className='text-primary-800 hover:text-primary-900 font-bold transition-colors duration-300'
                >
                  Host Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Terms Footer */}
          <div className='text-center mt-8'>
            <p className='text-sm text-primary-500'>
              By creating an account, you agree to our{' '}
              <button className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300'>
                Terms of Service
              </button>{' '}
              and{' '}
              <button className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300'>
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount
