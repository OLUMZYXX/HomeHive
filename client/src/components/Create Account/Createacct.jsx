// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { HiUser, HiMail, HiLockClosed, HiPhone } from 'react-icons/hi'
import { toast } from '../../utils/toast.jsx'
import { useAPI } from '../../contexts/APIContext'
import GoogleAuth from '../../config/googleAuth'

const Createacct = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { register, googleAuth } = useAPI()

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isPhoneValid = (phone) => {
    return phone.length >= 10 && /^\+?[\d\s-()]+$/.test(phone)
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()

    // Reset error
    setError('')

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.')
      return
    }

    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (phone && !isPhoneValid(phone)) {
      setError('Please enter a valid phone number.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        password,
      }

      const result = await register(userData)

      toast.success(
        'Account created successfully! Welcome to HomeHive!',
        null,
        { autoClose: 4000 }
      )

      // Redirect after successful registration
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
      localStorage.removeItem('redirectAfterLogin')
      setTimeout(() => navigate(redirectPath), 2000)
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response) {
        console.error('Backend response:', error.response.data)
      }
      const errorMessage =
        error.response?.data?.message ||
        'Failed to create account. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage, 'Registration Failed', { autoClose: 4000 })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      // Initialize and sign in with Google
      await GoogleAuth.initialize()
      const googleUser = await GoogleAuth.signIn()

      // Send to backend for authentication/registration
      const result = await googleAuth(googleUser.idToken, {
        email: googleUser.email,
        name: googleUser.name,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.id,
        isHost: false, // Explicitly set for user registration
      })

      toast.success(
        'Account created successfully with Google! Welcome to HomeHive!',
        `Welcome ${googleUser.name}!`,
        { autoClose: 4000 }
      )

      // Redirect after successful registration
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
      localStorage.removeItem('redirectAfterLogin')
      setTimeout(() => navigate(redirectPath), 2000)
    } catch (error) {
      console.error('Google signup error:', error)
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Google sign up failed. Please try again.'
      if (
        errorMessage.includes('429') ||
        errorMessage.toLowerCase().includes('too many requests')
      ) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      }
      setError(errorMessage)
      toast.error(errorMessage, 'Google Signup Error', { autoClose: 4000 })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4'>
      {/* Back to Login Button */}
      <button
        onClick={() => navigate('/signin')}
        className='absolute top-6 left-6 flex items-center gap-2 text-primary-700 hover:text-primary-900 bg-white hover:bg-primary-25 px-4 py-3 rounded-xl border border-primary-200 hover:border-primary-300 transition-all duration-300 font-medium shadow-soft hover:shadow-medium'
      >
        <FaArrowLeft className='text-sm' />
        <span>Back to Login</span>
      </button>

      {/* Main Container */}
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-strong overflow-hidden border border-primary-100'>
        <div className='grid grid-cols-1 lg:grid-cols-2 min-h-[600px]'>
          {/* Left Side: Image & Branding */}
          <div className='relative bg-gradient-to-br from-primary-800 to-primary-900 p-8 lg:p-12 flex flex-col justify-center items-center text-white lg:flex sm:hidden'>
            <div className='absolute inset-0 opacity-20'>
              <div className='w-full h-full from-primary-700/50 to-primary-900/50 bg-[url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")] bg-cover bg-center'></div>
            </div>

            <div className='relative z-10 text-center space-y-8'>
              <div>
                <h1 className='font-NotoSans text-4xl lg:text-5xl font-bold mb-4'>
                  Join
                  <span className='block text-transparent bg-gradient-to-r from-primary-200 to-white bg-clip-text'>
                    Homehive
                  </span>
                </h1>
                <p className='text-xl text-primary-100 leading-relaxed'>
                  Create your account and discover exceptional accommodations
                </p>
              </div>

              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                <p className='text-primary-100 italic mb-3'>
                  &ldquo;Simple signup process and amazing accommodations.
                  Highly recommended!&rdquo;
                </p>
                <div className='text-sm text-primary-200'>
                  - Michael R., New Member
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Create Account Form */}
          <div className='p-8 lg:p-12 flex flex-col justify-center'>
            <div className='max-w-md mx-auto w-full'>
              {/* Header */}
              <div className='text-center mb-8'>
                <h2 className='font-NotoSans text-3xl lg:text-4xl font-bold text-primary-900 mb-2'>
                  Create Account
                </h2>
                <p className='text-lg text-primary-600'>
                  Get started with your free account
                </p>
              </div>

              <form className='space-y-6' onSubmit={handleCreateAccount}>
                {/* Name Inputs */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-neutral-700'>
                      First Name
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <HiUser className='h-5 w-5 text-neutral-400' />
                      </div>
                      <input
                        type='text'
                        placeholder='First name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-neutral-800 placeholder-neutral-400 bg-neutral-25 hover:bg-neutral-50'
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-neutral-700'>
                      Last Name
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <HiUser className='h-5 w-5 text-neutral-400' />
                      </div>
                      <input
                        type='text'
                        placeholder='Last name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-neutral-800 placeholder-neutral-400 bg-neutral-25 hover:bg-neutral-50'
                      />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-neutral-700'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <HiMail className='h-5 w-5 text-neutral-400' />
                    </div>
                    <input
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-neutral-800 placeholder-neutral-400 bg-neutral-25 hover:bg-neutral-50'
                    />
                  </div>
                </div>

                {/* Phone Input (Optional) */}
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-neutral-700'>
                    Phone Number (Optional)
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <HiPhone className='h-5 w-5 text-neutral-400' />
                    </div>
                    <input
                      type='tel'
                      placeholder='Enter your phone number'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-neutral-800 placeholder-neutral-400 bg-neutral-25 hover:bg-neutral-50'
                    />
                  </div>
                </div>

                {/* Password Inputs */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-neutral-700'>
                      Password
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <HiLockClosed className='h-5 w-5 text-neutral-400' />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Create password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-neutral-800 placeholder-neutral-400 bg-neutral-25 hover:bg-neutral-50'
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors duration-300' />
                        ) : (
                          <FaEye className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors duration-300' />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-neutral-700'>
                      Confirm Password
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <HiLockClosed className='h-5 w-5 text-neutral-400' />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-neutral-800 placeholder-neutral-400 bg-neutral-25 hover:bg-neutral-50'
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors duration-300' />
                        ) : (
                          <FaEye className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors duration-300' />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className='bg-error-50 border border-error-200 rounded-xl p-4'>
                    <p className='text-error-700 font-medium text-sm'>
                      {error}
                    </p>
                  </div>
                )}

                {/* Create Account Button */}
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3'
                >
                  {isLoading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className='text-sm' />
                      <span>Create My Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className='relative my-8'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-primary-200'></div>
                </div>
                <div className='relative flex justify-center'>
                  <span className='px-4 bg-white text-primary-500 font-medium'>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <button
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className='w-full bg-white hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300 text-primary-800 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-soft hover:shadow-medium'
              >
                <FcGoogle className='w-6 h-6' />
                <span>
                  {isGoogleLoading
                    ? 'Creating Account...'
                    : 'Continue with Google'}
                </span>
              </button>

              {/* Already have an account link */}
              <div className='text-center mt-8 pt-6 border-t border-primary-100'>
                <p className='text-primary-600'>
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/signin')}
                    className='text-primary-800 hover:text-primary-900 font-semibold transition-colors duration-300 underline decoration-2 underline-offset-2'
                  >
                    Sign In
                  </button>
                </p>
              </div>

              {/* Terms Footer */}
              <div className='text-center mt-4'>
                <p className='text-primary-500 text-sm leading-relaxed'>
                  By creating an account, you agree to our{' '}
                  <button className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300 underline decoration-1 underline-offset-2'>
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className='text-primary-700 hover:text-primary-900 font-medium transition-colors duration-300 underline decoration-1 underline-offset-2'>
                    Privacy Policy
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

export default Createacct
