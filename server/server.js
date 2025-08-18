import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import favoriteRoutes from './routes/favorites.js'
import bookingRoutes from './routes/bookings.js'
import profileRoutes from './routes/profile.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

// Use modular routers
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/profile', profileRoutes)

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  })
})

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('API Error:', error)
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
  })
})

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 HomeHive API Server running on http://localhost:${PORT}`)
})
