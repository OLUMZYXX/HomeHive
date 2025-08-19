import mongoose from 'mongoose'

// Property Schema
const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true }, // Apartment, House, Villa, etc.
    category: { type: String, default: 'Standard' }, // Standard, Premium, Luxury, Executive
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    currency: { type: String, default: 'NGN' },

    // Location
    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      country: { type: String, default: 'Nigeria' },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Property Details
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: Number, // in square meters
    amenities: [String],

    // Images and Media
    images: [String], // Array of image URLs
    imageQuality: { type: Number, default: 7, min: 1, max: 10 },

    // Host Information
    hostId: { type: String, required: true },
    hostName: String,
    hostPremium: { type: Boolean, default: false },

    // Property Status
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    // Stats
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
)

// Indexes for better query performance
propertySchema.index({ city: 1, isActive: 1 })
propertySchema.index({ price: 1, isActive: 1 })
propertySchema.index({ hostId: 1, isActive: 1 })
propertySchema.index({ category: 1, price: -1 })
propertySchema.index({ imageQuality: -1, views: -1 })
propertySchema.index({ isFeatured: 1, isActive: 1 })

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: String, // Full name (can be derived from firstName + lastName)
    phone: String,
    avatar: String,
    profilePicture: String, // For Google OAuth profile pictures
    role: { type: String, enum: ['user', 'host', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: Date,

    // OAuth fields
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: String, // Google user ID for OAuth users
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
)

// Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    userId: { type: String, required: true },
    hostId: { type: String, required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },

    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

// Favorite Schema
const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Featured Images Schema
const featuredSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['weekly-header', 'hero-rotation', 'premium-showcase'],
      required: true,
    },
    images: [
      {
        id: String,
        url: String,
        title: String,
        type: String,
        category: String,
        location: String,
        price: Number,
        rating: Number,
        quality: Number,
        isPremium: Boolean,
        isLuxury: Boolean,
        amenities: [String],
        bedrooms: Number,
        bathrooms: Number,
        views: Number,
        hostName: String,
        propertyId: String,
      },
    ],
    week: Number,
    lastUpdated: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

// Testimonial Schema
const testimonialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Make optional to support guest testimonials
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false, // Make optional for general testimonials
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    stayDate: {
      type: Date,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    guestName: {
      type: String,
      required: function () {
        return this.isGuest
      },
    },
    guestEmail: {
      type: String,
      required: function () {
        return this.isGuest
      },
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

// Export Models
export const Property = mongoose.model('Property', propertySchema)
export const User = mongoose.model('User', userSchema)
export const Booking = mongoose.model('Booking', bookingSchema)
export const Favorite = mongoose.model('Favorite', favoriteSchema)
export const Featured = mongoose.model('Featured', featuredSchema)
export const Testimonial = mongoose.model('Testimonial', testimonialSchema)
