import { useInView } from 'framer-motion'
import { useRef } from 'react'

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    margin = '0px 0px -100px 0px',
  } = options

  const ref = useRef(null)
  const isInView = useInView(ref, {
    threshold,
    once: triggerOnce,
    margin,
  })

  return { ref, isInView }
}

// Custom hook for stagger animations
export const useStaggerAnimation = (itemsLength, options = {}) => {
  const { staggerDelay = 0.1, initialDelay = 0.2, threshold = 0.1 } = options

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, {
    threshold,
    once: true,
    margin: '0px 0px -50px 0px',
  })

  const getItemDelay = (index) => {
    return initialDelay + index * staggerDelay
  }

  return { containerRef, isInView, getItemDelay }
}

// Animation variants for common use cases
export const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export const slideInVariants = {
  left: {
    hidden: { opacity: 0, x: -100 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  },
  right: {
    hidden: { opacity: 0, x: 100 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  },
}

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Hover animation variants
export const hoverVariants = {
  scale: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  lift: {
    rest: { y: 0 },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
}
