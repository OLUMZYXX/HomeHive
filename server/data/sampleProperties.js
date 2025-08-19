// Sample luxury properties data for testing
// You can import this data into either Firebase or MongoDB

export const sampleLuxuryProperties = [
  {
    title: 'Executive Penthouse Suite',
    description:
      'Luxurious penthouse with panoramic city views, private pool, and concierge service',
    type: 'Penthouse',
    category: 'Executive',
    price: 750000,
    currency: 'NGN',
    address: {
      street: '1004 Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
    },
    bedrooms: 4,
    bathrooms: 4,
    area: 350,
    amenities: [
      'Private Pool',
      'Concierge',
      'Gym',
      'Spa',
      'Parking',
      'Security',
      'WiFi',
      'Kitchen',
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
    ],
    imageQuality: 9,
    hostName: 'Lagos Premium Estates',
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    isFeatured: true,
    averageRating: 4.9,
    totalReviews: 127,
  },
  {
    title: 'Luxury Marina Apartment',
    description:
      'Stunning waterfront luxury apartment with marina views and world-class amenities',
    type: 'Apartment',
    category: 'Luxury',
    price: 650000,
    currency: 'NGN',
    address: {
      street: 'Banana Island',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
    },
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    amenities: [
      'Marina View',
      'Pool',
      'Gym',
      'Security',
      'Parking',
      'WiFi',
      'Kitchen',
      'Balcony',
    ],
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    imageQuality: 8,
    hostName: 'Waterfront Luxury',
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    isFeatured: true,
    averageRating: 4.8,
    totalReviews: 89,
  },
  {
    title: 'Premium Lekki Villa',
    description:
      'Exclusive villa in premium Lekki location with private garden and luxury finishes',
    type: 'Villa',
    category: 'Premium',
    price: 450000,
    currency: 'NGN',
    address: {
      street: 'Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
    },
    bedrooms: 5,
    bathrooms: 5,
    area: 450,
    amenities: [
      'Private Garden',
      'Pool',
      'Security',
      'Parking',
      'Kitchen',
      'WiFi',
      'Generator',
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    imageQuality: 8,
    hostName: 'Lekki Luxury Homes',
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    averageRating: 4.7,
    totalReviews: 56,
  },
  {
    title: 'Executive Ikoyi Residence',
    description:
      'Ultra-modern executive residence in the heart of Ikoyi with premium amenities',
    type: 'Apartment',
    category: 'Executive',
    price: 550000,
    currency: 'NGN',
    address: {
      street: 'Ikoyi GRA',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
    },
    bedrooms: 3,
    bathrooms: 4,
    area: 300,
    amenities: [
      'Concierge',
      'Gym',
      'Pool',
      'Security',
      'Parking',
      'WiFi',
      'Kitchen',
      'Laundry',
    ],
    images: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    imageQuality: 9,
    hostName: 'Ikoyi Elite Properties',
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    averageRating: 4.8,
    totalReviews: 73,
  },
  {
    title: 'Luxury Abuja Estate Home',
    description:
      'Magnificent luxury home in premium Abuja estate with world-class facilities',
    type: 'House',
    category: 'Luxury',
    price: 400000,
    currency: 'NGN',
    address: {
      street: 'Maitama District',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
    },
    bedrooms: 4,
    bathrooms: 4,
    area: 380,
    amenities: [
      'Garden',
      'Pool',
      'Security',
      'Parking',
      'Kitchen',
      'WiFi',
      'Generator',
      'Study',
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80',
    ],
    imageQuality: 8,
    hostName: 'Capital Luxury Estates',
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    averageRating: 4.6,
    totalReviews: 41,
  },
  {
    title: 'Premium Serviced Apartment',
    description:
      'High-end serviced apartment with hotel-like amenities and prime location',
    type: 'Serviced Apartment',
    category: 'Premium',
    price: 320000,
    currency: 'NGN',
    address: {
      street: 'Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
    },
    bedrooms: 2,
    bathrooms: 2,
    area: 180,
    amenities: [
      'Room Service',
      'Housekeeping',
      'Gym',
      'Pool',
      'Security',
      'WiFi',
      'Kitchen',
      'Parking',
    ],
    images: [
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    imageQuality: 8,
    hostName: 'VI Premium Suites',
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    averageRating: 4.7,
    totalReviews: 94,
  },
]

// Instructions for importing data:

// FOR FIREBASE:
// 1. Go to Firebase Console → Firestore Database
// 2. Create collection "properties"
// 3. Add each property as a document
// 4. Set document ID as auto-generated

// FOR MONGODB:
// 1. Use MongoDB Compass or Atlas interface
// 2. Create database "homehive"
// 3. Create collection "properties"
// 4. Import this JSON data

export default sampleLuxuryProperties
