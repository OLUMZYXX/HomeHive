import { useRef, useState, useEffect, useContext } from 'react'
import apt from '../../assets/Apt1.webp'
import { HiStar, HiX } from 'react-icons/hi'
import { FaQuoteLeft, FaPlus } from 'react-icons/fa'
import { testimonialsAPI } from '../../services/api'
import APIContext from '../../contexts/APIContext'

// Simple toast notification function
const showToast = {
  success: (message) => {
    alert(`Success: ${message}`)
  },
  error: (message) => {
    alert(`Error: ${message}`)
  },
}

const Testimonial = () => {
  const { user } = useContext(APIContext)
  const testimonialRef = useRef(null)
  const [testimonials, setTestimonials] = useState([])
  const [stats, setStats] = useState({
    averageRating: 4.9,
    totalTestimonials: 0,
    satisfactionRate: 98,
    fiveStarCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: '',
    propertyId: '',
    stayDate: '',
    guestName: '',
    guestEmail: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fallbackTestimonials = [
      {
        _id: '1',
        userId: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          avatar: apt,
        },
        propertyId: {
          title: 'Luxury Downtown Apartment',
          'address.city': 'Lagos',
        },
        rating: 5,
        comment:
          'Absolutely incredible experience! The property exceeded all my expectations. The attention to detail and customer service was outstanding.',
        stayDate: '2024-03-01T00:00:00Z',
        createdAt: '2024-03-15T10:00:00Z',
      },
      {
        _id: '2',
        userId: {
          firstName: 'James',
          lastName: 'Rodriguez',
          avatar: apt,
        },
        propertyId: {
          title: 'Family Villa',
          'address.city': 'Abuja',
        },
        rating: 5,
        comment:
          'Perfect for our family getaway. The amenities were top-notch and the location was ideal. Our kids had an amazing time.',
        stayDate: '2024-02-15T00:00:00Z',
        createdAt: '2024-02-28T10:00:00Z',
      },
      {
        _id: '3',
        userId: {
          firstName: 'Aisha',
          lastName: 'Okonkwo',
          avatar: apt,
        },
        propertyId: {
          title: 'Peaceful Retreat',
          'address.city': 'Port Harcourt',
        },
        rating: 5,
        comment:
          'A peaceful and luxurious retreat. The property was immaculate and the host was incredibly accommodating. Highly recommended!',
        stayDate: '2024-01-20T00:00:00Z',
        createdAt: '2024-02-01T10:00:00Z',
      },
      {
        _id: '4',
        userId: {
          firstName: 'Liam',
          lastName: 'Thompson',
          avatar: apt,
        },
        propertyId: {
          title: 'Romantic Getaway',
          'address.city': 'Ibadan',
        },
        rating: 5,
        comment:
          'The perfect romantic escape. Beautiful property with stunning views. Every detail was thoughtfully arranged for our special occasion.',
        stayDate: '2023-12-10T00:00:00Z',
        createdAt: '2023-12-25T10:00:00Z',
      },
    ]

    const fetchData = async () => {
      setLoading(true)
      try {
        const [testimonialsRes, statsRes] = await Promise.all([
          testimonialsAPI.getTestimonials(12),
          testimonialsAPI.getTestimonialStats(),
        ])

        if (
          testimonialsRes.success &&
          testimonialsRes.testimonials.length > 0
        ) {
          setTestimonials(testimonialsRes.testimonials)
        } else {
          setTestimonials(fallbackTestimonials)
        }

        if (statsRes.success) {
          setStats(statsRes.stats)
        }
      } catch {
        setTestimonials(fallbackTestimonials)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (testimonials.length <= 4) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= testimonials.length - 4 ? 0 : prevIndex + 1
      )
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await testimonialsAPI.createTestimonial(feedbackForm)
      if (response.success) {
        showToast.success(
          'Thank you for your feedback! It will be reviewed and published soon.'
        )
        setShowFeedbackForm(false)
        setFeedbackForm({
          rating: 5,
          comment: '',
          propertyId: '',
          stayDate: '',
          guestName: '',
          guestEmail: '',
        })
      } else {
        showToast.error(response.message || 'Failed to submit feedback')
      }
    } catch {
      showToast.error('Failed to submit feedback. Please try again.')
    }
    setSubmitting(false)
  }

  const displayedTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + 4
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <section
      ref={testimonialRef}
      className='py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-neutral-50 relative overflow-hidden w-full [content-visibility:auto] [contain-intrinsic-size:1px_1000px]'
      id='testimonial'
    >
      {/* Background Decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 left-10 w-40 h-40 bg-primary-100 rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-48 h-48 bg-neutral-100 rounded-full opacity-30 blur-2xl'></div>
      </div>

      <div className='relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-soft'>
            <HiStar className='text-amber-500 text-sm' />
            <span className='text-sm font-medium text-primary-700'>
              Guest Reviews
            </span>
          </div>

          <h2 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-800 mb-6'>
            What Our Guests
            <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text block sm:inline sm:ml-3'>
              Are Saying
            </span>
          </h2>

          <div className='w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-800 mx-auto rounded-full mb-8'></div>

          <p className='text-lg lg:text-xl text-primary-600 leading-relaxed max-w-3xl mx-auto'>
            Read authentic reviews from our verified guests who have experienced
            the exceptional quality and service that sets Homehive apart.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className='relative'>
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-3xl shadow-soft p-6 animate-pulse'
                >
                  <div className='h-4 bg-gray-200 rounded mb-4'></div>
                  <div className='h-20 bg-gray-200 rounded mb-4'></div>
                  <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 bg-gray-200 rounded-full'></div>
                    <div className='flex-1'>
                      <div className='h-4 bg-gray-200 rounded mb-2'></div>
                      <div className='h-3 bg-gray-200 rounded'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-500'>
                {displayedTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial._id}
                    className={`group bg-white rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-primary-100 ${
                      index % 2 === 1 ? 'lg:mt-8' : ''
                    }`}
                  >
                    {/* Quote Icon */}
                    <div className='relative p-6 pb-4'>
                      <div className='absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center'>
                        <FaQuoteLeft className='text-primary-700 text-lg' />
                      </div>

                      {/* Rating Stars */}
                      <div className='flex items-center gap-1 mb-4'>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <HiStar key={i} className='text-amber-400 text-lg' />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className='text-base text-primary-700 leading-relaxed mb-6 font-medium'>
                        &quot;{testimonial.comment}&quot;
                      </p>
                    </div>

                    {/* User Info */}
                    <div className='px-6 pb-6'>
                      <div className='flex items-center gap-4'>
                        <div className='relative'>
                          <img
                            src={testimonial.userId?.avatar || apt}
                            alt={`${testimonial.userId?.firstName} ${testimonial.userId?.lastName}`}
                            className='w-14 h-14 rounded-full object-cover border-3 border-primary-200 group-hover:border-primary-300 transition-colors duration-300'
                            loading='lazy'
                            decoding='async'
                            width={56}
                            height={56}
                          />
                          <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-success-500 rounded-full border-2 border-white'></div>
                        </div>

                        <div className='flex-1'>
                          <h4 className='font-NotoSans text-lg font-bold text-primary-900 group-hover:text-primary-800 transition-colors duration-300'>
                            {testimonial.userId?.firstName}{' '}
                            {testimonial.userId?.lastName}
                          </h4>
                          <p className='text-sm text-primary-600 font-medium'>
                            {testimonial.propertyId?.title || 'Verified Guest'}
                          </p>
                          <p className='text-sm text-primary-500'>
                            {testimonial.propertyId?.['address.city'] ||
                              'Nigeria'}
                          </p>
                        </div>
                      </div>

                      {/* Stay Date */}
                      <div className='mt-4 pt-4 border-t border-primary-100'>
                        <p className='text-xs text-primary-500 font-medium'>
                          Stayed in{' '}
                          {testimonial.stayDate
                            ? formatDate(testimonial.stayDate)
                            : formatDate(testimonial.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Feedback Button */}
              <div className='mt-8 text-center'>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className='inline-flex items-center gap-2 bg-primary-800 hover:bg-primary-900 text-white font-semibold py-3 px-6 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105'
                >
                  <FaPlus className='text-sm' />
                  Share Your Experience
                </button>
              </div>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className='mt-16 pt-12 border-t border-primary-200'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='space-y-2'>
              <div className='text-3xl lg:text-4xl font-black text-primary-800'>
                {stats.averageRating}
              </div>
              <div className='text-base text-primary-600 font-medium'>
                Average Rating
              </div>
              <div className='flex justify-center'>
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className='text-amber-400 text-lg' />
                ))}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-3xl lg:text-4xl font-black text-primary-800'>
                {stats.totalTestimonials || '2,500+'}
              </div>
              <div className='text-base text-primary-600 font-medium'>
                Happy Guests
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-3xl lg:text-4xl font-black text-primary-800'>
                {stats.satisfactionRate}%
              </div>
              <div className='text-base text-primary-600 font-medium'>
                Satisfaction Rate
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-3xl lg:text-4xl font-black text-primary-800'>
                {stats.fiveStarCount || '500+'}
              </div>
              <div className='text-base text-primary-600 font-medium'>
                5-Star Reviews
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
              <div className='p-6 border-b border-primary-100'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-bold text-primary-900'>
                    Share Your Experience
                  </h3>
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className='w-8 h-8 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors duration-200'
                  >
                    <HiX className='text-primary-700' />
                  </button>
                </div>
              </div>

              <form onSubmit={handleFeedbackSubmit} className='p-6 space-y-6'>
                {/* Rating */}
                <div>
                  <label className='block text-sm font-medium text-primary-700 mb-2'>
                    Rating *
                  </label>
                  <div className='flex items-center gap-2'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type='button'
                        onClick={() =>
                          setFeedbackForm((prev) => ({ ...prev, rating: star }))
                        }
                        className='transition-colors duration-200'
                      >
                        <HiStar
                          className={`text-2xl ${
                            star <= feedbackForm.rating
                              ? 'text-amber-400'
                              : 'text-gray-300 hover:text-amber-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className='ml-2 text-sm text-primary-600'>
                      {feedbackForm.rating} star
                      {feedbackForm.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className='block text-sm font-medium text-primary-700 mb-2'>
                    Your Review *
                  </label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={(e) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder='Tell us about your experience...'
                    className='w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
                    rows={4}
                    maxLength={1000}
                    required
                  />
                  <div className='text-right text-xs text-primary-500 mt-1'>
                    {feedbackForm.comment.length}/1000
                  </div>
                </div>

                {/* Guest Information - Only show if user is not authenticated */}
                {!user && (
                  <>
                    {/* Guest Name */}
                    <div>
                      <label className='block text-sm font-medium text-primary-700 mb-2'>
                        Your Name *
                      </label>
                      <input
                        type='text'
                        value={feedbackForm.guestName}
                        onChange={(e) =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            guestName: e.target.value,
                          }))
                        }
                        placeholder='Enter your name'
                        className='w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                        required
                      />
                    </div>

                    {/* Guest Email */}
                    <div>
                      <label className='block text-sm font-medium text-primary-700 mb-2'>
                        Your Email *
                      </label>
                      <input
                        type='email'
                        value={feedbackForm.guestEmail}
                        onChange={(e) =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            guestEmail: e.target.value,
                          }))
                        }
                        placeholder='Enter your email'
                        className='w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                        required
                      />
                    </div>
                  </>
                )}

                {/* Property ID (Optional - in a real app, this might be auto-filled) */}
                <div>
                  <label className='block text-sm font-medium text-primary-700 mb-2'>
                    Property Name (Optional)
                  </label>
                  <input
                    type='text'
                    value={feedbackForm.propertyId}
                    onChange={(e) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        propertyId: e.target.value,
                      }))
                    }
                    placeholder='Which property did you stay at?'
                    className='w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>

                {/* Stay Date */}
                <div>
                  <label className='block text-sm font-medium text-primary-700 mb-2'>
                    Stay Date (Optional)
                  </label>
                  <input
                    type='date'
                    value={feedbackForm.stayDate}
                    onChange={(e) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        stayDate: e.target.value,
                      }))
                    }
                    className='w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>

                {/* Submit Button */}
                <div className='flex gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => setShowFeedbackForm(false)}
                    className='flex-1 py-3 px-4 border border-primary-200 text-primary-700 rounded-xl hover:bg-primary-50 transition-colors duration-200'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={
                      submitting ||
                      !feedbackForm.comment.trim() ||
                      (!user &&
                        (!feedbackForm.guestName.trim() ||
                          !feedbackForm.guestEmail.trim()))
                    }
                    className='flex-1 py-3 px-4 bg-primary-800 hover:bg-primary-900 disabled:bg-primary-400 text-white rounded-xl transition-colors duration-200'
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {/* <div className='mt-16 text-center'>
          <div className='bg-white/80 backdrop-blur-sm border-2 border-primary-200 rounded-3xl p-8 lg:p-12 shadow-medium'>
            <h3 className='font-NotoSans text-2xl lg:text-3xl font-bold text-primary-800 mb-4'>
              Ready to Create Your Own Amazing Experience?
            </h3>
            <p className='text-lg text-primary-600 mb-8 max-w-2xl mx-auto'>
              Join thousands of satisfied guests and book your perfect
              accommodation today.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() =>
                  document
                    .getElementById('accomodation')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className='bg-primary-800 hover:bg-primary-900 text-white font-semibold py-4 px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105'
              >
                Book Your Stay
              </button>
              <Link
                to='/reviews'
                className='border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center'
              >
                Read All Reviews
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default Testimonial
