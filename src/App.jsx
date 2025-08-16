/* eslint-disable no-unused-vars */
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageWrapper } from './components/common/AnimatedComponents'

import Home from './Home'
import Login from './components/Loginpage/login'
import Createacct from './components/Create Account/Createacct'
import CreateAccount from './components/HostCreate-Acct/CreateAccount'
import Homepage from './components/home-page/Homepage'
import ListingDetails from './components/HomepageDetails/ListingDetails'
import Cart from './components/Cart/Cart'
import Host from './components/Become a Host/Host'
import Hostlogin from './components/Host-Login/Hostlogin'
import Dashboard from './components/Host-dashboard/Dashboard'
import ScrollToTop from './components/ScrollToTop'
import AppToastContainer from './components/common/ToastContainer'

const AnimatedRoutes = () => {
  const location = useLocation()

  const getPageVariant = (pathname) => {
    switch (pathname) {
      case '/':
        return 'fadeInUp'
      case '/signin':
      case '/signup':
        return 'scaleIn'
      case '/homepage':
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
          path='/homepage'
          element={
            <PageWrapper variant={getPageVariant(location.pathname)}>
              <Homepage />
            </PageWrapper>
          }
        />
        <Route
          path='/listing/:id'
          element={
            <PageWrapper variant={getPageVariant(location.pathname)}>
              <ListingDetails />
            </PageWrapper>
          }
        />
        <Route
          path='/cart'
          element={
            <PageWrapper variant='fadeInUp'>
              <Cart />
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
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <AnimatedRoutes />
      <AppToastContainer />
    </>
  )
}

export default App
