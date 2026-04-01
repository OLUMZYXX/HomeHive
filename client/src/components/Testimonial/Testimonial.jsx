import { useRef, useState, useEffect, useContext } from 'react'
import { HiStar, HiX, HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import { FaPlus } from 'react-icons/fa'
import { toast } from 'sonner'
import { testimonialsAPI } from '../../services/api'
import APIContext from '../../contexts/APIContext'

const Testimonial = () => {
  const { user } = useContext(APIContext)
  const testimonialRef = useRef(null)
  const [testimonials, setTestimonials] = useState([])
  const [stats, setStats] = useState(null)
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

  const PER_PAGE = 3

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [testimonialsRes, statsRes] = await Promise.all([
          testimonialsAPI.getTestimonials(12),
          testimonialsAPI.getTestimonialStats(),
        ])
        if (testimonialsRes.success && testimonialsRes.testimonials?.length > 0) {
          setTestimonials(testimonialsRes.testimonials)
        }
        if (statsRes.success && statsRes.stats?.totalTestimonials > 0) {
          setStats(statsRes.stats)
        }
      } catch { /* API unavailable */ }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (testimonials.length <= PER_PAGE) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + PER_PAGE >= testimonials.length ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await testimonialsAPI.createTestimonial(feedbackForm)
      if (response.success) {
        toast.success('Thank you! Your review will be published after verification.')
        setShowFeedbackForm(false)
        setFeedbackForm({ rating: 5, comment: '', propertyId: '', stayDate: '', guestName: '', guestEmail: '' })
      } else {
        toast.error(response.message || 'Failed to submit feedback')
      }
    } catch {
      toast.error('Failed to submit feedback. Please try again.')
    }
    setSubmitting(false)
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const displayed = testimonials.slice(currentIndex, currentIndex + PER_PAGE)
  const canPrev = currentIndex > 0
  const canNext = currentIndex + PER_PAGE < testimonials.length

  return (
    <section
      ref={testimonialRef}
      className='py-16 lg:py-24 bg-white [content-visibility:auto] [contain-intrinsic-size:1px_800px]'
      id='testimonial'
    >
      <div className='container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl'>

        {/* Header */}
        <div className='flex flex-col lg:flex-row items-start lg:items-end justify-between mb-14 gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-8 h-px bg-amber-500' />
              <span className='text-xs font-semibold tracking-[0.25em] uppercase text-amber-600'>
                Guest Reviews
              </span>
            </div>
            <h2 className='font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]'>
              What Our Guests <span className='italic'>Are Saying</span>
            </h2>
          </div>

          <div className='flex items-center gap-6'>
            {/* Navigation */}
            {testimonials.length > PER_PAGE && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                  disabled={!canPrev}
                  className='w-9 h-9 border border-neutral-200 hover:border-neutral-800 flex items-center justify-center transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
                >
                  <HiArrowLeft className='text-sm text-neutral-700' />
                </button>
                <button
                  onClick={() => setCurrentIndex((p) => Math.min(testimonials.length - PER_PAGE, p + 1))}
                  disabled={!canNext}
                  className='w-9 h-9 border border-neutral-200 hover:border-neutral-800 flex items-center justify-center transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
                >
                  <HiArrowRight className='text-sm text-neutral-700' />
                </button>
              </div>
            )}
            <button
              onClick={() => setShowFeedbackForm(true)}
              className='group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-0.5 transition-all duration-200'
            >
              <FaPlus className='text-xs' />
              Write a Review
            </button>
          </div>
        </div>

        {/* Reviews */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='border border-neutral-100 p-6 animate-pulse'>
                <div className='h-3 bg-neutral-100 rounded w-20 mb-4' />
                <div className='h-16 bg-neutral-50 rounded mb-6' />
                <div className='h-3 bg-neutral-100 rounded w-32' />
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className='flex flex-col items-center py-20 text-center'>
            <div className='w-0.5 h-12 bg-amber-400/60 mb-8 mx-auto' />
            <h3 className='font-Cormorant text-2xl font-light text-neutral-800 mb-3'>No Reviews Yet</h3>
            <p className='text-neutral-500 text-sm mb-8 max-w-sm'>
              Be the first to share your experience staying with HomeHive.
            </p>
            <button
              onClick={() => setShowFeedbackForm(true)}
              className='inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium tracking-widest uppercase px-8 py-3 transition-colors duration-300'
            >
              <FaPlus className='text-xs' />
              Write a Review
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500'>
            {displayed.map((testimonial) => (
              <div key={testimonial._id} className='border border-neutral-100 hover:border-neutral-200 p-8 transition-colors duration-300'>
                {/* Stars */}
                <div className='flex items-center gap-0.5 mb-5'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <HiStar key={i} className='text-amber-400 text-sm' />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className='text-neutral-600 text-sm leading-relaxed mb-6 italic'>
                  &ldquo;{testimonial.comment}&rdquo;
                </blockquote>

                {/* Divider */}
                <div className='w-8 h-px bg-amber-400/60 mb-5' />

                {/* Guest */}
                <div>
                  <p className='font-semibold text-neutral-800 text-sm'>
                    {testimonial.userId?.firstName} {testimonial.userId?.lastName}
                  </p>
                  <p className='text-xs text-neutral-400 mt-0.5'>
                    {testimonial.propertyId?.title || 'Verified Guest'} •{' '}
                    {testimonial.stayDate
                      ? formatDate(testimonial.stayDate)
                      : formatDate(testimonial.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats strip */}
        {stats && (
          <div className='mt-16 pt-12 border-t border-neutral-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            {stats.averageRating > 0 && (
              <div>
                <div className='font-Cormorant text-4xl font-light text-neutral-900'>{Number(stats.averageRating).toFixed(1)}</div>
                <div className='text-xs text-neutral-400 uppercase tracking-wider mt-1'>Average Rating</div>
              </div>
            )}
            {stats.totalTestimonials > 0 && (
              <div>
                <div className='font-Cormorant text-4xl font-light text-neutral-900'>{stats.totalTestimonials.toLocaleString()}</div>
                <div className='text-xs text-neutral-400 uppercase tracking-wider mt-1'>Guest Reviews</div>
              </div>
            )}
            {stats.satisfactionRate > 0 && (
              <div>
                <div className='font-Cormorant text-4xl font-light text-neutral-900'>{stats.satisfactionRate}%</div>
                <div className='text-xs text-neutral-400 uppercase tracking-wider mt-1'>Satisfaction Rate</div>
              </div>
            )}
            {stats.fiveStarCount > 0 && (
              <div>
                <div className='font-Cormorant text-4xl font-light text-neutral-900'>{stats.fiveStarCount.toLocaleString()}</div>
                <div className='text-xs text-neutral-400 uppercase tracking-wider mt-1'>5-Star Reviews</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback modal */}
      {showFeedbackForm && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white w-full max-w-md max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between p-6 border-b border-neutral-100'>
              <h3 className='font-Cormorant text-2xl font-light text-neutral-900'>Share Your Experience</h3>
              <button onClick={() => setShowFeedbackForm(false)} className='w-8 h-8 border border-neutral-200 hover:border-neutral-400 flex items-center justify-center transition-colors'>
                <HiX className='text-neutral-500 text-sm' />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className='p-6 space-y-5'>
              {/* Rating */}
              <div>
                <label className='block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3'>Rating</label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type='button' onClick={() => setFeedbackForm((p) => ({ ...p, rating: star }))}>
                      <HiStar className={`text-2xl transition-colors ${star <= feedbackForm.rating ? 'text-amber-400' : 'text-neutral-200 hover:text-amber-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className='block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2'>Your Review *</label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm((p) => ({ ...p, comment: e.target.value }))}
                  placeholder='Tell us about your experience…'
                  className='w-full px-4 py-3 border border-neutral-200 focus:border-neutral-800 focus:outline-none resize-none text-sm text-neutral-800 transition-colors'
                  rows={4}
                  maxLength={1000}
                  required
                />
                <div className='text-right text-xs text-neutral-400 mt-1'>{feedbackForm.comment.length}/1000</div>
              </div>

              {!user && (
                <>
                  <div>
                    <label className='block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2'>Your Name *</label>
                    <input type='text' value={feedbackForm.guestName} onChange={(e) => setFeedbackForm((p) => ({ ...p, guestName: e.target.value }))} placeholder='Full name' className='w-full px-4 py-3 border border-neutral-200 focus:border-neutral-800 focus:outline-none text-sm transition-colors' required />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2'>Your Email *</label>
                    <input type='email' value={feedbackForm.guestEmail} onChange={(e) => setFeedbackForm((p) => ({ ...p, guestEmail: e.target.value }))} placeholder='Email address' className='w-full px-4 py-3 border border-neutral-200 focus:border-neutral-800 focus:outline-none text-sm transition-colors' required />
                  </div>
                </>
              )}

              <div>
                <label className='block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2'>Property (Optional)</label>
                <input type='text' value={feedbackForm.propertyId} onChange={(e) => setFeedbackForm((p) => ({ ...p, propertyId: e.target.value }))} placeholder='Which property did you stay at?' className='w-full px-4 py-3 border border-neutral-200 focus:border-neutral-800 focus:outline-none text-sm transition-colors' />
              </div>

              <div>
                <label className='block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2'>Stay Date (Optional)</label>
                <input type='date' value={feedbackForm.stayDate} onChange={(e) => setFeedbackForm((p) => ({ ...p, stayDate: e.target.value }))} className='w-full px-4 py-3 border border-neutral-200 focus:border-neutral-800 focus:outline-none text-sm transition-colors' />
              </div>

              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={() => setShowFeedbackForm(false)} className='flex-1 py-3 border border-neutral-200 text-neutral-600 text-sm hover:border-neutral-400 transition-colors'>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting || !feedbackForm.comment.trim() || (!user && (!feedbackForm.guestName.trim() || !feedbackForm.guestEmail.trim()))}
                  className='flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-sm transition-colors'
                >
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Testimonial
