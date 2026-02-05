"use client"

import { motion } from "framer-motion"

interface Shape {
  type: "hexagon" | "triangle"
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

const shapes: Shape[] = [
  { type: "hexagon", x: 10, y: 20, size: 100, duration: 40, delay: 0 },
  { type: "triangle", x: 80, y: 15, size: 80, duration: 35, delay: 5 },
  { type: "hexagon", x: 20, y: 70, size: 120, duration: 50, delay: 10 },
  { type: "triangle", x: 85, y: 80, size: 90, duration: 45, delay: 15 },
  { type: "hexagon", x: 50, y: 10, size: 60, duration: 30, delay: 8 },
  { type: "triangle", x: 15, y: 50, size: 70, duration: 38, delay: 12 },
]

export function AmbientShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-light"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            clipPath: shape.type === "hexagon" 
              ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
              : "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{
            x: [0, -100, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  )
}
