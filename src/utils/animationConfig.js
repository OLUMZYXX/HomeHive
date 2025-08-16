// Global animation configuration for consistent motion design

export const ANIMATION_CONFIG = {
  // Duration settings
  durations: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.7,
    page: 0.6,
  },

  // Easing curves
  easings: {
    // Standard Material Design easings
    standard: [0.4, 0.0, 0.2, 1],
    decelerate: [0.0, 0.0, 0.2, 1],
    accelerate: [0.4, 0.0, 1, 1],

    // Custom easings
    smooth: [0.25, 0.46, 0.45, 0.94],
    bouncy: [0.68, -0.55, 0.265, 1.55],
    elastic: [0.175, 0.885, 0.32, 1.275],

    // Expo easings
    easeOutExpo: [0.19, 1, 0.22, 1],
    easeInOutExpo: [1, 0, 0, 1],

    // Cubic easings
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
  },

  // Delay settings
  delays: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.3,
    stagger: 0.1,
  },

  // Spring configurations
  springs: {
    gentle: { stiffness: 120, damping: 14 },
    wobbly: { stiffness: 180, damping: 12 },
    stiff: { stiffness: 210, damping: 20 },
    slow: { stiffness: 280, damping: 60 },
    molasses: { stiffness: 280, damping: 120 },
  },

  // Intersection Observer settings
  scrollTriggers: {
    default: {
      threshold: 0.1,
      margin: '0px 0px -100px 0px',
    },
    immediate: {
      threshold: 0,
      margin: '0px 0px 0px 0px',
    },
    halfway: {
      threshold: 0.5,
      margin: '0px 0px -50px 0px',
    },
  },
}

// Predefined animation variants
export const VARIANTS = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.page,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.slow,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  fadeInDown: {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.slow,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  // Slide animations
  slideInLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.slow,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  slideInRight: {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.slow,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  // Scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  // Stagger animations
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: ANIMATION_CONFIG.delays.stagger,
        delayChildren: ANIMATION_CONFIG.delays.medium,
      },
    },
  },

  staggerItem: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.normal,
        ease: ANIMATION_CONFIG.easings.smooth,
      },
    },
  },

  // Hover animations
  hover: {
    scale: {
      rest: { scale: 1 },
      hover: {
        scale: 1.05,
        transition: {
          duration: ANIMATION_CONFIG.durations.fast,
          ease: ANIMATION_CONFIG.easings.smooth,
        },
      },
    },
    lift: {
      rest: { y: 0 },
      hover: {
        y: -8,
        transition: {
          duration: ANIMATION_CONFIG.durations.normal,
          ease: ANIMATION_CONFIG.easings.smooth,
        },
      },
    },
    glow: {
      rest: { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' },
      hover: {
        boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.1)',
        transition: {
          duration: ANIMATION_CONFIG.durations.normal,
          ease: ANIMATION_CONFIG.easings.smooth,
        },
      },
    },
  },

  // Modal animations
  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: ANIMATION_CONFIG.durations.normal,
          ease: ANIMATION_CONFIG.easings.smooth,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
          duration: ANIMATION_CONFIG.durations.fast,
          ease: ANIMATION_CONFIG.easings.smooth,
        },
      },
    },
  },
}

// Utility functions for animations
export const createDelayedVariant = (baseVariant, delay) => ({
  ...baseVariant,
  visible: {
    ...baseVariant.visible,
    transition: {
      ...baseVariant.visible.transition,
      delay,
    },
  },
})

export const createStaggerVariant = (
  children,
  staggerDelay = ANIMATION_CONFIG.delays.stagger
) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: ANIMATION_CONFIG.delays.medium,
    },
  },
})
