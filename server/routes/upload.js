import express from 'express'
import multer from 'multer'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { HostStorageService } from '../storageService/storageService.js'

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 20, // Max 20 files
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  },
})

const hostStorageService = new HostStorageService()

// Upload multiple images for property
router.post(
  '/property-images',
  authenticateToken,
  upload.array('images', 20),
  async (req, res) => {
    try {
      console.log('📸 Upload endpoint hit!')
      console.log('👤 User:', req.user?.userId || 'No user')
      console.log('📁 Files received:', req.files?.length || 0)
      console.log('📋 Body:', req.body)

      if (!req.files || req.files.length === 0) {
        console.log('❌ No images provided in request')
        return res.status(400).json({
          success: false,
          message: 'No images provided',
        })
      }

      const hostId = req.user.userId
      const propertyId = req.body.propertyId || 'temp_' + Date.now()

      console.log(
        `📸 Uploading ${req.files.length} images for property ${propertyId} and host ${hostId}`
      )

      // Convert multer files to the format expected by storage service
      const files = req.files.map((file) => ({
        buffer: file.buffer,
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }))

      const uploadResults = await hostStorageService.uploadPropertyImages(
        hostId,
        propertyId,
        files
      )

      console.log('🔄 Upload results:', uploadResults)

      const successfulUploads = uploadResults.filter((result) => result.success)
      const failedUploads = uploadResults.filter((result) => !result.success)

      console.log('✅ Successful uploads:', successfulUploads.length)
      console.log('❌ Failed uploads:', failedUploads.length)

      if (successfulUploads.length === 0) {
        console.log('💥 All uploads failed:', failedUploads)
        return res.status(500).json({
          success: false,
          message: 'All image uploads failed',
          errors: failedUploads.map((f) => f.error),
        })
      }

      const imageUrls = successfulUploads.map((result) => result.downloadURL)
      console.log('🎯 Final image URLs:', imageUrls)

      console.log(`✅ Successfully uploaded ${imageUrls.length} images`)

      res.json({
        success: true,
        message: `Successfully uploaded ${imageUrls.length} images`,
        images: imageUrls,
        failed: failedUploads.length,
      })
    } catch (error) {
      console.error('Error uploading property images:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: error.message,
      })
    }
  }
)

// Upload single image
router.post(
  '/single-image',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image provided',
        })
      }

      const hostId = req.user.userId
      const imageType = req.body.type || 'general'
      const fileName = `${imageType}_${Date.now()}.${req.file.originalname
        .split('.')
        .pop()}`

      const result = await hostStorageService.uploadFile(
        req.file,
        `${hostId}/${imageType}/${fileName}`
      )

      if (result.success) {
        res.json({
          success: true,
          imageUrl: result.downloadURL,
          message: 'Image uploaded successfully',
        })
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: result.error,
        })
      }
    } catch (error) {
      console.error('Error uploading single image:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message,
      })
    }
  }
)

// Delete image
router.delete('/delete-image', authenticateToken, async (req, res) => {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required',
      })
    }

    // Extract file path from URL (this depends on your Firebase storage structure)
    const filePath = imageUrl.split('/').pop().split('?')[0]

    const result = await hostStorageService.deleteFile(filePath)

    if (result.success) {
      res.json({
        success: true,
        message: 'Image deleted successfully',
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: result.error,
      })
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    })
  }
})

export default router
