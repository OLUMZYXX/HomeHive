import { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import livingroom from '../../assets/livning room.jpg'
import bedroom from '../../assets/bedroom.jpg'
import dining from '../../assets/dining.jpg'
import kitchen from '../../assets/kitchen.jpg'
import home from '../../assets/homeexterior.jpg'

import {
  FaBath,
  FaBed,
  FaCar,
  FaParking,
  FaShower,
  FaTv,
  FaUtensils,
  FaWifi,
  FaStar,
  FaHeart,
  FaShare,
} from 'react-icons/fa'
import { IoHomeOutline } from 'react-icons/io5'
import { WiStars } from 'react-icons/wi'
import { CiMoneyCheck1 } from 'react-icons/ci'
import { MdOutlineCalendarToday } from 'react-icons/md'
import { FaRegFlag } from 'react-icons/fa6'
import Footer from '../Footer/Footer'
import { toast } from 'sonner'
import MapboxMap from '../common/MapboxMap'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import useScrollToTop from '../../hooks/useScrollToTop'
import { useCurrency } from '../../contexts/CurrencyContext'

const DEMO_LISTINGS = [
  {
    id: 1,
    name: 'Luxury Banana Island Villa',
    location: 'Banana Island, Lagos',
    text: '4-6 guests · Entire Villa · 5 beds · 3 bath',
    amenities: ['Wifi', 'Kitchen', 'Free Parking', 'Pool', 'Security'],
    rating: 4.9,
    reviewCount: 312,
    priceUSD: 325,
    image: livingroom,
    badge: 'Superhost',
    category: 'luxury',
  },
  {
    id: 2,
    name: 'Modern Lekki Apartment',
    location: 'Lekki Phase 1, Lagos',
    text: '2-4 guests · Entire Apartment · 3 beds · 2 bath',
    amenities: ['Wifi', 'Kitchen', 'Gym', 'Security'],
    rating: 4.8,
    reviewCount: 156,
    priceUSD: 180,
    image: home,
    badge: 'Popular',
    category: 'apartment',
  },
  {
    id: 3,
    name: 'Cozy Victoria Island Studio',
    location: 'Victoria Island, Lagos',
    text: '1-2 guests · Studio · 1 bed · 1 bath',
    amenities: ['Wifi', 'Kitchen', 'AC'],
    rating: 4.7,
    reviewCount: 89,
    priceUSD: 120,
    image: bedroom,
    badge: 'Great Value',
    category: 'studio',
  },
]

const STATIC_AMENITIES = [
  { icon: FaWifi, label: 'Wifi' },
  { icon: FaShower, label: 'Shower' },
  { icon: FaBath, label: 'Bath' },
  { icon: FaTv, label: 'TV' },
  { icon: FaBed, label: 'Bed' },
  { icon: FaCar, label: 'Car' },
  { icon: FaParking, label: 'Parking' },
  { icon: FaUtensils, label: 'Kitchen' },
]

const StarRow = ({ rating, reviewCount }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`w-3.5 h-3.5 ${s <= Math.round(Number(rating) || 0) ? 'text-amber-400' : 'text-neutral-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    {rating && (
      <span className="text-sm font-semibold text-neutral-700 ml-1">
        {Number(rating).toFixed(1)}
      </span>
    )}
    {reviewCount != null && (
      <span className="text-sm text-neutral-400">({reviewCount} reviews)</span>
    )}
  </div>
)

const ListingDetails = () => {
  useScrollToTop()

  const navigate = useNavigate()
  const { id } = useParams()
  const { selectedCurrency, selectedCurrencyData, formatPrice, convertFromCurrency } = useCurrency()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkout, setCheckOut] = useState('')
  const [guest, setGuest] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/properties/${id}`)
        const data = await res.json()
        setProperty(data?.property || null)
      } catch {
        setProperty(null)
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  const demoHome = DEMO_LISTINGS.find((l) => l.id === parseInt(id, 10))
  const prop = property || demoHome

  const imageGallery = prop
    ? prop.images && prop.images.length > 0
      ? prop.images.map((img, i) => ({
          src: typeof img === 'object' && img.data ? img.data : img,
          alt: `${prop.title || prop.name || 'Property'} ${i + 1}`,
        }))
      : [
          { src: prop.image, alt: prop.name || prop.title || 'Property' },
          { src: bedroom, alt: 'Bedroom' },
          { src: dining, alt: 'Dining Room' },
          { src: kitchen, alt: 'Kitchen' },
          { src: livingroom, alt: 'Living Room' },
        ]
    : []

  const prevImage = () => {
    if (isTransitioning || imageGallery.length === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex((p) => (p - 1 + imageGallery.length) % imageGallery.length)
      setIsTransitioning(false)
    }, 150)
  }

  const nextImage = () => {
    if (isTransitioning || imageGallery.length === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex((p) => (p + 1) % imageGallery.length)
      setIsTransitioning(false)
    }, 150)
  }

  const goToImage = (index) => {
    if (index === currentImageIndex || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => { setCurrentImageIndex(index); setIsTransitioning(false) }, 150)
  }

  const handleTouchStart = (e) => setTouchStartX(e.targetTouches[0].clientX)
  const handleTouchMove = (e) => setTouchEndX(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const dist = touchStartX - touchEndX
    if (dist > 50) nextImage()
    if (dist < -50) prevImage()
    setTouchStartX(0); setTouchEndX(0)
  }

  const handleReservation = () => {
    if (!checkIn || !checkout || !guest) {
      toast.error('Missing Information', {
        description: 'Please fill in check-in, check-out, and number of guests.',
        duration: 4000,
      })
      return
    }
    toast.success('Booking Successful!', {
      description: 'Redirecting to checkout...',
      duration: 3000,
    })
    setTimeout(() => {
      navigate('/checkout', {
        state: {
          checkIn, checkout, guest,
          price: prop?.price || prop?.pricePerNight || prop?.priceUSD || 0,
          currency: prop?.currency || 'NGN',
          selectedCurrency,
          home: {
            id: prop?.id || prop?._id,
            name: prop?.name || prop?.title,
            location: prop?.location || prop?.city,
            image: imageGallery[0]?.src,
          },
        },
      })
    }, 1000)
    setCheckIn(''); setCheckOut(''); setGuest('')
  }

  const priceDisplay = prop
    ? prop.currency && prop.price
      ? formatPrice(
          selectedCurrency === prop.currency
            ? prop.price
            : parseFloat(convertFromCurrency(prop.price, prop.currency, selectedCurrency))
        )
      : formatPrice(parseFloat(prop.pricePerNight || prop.priceUSD || 75))
    : formatPrice(75)

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-neutral-500">Loading property…</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (!prop) {
    return (
      <div className="min-h-screen bg-white pt-20 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <p className="font-Cormorant text-4xl text-neutral-300 mb-4">Property not found</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-neutral-900 text-neutral-900 text-sm font-semibold hover:bg-neutral-900 hover:text-white transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col pt-20">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Back + Title ─────────────────────────────────── */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200 mb-4 group"
            >
              <IoIosArrowBack className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to listings
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="font-Cormorant text-4xl sm:text-5xl font-semibold text-neutral-900 leading-tight mb-2">
                  {prop.title || prop.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <StarRow rating={prop.rating || prop.averageRating} reviewCount={prop.reviewCount || prop.totalReviews} />
                  <span className="text-neutral-300">·</span>
                  <span className="text-sm text-neutral-600 underline cursor-pointer hover:text-neutral-900">
                    {prop.location || prop.city}
                  </span>
                  {prop.badge && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">{prop.badge}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium hover:border-neutral-900 hover:text-neutral-900 transition-colors duration-200">
                  <FaShare className="text-xs" /> Share
                </button>
                <button
                  onClick={() => setSaved((s) => !s)}
                  className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                    saved
                      ? 'border-red-400 text-red-500 bg-red-50'
                      : 'border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900'
                  }`}
                >
                  <FaHeart className="text-xs" /> {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Image Gallery ────────────────────────────────── */}
          {imageGallery.length > 0 && (
            <div className="mb-10">
              {/* Desktop: CSS grid gallery */}
              {imageGallery.length >= 3 ? (
                <div className="hidden md:grid grid-cols-2 gap-2 h-[480px]">
                  {/* Main image */}
                  <div
                    className="relative overflow-hidden cursor-pointer group"
                    onClick={() => goToImage(0)}
                  >
                    <img
                      src={imageGallery[currentImageIndex]?.src}
                      alt={imageGallery[currentImageIndex]?.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    {/* Prev/Next overlays */}
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage() }}
                      disabled={isTransitioning}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-md"
                    >
                      <IoIosArrowBack />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage() }}
                      disabled={isTransitioning}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-md"
                    >
                      <IoIosArrowForward />
                    </button>
                    {/* Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1">
                      {currentImageIndex + 1} / {imageGallery.length}
                    </div>
                  </div>
                  {/* Side images */}
                  <div className="grid grid-rows-2 gap-2">
                    {imageGallery.slice(1, 3).map((img, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden cursor-pointer group"
                        onClick={() => goToImage(i + 1)}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        {i === 1 && imageGallery.length > 3 && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-white text-sm font-semibold">+{imageGallery.length - 3} more</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Mobile: full-width carousel */}
              <div
                className={`${imageGallery.length >= 3 ? 'md:hidden' : ''} relative overflow-hidden`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out h-72 sm:h-96"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                  {imageGallery.map((img, i) => (
                    <div key={i} className="w-full flex-shrink-0">
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
                    </div>
                  ))}
                </div>
                <button onClick={prevImage} disabled={isTransitioning} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center shadow-md hover:bg-white">
                  <IoIosArrowBack />
                </button>
                <button onClick={nextImage} disabled={isTransitioning} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center shadow-md hover:bg-white">
                  <IoIosArrowForward />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {imageGallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToImage(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail strip (all sizes) */}
              {imageGallery.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {imageGallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => goToImage(i)}
                      className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 transition-all duration-200 ${
                        i === currentImageIndex ? 'border-neutral-900' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Main 2-col grid ──────────────────────────────── */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">

            {/* ── Left: Info ───────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Property meta */}
              <div className="pb-8 border-b border-neutral-200">
                <p className="text-neutral-600 text-base mb-1">
                  {prop.text || [
                    prop.bedrooms && `${prop.bedrooms} bed${prop.bedrooms > 1 ? 's' : ''}`,
                    prop.bathrooms && `${prop.bathrooms} bath${prop.bathrooms > 1 ? 's' : ''}`,
                    prop.propertyType || prop.category,
                  ].filter(Boolean).join(' · ')}
                </p>
                {prop.category && (
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-600 border border-amber-300 px-2 py-0.5 mt-1">
                    {prop.category}
                  </span>
                )}
              </div>

              {/* Feature highlights */}
              <div className="space-y-5 pb-8 border-b border-neutral-200">
                <div className="flex items-start gap-4">
                  <IoHomeOutline className="text-2xl text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {prop.category
                        ? prop.category.charAt(0).toUpperCase() + prop.category.slice(1)
                        : 'Entire home'}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5">You'll have the place to yourself</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <WiStars className="text-2xl text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-900">Enhanced Clean</p>
                    <p className="text-sm text-neutral-500 mt-0.5">This host committed to enhanced cleaning process</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CiMoneyCheck1 className="text-2xl text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-900">Self check-in</p>
                    <p className="text-sm text-neutral-500 mt-0.5">Check yourself in with the keypad</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MdOutlineCalendarToday className="text-xl text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-900">Free cancellation before Feb 25</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="font-Cormorant text-3xl font-semibold text-neutral-900 mb-4">About this place</h2>
                <p className="text-neutral-600 leading-relaxed">
                  {prop.description || prop.about ||
                    `Experience this beautiful ${prop.propertyType || 'property'} in ${prop.city || prop.location || 'a prime location'}. This space offers comfortable accommodation with premium amenities for your stay.`}
                </p>
              </div>

              {/* Where you'll sleep */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="font-Cormorant text-3xl font-semibold text-neutral-900 mb-6">Where you'll sleep</h2>
                <div className="border border-neutral-200 p-5 max-w-xs">
                  <img src={bedroom} alt="Bedroom" className="w-full h-40 object-cover mb-4" loading="lazy" />
                  <p className="font-semibold text-neutral-900">Bedroom</p>
                  <p className="text-sm text-neutral-500 mt-0.5">1 queen size bed</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="font-Cormorant text-3xl font-semibold text-neutral-900 mb-6">What this place offers</h2>
                {prop.amenities && prop.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                    {prop.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 text-neutral-700 text-sm">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {STATIC_AMENITIES.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3 p-3 border border-neutral-200 text-sm text-neutral-700 hover:border-neutral-400 transition-colors duration-200">
                        <Icon className="text-neutral-400 flex-shrink-0" />
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="pb-8">
                <h2 className="font-Cormorant text-3xl font-semibold text-neutral-900 mb-6">Where you'll be</h2>
                <div className="overflow-hidden border border-neutral-200 mb-4" style={{ height: 300 }}>
                  <MapboxMap
                    center={[prop.locationLng || 3.3792, prop.locationLat || 6.5244]}
                    zoom={14}
                    markers={[{
                      coordinates: [prop.locationLng || 3.3792, prop.locationLat || 6.5244],
                      popup: `<div><strong>${prop.title || 'Property'}</strong><br/>${prop.location || ''}</div>`,
                    }]}
                    style={{ height: '300px' }}
                  />
                </div>
                <p className="font-semibold text-neutral-900 mb-1">{prop.location}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Explore the vibrant area of {prop.location}. Enjoy local attractions, restaurants, and great transport links nearby.
                </p>
              </div>

              {/* Report */}
              <div className="pb-4">
                <button className="flex items-center gap-2 text-sm text-neutral-500 underline hover:text-neutral-900 transition-colors duration-200">
                  <FaRegFlag className="text-xs" /> Report this listing
                </button>
              </div>
            </div>

            {/* ── Right: Booking Card ──────────────────────── */}
            <div className="lg:col-span-1 mt-10 lg:mt-0">
              <div className="border border-neutral-200 p-6 lg:sticky lg:top-28 shadow-sm">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-Cormorant text-4xl font-semibold text-neutral-900">{priceDisplay}</span>
                  <span className="text-sm text-neutral-500">/night</span>
                </div>
                <StarRow rating={prop.rating || prop.averageRating} reviewCount={prop.reviewCount || prop.totalReviews} />

                <div className="mt-5 space-y-3">
                  {/* Date grid */}
                  <div className="grid grid-cols-2 border border-neutral-300">
                    <div className="p-3 border-r border-neutral-300">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-transparent text-sm text-neutral-900 focus:outline-none cursor-pointer"
                        style={{ fontSize: 16 }}
                      />
                    </div>
                    <div className="p-3">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Check-out</label>
                      <input
                        type="date"
                        value={checkout}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full bg-transparent text-sm text-neutral-900 focus:outline-none cursor-pointer"
                        style={{ fontSize: 16 }}
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="border border-neutral-300 p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Guests</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="2 guests"
                      value={guest}
                      onChange={(e) => setGuest(e.target.value)}
                      className="w-full bg-transparent text-sm text-neutral-900 focus:outline-none"
                      style={{ fontSize: 16 }}
                    />
                  </div>
                </div>

                {/* Book button */}
                <button
                  onClick={handleReservation}
                  className="w-full mt-4 py-3.5 bg-neutral-900 text-white text-sm font-semibold tracking-wide hover:bg-neutral-800 active:scale-[0.99] transition-all duration-200"
                >
                  Reserve
                </button>
                <p className="text-center text-xs text-neutral-400 mt-3">You won't be charged yet</p>

                {/* Price breakdown hint */}
                {checkIn && checkout && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex justify-between text-sm text-neutral-600">
                      <span>{priceDisplay} × 1 night</span>
                      <span>{priceDisplay}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-neutral-900 mt-2 pt-2 border-t border-neutral-200">
                      <span>Total</span>
                      <span>{priceDisplay}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ListingDetails
