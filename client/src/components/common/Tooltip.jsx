import { Tooltip as ReactTooltip } from 'react-tooltip'
import PropTypes from 'prop-types'
import './Tooltip.css'

// Enhanced Tooltip Component with multiple variants
const Tooltip = ({
  children,
  content,
  placement = 'top',
  variant = 'default',
  delay = 300,
  className = '',
  isClickable = false,
  maxWidth = 250,
  arrow = true,
  ...props
}) => {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          color: '#ffffff',
          border: '1px solid #059669',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)',
        }
      case 'error':
        return {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          border: '1px solid #dc2626',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)',
        }
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          border: '1px solid #d97706',
          boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.1)',
        }
      case 'info':
        return {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: '1px solid #2563eb',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
        }
      case 'dark':
        return {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          border: '1px solid #374151',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }
      case 'light':
        return {
          backgroundColor: '#ffffff',
          color: '#374151',
          border: '1px solid #d1d5db',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }
      default:
        return {
          backgroundColor: '#1e40af',
          color: '#ffffff',
          border: '1px solid #1d4ed8',
          boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.1)',
        }
    }
  }

  const tooltipStyles = {
    ...getVariantStyles(),
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: '500',
    lineHeight: '1.4',
    maxWidth: `${maxWidth}px`,
    zIndex: 9999,
    wordWrap: 'break-word',
    textAlign: 'center',
    ...props.style,
  }

  return (
    <>
      <span
        data-tooltip-id={tooltipId}
        data-tooltip-content={content}
        className={`inline-block ${className}`}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
      >
        {children}
      </span>
      <ReactTooltip
        id={tooltipId}
        place={placement}
        clickable={isClickable}
        delayShow={delay}
        style={tooltipStyles}
        noArrow={!arrow}
        className='custom-tooltip'
        {...props}
      />
    </>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  variant: PropTypes.oneOf([
    'default',
    'success',
    'error',
    'warning',
    'info',
    'dark',
    'light',
  ]),
  delay: PropTypes.number,
  className: PropTypes.string,
  isClickable: PropTypes.bool,
  maxWidth: PropTypes.number,
  arrow: PropTypes.bool,
  style: PropTypes.object,
}

// Pre-configured tooltip variants for common use cases
export const SuccessTooltip = ({ children, content, ...props }) => (
  <Tooltip variant='success' content={content} {...props}>
    {children}
  </Tooltip>
)

export const ErrorTooltip = ({ children, content, ...props }) => (
  <Tooltip variant='error' content={content} {...props}>
    {children}
  </Tooltip>
)

export const WarningTooltip = ({ children, content, ...props }) => (
  <Tooltip variant='warning' content={content} {...props}>
    {children}
  </Tooltip>
)

export const InfoTooltip = ({ children, content, ...props }) => (
  <Tooltip variant='info' content={content} {...props}>
    {children}
  </Tooltip>
)

// Quick tooltip for buttons
export const ButtonTooltip = ({ children, content, ...props }) => (
  <Tooltip
    variant='dark'
    content={content}
    delay={200}
    placement='top'
    {...props}
  >
    {children}
  </Tooltip>
)

// Form field tooltip
export const FieldTooltip = ({ children, content, ...props }) => (
  <Tooltip
    variant='info'
    content={content}
    placement='right'
    delay={400}
    {...props}
  >
    {children}
  </Tooltip>
)

SuccessTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

ErrorTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

WarningTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

InfoTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

ButtonTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

FieldTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

export default Tooltip
