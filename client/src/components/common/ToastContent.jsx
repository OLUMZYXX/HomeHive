import PropTypes from 'prop-types'

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

ToastContent.propTypes = {
  icon: PropTypes.elementType.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
}

export default ToastContent
