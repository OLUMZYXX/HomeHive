// Client-side API Service - Only HTTP calls to backend
// All business logic and database operations happen on the server

import axiosInstance from '../config/axios'

class APIClient {
  // Authentication endpoints
  auth = {
    login: async (credentials) => {
      const response = await axiosInstance.post('/auth/login', credentials)
      return response.data
    },

    register: async (userData) => {
      const response = await axiosInstance.post('/auth/register', userData)
      return response.data
    },

    logout: async () => {
      const response = await axiosInstance.post('/auth/logout')
      return response.data
    },

    refreshToken: async (refreshToken) => {
      const response = await axiosInstance.post('/auth/refresh', {
        refreshToken,
      })
      return response.data
    },

    getProfile: async () => {
      const response = await axiosInstance.get('/auth/profile')
      return response.data
    },

    updateProfile: async (profileData) => {
      const response = await axiosInstance.put('/auth/profile', profileData)
      return response.data
    },

    changePassword: async (passwordData) => {
      const response = await axiosInstance.put(
        '/auth/change-password',
        passwordData
      )
      return response.data
    },

    deleteAccount: async () => {
      const response = await axiosInstance.delete('/auth/account')
      return response.data
    },
  }

  // User management
  users = {
    getUsers: async (filters = {}) => {
      const response = await axiosInstance.get('/users', { params: filters })
      return response.data
    },

    getUserById: async (userId) => {
      const response = await axiosInstance.get(`/users/${userId}`)
      return response.data
    },

    updateUser: async (userId, userData) => {
      const response = await axiosInstance.put(`/users/${userId}`, userData)
      return response.data
    },

    deactivateUser: async (userId) => {
      const response = await axiosInstance.put(`/users/${userId}/deactivate`)
      return response.data
    },
  }

  // Property management
  properties = {
    getProperties: async (filters = {}) => {
      const response = await axiosInstance.get('/properties', {
        params: filters,
      })
      return response.data
    },

    getPropertyById: async (propertyId) => {
      const response = await axiosInstance.get(`/properties/${propertyId}`)
      return response.data
    },

    createProperty: async (propertyData) => {
      const response = await axiosInstance.post('/properties', propertyData)
      return response.data
    },

    updateProperty: async (propertyId, propertyData) => {
      const response = await axiosInstance.put(
        `/properties/${propertyId}`,
        propertyData
      )
      return response.data
    },

    deleteProperty: async (propertyId) => {
      const response = await axiosInstance.delete(`/properties/${propertyId}`)
      return response.data
    },

    searchProperties: async (searchCriteria) => {
      const response = await axiosInstance.post(
        '/properties/search',
        searchCriteria
      )
      return response.data
    },

    getFeaturedProperties: async (limit = 10) => {
      const response = await axiosInstance.get(
        `/properties/featured?limit=${limit}`
      )
      return response.data
    },

    // Fetch featured properties from the correct backend endpoint
    getFeaturedRandom: async (limit = 6, excludeHeader = true) => {
      const response = await axiosInstance.get(
        `/featured/featured-random?limit=${limit}&excludeHeader=${excludeHeader}`
      )
      return response.data
    },
  }

  // Booking management
  bookings = {
    getBookings: async (filters = {}) => {
      const response = await axiosInstance.get('/bookings', { params: filters })
      return response.data
    },

    getBookingById: async (bookingId) => {
      const response = await axiosInstance.get(`/bookings/${bookingId}`)
      return response.data
    },

    createBooking: async (bookingData) => {
      const response = await axiosInstance.post('/bookings', bookingData)
      return response.data
    },

    updateBooking: async (bookingId, bookingData) => {
      const response = await axiosInstance.put(
        `/bookings/${bookingId}`,
        bookingData
      )
      return response.data
    },

    cancelBooking: async (bookingId) => {
      const response = await axiosInstance.put(`/bookings/${bookingId}/cancel`)
      return response.data
    },

    confirmBooking: async (bookingId) => {
      const response = await axiosInstance.put(`/bookings/${bookingId}/confirm`)
      return response.data
    },
  }

