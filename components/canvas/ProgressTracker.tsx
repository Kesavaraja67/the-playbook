"use client"

import { motion } from "framer-motion"
import { Check, Lock, Circle } from "lucide-react"

interface Milestone {
  id: string
  title: string
  status: "completed" | "active" | "locked"
  progress?: number // 0-100 for active milestones
}

interface ProgressTrackerProps {
  milestones: Milestone[]
  title?: string
}

/**
 * ProgressTracker - GENERATIVE CANVAS COMPONENT
 * 
 * Visual mission progress with:
 * - Milestone indicators
 * - Progress bar with segments
 * - Completed/active/locked states
 * - Animated transitions
 * - Timeline visualization
 */
export function ProgressTracker({ milestones, title = "Mission Progress" }: ProgressTrackerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-lg p-6"
    >
      <h3
        className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-6"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        {title}
      </h3>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            index={index}
            isLast={index === milestones.length - 1}
          />
        ))}
      </div>
    </motion.div>
  )
}

function MilestoneItem({
  milestone,
  index,
  isLast
}: {
  milestone: Milestone
  index: number
  isLast: boolean
}) {
  const { title, status, progress = 0 } = milestone

  const statusConfig = {
    completed: {
      icon: <Check className="w-4 h-4" />,
      iconBg: "bg-green-500",
      iconColor: "text-white",
      lineColor: "bg-green-500",
      textColor: "text-slate-300",
      glow: "rgba(34, 197, 94, 0.5)"
    },
    active: {
      icon: <Circle className="w-4 h-4" />,
      iconBg: "bg-cyan-500",
      iconColor: "text-white",
      lineColor: "bg-cyan-500/30",
      textColor: "text-white",
      glow: "rgba(0, 240, 255, 0.5)"
    },
    locked: {
      icon: <Lock className="w-3 h-3" />,
      iconBg: "bg-slate-700",
      iconColor: "text-slate-500",
      lineColor: "bg-slate-700",
      textColor: "text-slate-500",
      glow: "rgba(100, 116, 139, 0.2)"
    }
  }

  const config = statusConfig[status]

  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            className={`w-8 h-8 rounded-full ${config.iconBg} ${config.iconColor} flex items-center justify-center relative z-10`}
            style={{
              boxShadow: status === "active" ? `0 0 20px ${config.glow}` : "none"
            }}
          >
            {status === "active" && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: config.iconBg }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            )}
            {config.icon}
          </motion.div>

          {/* Connecting line */}
          {!isLast && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
              className={`absolute left-1/2 top-8 w-0.5 h-8 -translate-x-1/2 ${config.lineColor}`}
              style={{ originY: 0 }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          <motion.h4
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.1 }}
            className={`text-sm font-semibold ${config.textColor} mb-2`}
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {title}
          </motion.h4>

          {/* Progress bar for active milestone */}
          {status === "active" && progress !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="space-y-1"
            >
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  style={{
                    boxShadow: "0 0 10px rgba(0, 240, 255, 0.5)"
                  }}
                />
              </div>
              <span className="text-xs text-slate-400">{progress}% Complete</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
