"use client"

import * as React from "react"
import { z } from "zod"
import { motion, useReducedMotion } from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

const actionCostSchema = z.object({
  resource: z.string(),
  amount: z.number(),
})

export const actionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string(),
  costs: z.array(actionCostSchema).optional(),
  successRate: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
})

export const actionMatrixSchema = z.object({
  actions: z.array(actionSchema),
})

export type ActionMatrixProps = z.input<typeof actionMatrixSchema> & {
  onActionClick?: (id: string) => void
  disabled?: boolean
}

type Action = z.infer<typeof actionSchema>

const defaultEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: defaultEase,
    },
  },
}

function formatCosts(costs: Action["costs"]) {
  if (!costs || costs.length === 0) return null
  return costs.map((c) => `${c.resource} -${c.amount}`).join(" • ")
}

export function ActionMatrix({ actions, onActionClick, disabled = false }: ActionMatrixProps) {
  const shouldReduceMotion = useReducedMotion()
  const [activeActionId, setActiveActionId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!activeActionId) return
    if (actions.some((a) => a.id === activeActionId)) return
    setActiveActionId(null)
  }, [actions, activeActionId])

  return (
    <section className={componentCardClassName}>
      <h3 className="mb-4 text-xl font-semibold text-text-primary">⚡ Actions</h3>

      {disabled && (
        <div className="-mt-2 mb-4 text-xs text-text-secondary">
          Actions are temporarily disabled.
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {actions.map((action) => {
          const isActive = action.id === activeActionId
          const costs = formatCosts(action.costs)
          const rawSuccessRate = action.successRate
          const successRate =
            typeof rawSuccessRate === "number"
              ? Math.max(0, Math.min(100, rawSuccessRate))
              : null

          return (
            <motion.button
              key={action.id}
              type="button"
              disabled={disabled}
              aria-disabled={disabled || undefined}
              onClick={() => {
                if (disabled) return
                setActiveActionId(action.id)
                onActionClick?.(action.id)
              }}
              variants={itemVariants}
              className={cn(
                "group rounded-xl border p-4 text-left shadow-sm",
                "transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out",
                disabled && "cursor-not-allowed opacity-60",
                isActive
                  ? "border-accent-primary bg-accent-primary text-text-inverse shadow-md"
                  : disabled
                    ? "border-light bg-bg-secondary text-text-primary"
                    : "border-light bg-bg-secondary text-text-primary hover:border-medium hover:shadow-md"
              )}
              whileHover={
                disabled || isActive || shouldReduceMotion
                  ? undefined
                  : {
                      y: -4,
                      boxShadow: "var(--shadow-md)",
                    }
              }
              whileTap={
                disabled || shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.96,
                      y: 0,
                    }
              }
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div
                    className={cn(
                      "text-[32px] leading-none transition-transform duration-200",
                      isActive
                        ? "scale-[1.03]"
                        : "group-hover:-translate-y-1 group-hover:rotate-3"
                    )}
                    aria-hidden
                  >
                    {action.icon}
                  </div>
                  <div className="mt-2 text-sm font-semibold">{action.label}</div>
                </div>
              </div>

              {costs && (
                <div
                  className={cn(
                    "mt-2 text-xs",
                    isActive ? "text-text-inverse/90" : "text-text-secondary"
                  )}
                >
                  {costs}
                </div>
              )}

              {typeof successRate === "number" && (
                <div className="mt-3">
                  <div
                    className={cn(
                      "flex items-center justify-between text-xs",
                      isActive ? "text-text-inverse/90" : "text-text-secondary"
                    )}
                  >
                    <span>Success</span>
                    <span
                      className={cn(
                        "font-semibold",
                        isActive ? "text-text-inverse" : "text-text-primary"
                      )}
                    >
                      {Math.round(successRate)}%
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-1 h-2 w-full rounded-full overflow-hidden",
                      isActive ? "bg-white/25" : "bg-border-light"
                    )}
                  >
                    <motion.div
                      className={cn(
                        "h-2 rounded-full",
                        isActive ? "bg-white" : "bg-accent-primary"
                      )}
                      initial={shouldReduceMotion ? false : { width: 0 }}
                      animate={{ width: `${successRate}%` }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: defaultEase }}
                    />
                  </div>
                </div>
              )}
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}