  // Favorites management
  favorites = {
    getFavorites: async () => {
      const response = await axiosInstance.get('/favorites')
      return response.data
    },

    addToFavorites: async (propertyId) => {
      const response = await axiosInstance.post('/favorites', { propertyId })
      return response.data
    },

    removeFromFavorites: async (propertyId) => {
      const response = await axiosInstance.delete(`/favorites/${propertyId}`)
      return response.data
    },
  }

  // Reviews management
  reviews = {
    getReviews: async (propertyId) => {
      const response = await axiosInstance.get(`/reviews/${propertyId}`)
      return response.data
    },

    createReview: async (reviewData) => {
      const response = await axiosInstance.post('/reviews', reviewData)
      return response.data
    },

    updateReview: async (reviewId, reviewData) => {
      const response = await axiosInstance.put(
        `/reviews/${reviewId}`,
        reviewData
      )
      return response.data
    },

    deleteReview: async (reviewId) => {
      const response = await axiosInstance.delete(`/reviews/${reviewId}`)
      return response.data
    },
  }

  // File upload
  files = {
    uploadImage: async (file, type = 'property') => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await axiosInstance.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },

    uploadMultipleImages: async (files, type = 'property') => {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))
      formData.append('type', type)

      const response = await axiosInstance.post(
        '/files/upload-multiple',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },

    deleteFile: async (fileUrl) => {
      const response = await axiosInstance.delete('/files/delete', {
        data: { fileUrl },
      })
      return response.data
    },
  }

  // Analytics (for hosts)
  analytics = {
    getHostAnalytics: async (timeframe = '30days') => {
      const response = await axiosInstance.get(
        `/analytics/host?timeframe=${timeframe}`
      )
      return response.data
    },

    getPropertyAnalytics: async (propertyId, timeframe = '30days') => {
      const response = await axiosInstance.get(
        `/analytics/property/${propertyId}?timeframe=${timeframe}`
      )
      return response.data
    },
  }

  // Premium plan management
  premium = {
    getFeaturedImages: async () => {
      const response = await axiosInstance.get('/premium/featured-images')
      return response.data
    },

    upgradeToPremium: async (planData) => {
      const response = await axiosInstance.post('/premium/upgrade', planData)
      return response.data
    },

    getPremiumStatus: async () => {
      const response = await axiosInstance.get('/premium/status')
      return response.data
    },

    cancelPremium: async () => {
      const response = await axiosInstance.post('/premium/cancel')
      return response.data
    },

    getPremiumPlans: async () => {
      const response = await axiosInstance.get('/premium/plans')
      return response.data
    },

    updateFeaturedImage: async (imageData) => {
      const response = await axiosInstance.post(
        '/premium/featured-image',
        imageData
      )
      return response.data
    },
  }

  // Testimonials management
  testimonials = {
    getTestimonials: async (limit = 20) => {
      const response = await axiosInstance.get(`/testimonials?limit=${limit}`)
      return response.data
    },

    createTestimonial: async (testimonialData) => {
      const response = await axiosInstance.post(
        '/testimonials',
        testimonialData
      )
      return response.data
    },

    getTestimonialStats: async () => {
      const response = await axiosInstance.get('/testimonials/stats')
      return response.data
    },
  }
}

// Create singleton instance
const apiClient = new APIClient()

// Export specific services for easy importing
export const authAPI = apiClient.auth
export const usersAPI = apiClient.users
export const propertiesAPI = apiClient.properties
export const bookingsAPI = apiClient.bookings
export const favoritesAPI = apiClient.favorites
export const reviewsAPI = apiClient.reviews
export const filesAPI = apiClient.files
export const analyticsAPI = apiClient.analytics
export const premiumAPI = apiClient.premium
export const testimonialsAPI = apiClient.testimonials

export default apiClient
