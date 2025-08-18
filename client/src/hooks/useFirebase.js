import { useState, useEffect, useCallback } from 'react'
import {
  userService,
  hostService,
  propertyService,
  bookingService,
} from '../services/homeHiveService'

// Hook for user profile management
export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userId) {
      loadUserProfile()
    }
  }, [userId])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const userProfile = await userService.getUserProfile(userId)
      setProfile(userProfile)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updateData) => {
    try {
      setLoading(true)
      await userService.updateUserProfile(userId, updateData)
      await loadUserProfile() // Reload profile
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, updateProfile, refetch: loadUserProfile }
}

// Hook for host profile management
export const useHostProfile = (hostId) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (hostId) {
      loadHostProfile()
    }
  }, [hostId])

  const loadHostProfile = async () => {
    try {
      setLoading(true)
      const hostProfile = await hostService.getHostProfile(hostId)
      setProfile(hostProfile)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updateData) => {
    try {
      setLoading(true)
      await hostService.updateHostProfile(hostId, updateData)
      await loadHostProfile() // Reload profile
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, updateProfile, refetch: loadHostProfile }
}

// Hook for property management
export const useProperties = (filters = {}) => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProperties()
  }, [JSON.stringify(filters)])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const propertyList = await propertyService.getAllProperties(filters)
      setProperties(propertyList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, refetch: loadProperties }
}

// Hook for single property
export const useProperty = (propertyId) => {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (propertyId) {
      loadProperty()
    }
  }, [propertyId])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const propertyData = await propertyService.getProperty(propertyId)
      setProperty(propertyData)

      // Increment views
      if (propertyData) {
        await propertyService.incrementViews(propertyId)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { property, loading, error, refetch: loadProperty }
}

// Hook for host properties
export const useHostProperties = (hostId) => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (hostId) {
      loadHostProperties()
    }
  }, [hostId])

  const loadHostProperties = async () => {
    try {
      setLoading(true)
      const propertyList = await propertyService.getHostProperties(hostId)
      setProperties(propertyList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addProperty = async (propertyData) => {
    try {
      setLoading(true)
      await propertyService.createProperty(hostId, propertyData)
      await loadHostProperties() // Reload properties
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProperty = async (propertyId, updateData) => {
    try {
      setLoading(true)
      await propertyService.updateProperty(propertyId, updateData)
      await loadHostProperties() // Reload properties
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (propertyId) => {
    try {
      setLoading(true)
      await propertyService.deleteProperty(propertyId)
      await loadHostProperties() // Reload properties
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch: loadHostProperties,
  }
}

// Hook for user favorites
export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userId) {
      loadFavorites()
    }
  }, [userId])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const favoritesList = await userService.getUserFavorites(userId)
      setFavorites(favoritesList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (propertyId) => {
    try {
      await userService.saveFavorite(userId, propertyId)
      await loadFavorites()
    } catch (err) {
      setError(err.message)
    }
  }

  const removeFromFavorites = async (propertyId) => {
    try {
      await userService.removeFavorite(userId, propertyId)
      await loadFavorites()
    } catch (err) {
      setError(err.message)
    }
  }

  const isFavorite = (propertyId) => {
    return favorites.some((fav) => fav.propertyId === propertyId)
  }

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: loadFavorites,
  }
}

// Hook for bookings
export const useBookings = (userId, isHost = false) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userId) {
      loadBookings()
    }
  }, [userId, isHost])

  const loadBookings = async () => {
    try {
      setLoading(true)
      let bookingsList
      if (isHost) {
        bookingsList = await bookingService.getHostBookings(userId)
      } else {
        bookingsList = await bookingService.getUserBookings(userId)
      }
      setBookings(bookingsList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData) => {
    try {
      setLoading(true)
      await bookingService.createBooking(bookingData)
      await loadBookings()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setLoading(true)
      await bookingService.updateBookingStatus(bookingId, status)
      await loadBookings()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    refetch: loadBookings,
  }
}
