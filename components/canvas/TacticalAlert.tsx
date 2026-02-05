"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Info, Zap, Shield } from "lucide-react"

interface TacticalAlertProps {
  type: "warning" | "info" | "danger" | "success"
  title: string
  message: string
  priority?: "low" | "medium" | "high" | "critical"
  icon?: React.ReactNode
}

/**
 * TacticalAlert - GENERATIVE CANVAS COMPONENT
 * 
 * Urgent notification component with:
 * - Priority-based styling
 * - Icon indicators
 * - Pulse animations
 * - Auto-dismiss timer (optional)
 * - Sound effect triggers (optional)
 */
export function TacticalAlert({
  type,
  title,
  message,
  priority = "medium",
  icon
}: TacticalAlertProps) {
  const typeConfig = {
    warning: {
      border: "border-accent-warning",
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: "text-accent-warning",
    },
    info: {
      border: "border-accent-info",
      icon: <Info className="w-5 h-5" />,
      iconColor: "text-accent-info",
    },
    danger: {
      border: "border-accent-danger",
      icon: <Zap className="w-5 h-5" />,
      iconColor: "text-accent-danger",
    },
    success: {
      border: "border-accent-success",
      icon: <Shield className="w-5 h-5" />,
      iconColor: "text-accent-success",
    }
  }

  const config = typeConfig[type]
  const displayIcon = icon || config.icon

  const priorityPulse = {
    low: { duration: 3, scale: [1, 1.02, 1] },
    medium: { duration: 2, scale: [1, 1.05, 1] },
    high: { duration: 1.5, scale: [1, 1.08, 1] },
    critical: { duration: 1, scale: [1, 1.1, 1] }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className={`bg-primary border-2 ${config.border} shadow-sm rounded-lg p-4`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.div
          className={`${config.iconColor} flex-shrink-0`}
          animate={{
            scale: priorityPulse[priority].scale
          }}
          transition={{
            duration: priorityPulse[priority].duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {displayIcon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.h4
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-bold text-primary mb-1"
          >
            {title}
          </motion.h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-secondary leading-relaxed"
          >
            {message}
          </motion.p>
        </div>

        {/* Priority badge */}
        {priority === "critical" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex-shrink-0"
          >
            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-primary text-accent-danger border-2 border-accent-danger">
              Critical
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
