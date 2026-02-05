"use client"

import * as React from "react"

import type { ActionMatrixProps } from "@/components/tambo/ActionMatrix"
import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

type Action = ActionMatrixProps["actions"][number]

function formatCosts(costs: Action["costs"]) {
  if (!costs || costs.length === 0) return null

  return costs
    .map((cost) => {
      const key = cost.resource.toLowerCase()
      if (key.includes("time")) return `Time +${cost.amount}h`
      if (key.includes("power")) return `Power -${cost.amount}%`
      return `${cost.resource} ${cost.amount}`
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
  return (
    <section className={componentCardClassName}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[#1D1D1F] text-xl font-bold">EMERGENCY ACTIONS PANEL</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">Select an action. Monitor readouts after execution.</div>
        </div>
        {disabled && <div className="text-xs font-semibold text-[#6E6E73]">Busy…</div>}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const costs = formatCosts(action.costs)

          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) return
                onActionClick(action.id)
              }}
              className={cn(
                "rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4 text-left",
                "shadow-[2px_2px_0px_#1D1D1F] transition-all",
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-[#0071E3] hover:-translate-y-0.5"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-[28px] leading-none" aria-hidden>
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1D1D1F]">{action.label}</div>
                    {costs && <div className="mt-1 text-xs text-[#6E6E73]">{costs}</div>}
                  </div>
                </div>
                <div className="rounded-md border-2 border-[#1D1D1F] bg-white px-2 py-1 text-[11px] font-bold">
                  EXEC
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
