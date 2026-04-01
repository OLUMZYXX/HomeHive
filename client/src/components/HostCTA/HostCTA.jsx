import { useNavigate } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'

const HostCTA = () => {
  const navigate = useNavigate()

  return (
    <section className='relative overflow-hidden bg-neutral-900 py-20 lg:py-28 [content-visibility:auto] [contain-intrinsic-size:1px_500px]'>
      {/* Subtle dot pattern */}
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Amber accent line — left */}
      <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-500/60 to-transparent' />

      <div className='relative container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>

          {/* Left — copy */}
          <div className='space-y-8'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-px bg-amber-500' />
              <span className='text-xs font-semibold tracking-[0.25em] uppercase text-amber-400'>
                For Property Owners
              </span>
            </div>

            <h2 className='font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1]'>
              Turn Your Property
              <br />
              <span className='italic'>Into Income</span>
            </h2>

            <p className='text-neutral-400 text-base leading-relaxed max-w-md'>
              Join a growing community of hosts earning from their properties across Nigeria.
              List in minutes, get bookings fast, and we handle the rest.
            </p>

            {/* Perks */}
            <ul className='space-y-4'>
              {[
                'Earn on your own schedule',
                'Access to thousands of verified guests',
                'Full control over your listing and pricing',
              ].map((perk) => (
                <li key={perk} className='flex items-center gap-4'>
                  <div className='w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0' />
                  <span className='text-neutral-300 text-sm'>{perk}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className='flex flex-col sm:flex-row gap-4 pt-2'>
              <button
                onClick={() => navigate('/host')}
                className='group inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium tracking-widest uppercase px-8 py-4 transition-colors duration-300'
              >
                Become a Host
                <HiArrowRight className='group-hover:translate-x-1 transition-transform duration-300' />
              </button>
              <button
                onClick={() => navigate('/hostlogin')}
                className='inline-flex items-center justify-center border border-white/20 hover:border-white/50 text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase px-8 py-4 transition-all duration-300'
              >
                Host Sign In
              </button>
            </div>
          </div>

          {/* Right — earnings card */}
          <div className='flex items-center justify-center'>
            <div className='relative w-full max-w-sm'>
              {/* Decorative cards behind */}
              <div className='absolute inset-0 border border-white/5 transform rotate-6 scale-95 translate-y-2' />
              <div className='absolute inset-0 border border-white/8 transform rotate-3 scale-97' />

              {/* Main card */}
              <div className='relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 space-y-6'>
                <div className='flex items-center justify-between'>
                  <span className='font-Cormorant text-lg font-light text-white/90'>My Property</span>
                  <span className='text-2xl'>🏠</span>
                </div>

                <div className='space-y-4'>
                  <div className='flex justify-between items-center py-2 border-b border-white/5'>
                    <span className='text-white/50 text-sm'>Status</span>
                    <span className='flex items-center gap-1.5 text-green-400 text-sm font-medium'>
                      <span className='w-1.5 h-1.5 bg-green-400 rounded-full' />
                      Active
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-white/5'>
                    <span className='text-white/50 text-sm'>Bookings this month</span>
                    <span className='text-white font-semibold'>12</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-white/5'>
                    <span className='text-white/50 text-sm'>Occupancy rate</span>
                    <span className='text-white font-semibold'>78%</span>
                  </div>
                </div>

                <div>
                  <p className='text-white/40 text-xs uppercase tracking-widest mb-2'>Monthly earnings</p>
                  <p className='font-Cormorant text-4xl font-light text-white'>₦480,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HostCTA
