"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Lightbulb, Info } from "lucide-react"

interface TacticalAdviceProps {
  advice: string
  type: "warning" | "tip" | "info"
  isVisible: boolean
}

/**
 * TacticalAdvice - GENERATIVE COMPONENT
 * 
 * This component displays AI-generated contextual advice during gameplay.
 * It appears dynamically based on the current state and player actions.
 */
export function TacticalAdvice({ advice, type, isVisible }: TacticalAdviceProps) {
  const config = {
    warning: {
      icon: AlertTriangle,
      borderColor: "border-accent-danger",
      iconColor: "text-accent-danger",
    },
    tip: {
      icon: Lightbulb,
      borderColor: "border-accent-warning",
      iconColor: "text-accent-warning",
    },
    info: {
      icon: Info,
      borderColor: "border-accent-info",
      iconColor: "text-accent-info",
    },
  }

  const { icon: Icon, borderColor, iconColor } = config[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`bg-primary ${borderColor} border-2 rounded-lg p-4 mb-4 shadow-sm`}
        >
          <div className="flex items-start gap-3">
            <Icon className={`${iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
            <p className="text-primary text-sm leading-relaxed">
              {advice}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
