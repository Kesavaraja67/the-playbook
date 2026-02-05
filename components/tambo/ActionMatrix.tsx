"use client"

import * as React from "react"
import { useTamboThread } from "@tambo-ai/react"
import { z } from "zod"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { formatPlaybookUiEvent } from "@/lib/tambo-protocol"
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

function formatCosts(costs: Action["costs"]) {
  if (!costs || costs.length === 0) return null
  return costs.map((c) => `${c.resource} -${c.amount}`).join(" • ")
}

function ActionMatrixGrid({
  actions,
  onActionClick,
  disabled,
  headline,
  helper,
}: {
  actions: Action[]
  onActionClick: (action: Action) => void
  disabled: boolean
  headline: string
  helper?: string
}) {
  const [activeActionId, setActiveActionId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!activeActionId) return
    if (actions.some((a) => a.id === activeActionId)) return
    setActiveActionId(null)
  }, [actions, activeActionId])

  return (
    <section className={componentCardClassName}>
      <h3 className="text-[#1D1D1F] text-xl font-bold mb-4">{headline}</h3>

      {disabled && helper && (
        <div className="-mt-2 mb-4 text-xs text-[#6E6E73]">{helper}</div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {actions.map((action) => {
          const isActive = action.id === activeActionId
          const costs = formatCosts(action.costs)
          const rawSuccessRate = action.successRate
          const successRate =
            typeof rawSuccessRate === "number"
              ? Math.max(0, Math.min(100, rawSuccessRate))
              : null

          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled}
              aria-disabled={disabled || undefined}
              onClick={() => {
                if (disabled) return
                setActiveActionId(action.id)
                onActionClick(action)
              }}
              className={cn(
                "rounded-lg border-2 p-4 text-left transition-all",
                "shadow-[2px_2px_0px_#1D1D1F]",
                disabled && "cursor-not-allowed opacity-60",
                isActive
                  ? "border-[#0071E3] bg-[#0071E3] text-white"
                  : disabled
                    ? "border-[#D2D2D7] bg-[#F5F5F7] text-[#1D1D1F]"
                    : "border-[#D2D2D7] bg-[#F5F5F7] text-[#1D1D1F] hover:border-[#0071E3] hover:-translate-y-0.5"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[32px] leading-none" aria-hidden>
                    {action.icon}
                  </div>
                  <div className="mt-2 text-sm font-bold">{action.label}</div>
                </div>
              </div>

              {costs && (
                <div
                  className={cn(
                    "mt-2 text-xs",
                    isActive ? "text-white/90" : "text-[#6E6E73]"
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
                      isActive ? "text-white/90" : "text-[#6E6E73]"
                    )}
                  >
                    <span>Success</span>
                    <span
                      className={cn(
                        "font-semibold",
                        isActive ? "text-white" : "text-[#1D1D1F]"
                      )}
                    >
                      {Math.round(successRate)}%
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-1 h-2 w-full rounded-full",
                      isActive ? "bg-white/30" : "bg-[#D2D2D7]"
                    )}
                  >
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        isActive ? "bg-white" : "bg-[#0071E3]"
                      )}
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function TamboActionMatrix({ actions, disabled = false }: ActionMatrixProps) {
  const { sendThreadMessage, isIdle } = useTamboThread()
  const [sending, setSending] = React.useState(false)
  const canTriggerActions = !disabled && isIdle && !sending

  return (
    <ActionMatrixGrid
      actions={actions}
      disabled={!canTriggerActions}
      headline="⚡ Actions"
      helper="Actions are temporarily disabled."
      onActionClick={async (action) => {
        if (!canTriggerActions) return

        setSending(true)
        try {
          await sendThreadMessage(
            formatPlaybookUiEvent({
              kind: "action_selected",
              actionId: action.id,
              label: action.label,
            })
          )
        } finally {
          setSending(false)
        }
      }}
    />
  )
}

export function ActionMatrix({ onActionClick, ...rest }: ActionMatrixProps) {
  if (onActionClick) {
    return (
      <ActionMatrixGrid
        actions={rest.actions}
        disabled={Boolean(rest.disabled)}
        headline="⚡ Actions"
        helper="Actions are temporarily disabled."
        onActionClick={(action) => {
          onActionClick(action.id)
        }}
      />
    )
  }

  return <TamboActionMatrix {...rest} />
}
