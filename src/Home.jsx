import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Location from './components/location/Location'
import Footer from './components/Footer/Footer'

// Lazy-load below-the-fold sections to improve initial load perf
const Header = lazy(() => import('./components/Header/Header'))
const About = lazy(() => import('./components/why choose us/About'))
const Featured = lazy(() => import('./components/Featured/Featured'))
const CustomerCare = lazy(() =>
  import('./components/Customer Care/CustomerCare')
)
const Testimonial = lazy(() => import('./components/Testimonial/Testimonial'))

function Home() {
  return (
    <div className='overflow-x-hidden bg-white'>
      <Navbar />
      <main>
        {/* Sections render full-bleed; each component manages its own inner container */}
        <Hero />
        <Location />
        <Suspense
          fallback={
            <div className='container mx-auto px-4 sm:px-6 md:px-8 xl:max-w-screen-xl md:max-w-screen-md'>
              <div className='py-16 text-primary-600'>Loading…</div>
            </div>
          }
        >
          <Header />
          <About />
          <Featured />
          <CustomerCare />
          <Testimonial />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default Home
