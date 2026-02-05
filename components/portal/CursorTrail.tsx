"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TrailPoint {
  id: number
  x: number
  y: number
}

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const idCounterRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newId = idCounterRef.current++
      
      setTrail((prev) => {
        const newTrail = [
          ...prev.slice(-10), // Keep only last 10 points
          { id: newId, x: e.clientX, y: e.clientY },
        ]
        return newTrail
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {trail.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-2 h-2 rounded-full bg-[var(--accent-primary)]"
            style={{ left: point.x, top: point.y }}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
