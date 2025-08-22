// File moved to storageService/storageService.js
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage'
import { userStorage, hostStorage } from '../config/firebaseConfig.js'

// Storage service for file uploads
export class StorageService {
  constructor(storageInstance, basePath = '') {
    this.storage = storageInstance
    this.basePath = basePath
  }

  // Upload a single file
  async uploadFile(file, path, metadata = {}) {
    try {
      const fullPath = this.basePath ? `${this.basePath}/${path}` : path
      const storageRef = ref(this.storage, fullPath)

      // Handle both File objects and buffer objects from multer
      const fileData = file.buffer || file
      const uploadResult = await uploadBytes(storageRef, fileData, metadata)
      const downloadURL = await getDownloadURL(uploadResult.ref)

      return {
        success: true,
        downloadURL,
        fullPath,
        metadata: uploadResult.metadata,
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, pathPrefix) {
    try {
      const uploadPromises = files.map((file, index) => {
        const fileName = `${pathPrefix}_${index + 1}_${Date.now()}.${file.name
          .split('.')
          .pop()}`
        return this.uploadFile(file, fileName)
      })

      const results = await Promise.all(uploadPromises)
      return results
    } catch (error) {
      console.error('Error uploading multiple files:', error)
      throw error
    }
  }

  // Delete a file
  async deleteFile(filePath) {
    try {
      const storageRef = ref(this.storage, filePath)
      await deleteObject(storageRef)
      return { success: true }
    } catch (error) {
      console.error('Error deleting file:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // List all files in a directory
  async listFiles(path = '') {
    try {
      const fullPath = this.basePath ? `${this.basePath}/${path}` : path
      const storageRef = ref(this.storage, fullPath)
      const result = await listAll(storageRef)

      const filePromises = result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef)
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          downloadURL,
        }
      })

      const files = await Promise.all(filePromises)
      return files
    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  }

  // Get download URL for a file
  async getDownloadURL(filePath) {
    try {
      const storageRef = ref(this.storage, filePath)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Error getting download URL:', error)
      throw error
    }
  }
}

// Specialized storage services
export class UserStorageService extends StorageService {
  constructor() {
    super(userStorage, 'users')
  }

  // Upload user profile picture
  async uploadProfilePicture(userId, file) {
    const path = `${userId}/profile/avatar.${file.name.split('.').pop()}`
    return await this.uploadFile(file, path)
  }

  // Upload user documents
  async uploadDocument(userId, file, documentType) {
    const timestamp = Date.now()
    const path = `${userId}/documents/${documentType}_${timestamp}.${file.name
      .split('.')
      .pop()}`
    return await this.uploadFile(file, path)
  }
}

export class HostStorageService extends StorageService {
  constructor() {
    super(hostStorage, 'hosts')
  }

  // Upload host profile picture
  async uploadProfilePicture(hostId, file) {
    const path = `${hostId}/profile/avatar.${file.name.split('.').pop()}`
    return await this.uploadFile(file, path)
  }

  // Upload property images
  async uploadPropertyImages(hostId, propertyId, files) {
    const pathPrefix = `${hostId}/properties/${propertyId}/image`
    return await this.uploadMultipleFiles(files, pathPrefix)
  }

  // Upload property documents
  async uploadPropertyDocument(hostId, propertyId, file, documentType) {
    const timestamp = Date.now()
    const path = `${hostId}/properties/${propertyId}/documents/${documentType}_${timestamp}.${file.name
      .split('.')
      .pop()}`
    return await this.uploadFile(file, path)
  }

  // Upload verification documents
  async uploadVerificationDocument(hostId, file, documentType) {
    const timestamp = Date.now()
    const path = `${hostId}/verification/${documentType}_${timestamp}.${file.name
      .split('.')
      .pop()}`
    return await this.uploadFile(file, path)
  }

  // Delete property images
  async deletePropertyImages(hostId, propertyId) {
    try {
      const imagesPath = `${hostId}/properties/${propertyId}`
      const files = await this.listFiles(imagesPath)

      const deletePromises = files.map((file) => this.deleteFile(file.fullPath))
      await Promise.all(deletePromises)

      return { success: true }
    } catch (error) {
      console.error('Error deleting property images:', error)
      return { success: false, error: error.message }
    }
  }
}

// Export service instances
export const userStorageService = new UserStorageService()
export const hostStorageService = new HostStorageService()
