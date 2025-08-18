import { HiSparkles, HiShieldCheck, HiClock, HiHeart } from 'react-icons/hi'

const About = () => {
  const features = [
    {
      icon: HiShieldCheck,
      title: 'Verified Quality',
      description:
        'Every property is personally inspected and verified for quality standards',
    },
    {
      icon: HiClock,
      title: '24/7 Support',
      description:
        'Round-the-clock customer service to assist you whenever you need help',
    },
    {
      icon: HiSparkles,
      title: 'Best Price Guarantee',
      description:
        'We guarantee the lowest prices with our best price match promise',
    },
    {
      icon: HiHeart,
      title: 'Curated Collection',
      description:
        'Handpicked accommodations designed for unforgettable experiences',
    },
  ]

  return (
    <section className='py-16 lg:py-24 bg-gradient-to-br from-white via-primary-25 to-primary-50 relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_1000px]'>
      {/* Background Decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 right-10 w-40 h-40 bg-primary-100 rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute bottom-20 left-10 w-32 h-32 bg-neutral-100 rounded-full opacity-30 blur-2xl'></div>
      </div>

      <div className='relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-soft'>
            <HiSparkles className='text-primary-600 text-sm' />
            <span className='text-sm font-medium text-primary-700'>
              What Makes Us Special
            </span>
          </div>

          <h2 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-800 mb-6'>
            Why Choose
            <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text block sm:inline sm:ml-3'>
              Homehive
            </span>
          </h2>

          <div className='w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-800 mx-auto rounded-full mb-8'></div>

          <p className='text-lg lg:text-xl text-primary-600 leading-relaxed max-w-4xl mx-auto'>
            We provide groundbreaking opportunities to explore a variety of
            premium accommodations for your stay—all conveniently accessible at
            your fingertips. Simply search for your perfect listing and
            experience luxury like never before.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group bg-white/70 backdrop-blur-sm border-2 border-primary-200 hover:border-primary-300 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2'
            >
              <div className='flex flex-col items-center text-center space-y-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-primary-300 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110'>
                  <feature.icon className='text-primary-700 text-2xl' />
                </div>

                <h3 className='font-NotoSans text-xl font-bold text-primary-800'>
                  {feature.title}
                </h3>

                <p className='text-base text-primary-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className='mt-16 text-center'>
          <div className='bg-white/80 backdrop-blur-sm border-2 border-primary-200 rounded-3xl p-8 lg:p-12 shadow-medium'>
            <h3 className='font-NotoSans text-2xl lg:text-3xl font-bold text-primary-800 mb-4'>
              Ready to Experience Luxury?
            </h3>
            <p className='text-lg text-primary-600 mb-8 max-w-2xl mx-auto'>
              Join thousands of satisfied guests who have discovered their
              perfect stay with us.
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
                Start Your Search
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById('testimonial')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className='border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105'
              >
                Read Reviews
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default About
