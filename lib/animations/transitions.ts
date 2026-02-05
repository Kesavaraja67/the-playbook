/**
 * Page transition animation utilities
 */

export const transitionTimings = {
  portal: {
    buttonPulse: 0.2,
    particleBurst: 0.3,
    whiteFlash: 0.2,
    expansion: 0.4,
    total: 1.2,
  },
  page: {
    fadeIn: 0.5,
    slideIn: 0.6,
  },
}

export const easings = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
}

/**
 * Create a staggered animation delay
 */
export function staggerDelay(index: number, baseDelay: number = 0.1): number {
  return index * baseDelay
}

/**
 * Portal activation sequence timing
 */
export function getPortalSequenceTiming() {
  return {
    buttonPulse: { duration: transitionTimings.portal.buttonPulse },
    particleBurst: { 
      delay: transitionTimings.portal.buttonPulse,
      duration: transitionTimings.portal.particleBurst 
    },
    whiteFlash: { 
      delay: transitionTimings.portal.buttonPulse + transitionTimings.portal.particleBurst,
      duration: transitionTimings.portal.whiteFlash 
    },
    expansion: { 
      delay: transitionTimings.portal.buttonPulse + transitionTimings.portal.particleBurst,
      duration: transitionTimings.portal.expansion 
    },
  }
}
