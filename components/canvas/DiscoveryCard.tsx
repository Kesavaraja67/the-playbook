"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useState } from "react"

interface DiscoveryCardProps {
  item: string
  quantity?: number
  rarity?: "common" | "rare" | "epic" | "legendary"
  animation?: "sparkle" | "glow" | "pulse"
  icon?: string
}

/**
 * DiscoveryCard - GENERATIVE CANVAS COMPONENT
 * 
 * Animated card showing discovered items/achievements:
 * - Item reveal animation
 * - Rarity indicators with color coding
 * - Sparkle/glow effects
 * - Quantity display
 * - Slide-in entrance
 */
export function DiscoveryCard({
  item,
  quantity = 1,
  rarity = "common",
  animation = "sparkle",
  icon
}: DiscoveryCardProps) {
  const rarityColors = {
    common: {
      border: "border-medium",
      text: "text-secondary"
    },
    rare: {
      border: "border-accent-info",
      text: "text-accent-info"
    },
    epic: {
      border: "border-accent-tambo",
      text: "text-accent-tambo"
    },
    legendary: {
      border: "border-accent-warning",
      text: "text-accent-warning"
    }
  }

  const colors = rarityColors[rarity]

  // Generate sparkle positions once using useState initializer (runs only on mount)
  const [sparklePositions] = useState(() => 
    [...Array(8)].map(() => ({
      x: 50 + (Math.random() - 0.5) * 100,
      y: 50 + (Math.random() - 0.5) * 100
    }))
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={`relative bg-primary shadow-sm rounded-lg p-6 border-2 ${colors.border}`}
      >
        {/* Sparkle effect */}
        {animation === "sparkle" && (
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            {sparklePositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  opacity: 0,
                  x: "50%",
                  y: "50%"
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: `${pos.x}%`,
                  y: `${pos.y}%`,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Sparkles className="w-4 h-4 text-accent-primary" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}
          >
            {rarity} Discovery
          </motion.span>
          {quantity > 1 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-xs font-bold bg-secondary px-2 py-1 rounded-full text-primary border-2 border-medium"
            >
              ×{quantity}
            </motion.span>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <div className="text-6xl">{icon}</div>
          </motion.div>
        )}

        {/* Item Name */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-primary text-center mb-2"
        >
          {item}
        </motion.h3>
      </motion.div>
    </AnimatePresence>
  )
}
