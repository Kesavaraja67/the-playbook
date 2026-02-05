"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { generateParticles, type Particle } from "@/lib/animations/particles"

interface ParticleSystemProps {
  isActive: boolean
}

export function ParticleSystem({ isActive }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate 60 particles on mount
    setParticles(generateParticles(60))
  }, [])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            left: "50%",
            top: "50%",
            opacity: particle.opacity,
          }}
          animate={{
            x: [
              Math.cos(particle.angle) * particle.radius,
              Math.cos(particle.angle + Math.PI * 2) * particle.radius,
            ],
            y: [
              Math.sin(particle.angle) * particle.radius,
              Math.sin(particle.angle + Math.PI * 2) * particle.radius,
            ],
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
