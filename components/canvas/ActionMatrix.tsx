"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import type { ActionMatrixProps as ActionMatrixSchemaProps } from "@/lib/canvas-schemas"

type Action = ActionMatrixSchemaProps["actions"][number]

type ActionMatrixProps = ActionMatrixSchemaProps & {
  onActionClick?: (actionId: string) => void
  disabled?: boolean
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
export function ActionMatrix({ actions, onActionClick, disabled = false }: ActionMatrixProps) {
  const gridCols = actions.length <= 2 ? 2 : actions.length <= 4 ? 2 : 3
  const hasWarnedMissingHandlerRef = useRef(false)

  const safeOnActionClick = (actionId: string) => {
    if (disabled) return

    if (!onActionClick) {
      if (process.env.NODE_ENV !== "production") {
        if (!hasWarnedMissingHandlerRef.current) {
          console.warn(
            "ActionMatrix: onActionClick is not provided; clicks are ignored."
          )
          hasWarnedMissingHandlerRef.current = true
        }
      }
      return
    }

    onActionClick(actionId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ds-card p-6"
    >
      <h3
        className="text-sm font-semibold text-secondary uppercase tracking-wide mb-4"
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
            disabled={disabled || !onActionClick}
            onClick={() => safeOnActionClick(action.id)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ActionCard({
  action,
  index,
  disabled,
  onClick
}: {
  action: Action
  index: number
  disabled: boolean
  onClick: () => void
}) {
  const { label, icon, costs, successRate, description } = action
  const clampedSuccessRate =
    typeof successRate === "number" ? Math.max(0, Math.min(100, successRate)) : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      className={`bg-primary border-2 border-medium rounded-lg p-4 transition-shadow hover:shadow-md ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
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
        className="text-sm font-semibold text-primary text-center mb-2"
      >
        {label}
      </h4>

      {/* Description */}
      {description && (
        <p className="text-xs text-tertiary text-center mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Resource Costs */}
      {costs && costs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mb-2">
          {costs.map((cost, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-accent-danger border-2 border-accent-danger"
            >
              -{cost.amount} {cost.resource}
            </span>
          ))}
        </div>
      )}

      {/* Success Rate Bar */}
      {typeof clampedSuccessRate === "number" && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-tertiary">Success Rate</span>
            <span className="text-[10px] text-secondary font-semibold">
              {Math.round(clampedSuccessRate)}%
            </span>
          </div>
          <div className="h-2 bg-secondary border-2 border-light rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  clampedSuccessRate >= 70
                    ? "var(--accent-success)"
                    : clampedSuccessRate >= 40
                    ? "var(--accent-warning)"
                    : "var(--accent-danger)"
              }}
              initial={{ width: 0 }}
              animate={{ width: `${clampedSuccessRate}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
