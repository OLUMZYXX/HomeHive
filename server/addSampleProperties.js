import { connectMongoDB } from "./config/mongodb.js";
import { Property } from "./models/mongodb-models.js";

const sampleProperties = [
  {
    title: "Luxury Lagos Apartment",
    description:
      "Beautiful modern apartment in the heart of Lagos with amazing amenities",
    type: "apartment",
    category: "Luxury",
    price: 150000,
    currency: "NGN",
    address: {
      street: "Victoria Island",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
    },
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    amenities: [
      "wifi",
      "tv",
      "kitchen",
      "parking",
      "ac",
      "pool",
      "gym",
      "security",
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    imageQuality: 9,
    hostId: "sample_host_1",
    hostName: "John Doe",
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    isFeatured: true,
    status: "active",
    averageRating: 4.8,
    totalReviews: 24,
  },
  {
    title: "Modern Abuja Villa",
    description:
      "Spacious villa with private garden and modern amenities in Abuja",
    type: "house",
    category: "Premium",
    price: 200000,
    currency: "NGN",
    address: {
      street: "Maitama",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
    },
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    amenities: [
      "wifi",
      "tv",
      "kitchen",
      "parking",
      "ac",
      "generator",
      "security",
      "garden",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    imageQuality: 8,
    hostId: "sample_host_2",
    hostName: "Jane Smith",
    hostPremium: false,
    isActive: true,
    isAvailable: true,
    isFeatured: false,
    status: "active",
    averageRating: 4.5,
    totalReviews: 18,
  },
  {
    title: "Luxury Lagos Villa",
    description:
      "Stunning luxury villa with private pool and modern amenities in Lagos",
    type: "villa",
    category: "Luxury",
    price: 600000,
    currency: "NGN",
    address: {
      street: "Banana Island",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
    },
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    amenities: [
      "wifi",
      "tv",
      "kitchen",
      "parking",
      "ac",
      "pool",
      "gym",
      "security",
      "garden",
      "jacuzzi",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    imageQuality: 10,
    hostId: "sample_host_4",
    hostName: "Elite Properties",
    hostPremium: true,
    isActive: true,
    isAvailable: true,
    isFeatured: true,
    status: "active",
    averageRating: 4.9,
    totalReviews: 35,
  },
];

async function addSampleProperties() {
  try {
    console.log("🔄 Connecting to database...");
    await connectMongoDB();

    console.log("🏠 Adding sample properties...");

    for (const propertyData of sampleProperties) {
      // Check if property already exists
      const existing = await Property.findOne({ title: propertyData.title });
      if (existing) {
        console.log(
          `⚠️  Property "${propertyData.title}" already exists, skipping...`,
        );
        continue;
      }

      const property = new Property(propertyData);
      await property.save();
      console.log(`✅ Added property: ${propertyData.title}`);
    }

    console.log("🎉 Sample properties added successfully!");

    // List all properties
    const allProperties = await Property.find({ isActive: true });
    console.log(
      `📊 Total active properties in database: ${allProperties.length}`,
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding sample properties:", error);
    process.exit(1);
  }
}

addSampleProperties();
