/**
 * Utility functions for text manipulation
 */

/**
 * Truncates text to specified length and adds ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of text
 * @param {string} suffix - Suffix to add when text is truncated (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150, suffix = '...') => {
  if (!text || typeof text !== 'string') {
    return ''
  }

  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength).trim() + suffix
}

/**
 * Validates text length and provides feedback
 * @param {string} text - The text to validate
 * @param {number} minLength - Minimum required length
 * @param {number} maxLength - Maximum allowed length
 * @returns {object} Validation result with status and message
 */
export const validateTextLength = (text, minLength = 0, maxLength = 500) => {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      status: 'error',
      message: 'Text is required',
      remainingChars: maxLength,
    }
  }

  const length = text.length

  if (length < minLength) {
    return {
      isValid: false,
      status: 'error',
      message: `Text must be at least ${minLength} characters long`,
      remainingChars: maxLength - length,
    }
  }

  if (length > maxLength) {
    return {
      isValid: false,
      status: 'error',
      message: `Text must not exceed ${maxLength} characters`,
      remainingChars: 0,
    }
  }

  // Warning when approaching limit
  const warningThreshold = maxLength * 0.9 // 90% of max length
  if (length > warningThreshold) {
    return {
      isValid: true,
      status: 'warning',
      message: `${maxLength - length} characters remaining`,
      remainingChars: maxLength - length,
    }
  }

  return {
    isValid: true,
    status: 'success',
    message: 'Text length is valid',
    remainingChars: maxLength - length,
  }
}

/**
 * Gets appropriate CSS classes based on text validation status
 * @param {string} status - Validation status ('success', 'warning', 'error')
 * @param {string} baseClass - Base CSS class for the input
 * @returns {string} Complete CSS class string
 */
export const getTextValidationClasses = (
  status,
  baseClass = 'border-primary-200 focus:border-primary-500'
) => {
  const statusClasses = {
    success: 'border-primary-200 focus:border-primary-500',
    warning: 'border-amber-400 focus:border-amber-500',
    error: 'border-red-400 focus:border-red-500',
  }

  return statusClasses[status] || baseClass
}

/**
 * Gets appropriate text color classes based on validation status
 * @param {string} status - Validation status ('success', 'warning', 'error')
 * @returns {string} CSS class string for text color
 */
export const getTextValidationTextClasses = (status) => {
  const statusClasses = {
    success: 'text-primary-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  }

  return statusClasses[status] || 'text-primary-600'
}
