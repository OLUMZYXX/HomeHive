import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import mongoose from 'mongoose'

// Import routes
import featuredRoutes from './routes/featured.js'
import testimonialsRoutes from './routes/testimonials.js'
import authRoutes from './routes/auth.js'
import propertiesRoutes from './routes/properties.js'
import bookingsRoutes from './routes/bookings.js'
import favoritesRoutes from './routes/favorites.js'
import premiumRoutes from './routes/premium.js'
import uploadRoutes from './routes/upload.js'

const app = express()

// MongoDB connection function
const connectMongoDB = async () => {
  try {
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 500, // Higher limit in development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'HomeHive API Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database:
      mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ⚠️',
    databaseState: mongoose.connection.readyState,
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏠 Welcome to HomeHive API - Basic Server',
    version: '1.0.0',
    status: 'Server running, MongoDB will be added next',
  })
})

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.originalUrl}`,
  })
})

// Start Server
const startServer = async () => {
  try {
    console.log('🔄 Starting server with MongoDB...')
    await connectMongoDB()

    const PORT = process.env.PORT || 3001
    console.log(`📡 Attempting to start server on port: ${PORT}`)

    const server = createServer(app)

    server.listen(PORT, '0.0.0.0', () => {
      console.log('\n🚀 HomeHive API Server Started!')
      console.log('━'.repeat(50))
      console.log(`🌐 Server URL: http://localhost:${PORT}`)
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log('━'.repeat(50))
    })

    server.on('error', (err) => {
      console.error('❌ Server Error:', err)
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`)
      }
      process.exit(1)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\nSIGTERM received. Shutting down gracefully...')
      server.close(() => {
        console.log('✅ Server closed')
        mongoose.connection.close()
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      console.log('\nSIGINT received. Shutting down gracefully...')
      server.close(() => {
        console.log('✅ Server closed')
        mongoose.connection.close()
        process.exit(0)
      })
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Initialize MongoDB connection for Vercel
if (process.env.VERCEL === '1') {
  // In Vercel environment, connect to MongoDB immediately
  connectMongoDB().catch((error) => {
    console.error('Failed to connect to MongoDB in Vercel:', error)
  })
}

// Export for Vercel
export default app

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  startServer()
}
