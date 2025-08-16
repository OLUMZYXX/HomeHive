import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import PropTypes from 'prop-types'

// Page Wrapper Component for consistent page transitions
export const PageWrapper = ({ children, variant = 'fadeInUp' }) => {
  const variants = {
    fadeInUp: {
      initial: { opacity: 0, y: 60 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.6, -0.05, 0.01, 0.99],
        },
      },
      exit: {
        opacity: 0,
        y: -30,
        transition: {
          duration: 0.4,
          ease: [0.6, -0.05, 0.01, 0.99],
        },
      },
    },
    slideInRight: {
      initial: { opacity: 0, x: 100 },
      animate: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.7,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      exit: {
        opacity: 0,
        x: -100,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
  }

  return (
    <motion.div
      variants={variants[variant]}
      initial='initial'
      animate='animate'
      exit='exit'
      className='min-h-screen'
    >
      {children}
    </motion.div>
  )
}

// Scroll Reveal Component
export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = '',
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    threshold,
    once: true,
    margin: '0px 0px -100px 0px',
  })

  const variants = {
    up: {
      hidden: { opacity: 0, y: 75 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
    down: {
      hidden: { opacity: 0, y: -75 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
    left: {
      hidden: { opacity: 0, x: -75 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
    right: {
      hidden: { opacity: 0, x: 75 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants[direction]}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger Container Component
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className = '',
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    threshold: 0.1,
    once: true,
    margin: '0px 0px -50px 0px',
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial='hidden'
      animate={isInView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger Item Component
export const StaggerItem = ({ children, className = '' }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// Animated Button Component
export const AnimatedButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const buttonVariants = {
    whileHover: {
      scale: disabled ? 1 : 1.05,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    whileTap: {
      scale: disabled ? 1 : 0.98,
      transition: {
        duration: 0.1,
      },
    },
  }

  return (
    <motion.button
      variants={buttonVariants}
      whileHover='whileHover'
      whileTap='whileTap'
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Animated Card Component
export const AnimatedCard = ({
  children,
  className = '',
  hoverScale = 1.02,
  hoverY = -8,
  ...props
}) => {
  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: hoverScale,
      y: hoverY,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial='rest'
      whileHover='hover'
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Floating Animation Component
export const FloatingElement = ({
  children,
  direction = 'y',
  distance = 10,
  duration = 3,
  className = '',
}) => {
  const floatingVariants = {
    y: {
      animate: {
        y: [0, -distance, 0],
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    x: {
      animate: {
        x: [0, distance, 0],
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
  }

  return (
    <motion.div
      variants={floatingVariants[direction]}
      animate='animate'
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Modal Animation Component
export const AnimatedModal = ({
  children,
  isOpen,
  onClose,
  className = '',
  backdropClassName = '',
}) => {
  const backdropVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const modalVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  if (!isOpen) return null

  return (
    <motion.div
      variants={backdropVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      onClick={onClose}
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${backdropClassName}`}
    >
      <motion.div
        variants={modalVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Loading Spinner Component
export const LoadingSpinner = ({
  size = 40,
  color = 'currentColor',
  className = '',
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        border: `3px solid transparent`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
      }}
    />
  )
}

// Pulse Animation Component
export const PulseElement = ({
  children,
  scale = 1.05,
  duration = 2,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// PropTypes
PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['fadeInUp', 'slideInRight', 'scaleIn']),
}

ScrollReveal.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right', 'scale']),
  delay: PropTypes.number,
  duration: PropTypes.number,
  threshold: PropTypes.number,
  className: PropTypes.string,
}

StaggerContainer.propTypes = {
  children: PropTypes.node.isRequired,
  staggerDelay: PropTypes.number,
  className: PropTypes.string,
}

StaggerItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hoverScale: PropTypes.number,
  hoverY: PropTypes.number,
}

FloatingElement.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['x', 'y']),
  distance: PropTypes.number,
  duration: PropTypes.number,
  className: PropTypes.string,
}

AnimatedModal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  backdropClassName: PropTypes.string,
}

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
}

PulseElement.propTypes = {
  children: PropTypes.node.isRequired,
  scale: PropTypes.number,
  duration: PropTypes.number,
  className: PropTypes.string,
}
