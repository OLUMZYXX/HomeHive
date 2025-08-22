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

  async updatePropertyBookingStats(propertyId) {
    try {
      // This would update booking count and other stats for the property
      // Implementation depends on your property schema
      const docRef = doc(db, 'properties', propertyId)
      await updateDoc(docRef, {
        lastBookingAt: new Date(),
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error updating property booking stats:', error)
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

  // Weekly Featured Images for Header
  async getWeeklyFeaturedImages() {
    try {
      // Check if we have a cached weekly selection
      const weeklyRef = doc(db, 'featured', 'weekly-header')
      const weeklySnap = await getDoc(weeklyRef)

      // Calculate current week number
      const now = new Date()
      const currentWeek = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000))

      if (weeklySnap.exists()) {
        const data = weeklySnap.data()
        if (data.week === currentWeek && data.images) {
          return {
            images: data.images,
            lastUpdated: data.lastUpdated?.toDate(),
            week: currentWeek,
            cached: true,
          }
        }
      }

      // Fetch fresh high-quality images from premium hosts
      const bestImages = await this.selectBestWeeklyImages()

      // Cache the selection for the week
      await updateDoc(weeklyRef, {
        images: bestImages,
        week: currentWeek,
        lastUpdated: new Date(),
        selectedAt: new Date(),
      }).catch(async () => {
        // Create document if it doesn't exist
        await addDoc(collection(db, 'featured'), {
          images: bestImages,
          week: currentWeek,
          lastUpdated: new Date(),
          selectedAt: new Date(),
          type: 'weekly-header',
        })
      })

      return {
        images: bestImages,
        lastUpdated: new Date(),
        week: currentWeek,
        cached: false,
      }
    } catch (error) {
      console.error('Error fetching weekly featured images:', error)
      throw new Error('Failed to fetch weekly featured images')
    }
  },

  async selectBestWeeklyImages() {
    try {
      // Get luxury premium properties with minimum price of 200K
      const luxuryQuery = query(
        collection(db, 'properties'),
        where('isActive', '==', true),
        where('price', '>=', 200000), // Minimum 200K/night
        where('category', 'in', ['Luxury', 'Premium', 'Executive']),
        where('imageQuality', '>=', 8),
        orderBy('price', 'desc'), // Show most expensive first
        orderBy('imageQuality', 'desc'),
        limit(15) // Get more options for variety
      )

      const snapshot = await getDocs(luxuryQuery)
      let properties = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // If no luxury properties found, get high-end properties above 200K
      if (properties.length === 0) {
        const fallbackQuery = query(
          collection(db, 'properties'),
          where('isActive', '==', true),
          where('price', '>=', 200000),
          where('images', '!=', []),
          orderBy('price', 'desc'),
          orderBy('views', 'desc'),
          limit(10)
        )

        const fallbackSnapshot = await getDocs(fallbackQuery)
        properties = fallbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      }

      // Get currently displayed hero images to avoid duplicates
      const heroImagesQuery = query(
        collection(db, 'featured'),
        where('type', '==', 'hero-rotation')
      )
      const heroSnapshot = await getDocs(heroImagesQuery)
      const usedImageUrls = new Set()

      heroSnapshot.docs.forEach((doc) => {
        const data = doc.data()
        if (data.images) {
          data.images.forEach((img) => usedImageUrls.add(img.url))
        }
      })

      // Select diverse luxury properties avoiding hero duplicates
      const selectedImages = []
      const usedPropertyTypes = new Set()
      const usedLocations = new Set()

      for (const property of properties) {
        if (selectedImages.length >= 6) break

        // Skip if image is already used in hero section
        if (property.images?.[0] && usedImageUrls.has(property.images[0])) {
          continue
        }

        // Ensure variety in property types and locations
        const propertyType = property.type || property.category
        const location = property.address?.city || property.location

        if (selectedImages.length < 3) {
          // First 3 can be any luxury type
        } else {
          // For remaining slots, ensure variety
          if (
            usedPropertyTypes.has(propertyType) &&
            usedPropertyTypes.size >= 3
          )
            continue
          if (usedLocations.has(location) && usedLocations.size >= 4) continue
        }

        if (property.images && property.images.length > 0) {
          selectedImages.push({
            id: property.id,
            url: property.images[0],
            title: property.title || `Luxury ${propertyType}`,
            type: propertyType,
            category: property.category || 'Luxury',
            location: location || 'Premium Location',
            price: property.price,
            originalPrice: property.originalPrice || property.price,
            currency: property.currency || 'NGN',
            rating: property.averageRating || 4.8,
            quality: property.imageQuality || 8,
            isPremium: property.hostPremium || property.price >= 500000,
            isLuxury: true,
            amenities: property.amenities || [],
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            views: property.views || 0,
            hostName: property.hostName,
            propertyId: property.id,
          })

          usedPropertyTypes.add(propertyType)
          usedLocations.add(location)
        }
      }

      // If we don't have enough luxury properties, fill with high-end alternatives
      if (selectedImages.length < 2) {
        const additionalQuery = query(
          collection(db, 'properties'),
          where('isActive', '==', true),
          where('price', '>=', 150000), // Slightly lower threshold
          where('images', '!=', []),
          orderBy('price', 'desc'),
          limit(5)
        )

        const additionalSnapshot = await getDocs(additionalQuery)
        const additionalProps = additionalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        for (const property of additionalProps) {
          if (selectedImages.length >= 6) break

          // Skip duplicates
          if (selectedImages.some((img) => img.id === property.id)) continue
          if (property.images?.[0] && usedImageUrls.has(property.images[0]))
            continue

          selectedImages.push({
            id: property.id,
            url: property.images[0],
            title: property.title || `Premium ${property.type}`,
            type: property.type,
            category: property.category || 'Premium',
            location: property.address?.city || 'Featured Location',
            price: Math.max(property.price, 200000), // Ensure minimum 200K display
            originalPrice: property.price,
            currency: property.currency || 'NGN',
            rating: property.averageRating || 4.5,
            quality: property.imageQuality || 7,
            isPremium: property.price >= 300000,
            isLuxury: property.price >= 500000,
            amenities: property.amenities || [],
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            views: property.views || 0,
            hostName: property.hostName,
            propertyId: property.id,
          })
        }
      }

      return selectedImages
    } catch (error) {
      console.error('Error selecting best weekly images:', error)
      return [] // Return empty array for fallback handling
    }
  },

  async getPremiumShowcaseImages() {
    try {
      const q = query(
        collection(db, 'properties'),
        where('isActive', '==', true),
        where('hostPremium', '==', true),
        where('imageQuality', '>=', 9),
        orderBy('imageQuality', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(12)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          url: data.images?.[0],
          title: data.title,
          type: data.type,
          location: data.address?.city,
          price: data.price,
          rating: data.averageRating || 5.0,
          quality: data.imageQuality,
          premiumBadge: true,
        }
      })
    } catch (error) {
      console.error('Error fetching premium showcase:', error)
      return []
    }
  },

  async getRandomBestImages(limit = 6, excludeUrls = []) {
    try {
      // Get high-quality images, excluding header images
      const q = query(
        collection(db, 'properties'),
        where('isActive', '==', true),
        where('images', '!=', []),
        orderBy('views', 'desc'),
        limit(limit * 3) // Get more than needed for filtering and randomization
      )

      const snapshot = await getDocs(q)
      let properties = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Filter out properties with excluded image URLs
      if (excludeUrls.length > 0) {
        properties = properties.filter((property) => {
          return !property.images?.some((imageUrl) =>
            excludeUrls.includes(imageUrl)
          )
        })
      }

      // Randomize and select
      const shuffled = properties.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, limit).map((property) => ({
        id: property.id,
        url: property.images[0],
        title: property.title || `${property.type} Property`,
        type: property.type,
        category: property.category || 'Featured',
        location: property.address?.city || 'Featured Location',
        price: property.price,
        currency: property.currency || 'NGN',
        rating: property.averageRating || 4.5,
        quality: property.imageQuality || 7,
        views: property.views || 0,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities || [],
        hostName: property.hostName,
        propertyId: property.id,
      }))
    } catch (error) {
      console.error('Error fetching random best images:', error)
      return []
    }
  },

  async updateWeeklyFeaturedImages(images) {
    try {
      const weeklyRef = doc(db, 'featured', 'weekly-header')
      const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))

      await updateDoc(weeklyRef, {
        images,
        week: currentWeek,
        lastUpdated: new Date(),
        manualUpdate: true,
      }).catch(async () => {
        // Create document if it doesn't exist
        await addDoc(collection(db, 'featured'), {
          images,
          week: currentWeek,
          lastUpdated: new Date(),
          manualUpdate: true,
          type: 'weekly-header',
        })
      })
    } catch (error) {
      console.error('Error updating weekly featured images:', error)
      throw new Error('Failed to update weekly featured images')
    }
  },

  // Track used images to prevent duplicates between sections
  async markImagesAsUsed(images, section = 'header') {
    try {
      const usedImagesRef = doc(db, 'featured', 'used-images')
      const imageUrls = images.map((img) => img.url).filter(Boolean)

      const updateData = {}
      updateData[section] = imageUrls
      updateData[`${section}UpdatedAt`] = new Date()

      await updateDoc(usedImagesRef, updateData).catch(async () => {
        await addDoc(collection(db, 'featured'), {
          ...updateData,
          type: 'used-images',
        })
      })
    } catch (error) {
      console.error('Error marking images as used:', error)
      // Non-critical, don't throw
    }
  },

  async getUsedImages(section = null) {
    try {
      const usedImagesRef = doc(db, 'featured', 'used-images')
      const docSnap = await getDoc(usedImagesRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        return section ? data[section] || [] : data
      }
      return section ? [] : {}
    } catch (error) {
      console.error('Error getting used images:', error)
      return section ? [] : {}
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
      const { propertyId, checkIn, checkOut, userId, guests, totalAmount } =
        bookingData

      // Check for overlapping bookings
      const hasConflict = await this.checkDateConflict(
        propertyId,
        checkIn,
        checkOut
      )
      if (hasConflict) {
        throw new Error(
          'Property is already booked for the selected dates. Please choose different dates.'
        )
      }

      // Get property to find hostId
      const property = await propertyService.getPropertyById(propertyId)
      if (!property) {
        throw new Error('Property not found')
      }

      const booking = {
        propertyId,
        userId,
        hostId: property.hostId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: parseInt(guests),
        totalAmount: parseFloat(totalAmount),
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const docRef = await addDoc(collection(db, 'bookings'), booking)

      // Update host statistics
      await this.updateHostStats(property.hostId)

      // Update property statistics
      await propertyService.updatePropertyBookingStats(propertyId)

      return docRef.id
    } catch (error) {
      console.error('Error creating booking:', error)
      throw new Error(error.message || 'Failed to create booking')
    }
  },

  async checkDateConflict(propertyId, checkIn, checkOut) {
    try {
      const startDate = new Date(checkIn)
      const endDate = new Date(checkOut)

      // Query for bookings that overlap with the requested dates
      const q = query(
        collection(db, 'bookings'),
        where('propertyId', '==', propertyId),
        where('status', 'in', ['pending', 'confirmed'])
      )

      const snapshot = await getDocs(q)

      for (const doc of snapshot.docs) {
        const booking = doc.data()
        const bookingStart = booking.checkIn.toDate()
        const bookingEnd = booking.checkOut.toDate()

        // Check if dates overlap
        if (startDate < bookingEnd && endDate > bookingStart) {
          return true // Conflict found
        }
      }

      return false // No conflict
    } catch (error) {
      console.error('Error checking date conflict:', error)
      throw new Error('Failed to check date availability')
    }
  },

  async updateHostStats(hostId) {
    try {
      const hostBookings = await this.getHostBookings(hostId)

      // Calculate total bookings
      const totalBookings = hostBookings.length

      // Calculate monthly earnings (current month)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const monthlyEarnings = hostBookings
        .filter((booking) => {
          const bookingDate = booking.createdAt.toDate
            ? booking.createdAt.toDate()
            : new Date(booking.createdAt)
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear &&
            booking.status === 'confirmed'
          )
        })
        .reduce((total, booking) => total + (booking.totalAmount || 0), 0)

      // Calculate total earnings
      const totalEarnings = hostBookings
        .filter((booking) => booking.status === 'confirmed')
        .reduce((total, booking) => total + (booking.totalAmount || 0), 0)

      // Update host stats (if using MongoDB)
      // Note: This would update a hosts collection if you have one
      // For now, we'll store these stats with the bookings data

      return {
        totalBookings,
        monthlyEarnings,
        totalEarnings,
      }
    } catch (error) {
      console.error('Error updating host stats:', error)
      throw new Error('Failed to update host statistics')
    }
  },

  async getHostStats(hostId) {
    try {
      const hostBookings = await this.getHostBookings(hostId)
      const hostProperties = await propertyService.getHostProperties(hostId)

      // Calculate statistics
      const totalBookings = hostBookings.length
      const confirmedBookings = hostBookings.filter(
        (b) => b.status === 'confirmed'
      )

      // Monthly earnings (current month)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const monthlyEarnings = confirmedBookings
        .filter((booking) => {
          const bookingDate = booking.createdAt.toDate
            ? booking.createdAt.toDate()
            : new Date(booking.createdAt)
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear
          )
        })
        .reduce((total, booking) => total + (booking.totalAmount || 0), 0)

      // Total earnings
      const totalEarnings = confirmedBookings.reduce(
        (total, booking) => total + (booking.totalAmount || 0),
        0
      )

      // Average rating across all properties
      const avgRating =
        hostProperties.length > 0
          ? hostProperties.reduce(
              (sum, prop) => sum + (prop.averageRating || 0),
              0
            ) / hostProperties.length
          : 0

      // Total reviews across all properties
      const totalReviews = hostProperties.reduce(
        (sum, prop) => sum + (prop.totalReviews || 0),
        0
      )

      return {
        totalListings: hostProperties.length,
        totalBookings,
        monthlyEarnings: Math.round(monthlyEarnings),
        totalEarnings: Math.round(totalEarnings),
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews,
      }
    } catch (error) {
      console.error('Error getting host stats:', error)
      throw new Error('Failed to get host statistics')
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

      // If booking is confirmed, update host stats
      if (status === 'confirmed') {
        const booking = await this.getBooking(bookingId)
        if (booking) {
          await this.updateHostStats(booking.hostId)
        }
      }
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

  async getPropertyAvailability(propertyId, month, year) {
    try {
      // Get all bookings for the property in the specified month
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)

      const q = query(
        collection(db, 'bookings'),
        where('propertyId', '==', propertyId),
        where('status', 'in', ['pending', 'confirmed'])
      )

      const snapshot = await getDocs(q)
      const bookedDates = []

      snapshot.docs.forEach((doc) => {
        const booking = doc.data()
        const checkIn = booking.checkIn.toDate()
        const checkOut = booking.checkOut.toDate()

        // Add all dates between checkIn and checkOut to bookedDates
        const currentDate = new Date(checkIn)
        while (currentDate <= checkOut) {
          if (currentDate >= startDate && currentDate <= endDate) {
            bookedDates.push(new Date(currentDate).toDateString())
          }
          currentDate.setDate(currentDate.getDate() + 1)
        }
      })

      return bookedDates
    } catch (error) {
      console.error('Error getting property availability:', error)
      throw new Error('Failed to get property availability')
    }
  },
}
