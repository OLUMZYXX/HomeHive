import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react'
import axiosInstance from '../config/axios'
import { TokenManager } from '../services/jwtAuthService'

// ================================
// CONTEXT STATE MANAGEMENT
// ================================

// Initial state
const initialState = {
  user: TokenManager.getCurrentUser(),
  isAuthenticated: TokenManager.isLoggedIn(),
  loading: false,
  error: null,
  properties: [],
  favorites: [],
  bookings: [],
  hostProperties: [],
}

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  SET_PROPERTIES: 'SET_PROPERTIES',
  SET_FAVORITES: 'SET_FAVORITES',
  SET_BOOKINGS: 'SET_BOOKINGS',
  SET_HOST_PROPERTIES: 'SET_HOST_PROPERTIES',
  ADD_PROPERTY: 'ADD_PROPERTY',
  UPDATE_PROPERTY: 'UPDATE_PROPERTY',
  REMOVE_PROPERTY: 'REMOVE_PROPERTY',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
}

// Reducer
const apiReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload }

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false }

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null }

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      }

    case actionTypes.CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        favorites: [],
        bookings: [],
        hostProperties: [],
      }

    case actionTypes.SET_PROPERTIES:
      return { ...state, properties: action.payload, loading: false }

    case actionTypes.SET_FAVORITES:
      return { ...state, favorites: action.payload, loading: false }

    case actionTypes.SET_BOOKINGS:
      return { ...state, bookings: action.payload, loading: false }

    case actionTypes.SET_HOST_PROPERTIES:
      return { ...state, hostProperties: action.payload, loading: false }

    case actionTypes.ADD_PROPERTY:
      return {
        ...state,
        properties: [...state.properties, action.payload],
        hostProperties:
          state.user?.role === 'host'
            ? [...state.hostProperties, action.payload]
            : state.hostProperties,
      }

    case actionTypes.UPDATE_PROPERTY:
      return {
        ...state,
        properties: state.properties.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
        hostProperties: state.hostProperties.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }

    case actionTypes.REMOVE_PROPERTY:
      return {
        ...state,
        properties: state.properties.filter((p) => p.id !== action.payload),
        hostProperties: state.hostProperties.filter(
          (p) => p.id !== action.payload
        ),
      }

    case actionTypes.ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }

    case actionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(
          (f) => f.propertyId !== action.payload
        ),
      }

    case actionTypes.ADD_BOOKING:
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      }

    case actionTypes.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      }

    default:
      return state
  }
}

// ================================
// CONTEXT CREATION
// ================================

const APIContext = createContext()

// ================================
// API CONTEXT PROVIDER
// ================================

