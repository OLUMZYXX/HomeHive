import { useNavigate } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../common/AnimatedComponents'

const steps = [
  {
    number: '01',
    emoji: '🔍',
    title: 'Search',
    description:
      'Browse our curated collection of verified properties. Filter by location, price, amenities, and property type to find exactly what you need.',
  },
  {
    number: '02',
    emoji: '📅',
    title: 'Book',
    description:
      'Select your dates, confirm your guest count, and reserve your stay instantly. Secure payment processing keeps every transaction safe.',
  },
  {
    number: '03',
    emoji: '🏠',
    title: 'Stay',
    description:
      'Check in and experience a verified, high-quality property. Our support team is available 24/7 throughout your entire stay.',
  },
]

const HowItWorks = () => {
  const navigate = useNavigate()

  return (
    <section className='py-16 lg:py-24 bg-white relative overflow-hidden'>
      {/* Subtle grid background */}
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className='relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        {/* Header */}
        <ScrollReveal direction='up' delay={0.2}>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-6'>
              <span className='w-2 h-2 rounded-full bg-primary-600'></span>
              <span className='text-sm font-medium text-primary-700'>
                Simple Process
              </span>
            </div>
            <h2 className='font-Sora text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-800 mb-6'>
              How It{' '}
              <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text'>
                Works
              </span>
            </h2>
            <div className='w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-800 mx-auto rounded-full mb-6'></div>
            <p className='text-lg lg:text-xl text-primary-600 leading-relaxed max-w-2xl mx-auto'>
              Finding and booking your perfect stay takes just a few minutes.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <StaggerContainer
          staggerDelay={0.2}
          className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative'
        >
          {/* Connecting line — desktop only */}
          <div className='hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200' />

          {steps.map((step, index) => (
            <StaggerItem key={step.number}>
              <div className='flex flex-col items-center text-center group'>
                {/* Step circle */}
                <div className='relative mb-8'>
                  <div className='w-32 h-32 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 group-hover:border-primary-400 rounded-full flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-medium'>
                    <span className='text-4xl mb-1'>{step.emoji}</span>
                  </div>
                  {/* Step number badge */}
                  <div className='absolute -top-2 -right-2 w-9 h-9 bg-primary-800 rounded-full flex items-center justify-center shadow-medium'>
                    <span className='text-white text-xs font-bold'>
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className='font-Sora text-2xl font-bold text-primary-800 mb-4'>
                  {step.title}
                </h3>
                <p className='text-base text-primary-600 leading-relaxed max-w-xs'>
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <ScrollReveal direction='up' delay={0.6}>
          <div className='text-center mt-14'>
            <button
              onClick={() => navigate('/listings')}
              className='group inline-flex items-center gap-3 bg-primary-800 hover:bg-primary-900 text-white font-semibold py-4 px-10 rounded-full shadow-medium hover:shadow-strong transition-all duration-300'
            >
              Find Your Stay
              <HiArrowRight className='text-lg group-hover:translate-x-1 transition-transform duration-300' />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default HowItWorks
