import {
  Property,
  User,
  Booking,
  Favorite,
  Featured,
} from "../models/mongodb-models.js";

// Property Service for MongoDB
export const mongoPropertyService = {
  async getAllProperties(filters = {}, pagination = {}) {
    try {
      const query = { isActive: true };

      // Apply filters
      if (filters.city) {
        query["address.city"] = new RegExp(filters.city, "i"); // Case insensitive
      }
      if (filters.propertyType) {
        query.type = filters.propertyType;
      }
      if (filters.bedrooms) {
        query.bedrooms = filters.bedrooms;
      }
      if (filters.bathrooms) {
        query.bathrooms = filters.bathrooms;
      }
      if (filters.minPrice) {
        query.price = { ...query.price, $gte: filters.minPrice };
      }
      if (filters.maxPrice) {
        query.price = { ...query.price, $lte: filters.maxPrice };
      }

      let queryBuilder = Property.find(query).sort({
        createdAt: -1,
        views: -1,
      });

      // Apply pagination if provided
      if (pagination.skip !== undefined) {
        queryBuilder = queryBuilder.skip(pagination.skip);
      }
      if (pagination.limit !== undefined) {
        queryBuilder = queryBuilder.limit(pagination.limit);
      } else {
        queryBuilder = queryBuilder.limit(50); // Default limit if no pagination
      }

      const properties = await queryBuilder;

      return properties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error("Failed to fetch properties");
    }
  },

  async getPropertiesCount(filters = {}) {
    try {
      const query = { isActive: true };

      // Apply same filters as getAllProperties
      if (filters.city) {
        query["address.city"] = new RegExp(filters.city, "i");
      }
      if (filters.propertyType) {
        query.type = filters.propertyType;
      }
      if (filters.bedrooms) {
        query.bedrooms = filters.bedrooms;
      }
      if (filters.bathrooms) {
        query.bathrooms = filters.bathrooms;
      }
      if (filters.minPrice) {
        query.price = { ...query.price, $gte: filters.minPrice };
      }
      if (filters.maxPrice) {
        query.price = { ...query.price, $lte: filters.maxPrice };
      }

      return await Property.countDocuments(query);
    } catch (error) {
      console.error("Error counting properties:", error);
      throw new Error("Failed to count properties");
    }
  },

  async getProperty(propertyId) {
    try {
      console.log("🔍 Looking up property with ID:", propertyId);

      // Validate the propertyId
      if (!propertyId) {
        throw new Error("Property ID is required");
      }

      // Handle different ID formats
      let query;
      if (propertyId.match(/^[0-9a-fA-F]{24}$/)) {
        // Valid MongoDB ObjectId
        query = { _id: propertyId, isActive: true };
      } else {
        // Could be a custom ID or invalid format
        console.log("❌ Invalid MongoDB ObjectId format:", propertyId);
        return null;
      }

      const property = await Property.findOne(query);

      if (!property) {
        console.log("❌ Property not found in database for ID:", propertyId);
        return null;
      }

      console.log("✅ Property found:", property.title, "ID:", property._id);
      return property;
    } catch (error) {
      console.error("❌ Error in getProperty service:", error);
      throw new Error("Failed to fetch property: " + error.message);
    }
  },

  async createProperty(hostId, propertyData) {
    try {
      const property = new Property({
        ...propertyData,
        hostId,
        views: 0,
      });

      const savedProperty = await property.save();
      return savedProperty._id.toString();
    } catch (error) {
      console.error("Error creating property:", error);
      throw new Error("Failed to create property");
    }
  },

  async updateProperty(propertyId, updateData) {
    try {
      await Property.findByIdAndUpdate(
        propertyId,
        { ...updateData, updatedAt: new Date() },
        { new: true },
      );
    } catch (error) {
      console.error("Error updating property:", error);
      throw new Error("Failed to update property");
    }
  },

  async deleteProperty(propertyId) {
    try {
      await Property.findByIdAndUpdate(propertyId, { isActive: false });
    } catch (error) {
      console.error("Error deleting property:", error);
      throw new Error("Failed to delete property");
    }
  },

  async getHostProperties(hostId) {
    try {
      return await Property.find({ hostId }).sort({
        createdAt: -1,
      });
    } catch (error) {
      console.error("Error fetching host properties:", error);
      throw new Error("Failed to fetch host properties");
    }
  },

  async incrementViews(propertyId) {
    try {
      await Property.findByIdAndUpdate(propertyId, { $inc: { views: 1 } });
    } catch (error) {
      console.error("Error incrementing views:", error);
      // Don't throw error as this is not critical
    }
  },

  // Weekly Featured Images for Header (Luxury Properties)
  async getWeeklyFeaturedImages() {
    try {
      // For now, skip caching to avoid schema issues
      // Just return fresh luxury images each time
      const bestImages = await this.selectBestWeeklyImages();

      return {
        images: bestImages,
        lastUpdated: new Date(),
        week: Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)),
        cached: false,
      };
    } catch (error) {
      console.error("Error fetching weekly featured images:", error);
      throw new Error("Failed to fetch weekly featured images");
    }
  },

  async selectBestWeeklyImages() {
    try {
      // Get luxury properties with minimum price of 200K (simplified approach)
      let properties = await Property.find({
        isActive: true,
        price: { $gte: 200000 },
        images: { $exists: true, $ne: [] },
      })
        .sort({ price: -1, views: -1 })
        .limit(6); // Get exactly what we need

      // If no properties found, return empty array
      if (properties.length === 0) {
        console.log("No properties found for weekly featured images");
        return [];
      }

      // Convert properties to image objects
      const selectedImages = properties.map((property) => ({
        id: property._id.toString(),
        url: property.images[0],
        title: property.title || `${property.type} Property`,
        type: property.type,
        category: property.category || "Featured",
        location: property.address?.city || "Featured Location",
        price: property.price,
        originalPrice: property.originalPrice || property.price,
        currency: property.currency || "NGN",
        rating: property.averageRating || 4.8,
        quality: property.imageQuality || 8,
        isPremium: property.price >= 500000,
        isLuxury: property.price >= 200000,
        amenities: property.amenities || [],
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        views: property.views || 0,
        hostName: property.hostName,
        propertyId: property._id.toString(),
      }));

      return selectedImages;
    } catch (error) {
      console.error("Error selecting best weekly images:", error);
      return [];
    }
  },

  async getRandomBestImages(limit = 6, excludeUrls = []) {
    try {
      // Simplified approach - just get random properties
      const properties = await Property.find({
        isActive: true,
        images: { $exists: true, $ne: [] },
      })
        .sort({ views: -1, price: -1 })
        .limit(limit);

      return properties.map((property) => ({
        id: property._id.toString(),
        url: property.images[0],
        title: property.title || `${property.type} Property`,
        type: property.type,
        category: property.category || "Featured",
        location: property.address?.city || "Featured Location",
        price: property.price,
        currency: property.currency || "NGN",
        rating: property.averageRating || 4.5,
        quality: property.imageQuality || 7,
        views: property.views || 0,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities || [],
        hostName: property.hostName,
        propertyId: property._id.toString(),
      }));
    } catch (error) {
      console.error("Error fetching random best images:", error);
      return [];
    }
  },

  async markImagesAsUsed(images, section = "header") {
    try {
      const imageUrls = images.map((img) => img.url).filter(Boolean);

      await Featured.findOneAndUpdate(
        { type: `used-${section}` },
        {
          urls: imageUrls, // Use urls field for simple URL storage
          lastUpdated: new Date(),
          isActive: true,
        },
        { upsert: true },
      );
    } catch (error) {
      console.error("Error marking images as used:", error);
    }
  },

  async getUsedImages(section = "header") {
    try {
      const used = await Featured.findOne({ type: `used-${section}` });
      return used ? used.urls || [] : []; // Use urls field
    } catch (error) {
      console.error("Error getting used images:", error);
      return [];
    }
  },

  // Premium Featured Images (High-end properties)
  async getPremiumFeaturedImages(limit = 6) {
    try {
      const premiumProperties = await Property.find({
        isActive: true,
        price: { $gte: 300000 }, // Premium price threshold
        images: { $exists: true, $ne: [] },
        $or: [
          { category: { $in: ["Luxury", "Premium", "Executive"] } },
          { hostPremium: true },
          { price: { $gte: 500000 } },
        ],
      })
        .sort({ price: -1, views: -1, averageRating: -1 })
        .limit(limit * 2); // Get more for better selection

      const selectedImages = premiumProperties
        .slice(0, limit)
        .map((property) => ({
          id: property._id.toString(),
          url: property.images[0],
          title: property.title || `Premium ${property.type}`,
          type: property.type,
          category: property.category || "Premium",
          location: property.address?.city || "Premium Location",
          price: property.price,
          originalPrice: property.originalPrice || property.price,
          currency: property.currency || "NGN",
          rating: property.averageRating || 4.7,
          quality: property.imageQuality || 8,
          isPremium: true,
          isLuxury: property.price >= 500000,
          amenities: property.amenities || [],
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          views: property.views || 0,
          hostName: property.hostName,
          hostPremium: property.hostPremium || false,
          propertyId: property._id.toString(),
        }));

      return selectedImages;
    } catch (error) {
      console.error("Error fetching premium featured images:", error);
      return [];
    }
  },

  // Premium Showcase Images (Best Quality)
  async getPremiumShowcaseImages() {
    try {
      const showcaseProperties = await Property.find({
        isActive: true,
        imageQuality: { $gte: 8 },
        price: { $gte: 200000 },
        images: { $exists: true, $ne: [] },
      })
        .sort({ imageQuality: -1, price: -1, averageRating: -1 })
        .limit(12);

      return showcaseProperties.map((property) => ({
        id: property._id.toString(),
        url: property.images[0],
        title: property.title || `Quality ${property.type}`,
        type: property.type,
        category: property.category || "Showcase",
        location: property.address?.city || "Premium Location",
        price: property.price,
        currency: property.currency || "NGN",
        rating: property.averageRating || 4.6,
        quality: property.imageQuality || 8,
        amenities: property.amenities || [],
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        views: property.views || 0,
        hostName: property.hostName,
        propertyId: property._id.toString(),
      }));
    } catch (error) {
      console.error("Error fetching premium showcase images:", error);
      return [];
    }
  },

  // Premium Properties (High-end listings)
  async getPremiumProperties(limit = 12, minPrice = 300000) {
    try {
      const properties = await Property.find({
        isActive: true,
        price: { $gte: minPrice },
        images: { $exists: true, $ne: [] },
      })
        .sort({ price: -1, views: -1 })
        .limit(limit);

      return properties.map((property) => ({
        id: property._id.toString(),
        title: property.title,
        description: property.description,
        type: property.type,
        category: property.category || "Premium",
        price: property.price,
        currency: property.currency || "NGN",
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        location: property.address?.city || "Premium Location",
        fullAddress: property.address,
        images: property.images,
        amenities: property.amenities || [],
        rating: property.averageRating || 4.5,
        reviews: property.totalReviews || 0,
        views: property.views || 0,
        hostName: property.hostName,
        hostId: property.hostId,
        hostPremium: property.hostPremium || false,
        isAvailable: property.isAvailable,
        isFeatured: property.isFeatured,
        createdAt: property.createdAt,
      }));
    } catch (error) {
      console.error("Error fetching premium properties:", error);
      return [];
    }
  },

  async getFeaturedProperties(limit = 10) {
    try {
      console.log(`⭐ Fetching ${limit} featured properties`);

      // Get properties that are marked as featured, or fallback to high-rated properties
      const query = {
        isActive: true,
        $or: [
          { isFeatured: true },
          { averageRating: { $gte: 4.5 } },
          { category: { $in: ["Premium", "Luxury", "Executive"] } },
        ],
      };

      const properties = await Property.find(query)
        .sort({
          isFeatured: -1, // Featured properties first
          averageRating: -1, // Then by rating
          views: -1, // Then by views
          createdAt: -1, // Finally by creation date
        })
        .limit(limit);

      console.log(`✅ Found ${properties.length} featured properties`);
      return properties;
    } catch (error) {
      console.error("❌ Error fetching featured properties:", error);
      throw new Error("Failed to fetch featured properties: " + error.message);
    }
  },

  async searchProperties(searchCriteria) {
    try {
      console.log("🔍 Searching properties with criteria:", searchCriteria);

      const query = { isActive: true };

      // Apply location filter
      if (searchCriteria.location) {
        // Search in address fields
        query.$or = [
          { "address.city": new RegExp(searchCriteria.location, "i") },
          { "address.state": new RegExp(searchCriteria.location, "i") },
          { "address.country": new RegExp(searchCriteria.location, "i") },
          { title: new RegExp(searchCriteria.location, "i") },
          { description: new RegExp(searchCriteria.location, "i") },
        ];
      }

      // Apply property type filter
      if (searchCriteria.propertyType) {
        query.type = new RegExp(searchCriteria.propertyType, "i");
      }

      // Apply price range filters
      if (
        searchCriteria.minPrice !== undefined ||
        searchCriteria.maxPrice !== undefined
      ) {
        query.price = {};
        if (searchCriteria.minPrice !== undefined) {
          query.price.$gte = searchCriteria.minPrice;
        }
        if (searchCriteria.maxPrice !== undefined) {
          query.price.$lte = searchCriteria.maxPrice;
        }
      }

      // Apply availability filter
      if (searchCriteria.available !== undefined) {
        query.isAvailable = searchCriteria.available;
      }

      // Apply status filter
      if (searchCriteria.status) {
        query.status = searchCriteria.status;
      }

      // Apply keyword search across multiple fields
      if (searchCriteria.search) {
        const searchRegex = new RegExp(searchCriteria.search, "i");
        const searchFields = searchCriteria.searchFields || [
          "title",
          "description",
          "amenities",
        ];

        const searchConditions = searchFields.map((field) => {
          if (field === "amenities") {
            return { amenities: { $in: [searchRegex] } };
          } else {
            return { [field]: searchRegex };
          }
        });

        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: searchConditions }];
          delete query.$or;
        } else {
          query.$or = searchConditions;
        }
      }

      console.log("🏗️ Built search query:", JSON.stringify(query, null, 2));

      const properties = await Property.find(query)
        .sort({ createdAt: -1, views: -1 })
        .limit(50); // Limit results to prevent overwhelming responses

      console.log(
        `✅ Found ${properties.length} properties matching search criteria`,
      );

      return properties;
    } catch (error) {
      console.error("❌ Error searching properties:", error);
      throw new Error("Failed to search properties: " + error.message);
    }
  },
};

export default mongoPropertyService;
