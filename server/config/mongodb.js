import mongoose from 'mongoose'

export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined')
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      dbName: 'homehive', // Explicitly specify database name
    }

    await mongoose.connect(mongoUri, options)

    console.log('✅ MongoDB Connected Successfully!')
    console.log(`📊 Database: ${mongoose.connection.name}`)
    console.log(`🌐 Host: ${mongoose.connection.host}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)

    // Provide helpful error messages
    if (error.message.includes('MONGODB_URI')) {
      console.error(`
🔧 Setup Required:
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a free cluster
3. Add a database user
4. Whitelist your IP address
5. Get your connection string
6. Add MONGODB_URI to your .env file

Example .env entry:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/homehive?retryWrites=true&w=majority
      `)
    }

    process.exit(1)
  }
}

export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB disconnected successfully')
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error)
  }
}
