"use client"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import type { ActionMatrixProps } from "@/components/tambo/ActionMatrix"
import { cn } from "@/lib/utils"

export type InvestigationAction = ActionMatrixProps["actions"][number]

export type InvestigationActionsProps = {
  actions: InvestigationAction[]
  disabled: boolean
  className?: string
  onActionClick: (actionId: string) => void
}

export function InvestigationActions({ actions, disabled, className, onActionClick }: InvestigationActionsProps) {
  return (
    <section className={cn(componentCardClassName, className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#1D1D1F]">Investigation Actions</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">Pick your next move carefully.</div>
        </div>
        {disabled && <div className="text-xs font-semibold text-[#6E6E73]">Busy…</div>}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const timeCostHours =
            action.costs?.find((cost) => cost.resource === "Time")?.amount ?? null
          const successRate =
            typeof action.successRate === "number" ? Math.round(action.successRate) : null

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
              "rounded-lg border-2 border-[#D2D2D7] bg-white p-4 text-left",
              "shadow-[2px_2px_0px_#1D1D1F] transition-all",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:border-[#0071E3] hover:-translate-y-0.5"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-[#1D1D1F]">
                  {action.icon} {action.label}
                </div>
                {action.description && (
                  <div className="mt-1 text-xs text-[#6E6E73]">{action.description}</div>
                )}
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[11px] font-semibold text-[#6E6E73]">Success</div>
                <div className="text-sm font-bold text-[#1D1D1F]">
                  {successRate === null ? "—" : `${successRate}%`}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-[#6E6E73]">Cost</div>
              {typeof timeCostHours === "number" ? (
                <div className="rounded-full border-2 border-[#D2D2D7] bg-[#F5F5F7] px-2 py-0.5 text-[11px] font-semibold text-[#1D1D1F]">
                  ⏱️ {timeCostHours}h
                </div>
              ) : (
                <div className="rounded-full border-2 border-[#D2D2D7] bg-[#F5F5F7] px-2 py-0.5 text-[11px] font-semibold text-[#6E6E73]">
                  None
                </div>
              )}
            </div>
          </button>
          )
        })}
      </div>
    </section>
  )
}
