// File moved to homeHiveService/homeHiveService.js
import { userFirestore as db } from '../config/firebaseConfig.js' // No change needed
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
} from 'firebase/firestore'

// Property Service
export const propertyService = {
  async getAllProperties(filters = {}) {
    try {
      const propertiesRef = collection(db, 'properties')
      let q = query(propertiesRef, where('isActive', '==', true))

      // Apply filters
      if (filters.city) {
        q = query(q, where('address.city', '==', filters.city))
      }
      if (filters.propertyType) {
        q = query(q, where('type', '==', filters.propertyType))
      }
      if (filters.bedrooms) {
        q = query(q, where('bedrooms', '==', filters.bedrooms))
      }
      if (filters.bathrooms) {
        q = query(q, where('bathrooms', '==', filters.bathrooms))
      }

      const snapshot = await getDocs(q)
      let properties = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Apply price filters (done after fetching due to Firestore limitations)
      if (filters.minPrice) {
        properties = properties.filter((p) => p.price >= filters.minPrice)
      }
      if (filters.maxPrice) {
        properties = properties.filter((p) => p.price <= filters.maxPrice)
      }

      return properties
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw new Error('Failed to fetch properties')
    }
  },

  async getProperty(propertyId) {
    try {
      const docRef = doc(db, 'properties', propertyId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching property:', error)
      throw new Error('Failed to fetch property')
    }
  },

  async createProperty(hostId, propertyData) {
    try {
      const property = {
        ...propertyData,
        hostId,
        isActive: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const docRef = await addDoc(collection(db, 'properties'), property)
      return docRef.id
    } catch (error) {
      console.error('Error creating property:', error)
      throw new Error('Failed to create property')
    }
  },

  async updateProperty(propertyId, updateData) {
    try {
      const docRef = doc(db, 'properties', propertyId)
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error updating property:', error)
      throw new Error('Failed to update property')
    }
  },

  async deleteProperty(propertyId) {
    try {
      const docRef = doc(db, 'properties', propertyId)
      await updateDoc(docRef, { isActive: false })
    } catch (error) {
      console.error('Error deleting property:', error)
      throw new Error('Failed to delete property')
    }
  },

  async getHostProperties(hostId) {
    try {
      const q = query(
        collection(db, 'properties'),
        where('hostId', '==', hostId),
        where('isActive', '==', true)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error('Error fetching host properties:', error)
      throw new Error('Failed to fetch host properties')
    }
  },

  async incrementViews(propertyId) {
    try {
      const docRef = doc(db, 'properties', propertyId)
      await updateDoc(docRef, {
        views: increment(1),
      })
    } catch (error) {
      console.error('Error incrementing views:', error)
      // Don't throw error as this is not critical
    }
  },
}

// User Service
export const userService = {
  async getUserFavorites(userId) {
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(q)
      const favoriteIds = snapshot.docs.map((doc) => doc.data().propertyId)

      // Get property details for each favorite
      const favorites = []
      for (const propertyId of favoriteIds) {
        const property = await propertyService.getProperty(propertyId)
        if (property) {
          favorites.push(property)
        }
      }

      return favorites
    } catch (error) {
      console.error('Error fetching user favorites:', error)
      throw new Error('Failed to fetch favorites')
    }
  },

  async saveFavorite(userId, propertyId) {
    try {
      // Check if already favorited
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('propertyId', '==', propertyId)
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        throw new Error('Property already in favorites')
      }

      await addDoc(collection(db, 'favorites'), {
        userId,
        propertyId,
        createdAt: new Date(),
      })
    } catch (error) {
      console.error('Error saving favorite:', error)
      throw new Error('Failed to save favorite')
    }
  },

  async removeFavorite(userId, propertyId) {
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('propertyId', '==', propertyId)
      )
      const snapshot = await getDocs(q)

      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, 'favorites', docSnap.id))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      throw new Error('Failed to remove favorite')
    }
  },
}

// Host Service
export const hostService = {
  async getHostStats(hostId) {
    try {
      // Get host properties
      const properties = await propertyService.getHostProperties(hostId)

      // Get bookings for host properties
      const propertyIds = properties.map((p) => p.id)
      const bookings = await bookingService.getHostBookings(hostId)

      const stats = {
        totalProperties: properties.length,
        totalBookings: bookings.length,
        totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
        activeBookings: bookings.filter((b) => b.status === 'confirmed').length,
        revenue: bookings
          .filter((b) => b.status === 'completed')
          .reduce((sum, b) => sum + b.totalAmount, 0),
      }

      return stats
    } catch (error) {
      console.error('Error fetching host stats:', error)
      throw new Error('Failed to fetch host statistics')
    }
  },
}

// Booking Service
export const bookingService = {
  async createBooking(bookingData) {
    try {
      const booking = {
        ...bookingData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const docRef = await addDoc(collection(db, 'bookings'), booking)
      return docRef.id
    } catch (error) {
      console.error('Error creating booking:', error)
      throw new Error('Failed to create booking')
    }
  },

  async getUserBookings(userId) {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw new Error('Failed to fetch user bookings')
    }
  },

  async getHostBookings(hostId) {
    try {
      // First get all properties of the host
      const hostProperties = await propertyService.getHostProperties(hostId)
      const propertyIds = hostProperties.map((p) => p.id)

      if (propertyIds.length === 0) {
        return []
      }

      // Get bookings for host properties
      const bookings = []
      for (const propertyId of propertyIds) {
        const q = query(
          collection(db, 'bookings'),
          where('propertyId', '==', propertyId),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        const propertyBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        bookings.push(...propertyBookings)
      }

      // Sort by creation date
      bookings.sort((a, b) => b.createdAt - a.createdAt)
      return bookings
    } catch (error) {
      console.error('Error fetching host bookings:', error)
      throw new Error('Failed to fetch host bookings')
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const docRef = doc(db, 'bookings', bookingId)
      await updateDoc(docRef, {
        status,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw new Error('Failed to update booking status')
    }
  },

  async getBooking(bookingId) {
    try {
      const docRef = doc(db, 'bookings', bookingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw new Error('Failed to fetch booking')
    }
  },
}
