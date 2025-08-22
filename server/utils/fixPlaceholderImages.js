import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
]

async function fixPlaceholderImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'homehive',
    })

    console.log('Connected to MongoDB')

    // Get native MongoDB client from mongoose
    const db = mongoose.connection.db
    const propertiesCollection = db.collection('properties')

    // Find all properties with placeholder images
    const placeholderProperties = await propertiesCollection
      .find({
        images: { $regex: 'via.placeholder.com' },
      })
      .toArray()

    console.log(
      `Found ${placeholderProperties.length} properties with placeholder images`
    )

    for (const property of placeholderProperties) {
      const numImages = property.images?.length || 1
      const newImages = []

      for (let i = 0; i < numImages; i++) {
        newImages.push(PROPERTY_IMAGES[i % PROPERTY_IMAGES.length])
      }

      // Update the property with new images
      await propertiesCollection.updateOne(
        { _id: property._id },
        { $set: { images: newImages } }
      )

      console.log(`Updated property: ${property.title}`)
    }

    console.log('✅ All placeholder images have been fixed!')
  } catch (error) {
    console.error('❌ Error fixing placeholder images:', error)
  } finally {
    await mongoose.disconnect()
  }
}

// Run the fix
fixPlaceholderImages()
