import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAPI } from '../../contexts/APIContext'
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaPrint,
  FaDownload,
  FaShare,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaClock,
} from 'react-icons/fa'
import { toast } from 'sonner'

const BookingConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { getBookingById, sendBookingEmail } = useAPI()

  const [bookingDetails, setBookingDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [emailSent, setEmailSent] = useState(false)

  const bookingId = location.state?.bookingId
  const initialBookingData = location.state?.bookingData

  useEffect(() => {
    if (initialBookingData) {
      setBookingDetails(initialBookingData)
      setLoading(false)

      // Send confirmation email
      sendConfirmationEmail()
    } else if (bookingId) {
      fetchBookingDetails()
    } else {
      toast.error('No booking information found')
      navigate('/listings')
    }
  }, [bookingId, initialBookingData])

  const fetchBookingDetails = async () => {
    try {
      const booking = await getBookingById(bookingId)
      setBookingDetails(booking)
      sendConfirmationEmail()
    } catch (error) {
      console.error('Error fetching booking details:', error)
      toast.error('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const sendConfirmationEmail = async () => {
    try {
      if (sendBookingEmail) {
        await sendBookingEmail(bookingId || bookingDetails?.bookingId)
        setEmailSent(true)
        toast.success('Confirmation email sent!')
      }
    } catch (error) {
      console.error('Failed to send email:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'HomeHive Booking Confirmation',
        text: `My booking confirmation for ${bookingDetails?.propertyTitle}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-25'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4'></div>
          <p className='text-primary-700 font-medium'>
            Loading booking details...
          </p>
        </div>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-error-50 to-neutral-25'>
        <div className='text-center max-w-md mx-auto px-4'>
          <div className='bg-neutral-25 rounded-3xl shadow-strong p-8 border border-neutral-200'>
            <div className='text-error-600 text-6xl mb-4'>❌</div>
            <h2 className='text-2xl font-bold text-error-700 mb-4'>
              Booking Not Found
            </h2>
            <p className='text-error-600 mb-6'>
              We couldn't find your booking details.
            </p>
            <button
              onClick={() => navigate('/my-bookings')}
              className='w-full bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-medium hover:shadow-strong'
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-success-50 to-neutral-25'>
      {/* Success Header */}
      <div className='bg-gradient-to-r from-success-600 to-success-700 text-white py-20'>
        <div className='max-w-[1400px] mx-auto px-6 lg:px-8 text-center'>
          <div className='mb-8 animate-scaleIn'>
            <FaCheckCircle className='text-8xl mx-auto mb-6 animate-popup' />
          </div>
          <h1 className='text-4xl lg:text-6xl font-bold mb-6 animate-slideUp'>
            Booking Confirmed! 🎉
          </h1>
          <p className='text-xl lg:text-2xl text-success-100 mb-8 animate-fadeIn'>
            Your reservation has been successfully submitted
          </p>
          <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-8 inline-block shadow-medium animate-slideDown'>
            <p className='text-success-100 mb-3 text-lg'>Booking Reference</p>
            <p className='text-3xl lg:text-4xl font-bold tracking-wide'>
              {bookingId || bookingDetails?.bookingId}
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-[1400px] mx-auto px-6 lg:px-8 py-12'>
        {/* Action Buttons */}
        <div className='flex justify-center gap-6 mb-12'>
          <button
            onClick={handlePrint}
            className='flex items-center gap-3 bg-neutral-25 hover:bg-neutral-100 text-neutral-700 px-8 py-4 rounded-2xl border border-neutral-200 transition-all duration-300 shadow-soft hover:shadow-medium hover:border-neutral-300'
          >
            <FaPrint className='text-lg' />
            <span className='font-medium'>Print</span>
          </button>
          <button
            onClick={handleShare}
            className='flex items-center gap-3 bg-neutral-25 hover:bg-neutral-100 text-neutral-700 px-8 py-4 rounded-2xl border border-neutral-200 transition-all duration-300 shadow-soft hover:shadow-medium hover:border-neutral-300'
          >
            <FaShare className='text-lg' />
            <span className='font-medium'>Share</span>
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className='flex items-center gap-3 bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-medium hover:shadow-strong'
          >
            <FaHome className='text-lg' />
            <span className='font-medium'>My Bookings</span>
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          {/* Left Column - Booking Details */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Property Information */}
            <div className='bg-neutral-25 rounded-3xl p-8 shadow-soft border border-neutral-150'>
              <h2 className='text-3xl font-bold text-neutral-800 mb-6'>
                Your Booking
              </h2>
              <div className='flex gap-6'>
                <img
                  src={
                    bookingDetails.propertyImage || '/placeholder-property.jpg'
                  }
                  alt={bookingDetails.propertyTitle}
                  className='w-40 h-40 rounded-2xl object-cover shadow-medium'
                />
                <div className='flex-1'>
                  <h3 className='text-2xl font-bold text-neutral-800 mb-3'>
                    {bookingDetails.propertyTitle}
                  </h3>
                  <div className='flex items-center gap-3 text-neutral-600 mb-4'>
                    <FaMapMarkerAlt className='text-lg text-primary-600' />
                    <span className='text-lg'>
                      {bookingDetails.propertyLocation}
                    </span>
                  </div>
                  <div className='flex items-center gap-4 text-neutral-600'>
                    <span className='flex items-center gap-2 bg-success-100 text-success-700 px-4 py-2 rounded-xl'>
                      <FaClock />
                      Status: <span className='font-semibold'>Confirmed</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className='bg-neutral-25 rounded-3xl p-8 shadow-soft border border-neutral-150'>
              <h3 className='text-2xl font-bold text-neutral-800 mb-6'>
                Booking Timeline
              </h3>
              <div className='space-y-6'>
                <div className='flex items-start gap-5'>
                  <div className='w-12 h-12 bg-success-100 rounded-full flex items-center justify-center shadow-soft'>
                    <FaCheckCircle className='text-success-600 text-lg' />
                  </div>
                  <div>
                    <h4 className='font-bold text-neutral-800 text-lg'>
                      Booking Confirmed
                    </h4>
                    <p className='text-neutral-600 mb-1'>
                      Your reservation has been confirmed
                    </p>
                    <p className='text-sm text-neutral-500'>Just now</p>
                  </div>
                </div>

                <div className='flex items-start gap-5'>
                  <div className='w-12 h-12 bg-accent-blue-100 rounded-full flex items-center justify-center shadow-soft'>
                    <FaEnvelope className='text-accent-blue-600 text-lg' />
                  </div>
                  <div>
                    <h4 className='font-bold text-neutral-800 text-lg'>
                      Confirmation Email Sent
                    </h4>
                    <p className='text-neutral-600 mb-1'>
                      {emailSent
                        ? 'Email sent successfully'
                        : 'Sending confirmation email...'}
                    </p>
                    <p className='text-sm text-neutral-500'>Just now</p>
                  </div>
                </div>

                <div className='flex items-start gap-5'>
                  <div className='w-12 h-12 bg-accent-amber-100 rounded-full flex items-center justify-center shadow-soft'>
                    <FaPhone className='text-accent-amber-600 text-lg' />
                  </div>
                  <div>
                    <h4 className='font-bold text-neutral-800 text-lg'>
                      Host Notification
                    </h4>
                    <p className='text-neutral-600 mb-1'>
                      Host has been notified of your booking
                    </p>
                    <p className='text-sm text-neutral-500'>Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className='bg-gradient-to-br from-info-50 to-info-100 rounded-3xl p-8 border border-info-200'>
              <h3 className='text-2xl font-bold text-info-700 mb-6'>
                What's Next?
              </h3>
              <div className='space-y-4 text-info-700'>
                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 bg-info-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-soft'>
                    1
                  </div>
                  <p className='text-lg'>
                    You'll receive a confirmation email with all booking details
                  </p>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 bg-info-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-soft'>
                    2
                  </div>
                  <p className='text-lg'>
                    The host will be notified and may reach out with additional
                    information
                  </p>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 bg-info-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-soft'>
                    3
                  </div>
                  <p className='text-lg'>
                    Complete your check-in on{' '}
                    <span className='font-semibold'>
                      {new Date(bookingDetails.checkIn).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-neutral-25 rounded-3xl p-8 shadow-strong border border-neutral-150 sticky top-8'>
              <h3 className='text-2xl font-bold text-neutral-800 mb-6'>
                Booking Summary
              </h3>

              <div className='space-y-5 mb-8'>
                <div className='flex items-center justify-between py-4 border-b border-neutral-200'>
                  <div className='flex items-center gap-3'>
                    <FaCalendarAlt className='text-primary-600 text-lg' />
                    <span className='text-neutral-700 font-medium'>
                      Check-in
                    </span>
                  </div>
                  <span className='font-bold text-neutral-800 text-lg'>
                    {new Date(bookingDetails.checkIn).toLocaleDateString()}
                  </span>
                </div>

                <div className='flex items-center justify-between py-4 border-b border-neutral-200'>
                  <div className='flex items-center gap-3'>
                    <FaCalendarAlt className='text-primary-600 text-lg' />
                    <span className='text-neutral-700 font-medium'>
                      Check-out
                    </span>
                  </div>
                  <span className='font-bold text-neutral-800 text-lg'>
                    {new Date(bookingDetails.checkOut).toLocaleDateString()}
                  </span>
                </div>

                <div className='flex items-center justify-between py-4 border-b border-neutral-200'>
                  <div className='flex items-center gap-3'>
                    <FaUsers className='text-primary-600 text-lg' />
                    <span className='text-neutral-700 font-medium'>Guests</span>
                  </div>
                  <span className='font-bold text-neutral-800 text-lg'>
                    {bookingDetails.guests}{' '}
                    {bookingDetails.guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>

                <div className='flex items-center justify-between py-4'>
                  <span className='text-neutral-700 font-medium'>Duration</span>
                  <span className='font-bold text-neutral-800 text-lg'>
                    {bookingDetails.nights}{' '}
                    {bookingDetails.nights === 1 ? 'Night' : 'Nights'}
                  </span>
                </div>
              </div>

              <div className='bg-neutral-100 rounded-2xl p-6 mb-8'>
                <h4 className='font-bold text-neutral-800 mb-4 text-lg'>
                  Price Breakdown
                </h4>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-neutral-600'>
                      {bookingDetails.currencySymbol || '₦'}
                      {bookingDetails.pricePerNight?.toLocaleString()} ×{' '}
                      {bookingDetails.nights} nights
                    </span>
                    <span className='text-neutral-800 font-medium'>
                      {bookingDetails.currencySymbol || '₦'}
                      {bookingDetails.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-neutral-600'>Service fee</span>
                    <span className='text-success-600 font-medium'>Free</span>
                  </div>
                  <hr className='border-neutral-300' />
                  <div className='flex justify-between font-bold text-xl text-neutral-800'>
                    <span>Total</span>
                    <span>
                      {bookingDetails.currencySymbol || '₦'}
                      {bookingDetails.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className='text-center'>
                <p className='text-neutral-600 mb-4'>
                  Need help with your booking?
                </p>
                <button
                  onClick={() => navigate('/customer-care')}
                  className='w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-soft hover:shadow-medium'
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
