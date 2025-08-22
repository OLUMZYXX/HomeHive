import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'

// Import routes
import featuredRoutes from '../routes/featured.js'
import testimonialsRoutes from '../routes/testimonials.js'
import authRoutes from '../routes/auth.js'
import propertiesRoutes from '../routes/properties.js'
import bookingsRoutes from '../routes/bookings.js'
import favoritesRoutes from '../routes/favorites.js'
import premiumRoutes from '../routes/premium.js'
import uploadRoutes from '../routes/upload.js'

const app = express()

// MongoDB connection function
const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGODB_URI
      if (!mongoUri)
        throw new Error('MONGODB_URI environment variable is not defined')
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        dbName: 'homehive',
      })
      console.log('✅ MongoDB Connected Successfully!')
    }
    return true
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    return false
  }
}

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:4173',
      'https://homehive-client.vercel.app',
      'https://home-hive-client.vercel.app',
      'https://homehive.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

app.use(helmet())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 500,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/featured', featuredRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/properties', propertiesRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/premium', premiumRoutes)
app.use('/api/upload', uploadRoutes)

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  })
})

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectMongoDB()
    res.json({
      success: true,
      message: 'HomeHive API Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      database:
        mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ⚠️',
      databaseState: mongoose.connection.readyState,
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    })
  }
})

// Root endpoint
app.get('/', async (req, res) => {
  try {
    await connectMongoDB()
    res.json({
      success: true,
      message: '🏠 Welcome to HomeHive API Server',
      version: '1.0.0',
      status: 'Server running on Vercel',
      timestamp: new Date().toISOString(),
      database:
        mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ⚠️',
    })
  } catch (error) {
    console.error('Root endpoint error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
})

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.originalUrl}`,
  })
})

// Initialize MongoDB connection for Vercel
connectMongoDB().catch((error) => {
  console.error('Failed to connect to MongoDB in Vercel:', error)
})

export default app
