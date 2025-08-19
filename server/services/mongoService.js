import {
  Property,
  User,
  Booking,
  Favorite,
  Featured,
} from '../models/mongodb-models.js'

// Property Service for MongoDB
export const mongoPropertyService = {
  async getAllProperties(filters = {}) {
    try {
      const query = { isActive: true }

      // Apply filters
      if (filters.city) {
        query['address.city'] = new RegExp(filters.city, 'i') // Case insensitive
      }
      if (filters.propertyType) {
        query.type = filters.propertyType
      }
      if (filters.bedrooms) {
        query.bedrooms = filters.bedrooms
      }
      if (filters.bathrooms) {
        query.bathrooms = filters.bathrooms
      }
      if (filters.minPrice) {
        query.price = { ...query.price, $gte: filters.minPrice }
      }
      if (filters.maxPrice) {
        query.price = { ...query.price, $lte: filters.maxPrice }
      }

      const properties = await Property.find(query)
        .sort({ createdAt: -1, views: -1 })
        .limit(50)

      return properties
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw new Error('Failed to fetch properties')
    }
  },

  async getProperty(propertyId) {
    try {
      return await Property.findById(propertyId)
    } catch (error) {
      console.error('Error fetching property:', error)
      throw new Error('Failed to fetch property')
    }
  },

  async createProperty(hostId, propertyData) {
    try {
      const property = new Property({
        ...propertyData,
        hostId,
        views: 0,
      })

      const savedProperty = await property.save()
      return savedProperty._id.toString()
    } catch (error) {
      console.error('Error creating property:', error)
      throw new Error('Failed to create property')
    }
  },

  async updateProperty(propertyId, updateData) {
    try {
      await Property.findByIdAndUpdate(
        propertyId,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
    } catch (error) {
      console.error('Error updating property:', error)
      throw new Error('Failed to update property')
    }
  },

  async deleteProperty(propertyId) {
    try {
      await Property.findByIdAndUpdate(propertyId, { isActive: false })
    } catch (error) {
      console.error('Error deleting property:', error)
      throw new Error('Failed to delete property')
    }
  },

  async getHostProperties(hostId) {
    try {
      return await Property.find({ hostId, isActive: true }).sort({
        createdAt: -1,
      })
    } catch (error) {
      console.error('Error fetching host properties:', error)
      throw new Error('Failed to fetch host properties')
    }
  },

  async incrementViews(propertyId) {
    try {
      await Property.findByIdAndUpdate(propertyId, { $inc: { views: 1 } })
    } catch (error) {
      console.error('Error incrementing views:', error)
      // Don't throw error as this is not critical
    }
  },

  // Weekly Featured Images for Header (Luxury Properties)
  async getWeeklyFeaturedImages() {
    try {
      const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))

      // Check for cached weekly selection
      let weeklyFeatured = await Featured.findOne({
        type: 'weekly-header',
        week: currentWeek,
        isActive: true,
      })

      if (weeklyFeatured && weeklyFeatured.images.length > 0) {
        return {
          images: weeklyFeatured.images,
          lastUpdated: weeklyFeatured.lastUpdated,
          week: currentWeek,
          cached: true,
        }
      }

      // Fetch fresh luxury images
      const bestImages = await this.selectBestWeeklyImages()

      // Cache the selection
      weeklyFeatured = await Featured.findOneAndUpdate(
        { type: 'weekly-header' },
        {
          images: bestImages,
          week: currentWeek,
          lastUpdated: new Date(),
          isActive: true,
        },
        { upsert: true, new: true }
      )

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
      // Get luxury properties with minimum price of 200K
      let properties = await Property.find({
        isActive: true,
        price: { $gte: 200000 },
        category: { $in: ['Luxury', 'Premium', 'Executive'] },
        imageQuality: { $gte: 8 },
        images: { $exists: true, $ne: [] },
      })
        .sort({ price: -1, imageQuality: -1, views: -1 })
        .limit(15)

      // Fallback to high-end properties if no luxury found
      if (properties.length === 0) {
        properties = await Property.find({
          isActive: true,
          price: { $gte: 200000 },
          images: { $exists: true, $ne: [] },
        })
          .sort({ price: -1, views: -1 })
          .limit(10)
      }

      // Get used hero images to avoid duplicates
      const heroFeatured = await Featured.findOne({ type: 'hero-rotation' })
      const usedImageUrls = new Set()

      if (heroFeatured && heroFeatured.images) {
        heroFeatured.images.forEach((img) => usedImageUrls.add(img.url))
      }

      // Select diverse luxury properties
      const selectedImages = []
      const usedTypes = new Set()
      const usedLocations = new Set()

      for (const property of properties) {
        if (selectedImages.length >= 6) break

        // Skip if image already used in hero
        if (property.images[0] && usedImageUrls.has(property.images[0])) {
          continue
        }

        // Ensure variety
        const propertyType = property.type
        const location = property.address?.city

        if (selectedImages.length >= 3) {
          if (usedTypes.has(propertyType) && usedTypes.size >= 3) continue
          if (usedLocations.has(location) && usedLocations.size >= 4) continue
        }

        selectedImages.push({
          id: property._id.toString(),
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
          propertyId: property._id.toString(),
        })

        usedTypes.add(propertyType)
        usedLocations.add(location)
      }

      return selectedImages
    } catch (error) {
      console.error('Error selecting best weekly images:', error)
      return []
    }
  },

  async getRandomBestImages(limit = 6, excludeUrls = []) {
    try {
      const query = {
        isActive: true,
        images: { $exists: true, $ne: [] },
      }

      // Exclude specific URLs if provided
      if (excludeUrls.length > 0) {
        query['images.0'] = { $nin: excludeUrls }
      }

      const properties = await Property.aggregate([
        { $match: query },
        { $sample: { size: limit * 2 } }, // Get more for randomization
        { $limit: limit },
      ])

      return properties.map((property) => ({
        id: property._id.toString(),
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
        propertyId: property._id.toString(),
      }))
    } catch (error) {
      console.error('Error fetching random best images:', error)
      return []
    }
  },

  async markImagesAsUsed(images, section = 'header') {
    try {
      const imageUrls = images.map((img) => img.url).filter(Boolean)

      await Featured.findOneAndUpdate(
        { type: `used-${section}` },
        {
          images: imageUrls,
          lastUpdated: new Date(),
          isActive: true,
        },
        { upsert: true }
      )
    } catch (error) {
      console.error('Error marking images as used:', error)
    }
  },

  async getUsedImages(section = 'header') {
    try {
      const used = await Featured.findOne({ type: `used-${section}` })
      return used ? used.images : []
    } catch (error) {
      console.error('Error getting used images:', error)
      return []
    }
  },
}

export default mongoPropertyService
