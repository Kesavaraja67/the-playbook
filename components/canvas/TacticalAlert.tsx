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
      bg: "from-yellow-900/50 to-orange-900/50",
      border: "border-yellow-500/50",
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: "text-yellow-400",
      glow: "rgba(251, 191, 36, 0.3)"
    },
    info: {
      bg: "from-blue-900/50 to-cyan-900/50",
      border: "border-cyan-500/50",
      icon: <Info className="w-5 h-5" />,
      iconColor: "text-cyan-400",
      glow: "rgba(0, 240, 255, 0.3)"
    },
    danger: {
      bg: "from-red-900/50 to-pink-900/50",
      border: "border-red-500/50",
      icon: <Zap className="w-5 h-5" />,
      iconColor: "text-red-400",
      glow: "rgba(255, 0, 110, 0.4)"
    },
    success: {
      bg: "from-green-900/50 to-emerald-900/50",
      border: "border-green-500/50",
      icon: <Shield className="w-5 h-5" />,
      iconColor: "text-green-400",
      glow: "rgba(34, 197, 94, 0.3)"
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
      className={`relative glass-strong rounded-lg p-4 border-2 ${config.border} bg-gradient-to-r ${config.bg}`}
      style={{
        boxShadow: `0 0 20px ${config.glow}`
      }}
    >
      {/* Priority indicator */}
      {priority === "critical" && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: [
              `0 0 0px ${config.glow}`,
              `0 0 30px ${config.glow}`,
              `0 0 0px ${config.glow}`
            ]
          }}
          transition={{
            duration: priorityPulse[priority].duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

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
            className="text-sm font-bold text-white mb-1"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {title}
          </motion.h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-slate-300 leading-relaxed"
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
            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-red-500/30 text-red-300 border border-red-500/50">
              Critical
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
