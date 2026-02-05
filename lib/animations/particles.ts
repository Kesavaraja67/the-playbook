/**
 * Particle physics calculations for orbital motion
 */

// Note: Currently unused. Kept for potential future portal/visual effects.

export interface Particle {
  id: number
  angle: number
  radius: number
  speed: number
  size: number
  color: string
}

/**
 * Generate particles with randomized properties
 */
export function generateParticles(count: number): Particle[] {
  const colors = [
    "var(--accent-primary, #0071e3)",
    "var(--accent-info, #5e5ce6)",
    "var(--accent-tambo, #ff006e)",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / count,
    radius: 120 + Math.random() * 80,
    speed: 3 + Math.random() * 5,
    size: 2 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
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
