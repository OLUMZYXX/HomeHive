// eslint-disable-next-line no-unused-vars
import React from 'react'
import { HiPhone, HiChat, HiMail } from 'react-icons/hi'

const CustomerCare = () => {
  const representatives = [
    {
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      name: 'Sarah Johnson',
      role: 'Senior Support Specialist',
      contact: 'Available 24/7',
    },
    {
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      name: 'Michael Chen',
      role: 'Guest Experience Manager',
      contact: 'Booking Assistance',
    },
    {
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      name: 'Emily Rodriguez',
      role: 'Customer Success Lead',
      contact: 'Property Support',
    },
  ]

  return (
    <section
      className='py-10 lg:py-14 bg-gradient-to-br from-primary-50 via-white to-neutral-50'
      id='support'
    >
      <div className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-soft'>
            <HiChat className='text-primary-600 text-sm' />
            <span className='text-sm font-medium text-primary-700'>
              Customer Support
            </span>
          </div>
          <h2 className='font-NotoSans text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-800 mb-6'>
            Meet Our Customer Care
            <span className='text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text block sm:inline sm:ml-3'>
              Representatives
            </span>
          </h2>
          <div className='w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-800 mx-auto rounded-full mb-8'></div>
          <p className='text-lg lg:text-xl text-primary-600 leading-relaxed max-w-4xl mx-auto'>
            At Homehive, we&#39;re committed to offering exceptional support and
            ensuring your stay is nothing less than perfect. Our dedicated
            customer care team is here to assist you with any questions or
            concerns, making your experience smooth and enjoyable.
          </p>
        </div>

        {/* Representatives Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {representatives.map((rep, index) => (
            <div
              key={index}
              className='group bg-white rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-primary-100'
            >
              {/* Image Container */}
              <div className='relative overflow-hidden'>
                <img
                  src={rep.image}
                  alt={`Customer Care Representative ${rep.name}`}
                  className='w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105'
                  loading='lazy'
                  decoding='async'
                  width={400}
                  height={320}
                />
                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                {/* Contact Info Overlay */}
                <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0'>
                  <div className='bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-medium'>
                    <div className='flex items-center justify-center gap-4'>
                      <button className='w-10 h-10 bg-primary-800 hover:bg-primary-900 text-white rounded-full flex items-center justify-center transition-colors duration-300'>
                        <HiPhone className='text-lg' />
                      </button>
                      <button className='w-10 h-10 bg-primary-800 hover:bg-primary-900 text-white rounded-full flex items-center justify-center transition-colors duration-300'>
                        <HiChat className='text-lg' />
                      </button>
                      <button className='w-10 h-10 bg-primary-800 hover:bg-primary-900 text-white rounded-full flex items-center justify-center transition-colors duration-300'>
                        <HiMail className='text-lg' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className='p-6 text-center space-y-3'>
                <h3 className='font-NotoSans text-xl font-bold text-primary-900'>
                  {rep.name}
                </h3>
                <p className='text-base text-primary-700 font-medium'>
                  {rep.role}
                </p>
                <p className='text-base text-primary-600'>{rep.contact}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Methods */}
        <div className='bg-white/80 backdrop-blur-sm border-2 border-primary-200 rounded-3xl p-8 lg:p-12 shadow-medium'>
          <div className='text-center mb-8'>
            <h3 className='font-NotoSans text-2xl lg:text-3xl font-bold text-primary-800 mb-4'>
              Get in Touch
            </h3>
            <p className='text-lg text-primary-600'>
              Multiple ways to reach our support team
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-6 bg-primary-50 rounded-2xl border border-primary-100 hover:border-primary-200 transition-colors duration-300'>
              <div className='w-16 h-16 bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <HiPhone className='text-white text-2xl' />
              </div>
              <h4 className='font-semibold text-primary-900 text-lg mb-2'>
                24/7 Phone Support
              </h4>
              <p className='text-primary-600 text-base mb-3'>
                Immediate assistance when you need it
              </p>
              <button className='text-primary-800 font-semibold hover:text-primary-900 transition-colors duration-300'>
                +234 800 123 4567
              </button>
            </div>
            <div className='text-center p-6 bg-primary-50 rounded-2xl border border-primary-100 hover:border-primary-200 transition-colors duration-300'>
              <div className='w-16 h-16 bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <HiChat className='text-white text-2xl' />
              </div>
              <h4 className='font-semibold text-primary-900 text-lg mb-2'>
                Live Chat
              </h4>
              <p className='text-primary-600 text-base mb-3'>
                Quick responses to your questions
              </p>
              <button className='bg-primary-800 hover:bg-primary-900 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-300'>
                Start Chat
              </button>
            </div>
            <div className='text-center p-6 bg-primary-50 rounded-2xl border border-primary-100 hover:border-primary-200 transition-colors duration-300'>
              <div className='w-16 h-16 bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <HiMail className='text-white text-2xl' />
              </div>
              <h4 className='font-semibold text-primary-900 text-lg mb-2'>
                Email Support
              </h4>
              <p className='text-primary-600 text-base mb-3'>
                Detailed help for complex issues
              </p>
              <button className='text-primary-800 font-semibold hover:text-primary-900 transition-colors duration-300'>
                support@homehive.com
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerCare
