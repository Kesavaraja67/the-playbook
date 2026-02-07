"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type SystemStatus = "nominal" | "degraded" | "offline"
export type SystemPriority = "low" | "medium" | "critical"

export type SystemRow = {
  id: string
  system: string
  status: SystemStatus
  priority: SystemPriority
  actionLabel?: string
  actionId?: string
}

export function SystemsTable({
  systems,
  disabled,
  onActionClick,
}: {
  systems: SystemRow[]
  disabled: boolean
  onActionClick: (id: string) => void
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className={componentCardClassName}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">📊 Systems Overview</h3>
          <div className="mt-1 text-xs text-text-secondary">
            Current subsystem status and recommended actions.
          </div>
        </div>
        {disabled && <div className="text-xs font-semibold text-text-secondary">Busy…</div>}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold text-text-secondary">
              <th className="pb-3">System</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Priority</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {systems.map((row) => {
              const status = statusMeta(row.status)
              const priority = priorityMeta(row.priority)
              const canAct = Boolean(row.actionId && row.actionLabel)

              return (
                <tr
                  key={row.id}
                  className="group align-top transition-colors duration-200 hover:bg-bg-secondary"
                >
                  <td className="py-4 pr-4 font-semibold text-text-primary">{row.system}</td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center gap-2">
                      <motion.span
                        aria-hidden
                        animate={
                          shouldReduceMotion
                            ? undefined
                            : row.status === "degraded"
                              ? { opacity: [1, 0.65, 1] }
                              : row.status === "offline"
                                ? { x: [0, -2, 2, 0] }
                                : { scale: [0.98, 1] }
                        }
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : row.status === "degraded"
                              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                              : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
                        }
                      >
                        {status.icon}
                      </motion.span>
                      <span className={cn("font-semibold", status.text)}>{status.label}</span>
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                        priority.border,
                        priority.text
                      )}
                    >
                      {priority.label}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {canAct ? (
                      <div className="inline-flex justify-end">
                        <div className="transition-all duration-200 md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={disabled}
                            onClick={() => {
                              if (!row.actionId) return
                              if (disabled) return
                              onActionClick(row.actionId)
                            }}
                          >
                            {row.actionLabel}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-text-secondary">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function statusMeta(status: SystemStatus) {
  if (status === "nominal") {
    return { icon: "🟢", label: "NOMINAL", text: "text-accent-success" }
  }
  if (status === "degraded") {
    return { icon: "🟡", label: "DEGRADED", text: "text-accent-warning" }
  }
  return { icon: "🔴", label: "OFFLINE", text: "text-accent-danger" }
}

function priorityMeta(priority: SystemPriority) {
  if (priority === "low") {
    return {
      label: "LOW",
      border: "border-light",
      text: "text-text-secondary",
    }
  }

  if (priority === "medium") {
    return {
      label: "MEDIUM",
      border: "border-accent-warning",
      text: "text-accent-warning",
    }
  }

  return {
    label: "CRITICAL",
    border: "border-accent-danger",
    text: "text-accent-danger",
  }
}
