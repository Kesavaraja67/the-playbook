"use client"

import * as React from "react"

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
  return (
    <section className={componentCardClassName}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[#1D1D1F] text-xl font-bold">📊 Systems Overview</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">Current subsystem status and recommended actions.</div>
        </div>
        {disabled && <div className="text-xs font-semibold text-[#6E6E73]">Busy…</div>}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold text-[#6E6E73]">
              <th className="pb-3">System</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Priority</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#D2D2D7]">
            {systems.map((row) => {
              const status = statusMeta(row.status)
              const priority = priorityMeta(row.priority)
              const canAct = Boolean(row.actionId && row.actionLabel)

              return (
                <tr key={row.id} className="align-top">
                  <td className="py-4 pr-4 font-semibold text-[#1D1D1F]">{row.system}</td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden>{status.icon}</span>
                      <span className={cn("font-semibold", status.text)}>{status.label}</span>
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={cn("rounded-full border-2 px-2 py-0.5 text-[11px] font-semibold", priority.border, priority.text)}>
                      {priority.label}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {canAct ? (
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
                    ) : (
                      <span className="text-xs font-semibold text-[#6E6E73]">—</span>
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
    return { icon: "🟢", label: "NOMINAL", text: "text-[#34C759]" }
  }
  if (status === "degraded") {
    return { icon: "🟡", label: "DEGRADED", text: "text-[#FF9F0A]" }
  }
  return { icon: "🔴", label: "OFFLINE", text: "text-[#FF3B30]" }
}

function priorityMeta(priority: SystemPriority) {
  if (priority === "low") {
    return {
      label: "LOW",
      border: "border-[#D2D2D7]",
      text: "text-[#6E6E73]",
    }
  }

  if (priority === "medium") {
    return {
      label: "MEDIUM",
      border: "border-[#FF9F0A]",
      text: "text-[#FF9F0A]",
    }
  }

  return {
    label: "CRITICAL",
    border: "border-[#FF3B30]",
    text: "text-[#FF3B30]",
  }
}
