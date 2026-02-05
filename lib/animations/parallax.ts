/**
 * Mouse parallax effect utilities
 */

/**
 * Calculate parallax offset based on mouse position
 */
export function calculateParallaxOffset(
  mouseX: number,
  mouseY: number,
  windowWidth: number,
  windowHeight: number,
  strength: number = 20
): { x: number; y: number } {
  const x = (mouseX / windowWidth - 0.5) * strength
  const y = (mouseY / windowHeight - 0.5) * strength
  
  return { x, y }
}

/**
 * Calculate distance from center
 */
export function distanceFromCenter(
  x: number,
  y: number,
  centerX: number,
  centerY: number
): number {
  return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
}

/**
 * Calculate magnetic pull effect
 * Returns offset towards target point based on distance
 */
export function calculateMagneticPull(
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number,
  maxDistance: number = 300,
  maxPull: number = 10
): { x: number; y: number } {
  const distance = distanceFromCenter(currentX, currentY, targetX, targetY)
  
  if (distance > maxDistance) {
    return { x: 0, y: 0 }
  }
  
  const pullStrength = (1 - distance / maxDistance) * maxPull
  const angle = Math.atan2(targetY - currentY, targetX - currentX)
  
  return {
    x: Math.cos(angle) * pullStrength,
    y: Math.sin(angle) * pullStrength,
  }
}
