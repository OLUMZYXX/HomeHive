import { User } from '../models/mongodb-models.js'
import bcrypt from 'bcryptjs'
import JWTAuthService from '../jwtAuthService/jwtAuthService.js'

export class MongoAuthService {
  // User Registration
  static async registerUser(userData) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        name,
        phone,
        provider = 'local',
        googleId,
        profilePicture,
      } = userData

      // Check if user already exists
      const existingUser = await User.findOne({ email }).lean()
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash password for local users
      let hashedPassword = password
      if (provider === 'local') {
        const saltRounds = 12
        hashedPassword = await bcrypt.hash(password, saltRounds)
      }

      // Create new user
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName: firstName || name?.split(' ')[0] || '',
        lastName: lastName || name?.split(' ')[1] || '',
        name: name || `${firstName} ${lastName}`,
        phone,
        provider,
        googleId,
        profilePicture,
        lastLogin: new Date(),
        role: 'user',
      })

      const savedUser = await newUser.save()

      // Generate JWT tokens
      const tokens = JWTAuthService.generateTokenPair({
        id: savedUser._id.toString(),
        email: savedUser.email,
        userType: savedUser.role,
      })

      // Return user data without password
      const { password: _, ...userWithoutPassword } = savedUser.toObject()

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          ...userWithoutPassword,
          userId: savedUser._id.toString(),
        },
        tokens,
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Login (Regular Users Only)
  static async login(email, password) {
    try {
      // Find user (only regular users, not hosts)
      const user = await User.findOne({
        email,
        role: { $ne: 'host' }, // Exclude hosts from regular login
      }).lean()

      if (!user) {
        throw new Error('Invalid email or password')
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated')
      }

      // For OAuth users, handle differently
      if (user.provider === 'google' && password.includes('google_oauth')) {
        // Allow OAuth login
      } else {
        // Verify password for local users
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }
      }

      // Update last login
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

      // Generate JWT tokens
      const tokens = JWTAuthService.generateTokenPair({
        id: user._id.toString(),
        email: user.email,
        userType: user.role,
      })

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user

      return {
        success: true,
        message: 'Login successful',
        user: {
          ...userWithoutPassword,
          userId: user._id.toString(),
        },
        tokens,
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Login by email only (for OAuth)
  static async loginByEmail(email) {
    try {
      const user = await User.findOne({ email }).lean()

      if (!user) {
        throw new Error('User not found')
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated')
      }

      // Update last login
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

      // Generate JWT tokens
      const tokens = JWTAuthService.generateTokenPair({
        id: user._id.toString(),
        email: user.email,
        userType: user.role,
      })

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user

      return {
        success: true,
        message: 'Login successful',
        user: {
          ...userWithoutPassword,
          userId: user._id.toString(),
        },
        tokens,
      }
    } catch (error) {
      console.error('Login by email error:', error)
      throw error
    }
  }

  // Get user profile (Regular Users Only)
  static async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password').lean()

      if (!user) {
        throw new Error('User not found')
      }

      // Ensure this is not a host account
      if (user.role === 'host') {
        throw new Error('Host account should use host authentication')
      }

      return {
        ...user,
        userId: user._id.toString(),
      }
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
        .select('-password')
        .lean()

      return {
        success: true,
        message: 'Profile updated successfully',
        user: {
          ...updatedUser,
          userId: updatedUser._id.toString(),
        },
      }
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // Change password
  static async changePassword(
    userId,
    currentPassword,
    newPassword,
    isHost = false
  ) {
    try {
      const user = await User.findById(userId)

      if (!user) {
        throw new Error('User not found')
      }

      // Optionally verify role if isHost is specified
      if (isHost && user.role !== 'host') {
        throw new Error('Host account not found')
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      )
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect')
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await UserModel.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
        updatedAt: new Date(),
      })

      return {
        success: true,
        message: 'Password changed successfully',
      }
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  }

  // Reset password (placeholder for email-based reset)
  static async resetPassword(email, isHost = false) {
    try {
      const user = await User.findOne({
        email,
        ...(isHost ? { role: 'host' } : {}),
      })

      if (!user) {
        throw new Error(
          isHost ? 'Host account not found with this email' : 'User not found'
        )
      }

      // In a real implementation, you would:
      // 1. Generate a reset token
      // 2. Save it to database with expiration
      // 3. Send email with reset link

      return {
        success: true,
        message: 'Password reset instructions sent to your email',
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Logout (mainly for token invalidation)
  static async logout(isHost = false) {
    try {
      // In a real implementation, you might:
      // 1. Invalidate refresh tokens
      // 2. Add tokens to blacklist
      // 3. Log logout activity

      return {
        success: true,
        message: 'Logged out successfully',
      }
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }
}

export default MongoAuthService
