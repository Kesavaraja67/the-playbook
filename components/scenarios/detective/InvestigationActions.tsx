"use client"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import type { ActionMatrixProps } from "@/components/tambo/ActionMatrix"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "framer-motion"

export type InvestigationAction = ActionMatrixProps["actions"][number]

export type InvestigationActionsProps = {
  actions: InvestigationAction[]
  disabled: boolean
  className?: string
  onActionClick: (actionId: string) => void
}

export function InvestigationActions({ actions, disabled, className, onActionClick }: InvestigationActionsProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className={cn(componentCardClassName, className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Investigation Actions</h3>
          <div className="mt-1 text-xs text-text-secondary">Pick your next move carefully.</div>
        </div>
        {disabled && <div className="text-xs font-semibold text-text-secondary">Busy…</div>}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const timeCostHours =
            action.costs?.find((cost) => cost.resource === "Time")?.amount ?? null
          const successRate =
            typeof action.successRate === "number" ? Math.round(action.successRate) : null

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
                "group rounded-xl border border-light bg-tertiary p-4 text-left shadow-sm",
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {action.icon} {action.label}
                  </div>
                  {action.description && (
                    <div className="mt-1 text-xs text-text-secondary">{action.description}</div>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-semibold text-text-secondary">Success</div>
                  <div className="text-sm font-semibold text-text-primary">
                    {successRate === null ? "—" : `${successRate}%`}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-text-secondary">Cost</div>
                {typeof timeCostHours === "number" ? (
                  <div className="rounded-full border border-light bg-bg-secondary px-2 py-0.5 text-[11px] font-semibold text-text-primary">
                    ⏱️ {timeCostHours}h
                  </div>
                ) : (
                  <div className="rounded-full border border-light bg-bg-secondary px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                    None
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
