/* eslint-disable no-unused-vars */
import React from 'react'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { id: 1, name: 'About Us', link: '/about' },
      { id: 2, name: 'Our Story', link: '/story' },
      { id: 3, name: 'Careers', link: '/careers' },
      { id: 4, name: 'Press', link: '/press' },
    ],
    services: [
      { id: 1, name: 'Accommodations', link: '#accomodation' },
      { id: 2, name: 'Testimonials', link: '#testimonial' },
      { id: 3, name: 'Support', link: '#support' },
      { id: 4, name: 'Become a Host', link: '/host' },
    ],
    support: [
      { id: 1, name: 'Help Center', link: '/help' },
      { id: 2, name: 'Contact Us', link: '/contact' },
      { id: 3, name: 'Safety', link: '/safety' },
      { id: 4, name: 'Community', link: '/community' },
    ],
    legal: [
      { id: 1, name: 'Privacy Policy', link: '/privacy' },
      { id: 2, name: 'Terms of Service', link: '/terms' },
      { id: 3, name: 'Cookie Policy', link: '/cookies' },
      { id: 4, name: 'GDPR', link: '/gdpr' },
    ],
  }

  const socialLinks = [
    {
      icon: FaFacebook,
      href: 'https://facebook.com/homehive',
      label: 'Facebook',
    },
    { icon: FaTwitter, href: 'https://twitter.com/homehive', label: 'Twitter' },
    {
      icon: FaInstagram,
      href: 'https://instagram.com/homehive',
      label: 'Instagram',
    },
    {
      icon: FaLinkedin,
      href: 'https://linkedin.com/company/homehive',
      label: 'LinkedIn',
    },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className='bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_600px]'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1'></div>
      </div>

      {/* Main Footer Content */}
      <div className='relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-12 max-w-full md:max-w-screen-md xl:max-w-screen-xl'>
        {/* Top Section */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8'>
          {/* Company Info */}
          <div className='lg:col-span-5 space-y-6'>
            <div>
              <h2 className='font-NotoSans text-3xl font-bold mb-4'>
                <span className='text-white'>Home</span>
                <span className='text-transparent bg-gradient-to-r from-primary-200 to-white bg-clip-text'>
                  hive
                </span>
              </h2>
              <p className='text-lg text-primary-100 leading-relaxed'>
                Discover exceptional accommodations that redefine comfort and
                luxury. Your perfect stay awaits with Homehive.
              </p>
            </div>

            {/* Contact Info */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='flex items-center gap-3'>
                <FaMapMarkerAlt className='text-primary-200 text-lg' />
                <div>
                  <p className='text-primary-100 text-sm'>Lagos, Nigeria</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <FaPhone className='text-primary-200 text-lg' />
                <div>
                  <p className='text-primary-100 text-sm'>+234 800 123 4567</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <FaEnvelope className='text-primary-200 text-lg' />
                <div>
                  <p className='text-primary-100 text-sm'>hello@homehive.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className='lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8'>
            {/* Company Links */}
            <div>
              <h3 className='text-lg font-bold text-white mb-4'>Company</h3>
              <ul className='space-y-2'>
                {footerLinks.company.slice(0, 4).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.link}
                      className='text-primary-100 hover:text-white transition-colors duration-300 text-sm'
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className='text-lg font-bold text-white mb-4'>Services</h3>
              <ul className='space-y-2'>
                {footerLinks.services.slice(0, 4).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.link}
                      className='text-primary-100 hover:text-white transition-colors duration-300 text-sm'
                      onClick={
                        link.link.startsWith('#')
                          ? (e) => {
                              e.preventDefault()
                              document
                                .querySelector(link.link)
                                ?.scrollIntoView({ behavior: 'smooth' })
                            }
                          : undefined
                      }
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className='text-lg font-bold text-white mb-4'>Support</h3>
              <ul className='space-y-2'>
                {footerLinks.support.slice(0, 4).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.link}
                      className='text-primary-100 hover:text-white transition-colors duration-300 text-sm'
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-primary-600/30 pt-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex flex-col md:flex-row items-center gap-4'>
              <p className='text-primary-100 text-sm'>
                © {currentYear} Homehive. All rights reserved.
              </p>
              <div className='flex gap-4'>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={social.label}
                    className='w-8 h-8 bg-primary-700/50 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110'
                  >
                    <social.icon className='text-sm text-primary-100 hover:text-white transition-colors duration-300' />
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className='bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 transform hover:scale-110'
              aria-label='Back to top'
            >
              <HiArrowUp className='text-lg text-white' />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
