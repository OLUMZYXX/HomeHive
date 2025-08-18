// File moved to authService/authService.js
import { userDB, hostDB } from '../databaseService/databaseService.js'

// User Profile Service
export class UserService {
  // Create user profile
  async createUserProfile(userId, profileData) {
    try {
      const userData = {
        userId,
        ...profileData,
        role: 'user',
        isActive: true,
        preferences: {
          notifications: true,
          marketing: false,
        },
      }
      return await userDB.create('users', userData)
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const users = await userDB.query('users', [
        { field: 'userId', operator: '==', value: userId },
      ])
      return users.length > 0 ? users[0] : null
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    try {
      const user = await this.getUserProfile(userId)
      if (user) {
        return await userDB.update('users', user.id, updateData)
      }
      throw new Error('User not found')
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Save user favorites
  async saveFavorite(userId, propertyId) {
    try {
      const favoriteData = {
        userId,
        propertyId,
        savedAt: new Date(),
      }
      return await userDB.create('favorites', favoriteData)
    } catch (error) {
      console.error('Error saving favorite:', error)
      throw error
    }
  }

  // Get user favorites
  async getUserFavorites(userId) {
    try {
      return await userDB.query('favorites', [
        { field: 'userId', operator: '==', value: userId },
      ])
    } catch (error) {
      console.error('Error getting favorites:', error)
      throw error
    }
  }

  // Remove favorite
  async removeFavorite(userId, propertyId) {
    try {
      const favorites = await userDB.query('favorites', [
        { field: 'userId', operator: '==', value: userId },
        { field: 'propertyId', operator: '==', value: propertyId },
      ])

      if (favorites.length > 0) {
        return await userDB.delete('favorites', favorites[0].id)
      }
      return false
    } catch (error) {
      console.error('Error removing favorite:', error)
      throw error
    }
  }
}

// Host Profile Service
export class HostService {
  // Create host profile
  async createHostProfile(hostId, profileData) {
    try {
      const hostData = {
        hostId,
        ...profileData,
        role: 'host',
        isVerified: false,
        isActive: true,
        rating: 0,
        totalReviews: 0,
        properties: [],
      }
      return await hostDB.create('hosts', hostData)
    } catch (error) {
      console.error('Error creating host profile:', error)
      throw error
    }
  }

  // Get host profile
  async getHostProfile(hostId) {
    try {
      const hosts = await hostDB.query('hosts', [
        { field: 'hostId', operator: '==', value: hostId },
      ])
      return hosts.length > 0 ? hosts[0] : null
    } catch (error) {
      console.error('Error getting host profile:', error)
      throw error
    }
  }

  // Update host profile
  async updateHostProfile(hostId, updateData) {
    try {
      const host = await this.getHostProfile(hostId)
      if (host) {
        return await hostDB.update('hosts', host.id, updateData)
      }
      throw new Error('Host not found')
    } catch (error) {
      console.error('Error updating host profile:', error)
      throw error
    }
  }
}

// Property Service
export class PropertyService {
  // Create property listing
  async createProperty(hostId, propertyData) {
    try {
      const property = {
        hostId,
        ...propertyData,
        isActive: true,
        isAvailable: true,
        views: 0,
        bookings: 0,
        rating: 0,
        reviews: [],
      }
      return await hostDB.create('properties', property)
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  }

  // Get all properties
  async getAllProperties(filters = {}) {
    try {
      const queryFilters = []

      // Add active filter by default
      queryFilters.push({ field: 'isActive', operator: '==', value: true })

      // Add custom filters
      if (filters.city) {
        queryFilters.push({
          field: 'city',
          operator: '==',
          value: filters.city,
        })
      }
      if (filters.minPrice) {
        queryFilters.push({
          field: 'price',
          operator: '>=',
          value: filters.minPrice,
        })
      }
      if (filters.maxPrice) {
        queryFilters.push({
          field: 'price',
          operator: '<=',
          value: filters.maxPrice,
        })
      }
      if (filters.propertyType) {
        queryFilters.push({
          field: 'type',
          operator: '==',
          value: filters.propertyType,
        })
      }

      return await hostDB.query('properties', queryFilters)
    } catch (error) {
      console.error('Error getting properties:', error)
      throw error
    }
  }

  // Get property by ID
  async getProperty(propertyId) {
    try {
      return await hostDB.read('properties', propertyId)
    } catch (error) {
      console.error('Error getting property:', error)
      throw error
    }
  }

  // Get host properties
  async getHostProperties(hostId) {
    try {
      return await hostDB.query('properties', [
        { field: 'hostId', operator: '==', value: hostId },
      ])
    } catch (error) {
      console.error('Error getting host properties:', error)
      throw error
    }
  }

  // Update property
  async updateProperty(propertyId, updateData) {
    try {
      return await hostDB.update('properties', propertyId, updateData)
    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  }

  // Delete property
  async deleteProperty(propertyId) {
    try {
      return await hostDB.delete('properties', propertyId)
    } catch (error) {
      console.error('Error deleting property:', error)
      throw error
    }
  }

  // Increment property views
  async incrementViews(propertyId) {
    try {
      const property = await this.getProperty(propertyId)
      if (property) {
        return await this.updateProperty(propertyId, {
          views: (property.views || 0) + 1,
        })
      }
    } catch (error) {
      console.error('Error incrementing views:', error)
      throw error
    }
  }
}

// Booking Service
export class BookingService {
  // Create booking
  async createBooking(bookingData) {
    try {
      const booking = {
        ...bookingData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return await userDB.create('bookings', booking)
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  // Get user bookings
  async getUserBookings(userId) {
    try {
      return await userDB.query(
        'bookings',
        [{ field: 'userId', operator: '==', value: userId }],
        { field: 'createdAt', direction: 'desc' }
      )
    } catch (error) {
      console.error('Error getting user bookings:', error)
      throw error
    }
  }

  // Get host bookings
  async getHostBookings(hostId) {
    try {
      return await hostDB.query(
        'bookings',
        [{ field: 'hostId', operator: '==', value: hostId }],
        { field: 'createdAt', direction: 'desc' }
      )
    } catch (error) {
      console.error('Error getting host bookings:', error)
      throw error
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      return await userDB.update('bookings', bookingId, { status })
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }
}

// Export service instances
export const userService = new UserService()
export const hostService = new HostService()
export const propertyService = new PropertyService()
export const bookingService = new BookingService()

// Main AuthService class that combines all authentication-related functionality
export class AuthService {
  // User registration
  static async registerUser(userData) {
    try {
      // This would integrate with Firebase Auth or your authentication system
      // For now, we'll just create a user profile
      const userId = await userService.createUserProfile(
        userData.email,
        userData
      )
      return {
        success: true,
        userId,
        message: 'User registered successfully',
      }
    } catch (error) {
      throw error
    }
  }

  // Host registration
  static async registerHost(hostData) {
    try {
      const hostId = await hostService.createHostProfile(
        hostData.email,
        hostData
      )
      return {
        success: true,
        hostId,
        message: 'Host registered successfully',
      }
    } catch (error) {
      throw error
    }
  }

  // Login
  static async login(email, password, isHost = false) {
    try {
      // This would typically verify credentials with Firebase Auth
      // For now, we'll return a mock response
      return {
        success: true,
        message: 'Login successful',
        user: { email, role: isHost ? 'host' : 'user' },
      }
    } catch (error) {
      throw error
    }
  }

  // Logout
  static async logout(isHost = false) {
    try {
      return {
        success: true,
        message: 'Logout successful',
      }
    } catch (error) {
      throw error
    }
  }

  // Change password
  static async changePassword(currentPassword, newPassword, isHost = false) {
    try {
      return {
        success: true,
        message: 'Password changed successfully',
      }
    } catch (error) {
      throw error
    }
  }

  // Reset password
  static async resetPassword(email, isHost = false) {
    try {
      return {
        success: true,
        message: 'Password reset email sent',
      }
    } catch (error) {
      throw error
    }
  }

  // Get user profile
  static async getUserProfile(userId, isHost = false) {
    try {
      if (isHost) {
        return await hostService.getHostProfile(userId)
      } else {
        return await userService.getUserProfile(userId)
      }
    } catch (error) {
      throw error
    }
  }

  // Update profile
  static async updateProfile(userId, updateData, isHost = false) {
    try {
      if (isHost) {
        await hostService.updateHostProfile(userId, updateData)
      } else {
        await userService.updateUserProfile(userId, updateData)
      }
      return {
        success: true,
        message: 'Profile updated successfully',
      }
    } catch (error) {
      throw error
    }
  }
}

// Export as default
export default AuthService
