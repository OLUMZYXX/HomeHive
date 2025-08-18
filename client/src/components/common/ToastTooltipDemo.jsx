import { useState } from 'react'
import { toast } from '../../utils/toastUtils'
import Tooltip, {
  ButtonTooltip,
  InfoTooltip,
  SuccessTooltip,
  ErrorTooltip,
  WarningTooltip,
  FieldTooltip,
} from '../components/common/Tooltip'
import {
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa'

const ToastTooltipDemo = () => {
  const [inputValue, setInputValue] = useState('')

  const handleSuccessToast = () => {
    toast.success('Your listing has been published successfully!', 'Success')
  }

  const handleErrorToast = () => {
    toast.error('Failed to upload images. Please try again.', 'Upload Error')
  }

  const handleWarningToast = () => {
    toast.warning(
      'Your listing is missing some required information.',
      'Incomplete Listing'
    )
  }

  const handleInfoToast = () => {
    toast.info(
      'Your listing is under review and will be published soon.',
      'Review in Progress'
    )
  }

  const handlePromiseToast = () => {
    const uploadPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5
          ? resolve('Upload successful!')
          : reject('Upload failed!')
      }, 3000)
    })

    toast.promise(uploadPromise, {
      pending: 'Uploading your images...',
      success: 'Images uploaded successfully! 🎉',
      error: 'Failed to upload images. Please try again.',
    })
  }

  return (
    <div className='max-w-4xl mx-auto p-8 space-y-8'>
      <h1 className='text-3xl font-bold text-primary-800 mb-8'>
        Enhanced Toast & Tooltip System Demo
      </h1>

      {/* Toast Demo Section */}
      <section className='bg-white p-6 rounded-xl shadow-soft border border-primary-200'>
        <h2 className='text-2xl font-semibold text-primary-800 mb-6'>
          Enhanced Toast Notifications
        </h2>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <ButtonTooltip content='Show a success notification'>
            <button
              onClick={handleSuccessToast}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors'
            >
              Success Toast
            </button>
          </ButtonTooltip>

          <ButtonTooltip content='Show an error notification'>
            <button
              onClick={handleErrorToast}
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors'
            >
              Error Toast
            </button>
          </ButtonTooltip>

          <ButtonTooltip content='Show a warning notification'>
            <button
              onClick={handleWarningToast}
              className='bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg font-medium transition-colors'
            >
              Warning Toast
            </button>
          </ButtonTooltip>

          <ButtonTooltip content='Show an info notification'>
            <button
              onClick={handleInfoToast}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors'
            >
              Info Toast
            </button>
          </ButtonTooltip>
        </div>

        <ButtonTooltip content='Demonstrate a promise-based toast with loading state'>
          <button
            onClick={handlePromiseToast}
            className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
          >
            Promise Toast (Loading Demo)
          </button>
        </ButtonTooltip>
      </section>

      {/* Tooltip Demo Section */}
      <section className='bg-white p-6 rounded-xl shadow-soft border border-primary-200'>
        <h2 className='text-2xl font-semibold text-primary-800 mb-6'>
          Enhanced Tooltip System
        </h2>

        <div className='space-y-6'>
          {/* Basic Tooltips */}
          <div>
            <h3 className='text-lg font-semibold text-primary-700 mb-4'>
              Basic Tooltips
            </h3>
            <div className='flex flex-wrap gap-4'>
              <Tooltip content='This is a default tooltip' placement='top'>
                <button className='bg-primary-600 text-white px-4 py-2 rounded-lg'>
                  Default Tooltip
                </button>
              </Tooltip>

              <Tooltip
                content='Dark theme tooltip'
                variant='dark'
                placement='right'
              >
                <button className='bg-gray-600 text-white px-4 py-2 rounded-lg'>
                  Dark Tooltip
                </button>
              </Tooltip>

              <Tooltip
                content='Light theme tooltip'
                variant='light'
                placement='bottom'
              >
                <button className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg'>
                  Light Tooltip
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Variant Tooltips */}
          <div>
            <h3 className='text-lg font-semibold text-primary-700 mb-4'>
              Variant Tooltips
            </h3>
            <div className='flex flex-wrap gap-4'>
              <SuccessTooltip content='Operation completed successfully!'>
                <span className='inline-flex items-center gap-2 text-green-600 cursor-help'>
                  <FaCheckCircle /> Success State
                </span>
              </SuccessTooltip>

              <ErrorTooltip content='Something went wrong. Please try again.'>
                <span className='inline-flex items-center gap-2 text-red-600 cursor-help'>
                  <FaExclamationTriangle /> Error State
                </span>
              </ErrorTooltip>

              <WarningTooltip content='Please review your input before proceeding.'>
                <span className='inline-flex items-center gap-2 text-amber-600 cursor-help'>
                  <FaExclamationTriangle /> Warning State
                </span>
              </WarningTooltip>

              <InfoTooltip content='Additional information about this feature.'>
                <span className='inline-flex items-center gap-2 text-blue-600 cursor-help'>
                  <FaInfoCircle /> Info State
                </span>
              </InfoTooltip>
            </div>
          </div>

          {/* Form Field Tooltips */}
          <div>
            <h3 className='text-lg font-semibold text-primary-700 mb-4'>
              Form Field Tooltips
            </h3>
            <div className='max-w-md'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Property Title
                <FieldTooltip content='Enter a catchy and descriptive title for your property. This will be the first thing guests see.'>
                  <span className='text-blue-500 ml-2 cursor-help'>?</span>
                </FieldTooltip>
              </label>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                placeholder='e.g., Luxury Beachfront Villa with Ocean Views'
              />
            </div>
          </div>

          {/* Interactive Elements */}
          <div>
            <h3 className='text-lg font-semibold text-primary-700 mb-4'>
              Interactive Elements
            </h3>
            <div className='flex flex-wrap gap-4'>
              <ButtonTooltip content='Click to save your changes' delay={500}>
                <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors'>
                  Save Changes
                </button>
              </ButtonTooltip>

              <ButtonTooltip
                content='This action cannot be undone'
                variant='error'
                placement='left'
              >
                <button className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'>
                  Delete Item
                </button>
              </ButtonTooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          Usage Examples
        </h2>
        <div className='space-y-4 text-sm'>
          <div>
            <h4 className='font-semibold text-gray-700'>Toast Usage:</h4>
            <pre className='bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto'>
              {`import { toast } from '../utils/toast'

// Basic usage
toast.success('Operation successful!', 'Success')
toast.error('Something went wrong', 'Error')
toast.warning('Please check your input', 'Warning')
toast.info('Information message', 'Info')

// Promise-based toast
toast.promise(apiCall(), {
  pending: 'Processing...',
  success: 'Done! 🎉',
  error: 'Failed to process'
})`}
            </pre>
          </div>
          <div>
            <h4 className='font-semibold text-gray-700'>Tooltip Usage:</h4>
            <pre className='bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto'>
              {`import { ButtonTooltip, InfoTooltip } from '../components/common/Tooltip'

// Basic tooltip
<ButtonTooltip content="Click to perform action">
  <button>Action Button</button>
</ButtonTooltip>

// Info tooltip with variants
<InfoTooltip content="Helpful information" variant="info">
  <span>Hover me</span>
</InfoTooltip>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ToastTooltipDemo
