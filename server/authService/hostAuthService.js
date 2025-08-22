import { Host } from '../models/mongodb-models.js'
import bcrypt from 'bcryptjs'
import JWTAuthService from '../jwtAuthService/jwtAuthService.js'

export class HostAuthService {
  // Host Registration
  static async registerHost(hostData) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        name,
        phone,
        businessName,
        businessType = 'Individual',
        businessAddress,
        businessPhone,
        provider = 'local',
        googleId,
        profilePicture,
      } = hostData

      // Check if host already exists
      const existingHost = await Host.findOne({ email }).lean()
      if (existingHost) {
        throw new Error('Host with this email already exists')
      }

      // Hash password for local hosts
      let hashedPassword = password
      if (provider === 'local') {
        const saltRounds = 12
        hashedPassword = await bcrypt.hash(password, saltRounds)
      }

      // Create new host
      const newHost = new Host({
        email,
        password: hashedPassword,
        firstName: firstName || name?.split(' ')[0] || '',
        lastName: lastName || name?.split(' ')[1] || '',
        name: name || `${firstName} ${lastName}`,
        phone,
        businessName,
        businessType,
        businessAddress,
        businessPhone,
        provider,
        googleId,
        profilePicture,
        lastLogin: new Date(),
      })

      const savedHost = await newHost.save()

      // Generate JWT tokens
      const tokens = JWTAuthService.generateTokenPair({
        id: savedHost._id.toString(),
        email: savedHost.email,
        userType: 'host',
      })

      // Return host data without password
      const { password: _, ...hostWithoutPassword } = savedHost.toObject()

      return {
        success: true,
        message: 'Host registered successfully',
        host: {
          ...hostWithoutPassword,
          hostId: savedHost._id.toString(),
          role: 'host',
        },
        tokens,
      }
    } catch (error) {
      console.error('Host registration error:', error)
      throw error
    }
  }

  // Host Login
  static async loginHost(email, password) {
    try {
      // Find host by email
      const host = await Host.findOne({ email }).lean()

      if (!host) {
        throw new Error('Host account not found with this email')
      }

      // Check if host is active
      if (!host.isActive) {
        throw new Error('Host account is deactivated')
      }

      // For OAuth hosts, handle differently
      if (host.provider === 'google' && password.includes('google_oauth')) {
        // Allow OAuth login
      } else {
        // Verify password for local hosts
        const isPasswordValid = await bcrypt.compare(password, host.password)
        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }
      }

      // Update last login
      await Host.findByIdAndUpdate(host._id, { lastLogin: new Date() })

      // Generate JWT tokens
      const tokens = JWTAuthService.generateTokenPair({
        id: host._id.toString(),
        email: host.email,
        userType: 'host',
      })

      // Return host data without password
      const { password: _, ...hostWithoutPassword } = host

      return {
        success: true,
        message: 'Host login successful',
        host: {
          ...hostWithoutPassword,
          hostId: host._id.toString(),
          role: 'host',
        },
        tokens,
      }
    } catch (error) {
      console.error('Host login error:', error)
      throw error
    }
  }

  // Host Login by email only (for OAuth)
  static async loginHostByEmail(email) {
    try {
      const host = await Host.findOne({ email }).lean()

      if (!host) {
        throw new Error('Host not found')
      }

      // Update last login
      await Host.findByIdAndUpdate(host._id, { lastLogin: new Date() })

      // Generate JWT tokens
      const tokens = JWTAuthService.generateTokenPair({
        id: host._id.toString(),
        email: host.email,
        userType: 'host',
      })

      // Return host data without password
      const { password: _, ...hostWithoutPassword } = host

      return {
        success: true,
        message: 'Host login successful',
        host: {
          ...hostWithoutPassword,
          hostId: host._id.toString(),
          role: 'host',
        },
        tokens,
      }
    } catch (error) {
      console.error('Host login by email error:', error)
      throw error
    }
  }

  // Get Host Profile
  static async getHostProfile(hostId) {
    try {
      const host = await Host.findById(hostId).select('-password').lean()

      if (!host) {
        throw new Error('Host not found')
      }

      return {
        ...host,
        hostId: host._id.toString(),
        role: 'host',
      }
    } catch (error) {
      console.error('Get host profile error:', error)
      throw error
    }
  }

  // Update Host Profile
  static async updateHostProfile(hostId, updateData) {
    try {
      const updatedHost = await Host.findByIdAndUpdate(
        hostId,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      ).select('-password')

      if (!updatedHost) {
        throw new Error('Host not found')
      }

      return {
        ...updatedHost.toObject(),
        hostId: updatedHost._id.toString(),
        role: 'host',
      }
    } catch (error) {
      console.error('Update host profile error:', error)
      throw error
    }
  }

  // Change Host Password
  static async changeHostPassword(hostId, oldPassword, newPassword) {
    try {
      const host = await Host.findById(hostId)

      if (!host) {
        throw new Error('Host not found')
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        host.password
      )
      if (!isOldPasswordValid) {
        throw new Error('Current password is incorrect')
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await Host.findByIdAndUpdate(hostId, { password: hashedNewPassword })

      return {
        success: true,
        message: 'Password changed successfully',
      }
    } catch (error) {
      console.error('Change host password error:', error)
      throw error
    }
  }

  // Google OAuth Registration/Login for Hosts
  static async googleAuthHost(googleUserData) {
    try {
      const { email, name, googleId, picture } = googleUserData

      // Check if host already exists
      let host = await Host.findOne({
        $or: [{ email }, { googleId }],
      }).lean()

      if (host) {
        // Existing host - login
        await Host.findByIdAndUpdate(host._id, { lastLogin: new Date() })

        const tokens = JWTAuthService.generateTokenPair({
          id: host._id.toString(),
          email: host.email,
          userType: 'host',
        })

        const { password: _, ...hostWithoutPassword } = host

        return {
          success: true,
          message: 'Host Google login successful',
          host: {
            ...hostWithoutPassword,
            hostId: host._id.toString(),
            role: 'host',
          },
          tokens,
          isNewHost: false,
        }
      } else {
        // New host - register
        const nameParts = name.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        const newHost = new Host({
          email,
          password: `google_oauth_${googleId}`, // Placeholder password for OAuth
          firstName,
          lastName,
          name,
          businessName: name, // Default business name to user's name
          provider: 'google',
          googleId,
          profilePicture: picture,
          lastLogin: new Date(),
        })

        const savedHost = await newHost.save()

        const tokens = JWTAuthService.generateTokenPair({
          id: savedHost._id.toString(),
          email: savedHost.email,
          userType: 'host',
        })

        const { password: _, ...hostWithoutPassword } = savedHost.toObject()

        return {
          success: true,
          message: 'Host Google registration successful',
          host: {
            ...hostWithoutPassword,
            hostId: savedHost._id.toString(),
            role: 'host',
          },
          tokens,
          isNewHost: true,
        }
      }
    } catch (error) {
      console.error('Google auth host error:', error)
      throw error
    }
  }
}

export default HostAuthService
