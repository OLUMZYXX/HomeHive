// File moved to jwtAuthService/jwtAuthService.js
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs' // No change needed

// JWT Configuration
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

export class JWTAuthService {
  // Hash password
  static async hashPassword(password) {
    try {
      const saltRounds = 12
      return await bcrypt.hash(password, saltRounds)
    } catch (error) {
      console.error('Error hashing password:', error)
      throw new Error('Password hashing failed')
    }
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
      console.error('Error verifying password:', error)
      throw new Error('Password verification failed')
    }
  }

  // Generate JWT access token
  static generateToken(payload) {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'homehive-app',
        audience: 'homehive-users',
      })
    } catch (error) {
      console.error('Error generating token:', error)
      throw new Error('Token generation failed')
    }
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'homehive-app',
        audience: 'homehive-users',
      })
    } catch (error) {
      console.error('Error generating refresh token:', error)
      throw new Error('Refresh token generation failed')
    }
  }

  // Verify JWT access token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'homehive-app',
        audience: 'homehive-users',
      })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired')
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token')
      } else {
        console.error('Error verifying token:', error)
        throw new Error('Token verification failed')
      }
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'homehive-app',
        audience: 'homehive-users',
      })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired')
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token')
      } else {
        console.error('Error verifying refresh token:', error)
        throw new Error('Refresh token verification failed')
      }
    }
  }

  // Check if token is expired
  static isTokenExpired(token) {
    try {
      this.verifyToken(token)
      return false
    } catch (error) {
      return (
        error.message.includes('expired') || error.message.includes('Invalid')
      )
    }
  }

  // Get user info from token
  static getUserFromToken(token) {
    try {
      const decoded = this.verifyToken(token)
      return {
        id: decoded.id,
        email: decoded.email,
        userType: decoded.userType,
        iat: decoded.iat,
        exp: decoded.exp,
      }
    } catch (error) {
      console.error('Error getting user from token:', error)
      return null
    }
  }

  // Generate token pair (access + refresh)
  static generateTokenPair(payload) {
    const accessToken = this.generateToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN,
    }
  }

  // Refresh access token using refresh token
  static refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken)

      // Create new payload without the refresh token specific fields
      const payload = {
        id: decoded.id,
        email: decoded.email,
        userType: decoded.userType,
      }

      return this.generateToken(payload)
    } catch (error) {
      throw new Error('Failed to refresh access token: ' + error.message)
    }
  }
}

export default JWTAuthService
