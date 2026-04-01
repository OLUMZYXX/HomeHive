import { useNavigate } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'

const destinations = [
  {
    city: 'Lagos',
    state: 'Lagos State',
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=800&q=80',
    tag: 'Most Popular',
  },
  {
    city: 'Abuja',
    state: 'FCT',
    image: 'https://images.unsplash.com/photo-1580711508444-cbdc4e8c77d3?w=800&q=80',
    tag: 'Capital City',
  },
  {
    city: 'Port Harcourt',
    state: 'Rivers State',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    tag: 'Business Hub',
  },
  {
    city: 'Ibadan',
    state: 'Oyo State',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    tag: 'Cultural Heart',
  },
  {
    city: 'Enugu',
    state: 'Enugu State',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    tag: 'Coal City',
  },
  {
    city: 'Kano',
    state: 'Kano State',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80',
    tag: 'Ancient Kingdom',
  },
]

const PopularDestinations = () => {
  const navigate = useNavigate()

  return (
    <section className='py-16 lg:py-24 bg-neutral-50 [content-visibility:auto] [contain-intrinsic-size:1px_800px]'>
      <div className='container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl'>

        {/* Header */}
        <div className='flex flex-col lg:flex-row items-start lg:items-end justify-between mb-14 gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-8 h-px bg-amber-500' />
              <span className='text-xs font-semibold tracking-[0.25em] uppercase text-amber-600'>
                Destinations
              </span>
            </div>
            <h2 className='font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]'>
              Explore <span className='italic'>Popular Cities</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/listings')}
            className='group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-0.5 transition-all duration-200 flex-shrink-0'
          >
            View All Listings
            <HiArrowRight className='group-hover:translate-x-1 transition-transform duration-200' />
          </button>
        </div>

        {/* Grid — Pinterest-style asymmetric */}
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
          {destinations.map((dest, index) => (
            <button
              key={dest.city}
              onClick={() => navigate(`/listings?location=${encodeURIComponent(dest.city)}`)}
              className={`group relative overflow-hidden text-left ${
                index === 0 ? 'col-span-2 lg:col-span-1 row-span-2' : ''
              }`}
              style={{ aspectRatio: index === 0 ? undefined : '4/3' }}
            >
              {/* Image */}
              <div
                className={`w-full overflow-hidden ${index === 0 ? 'h-full min-h-[320px]' : 'h-full'}`}
              >
                <img
                  src={dest.image}
                  alt={`${dest.city}, ${dest.state}`}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  loading='lazy'
                  decoding='async'
                  width={800}
                  height={index === 0 ? 640 : 320}
                />
              </div>

              {/* Gradient overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent' />

              {/* Tag */}
              <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-semibold tracking-wider uppercase px-2.5 py-1'>
                {dest.tag}
              </div>

              {/* City info */}
              <div className='absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between'>
                <div>
                  <h3 className={`font-Cormorant text-white font-light leading-tight ${index === 0 ? 'text-3xl' : 'text-xl'}`}>
                    {dest.city}
                  </h3>
                  <p className='text-white/70 text-xs mt-0.5'>{dest.state}</p>
                </div>
                <div className='w-8 h-8 border border-white/50 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300'>
                  <HiArrowRight className='text-white text-xs' />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularDestinations
