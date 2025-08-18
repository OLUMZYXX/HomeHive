import { useRef } from 'react'
import apt from '../../assets/Apt1.webp'
import { HiStar } from 'react-icons/hi'
import { FaQuoteLeft } from 'react-icons/fa'

const Testimonial = () => {
  const testimonialRef = useRef(null)

  const TestimonialData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      location: 'Lagos, Nigeria',
      text: 'Absolutely incredible experience! The property exceeded all my expectations. The attention to detail and customer service was outstanding.',
      img: { src: apt },
      rating: 5,
      stayDate: 'March 2024',
    },
    {
      id: 2,
      name: 'James Rodriguez',
      role: 'Family Vacation',
      location: 'Abuja, Nigeria',
      text: 'Perfect for our family getaway. The amenities were top-notch and the location was ideal. Our kids had an amazing time.',
      img: { src: apt },
      rating: 5,
      stayDate: 'February 2024',
    },
    {
      id: 3,
      name: 'Aisha Okonkwo',
      role: 'Weekend Retreat',
      location: 'Port Harcourt, Nigeria',
      text: 'A peaceful and luxurious retreat. The property was immaculate and the host was incredibly accommodating. Highly recommended!',
      img: { src: apt },
      rating: 5,
      stayDate: 'January 2024',
    },
    {
      id: 4,
      name: 'Liam Thompson',
      role: 'Romantic Getaway',
      location: 'Ibadan, Nigeria',
      text: 'The perfect romantic escape. Beautiful property with stunning views. Every detail was thoughtfully arranged for our special occasion.',
      img: { src: apt },
      rating: 5,
      stayDate: 'December 2023',
    },
  ]

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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {TestimonialData.map((testimonial, index) => (
            <div
              key={testimonial.id}
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
                  &quot;{testimonial.text}&quot;
                </p>
              </div>

              {/* User Info */}
              <div className='px-6 pb-6'>
                <div className='flex items-center gap-4'>
                  <div className='relative'>
                    <img
                      src={testimonial.img.src}
                      alt={testimonial.name}
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
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-primary-600 font-medium'>
                      {testimonial.role}
                    </p>
                    <p className='text-sm text-primary-500'>
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Stay Date */}
                <div className='mt-4 pt-4 border-t border-primary-100'>
                  <p className='text-xs text-primary-500 font-medium'>
                    Stayed in {testimonial.stayDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className='mt-16 pt-12 border-t border-primary-200'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='space-y-2'>
              <div className='text-3xl lg:text-4xl font-black text-primary-800'>
                4.9
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
                2,500+
              </div>
              <div className='text-base text-primary-600 font-medium'>
                Happy Guests
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-3xl lg:text-4xl font-black text-primary-800'>
                98%
              </div>
              <div className='text-base text-primary-600 font-medium'>
                Satisfaction Rate
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-3xl lg:text-4xl font-black text-primary-800'>
                500+
              </div>
              <div className='text-base text-primary-600 font-medium'>
                5-Star Reviews
              </div>
            </div>
          </div>
        </div>

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
