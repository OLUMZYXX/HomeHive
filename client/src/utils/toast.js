import { toast as reactToast } from 'react-toastify'
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from 'react-icons/fa'

// Custom toast configuration
const defaultConfig = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
  className: 'font-medium',
}

// Custom toast content with icons
const ToastContent = ({ icon: Icon, message, title }) => (
  <div className='flex items-start gap-3 p-1'>
    <div className='flex-shrink-0 mt-0.5'>
      <Icon className='text-lg' />
    </div>
    <div className='flex-1 min-w-0'>
      {title && (
        <div className='font-semibold text-sm leading-5 mb-1'>{title}</div>
      )}
      <div className='text-sm leading-5'>{message}</div>
    </div>
  </div>
)

// Enhanced toast methods
export const toast = {
  success: (message, title = null, config = {}) => {
    return reactToast.success(
      <ToastContent icon={FaCheckCircle} message={message} title={title} />,
      {
        ...defaultConfig,
        ...config,
        className: `${defaultConfig.className} !bg-gradient-to-r !from-green-50 !to-emerald-50 !text-green-800 !border-l-4 !border-green-500 !shadow-lg !rounded-xl`,
        progressClassName: '!bg-green-500',
      }
    )
  },

  error: (message, title = null, config = {}) => {
    return reactToast.error(
      <ToastContent icon={FaTimesCircle} message={message} title={title} />,
      {
        ...defaultConfig,
        autoClose: 5000, // Keep error messages longer
        ...config,
        className: `${defaultConfig.className} !bg-gradient-to-r !from-red-50 !to-rose-50 !text-red-800 !border-l-4 !border-red-500 !shadow-lg !rounded-xl`,
        progressClassName: '!bg-red-500',
      }
    )
  },

  warning: (message, title = null, config = {}) => {
    return reactToast.warning(
      <ToastContent
        icon={FaExclamationTriangle}
        message={message}
        title={title}
      />,
      {
        ...defaultConfig,
        autoClose: 4500,
        ...config,
        className: `${defaultConfig.className} !bg-gradient-to-r !from-amber-50 !to-yellow-50 !text-amber-800 !border-l-4 !border-amber-500 !shadow-lg !rounded-xl`,
        progressClassName: '!bg-amber-500',
      }
    )
  },

  info: (message, title = null, config = {}) => {
    return reactToast.info(
      <ToastContent icon={FaInfoCircle} message={message} title={title} />,
      {
        ...defaultConfig,
        ...config,
        className: `${defaultConfig.className} !bg-gradient-to-r !from-blue-50 !to-indigo-50 !text-blue-800 !border-l-4 !border-blue-500 !shadow-lg !rounded-xl`,
        progressClassName: '!bg-blue-500',
      }
    )
  },

  promise: (promise, messages, config = {}) => {
    return reactToast.promise(
      promise,
      {
        pending: {
          render: () => (
            <ToastContent
              icon={FaExclamationCircle}
              message={messages.pending || 'Processing...'}
            />
          ),
          className: `${defaultConfig.className} !bg-gradient-to-r !from-gray-50 !to-slate-50 !text-gray-800 !border-l-4 !border-gray-400 !shadow-lg !rounded-xl`,
        },
        success: {
          render: () => (
            <ToastContent
              icon={FaCheckCircle}
              message={messages.success || 'Success!'}
            />
          ),
          className: `${defaultConfig.className} !bg-gradient-to-r !from-green-50 !to-emerald-50 !text-green-800 !border-l-4 !border-green-500 !shadow-lg !rounded-xl`,
        },
        error: {
          render: () => (
            <ToastContent
              icon={FaTimesCircle}
              message={messages.error || 'Something went wrong!'}
            />
          ),
          className: `${defaultConfig.className} !bg-gradient-to-r !from-red-50 !to-rose-50 !text-red-800 !border-l-4 !border-red-500 !shadow-lg !rounded-xl`,
        },
      },
      {
        ...defaultConfig,
        ...config,
      }
    )
  },

  // Dismiss all toasts
  dismiss: () => reactToast.dismiss(),

  // Dismiss specific toast
  dismissToast: (toastId) => reactToast.dismiss(toastId),

  // Check if toast is active
  isActive: (toastId) => reactToast.isActive(toastId),
}

// Export default config for ToastContainer
export const toastConfig = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
  className: 'font-medium',
  toastClassName:
    'relative flex p-1 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer',
  bodyClassName: () => 'flex text-sm font-medium font-white block p-3',
  progressClassName: 'fancy-progress-bar',
  style: {
    fontSize: '14px',
  },
}

export default toast
