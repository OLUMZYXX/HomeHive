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

const app = express()

// Auto port detection function
const findAvailablePort = async (startPort = 3001) => {
  const net = await import('net')

  return new Promise((resolve, reject) => {
    const server = net.createServer()

    const tryPort = (port) => {
      server.listen(port, () => {
        server.once('close', () => resolve(port))
        server.close()
      })

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`)
          tryPort(port + 1)
        } else {
          reject(err)
        }
      })
    }

    tryPort(startPort)
  })
}

// MongoDB connection function
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri)
      throw new Error('MONGODB_URI environment variable is not defined')
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

app.use(helmet())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
})
app.use(limiter)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/featured', featuredRoutes)
app.use('/api/testimonials', testimonialsRoutes)

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

// Luxury property endpoint (mock data)
app.get('/api/featured/header-images', (req, res) => {
  res.json({
    success: true,
    message: 'Luxury properties for header',
    data: [
      {
        id: 'luxury-1',
        title: 'Luxury Penthouse Suite',
        location: 'Victoria Island, Lagos',
        price: 250000,
        currency: '₦',
        period: 'night',
        image: '/src/assets/apartment1.jpg',
        quality: 'premium',
        category: 'luxury',
      },
      {
        id: 'luxury-2',
        title: 'Executive Villa',
        location: 'Banana Island, Lagos',
        price: 300000,
        currency: '₦',
        period: 'night',
        image: '/src/assets/Apt1.webp',
        quality: 'premium',
        category: 'luxury',
      },
    ],
    note: 'This is mock data. Real data will be available when MongoDB is connected.',
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

    const preferredPort = process.env.PORT || 3001
    const availablePort = await findAvailablePort(parseInt(preferredPort))

    const server = createServer(app)

    server.listen(availablePort, () => {
      console.log('\n🚀 HomeHive Basic API Server Started!')
      console.log('━'.repeat(50))
      console.log(`🌐 Server URL: http://localhost:${availablePort}`)
      console.log(
        `🏥 Health Check: http://localhost:${availablePort}/api/health`
      )
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log('━'.repeat(50))
    })

    server.on('error', (err) => {
      console.error('❌ Server Error:', err)
      process.exit(1)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\nSIGTERM received. Shutting down gracefully...')
      server.close(() => {
        console.log('✅ Server closed')
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      console.log('\nSIGINT received. Shutting down gracefully...')
      server.close(() => {
        console.log('✅ Server closed')
        process.exit(0)
      })
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
