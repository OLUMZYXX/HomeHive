import { connectDB } from './config/mongodb.js'
import { Property } from './models/mongodb-models.js'

const sampleProperties = [
  {
    title: 'Luxury Lagos Apartment',
    description:
      'Beautiful modern apartment in the heart of Lagos with amazing amenities',
    type: 'apartment',
    category: 'Luxury',
    price: 150000,
    currency: 'NGN',
    address: {
      street: 'Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
    },
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    amenities: [
      'wifi',
      'tv',
      'kitchen',
      'parking',
      'ac',
      'pool',
      'gym',
      'security',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    imageQuality: 9,
    hostId: 'sample_host_1',
    hostName: 'John Doe',
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    isFeatured: true,
    averageRating: 4.8,
    totalReviews: 24,
  },
  {
    title: 'Modern Abuja Villa',
    description:
      'Spacious villa with private garden and modern amenities in Abuja',
    type: 'house',
    category: 'Premium',
    price: 200000,
    currency: 'NGN',
    address: {
      street: 'Maitama',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
    },
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    amenities: [
      'wifi',
      'tv',
      'kitchen',
      'parking',
      'ac',
      'generator',
      'security',
      'garden',
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    imageQuality: 8,
    hostId: 'sample_host_2',
    hostName: 'Jane Smith',
    hostPremium: false,
    isActive: true,
    isAvailable: true,
    isFeatured: false,
    averageRating: 4.5,
    totalReviews: 18,
  },
  {
    title: 'Cozy Port Harcourt Studio',
    description:
      'Perfect studio apartment for business travelers and short stays',
    type: 'studio',
    category: 'Standard',
    price: 75000,
    currency: 'NGN',
    address: {
      street: 'GRA Phase 2',
      city: 'Port Harcourt',
      state: 'Rivers State',
      country: 'Nigeria',
    },
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    amenities: ['wifi', 'tv', 'kitchen', 'ac', 'security'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    imageQuality: 7,
    hostId: 'sample_host_3',
    hostName: 'Michael Johnson',
    hostPremium: false,
    isActive: true,
    isAvailable: true,
    isFeatured: false,
    averageRating: 4.2,
    totalReviews: 12,
  },
]

async function addSampleProperties() {
  try {
    console.log('🔄 Connecting to database...')
    await connectDB()

    console.log('🏠 Adding sample properties...')

    for (const propertyData of sampleProperties) {
      // Check if property already exists
      const existing = await Property.findOne({ title: propertyData.title })
      if (existing) {
        console.log(
          `⚠️  Property "${propertyData.title}" already exists, skipping...`
        )
        continue
      }

      const property = new Property(propertyData)
      await property.save()
      console.log(`✅ Added property: ${propertyData.title}`)
    }

    console.log('🎉 Sample properties added successfully!')

    // List all properties
    const allProperties = await Property.find({ isActive: true })
    console.log(
      `📊 Total active properties in database: ${allProperties.length}`
    )

    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding sample properties:', error)
    process.exit(1)
  }
}

addSampleProperties()
