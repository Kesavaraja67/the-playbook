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
      bgColor: "bg-red-900/30",
      borderColor: "border-red-500/50",
      iconColor: "text-red-400",
      textColor: "text-red-100",
    },
    tip: {
      icon: Lightbulb,
      bgColor: "bg-yellow-900/30",
      borderColor: "border-yellow-500/50",
      iconColor: "text-yellow-400",
      textColor: "text-yellow-100",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-500/50",
      iconColor: "text-blue-400",
      textColor: "text-blue-100",
    },
  }

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-4`}
        >
          <div className="flex items-start gap-3">
            <Icon className={`${iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
            <p className={`${textColor} text-sm leading-relaxed`}>
              {advice}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
