// Simple test version for debugging
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const response = {
      success: true,
      message: '🏠 Welcome to HomeHive API Server - Simple Version',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      path: req.url.split('?')[0],
      environment: process.env.NODE_ENV || 'production',
      mongoUri: process.env.MONGODB_URI ? 'Set ✅' : 'Missing ❌'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error in handler:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}
