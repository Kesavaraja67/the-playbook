/**
 * Particle physics calculations for orbital motion
 */

export interface Particle {
  id: number
  angle: number
  radius: number
  speed: number
  size: number
  color: string
  opacity: number
}

/**
 * Generate particles with randomized properties
 */
export function generateParticles(count: number): Particle[] {
  const colors = ["#00d9ff", "#a855f7", "#ec4899", "#ffffff"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / count,
    radius: 120 + Math.random() * 80,
    speed: 3 + Math.random() * 5,
    size: 2 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.6 + Math.random() * 0.4,
  }))
}

/**
 * Calculate particle position based on angle and radius
 */
export function calculateParticlePosition(
  angle: number,
  radius: number
): { x: number; y: number } {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

/**
 * Update particle angle based on speed and delta time
 */
export function updateParticleAngle(
  currentAngle: number,
  speed: number,
  deltaTime: number = 1
): number {
  return (currentAngle + (Math.PI * 2 * deltaTime) / speed) % (Math.PI * 2)
}
