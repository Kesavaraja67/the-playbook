"use client"

import { motion } from "framer-motion"
import { useState } from "react"

/**
 * ParticleField - VISUAL POLISH COMPONENT
 * 
 * Animated particle field for background ambiance:
 * - Floating particles with random positions
 * - Smooth animations
 * - Customizable colors and density
 */
export function ParticleField({
  count = 50,
  color = "rgba(0, 240, 255, 0.3)"
}: {
  count?: number
  color?: string
}) {
  // Generate particle positions once using useState initializer
  const [particles] = useState(() => 
    [...Array(count)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: color,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}
