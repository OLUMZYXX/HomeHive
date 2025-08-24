/* eslint-disable no-unused-vars */
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { PageWrapper } from './components/common/AnimatedComponents'

import Home from './Home'
import Login from './components/Loginpage/login'
import Createacct from './components/Create Account/Createacct'
import CreateAccount from './components/HostCreate-Acct/CreateAccount'
import Listings from './components/listings-page/Listings'
import PropertyDetail from './components/PropertyDetail/PropertyDetail'
import MyBookings from './components/MyBookings/MyBookings'
import Checkout from './components/Checkout/Checkout'
import BookingConfirmation from './components/BookingConfirmation/BookingConfirmation'
import Host from './components/Become a Host/Host'
import Hostlogin from './components/Host-Login/Hostlogin'
import Dashboard from './components/Host-dashboard/Dashboard'
import PaymentPage from './pages/PaymentPage'
import ScrollToTop from './components/ScrollToTop'

const AnimatedRoutes = () => {
  const location = useLocation()

  const getPageVariant = (pathname) => {
    switch (pathname) {
      case '/':
        return 'fadeInUp'
      case '/signin':
      case '/signup':
        return 'scaleIn'
      case '/listings':
      case '/listing':
        return 'slideInRight'
      default:
        return 'fadeInUp'
    }
  }

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route
          path='/'
          element={
            <PageWrapper variant={getPageVariant(location.pathname)}>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path='/signin'
          element={
            <PageWrapper variant={getPageVariant(location.pathname)}>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path='/signup'
          element={
            <PageWrapper variant={getPageVariant(location.pathname)}>
              <Createacct />
            </PageWrapper>
          }
        />
        <Route
          path='/listings'
          element={
            <PageWrapper variant={getPageVariant(location.pathname)}>
              <Listings />
            </PageWrapper>
          }
        />
        <Route
          path='/listing/:id'
          element={
            <PageWrapper variant={getPageVariant(location.pathname)}>
              <PropertyDetail />
            </PageWrapper>
          }
        />
        <Route
          path='/my-bookings'
          element={
            <PageWrapper variant='fadeInUp'>
              <MyBookings />
            </PageWrapper>
          }
        />
        <Route
          path='/bookings'
          element={
            <PageWrapper variant='fadeInUp'>
              <MyBookings />
            </PageWrapper>
          }
        />
        <Route
          path='/checkout'
          element={
            <PageWrapper variant='fadeInUp'>
              <Checkout />
            </PageWrapper>
          }
        />
        <Route
          path='/booking-confirmation'
          element={
            <PageWrapper variant='fadeInUp'>
              <BookingConfirmation />
            </PageWrapper>
          }
        />
        <Route
          path='/my-bookings'
          element={
            <PageWrapper variant='fadeInUp'>
              <MyBookings />
            </PageWrapper>
          }
        />
        <Route
          path='/host'
          element={
            <PageWrapper variant='scaleIn'>
              <Host />
            </PageWrapper>
          }
        />
        <Route
          path='/hostlogin'
          element={
            <PageWrapper variant='scaleIn'>
              <Hostlogin />
            </PageWrapper>
          }
        />
        <Route
          path='/host-dashboard'
          element={
            <PageWrapper variant='slideInRight'>
              <Dashboard />
            </PageWrapper>
          }
        />
        <Route
          path='/host-signup'
          element={
            <PageWrapper variant='scaleIn'>
              <CreateAccount />
            </PageWrapper>
          }
        />
        <Route
          path='/payment'
          element={
            <PageWrapper variant='fadeInUp'>
              <PaymentPage />
            </PageWrapper>
          }
        />
        {/* Catch-all route for unknown paths */}
        <Route
          path='*'
          element={
            <PageWrapper variant='fadeInUp'>
              <div
                style={{
                  minHeight: '60vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c53030',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                }}
              >
                404 - Page Not Found
              </div>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <AnimatedRoutes />
      <Toaster
        position='top-right'
        richColors
        closeButton
        expand={true}
        duration={4000}
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
          className: 'sonner-toast',
        }}
      />
    </>
  )
}

export default App