export const APIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState)

  // ================================
  // HELPER FUNCTIONS
  // ================================

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading })
  }, [])

  const setError = useCallback((error) => {
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred'
    dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR })
  }, [])

  // ================================
  // AUTHENTICATION API CALLS
  // ================================

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.post('/auth/register', userData)
        const { user, tokens } = response.data

        // Store tokens in localStorage
        if (tokens) {
          TokenManager.setTokens(tokens.accessToken, tokens.refreshToken)
          TokenManager.setUserData(user)
        }

        dispatch({ type: actionTypes.SET_USER, payload: user })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      }
    },
    [setLoading, setError, clearError]
  )

  const registerHost = useCallback(
    async (hostData) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.post(
          '/auth/register-host',
          hostData
        )
        const { host, tokens } = response.data

        // Store tokens in localStorage
        if (tokens) {
          TokenManager.setTokens(tokens.accessToken, tokens.refreshToken)
          TokenManager.setUserData(host)
        }

        dispatch({ type: actionTypes.SET_USER, payload: host })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      }
    },
    [setLoading, setError, clearError]
  )

  const login = useCallback(
    async (email, password, isHost = false) => {
      try {
        setLoading(true)
        clearError()

        // Use different endpoint for host login
        const endpoint = isHost ? '/auth/host-login' : '/auth/login'
        const requestData = isHost
          ? { email, password }
          : { email, password, isHost }

        const response = await axiosInstance.post(endpoint, requestData)

        const { user, tokens } = response.data

        // Store tokens in localStorage
        if (tokens) {
          TokenManager.setTokens(tokens.accessToken, tokens.refreshToken)
          TokenManager.setUserData(user)
        }

        dispatch({ type: actionTypes.SET_USER, payload: user })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      }
    },
    [setLoading, setError, clearError]
  )

  const googleAuth = useCallback(
    async (idToken, userData) => {
      try {
        setLoading(true)
        clearError()

        // Use different endpoint for host Google auth
        const endpoint = userData.isHost ? '/auth/google-host' : '/auth/google'

        const response = await axiosInstance.post(endpoint, {
          idToken,
          userData,
        })

        const { user, tokens } = response.data

        // Store tokens in localStorage
        if (tokens) {
          TokenManager.setTokens(tokens.accessToken, tokens.refreshToken)
          TokenManager.setUserData(user)
        }

        dispatch({ type: actionTypes.SET_USER, payload: user })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      }
    },
    [setLoading, setError, clearError]
  )

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await axiosInstance.post('/auth/logout')

      TokenManager.clearTokens()
      dispatch({ type: actionTypes.CLEAR_USER })
      return { success: true }
    } catch (error) {
      // Even if API call fails, clear local state
      TokenManager.clearTokens()
      dispatch({ type: actionTypes.CLEAR_USER })
      setError(error)
      throw error
    }
  }, [setLoading, setError])

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      clearError()

      const response = await axiosInstance.get('/auth/me')
      const { user } = response.data

      // Update user data in localStorage
      TokenManager.setUserData(user)

      dispatch({ type: actionTypes.SET_USER, payload: user })
      return user
    } catch (error) {
      setError(error)
      throw error
    }
  }, [setLoading, setError, clearError])

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.put('/auth/change-password', {
          currentPassword,
          newPassword,
        })

        return response.data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const resetPassword = useCallback(
    async (email, isHost = false) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.post('/auth/reset-password', {
          email,
          isHost,
        })

        return response.data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const updateProfile = useCallback(
    async (profileData) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.put('/profile', profileData)

        // Update user in state
        const updatedUser = { ...state.user, ...profileData }
        dispatch({ type: actionTypes.SET_USER, payload: updatedUser })

        return response.data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [state.user, setLoading, setError, clearError]
  )

  // ================================
  // PROPERTIES API CALLS
  // ================================

  const getProperties = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.get('/properties', {
          params: filters,
        })
        const { properties } = response.data

        dispatch({ type: actionTypes.SET_PROPERTIES, payload: properties })
        return properties
      } catch (error) {
        setError(error)
        throw error
      }
    },
    [setLoading, setError, clearError]
  )

  const getProperty = useCallback(
    async (id) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.get(`/properties/${id}`)
        return response.data.property
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const createProperty = useCallback(
    async (propertyData) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.post(
          '/auth/host/properties',
          propertyData
        )
        const { data } = response.data

        dispatch({ type: actionTypes.ADD_PROPERTY, payload: data })
        return data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const updateProperty = useCallback(
    async (id, propertyData) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.put(
          `/auth/host/properties/${id}`,
          propertyData
        )
        const { data } = response.data

        dispatch({
          type: actionTypes.UPDATE_PROPERTY,
          payload: { id, ...data },
        })
        return data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const deleteProperty = useCallback(
    async (id) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.delete(
          `/auth/host/properties/${id}`
        )

        dispatch({ type: actionTypes.REMOVE_PROPERTY, payload: id })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const getHostProperties = useCallback(async () => {
    try {
      setLoading(true)
      clearError()

      console.log('🔍 Fetching host properties...')
      console.log('📍 Endpoint: /auth/host/properties')
      console.log('🔐 User token exists:', !!TokenManager.getAccessToken())

      const response = await axiosInstance.get('/auth/host/properties')
      console.log('✅ Host properties response:', response.data)

      const { data } = response.data // The server returns { success, data, count, message }

      dispatch({ type: actionTypes.SET_HOST_PROPERTIES, payload: data || [] })
      return data || []
    } catch (error) {
      console.error('❌ Error in getHostProperties:', error)
      console.error('📄 Error response:', error.response?.data)
      console.error('🔢 Error status:', error.response?.status)
      console.error('🌐 Request URL:', error.config?.url)
      console.error(
        'Error loading properties:',
        error.response?.data?.message || error.message
      )
      setError(new Error(`Endpoint not found: ${error.config?.url}`))
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, clearError])

  const getHostStats = useCallback(
    async (hostId) => {
      try {
        setLoading(true)
        clearError()

        console.log('📊 Fetching host stats for:', hostId)

        const response = await axiosInstance.get(
          `/bookings/host/${hostId}/stats`
        )
        console.log('✅ Host stats response:', response.data)

        return response.data
      } catch (error) {
        console.error('❌ Error in getHostStats:', error)
        console.error('📄 Error response:', error.response?.data)
        setError(
          error.response?.data?.message ||
            error.message ||
            'Failed to fetch host statistics'
        )
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const checkBookingAvailability = useCallback(
    async (propertyId, checkIn, checkOut) => {
      try {
        const response = await axiosInstance.post(
          '/bookings/check-availability',
          {
            propertyId,
            checkIn,
            checkOut,
          }
        )

        return response.data
      } catch (error) {
        console.error('❌ Error checking availability:', error)
        throw error
      }
    },
    []
  )

  const createBookingWithValidation = useCallback(
    async (bookingData) => {
      try {
        setLoading(true)
        clearError()

        // First check availability
        const availabilityCheck = await checkBookingAvailability(
          bookingData.propertyId,
          bookingData.checkIn,
          bookingData.checkOut
        )

        if (!availabilityCheck.available) {
          throw new Error(
            availabilityCheck.message ||
              'Property is not available for the selected dates'
          )
        }

        // Create the booking
        const response = await axiosInstance.post('/bookings', bookingData)
        console.log('✅ Booking created:', response.data)

        const newBooking = {
          id: response.data.bookingId,
          ...bookingData,
          status: 'pending',
          createdAt: new Date(),
        }

        dispatch({ type: actionTypes.ADD_BOOKING, payload: newBooking })
        return response.data
      } catch (error) {
        console.error('❌ Error creating booking:', error)
        setError(
          error.response?.data?.message ||
            error.message ||
            'Failed to create booking'
        )
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError, checkBookingAvailability]
  )

  const searchProperties = useCallback(
    async (searchCriteria) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.post(
          '/properties/search',
          searchCriteria
        )
        const { properties } = response.data

        dispatch({ type: actionTypes.SET_PROPERTIES, payload: properties })
        return properties
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const getFeaturedProperties = useCallback(
    async (limit = 10) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.get(
          `/properties/featured?limit=${limit}`
        )
        const { properties } = response.data

        dispatch({ type: actionTypes.SET_PROPERTIES, payload: properties })
        return properties
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  // Premium plan methods
  const getPremiumImages = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/premium/featured-images')
      return response.data
    } catch (error) {
      console.error('Error fetching premium images:', error)
      return { images: [] } // Return empty array on error
    }
  }, [])

  const getWeeklyHeaderImages = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/featured/header-images')
      return response.data
    } catch (error) {
      console.error('Error fetching weekly header images:', error)
      return {
        success: false,
        images: [],
        useLocal: true,
        message: 'Using fallback images',
      }
    }
  }, [])

  const getRandomFeaturedImages = useCallback(async (limit = 6) => {
    try {
      const response = await axiosInstance.get(
        `/featured/featured-random?limit=${limit}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching random featured images:', error)
      return {
        success: false,
        images: [],
        useLocal: true,
      }
    }
  }, [])

  const getPremiumShowcase = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/featured/premium-showcase')
      return response.data
    } catch (error) {
      console.error('Error fetching premium showcase:', error)
      return {
        success: false,
        showcase: [],
        useLocal: true,
      }
    }
  }, [])

  const getHeroImages = useCallback(async (limit = 6) => {
    try {
      const response = await axiosInstance.get(
        `/featured/hero-images?limit=${limit}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching hero images:', error)
      return {
        success: false,
        images: [],
        useLocal: true,
        excludedHeaderDuplicates: false,
      }
    }
  }, [])

  const upgradeToPremium = useCallback(
    async (planData) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.post('/premium/upgrade', planData)
        return response.data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const getPremiumStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/premium/status')
      return response.data
    } catch (error) {
      console.error('Error fetching premium status:', error)
      return { isPremium: false }
    }
  }, [])

  // ================================
  // FAVORITES API CALLS
  // ================================

  const getFavorites = useCallback(async () => {
    try {
      setLoading(true)
      clearError()

      const response = await axiosInstance.get('/favorites')
      const { favorites } = response.data

      dispatch({ type: actionTypes.SET_FAVORITES, payload: favorites })
      return favorites
    } catch (error) {
      setError(error)
      throw error
    }
  }, [setLoading, setError, clearError])

  const addToFavorites = useCallback(
    async (propertyId) => {
      try {
        const response = await axiosInstance.post(`/favorites/${propertyId}`)

        const favoriteData = {
          propertyId,
          userId: state.user?.userId,
          savedAt: new Date(),
        }

        dispatch({ type: actionTypes.ADD_FAVORITE, payload: favoriteData })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      }
    },
    [state.user, setError]
  )

  const removeFromFavorites = useCallback(
    async (propertyId) => {
      try {
        const response = await axiosInstance.delete(`/favorites/${propertyId}`)

        dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: propertyId })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      }
    },
    [setError]
  )

  const isFavorite = useCallback(
    (propertyId) => {
      return state.favorites.some((fav) => fav.propertyId === propertyId)
    },
    [state.favorites]
  )

  // ================================
  // BOOKINGS API CALLS
  // ================================

  const getBookings = useCallback(async () => {
    try {
      setLoading(true)
      clearError()

      const response = await axiosInstance.get('/bookings')
      const { bookings } = response.data

      dispatch({ type: actionTypes.SET_BOOKINGS, payload: bookings })
      return bookings
    } catch (error) {
      setError(error)
      throw error
    }
  }, [setLoading, setError, clearError])

  const createBooking = useCallback(
    async (bookingData) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.post('/bookings', bookingData)
        const newBooking = { ...bookingData, id: response.data.bookingId }

        dispatch({ type: actionTypes.ADD_BOOKING, payload: newBooking })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  const updateBookingStatus = useCallback(
    async (bookingId, status) => {
      try {
        setLoading(true)
        clearError()

        const response = await axiosInstance.put(
          `/bookings/${bookingId}/status`,
          { status }
        )

        dispatch({
          type: actionTypes.UPDATE_BOOKING,
          payload: { id: bookingId, status },
        })
        return response.data
      } catch (error) {
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, clearError]
  )

  // ================================
  // CONTEXT VALUE
  // ================================

  const contextValue = {
    // State
    ...state,

    // Helper functions
    clearError,

    // Authentication
    register,
    registerHost,
    login,
    googleAuth,
    logout,
    getCurrentUser,
    changePassword,
    resetPassword,
    updateProfile,

    // Properties
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getHostProperties,
    getHostStats,
    searchProperties,
    getFeaturedProperties,
    getPremiumImages,
    getWeeklyHeaderImages,
    getRandomFeaturedImages,
    getPremiumShowcase,
    getHeroImages,
    upgradeToPremium,
    getPremiumStatus,

    // Favorites
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // Bookings
    getBookings,
    createBooking,
    createBookingWithValidation,
    checkBookingAvailability,
    updateBookingStatus,
  }

  return (
    <APIContext.Provider value={contextValue}>{children}</APIContext.Provider>
  )
}

// ================================
// CUSTOM HOOK TO USE CONTEXT
// ================================

export const useAPI = () => {
  const context = useContext(APIContext)

  if (!context) {
    throw new Error('useAPI must be used within an APIProvider')
  }

  return context
}

export default APIContext
