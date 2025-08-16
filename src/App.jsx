/* eslint-disable no-unused-vars */
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'

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
// ...existing code...

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route
          path='/'
          element={
            <MotionWrapper>
              <Home />
            </MotionWrapper>
          }
        />
        <Route
          path='/signin'
          element={
            <MotionWrapper>
              <Login />
            </MotionWrapper>
          }
        />
        <Route
          path='/signup'
          element={
            <MotionWrapper>
              <Createacct />
            </MotionWrapper>
          }
        />
        <Route
          path='/homepage'
          element={
            <MotionWrapper>
              <Homepage />
            </MotionWrapper>
          }
        />
        <Route
          path='/listingDetails/:id'
          element={
            <MotionWrapper>
              <ListingDetails />
            </MotionWrapper>
          }
        />
        <Route
          path='/cart'
          element={
            <MotionWrapper>
              <Cart />
            </MotionWrapper>
          }
        />
        <Route
          path='/host'
          element={
            <MotionWrapper>
              <Host />
            </MotionWrapper>
          }
        />
        <Route
          path='/hostlogin'
          element={
            <MotionWrapper>
              <Hostlogin />
            </MotionWrapper>
          }
        />
        <Route
          path='/host-dashboard'
          element={
            <MotionWrapper>
              <Dashboard />
            </MotionWrapper>
          }
        />
        <Route
          path='/host-signup'
          element={
            <MotionWrapper>
              <CreateAccount />
            </MotionWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

const MotionWrapper = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      {children}
    </motion.div>
  )
}
MotionWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

function App() {
  return <AnimatedRoutes />
}

export default App
