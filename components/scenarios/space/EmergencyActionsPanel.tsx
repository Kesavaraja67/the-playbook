"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import type { ActionMatrixProps } from "@/components/tambo/ActionMatrix"
import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

type Action = ActionMatrixProps["actions"][number]

function formatCosts(costs: Action["costs"]) {
  if (!costs || costs.length === 0) return null

  return costs
    .map((cost) => {
      const key = cost.resource.toLowerCase()

      const magnitude = Math.abs(cost.amount)
      const pct = `${cost.resource} ${cost.amount >= 0 ? "-" : "+"}${magnitude}%`

      if (key.includes("time")) {
        return `Time ${cost.amount >= 0 ? "+" : "-"}${magnitude}h`
      }

      return pct
    })
    .join(" • ")
}

export function EmergencyActionsPanel({
  actions,
  onActionClick,
  disabled,
}: {
  actions: Action[]
  onActionClick: (id: string) => void
  disabled: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className={componentCardClassName}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">EMERGENCY ACTIONS PANEL</h3>
          <div className="mt-1 text-xs text-text-secondary">
            Select an action. Monitor readouts after execution.
          </div>
        </div>
        {disabled && <div className="text-xs font-semibold text-text-secondary">Busy…</div>}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const costs = formatCosts(action.costs)

          return (
            <motion.button
              key={action.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) return
                onActionClick(action.id)
              }}
              className={cn(
                "group rounded-xl border border-light bg-bg-secondary p-4 text-left shadow-sm",
                "transition-[border-color,box-shadow,transform] duration-200 ease-out",
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-accent-primary hover:shadow-md"
              )}
              whileHover={
                disabled || shouldReduceMotion
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
                      scale: 0.97,
                      y: 0,
                    }
              }
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-[28px] leading-none" aria-hidden>
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{action.label}</div>
                    {costs && <div className="mt-1 text-xs text-text-secondary">{costs}</div>}
                  </div>
                </div>
                <motion.div
                  className="rounded-md border border-light bg-tertiary px-2 py-1 text-[11px] font-semibold text-text-primary shadow-sm"
                  whileHover={disabled ? undefined : { scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                >
                  EXEC
                </motion.div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
