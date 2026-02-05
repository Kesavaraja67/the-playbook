"use client"

import { motion } from "framer-motion"

interface Action {
  id: string
  label: string
  icon: string
  costs?: Array<{ resource: string; amount: number }>
  successRate?: number
  description?: string
}

interface ActionMatrixProps {
  actions: Action[]
  onActionClick?: (actionId: string) => void
}

/**
 * ActionMatrix - GENERATIVE CANVAS COMPONENT
 * 
 * Interactive grid of available actions with:
 * - Action icon and label
 * - Resource cost indicators
 * - Success probability visualization
 * - Hover glow effects
 * - Click handler integration
 * 
 * Supports 2-8 actions dynamically
 */
export function ActionMatrix({ actions, onActionClick }: ActionMatrixProps) {
  const gridCols = actions.length <= 2 ? 2 : actions.length <= 4 ? 2 : 3

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
        Available Actions
      </h3>

      <div
        className={`grid gap-3`}
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {actions.map((action, index) => (
          <ActionCard
            key={action.id}
            action={action}
            index={index}
            onClick={() => onActionClick?.(action.id)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ActionCard({
  action,
  index,
  onClick
}: {
  action: Action
  index: number
  onClick: () => void
}) {
  const { label, icon, costs, successRate, description } = action

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative glass border border-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:border-cyan-500/50 group"
    >
      {/* Icon */}
      <div className="flex items-center justify-center mb-3">
        <motion.div
          className="text-4xl"
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Label */}
      <h4
        className="text-sm font-semibold text-white text-center mb-2"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        {label}
      </h4>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-400 text-center mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Resource Costs */}
      {costs && costs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mb-2">
          {costs.map((cost, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30"
            >
              -{cost.amount} {cost.resource}
            </span>
          ))}
        </div>
      )}

      {/* Success Rate Bar */}
      {successRate !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-400">Success Rate</span>
            <span className="text-[10px] text-slate-300 font-semibold">
              {successRate}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  successRate >= 70
                    ? "var(--electric-cyan)"
                    : successRate >= 40
                    ? "var(--warning-amber)"
                    : "var(--neon-magenta)"
              }}
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
      </div>
    </motion.div>
  )
}
