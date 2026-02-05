"use client"

import { motion } from "framer-motion"

interface Resource {
  name: string
  value: number // 0-100
  color: string
  icon?: string
}

interface ResourceMeterProps {
  resources: Resource[]
}

/**
 * ResourceMeter - GENERATIVE CANVAS COMPONENT
 * 
 * Beautiful circular gauge display for resource levels:
 * - SVG-based circular progress indicators
 * - Animated progress fills
 * - Color coding based on value thresholds
 * - Center percentage display
 * - Grid layout for multiple meters
 */
export function ResourceMeter({ resources }: ResourceMeterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-lg p-6"
    >
      <h3
        className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        Resource Status
      </h3>

      <div className={`grid gap-4 ${resources.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {resources.map((resource, index) => (
          <CircularGauge
            key={resource.name}
            resource={resource}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

function CircularGauge({ resource, index }: { resource: Resource; index: number }) {
  const { name, value, color, icon } = resource
  const circumference = 2 * Math.PI * 40 // radius = 40
  const strokeDashoffset = circumference - (value / 100) * circumference

  // Determine status color based on value
  const getStatusColor = () => {
    if (value >= 70) return color
    if (value >= 40) return "var(--warning-amber)"
    return "var(--neon-magenta)"
  }

  const statusColor = getStatusColor()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-2 cursor-pointer"
    >
      {/* Circular SVG Gauge */}
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={statusColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
            style={{
              filter: `drop-shadow(0 0 8px ${statusColor})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && (
            <span className="text-2xl mb-1">{icon}</span>
          )}
          <motion.span
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            {value}%
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <p
        className="text-xs text-slate-300 font-medium text-center"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        {name}
      </p>

      {/* Status indicator */}
      <div className="flex items-center gap-1">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: statusColor }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <span className="text-[10px] text-slate-400">
          {value >= 70 ? "Optimal" : value >= 40 ? "Warning" : "Critical"}
        </span>
      </div>
    </motion.div>
  )
}
