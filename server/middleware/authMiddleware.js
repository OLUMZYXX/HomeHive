import JWTAuthService from '../jwtAuthService/jwtAuthService.js'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    })
  }

  try {
    const user = JWTAuthService.extractUserFromToken(token)
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
      })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const user = JWTAuthService.extractUserFromToken(token)
      req.user = user
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }
  next()
}
