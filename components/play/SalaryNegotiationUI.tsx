"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import type { ActionMatrixProps } from "@/components/tambo/ActionMatrix"
import type { ResourceMeterProps } from "@/components/tambo/ResourceMeter"
import type { Scenario } from "@/lib/scenarios"
import { cn } from "@/lib/utils"

type Resource = ResourceMeterProps["resources"][number]
type Action = ActionMatrixProps["actions"][number]

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[#6E6E73]">
        <span className="font-semibold text-[#1D1D1F]">{label}</span>
        <span className="font-semibold text-[#1D1D1F]">{formatUsd(value)}</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-[#D2D2D7]">
        <div
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function MetricTile({ resource }: { resource: Resource }) {
  const clamped = Math.max(0, Math.min(100, resource.value))

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4",
        "shadow-[2px_2px_0px_#1D1D1F]"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#1D1D1F]">{resource.name}</div>
        {resource.icon && (
          <div className="text-xl leading-none" aria-hidden>
            {resource.icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-3xl font-bold text-[#1D1D1F]">{Math.round(clamped)}</div>
        <div className="text-xs font-semibold text-[#6E6E73]">/ 100</div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-[#D2D2D7]">
        <div
          className="h-2 rounded-full"
          style={{ width: `${clamped}%`, backgroundColor: resource.color }}
        />
      </div>
    </div>
  )
}

const actionDescriptions: Record<string, string> = {
  counter: "Propose a confident number backed by data.",
  benefits: "Negotiate comp beyond base salary.",
  pause: "Ask for time to review terms and align priorities.",
  accept: "Lock the offer and request final details in writing.",
}

export function SalaryNegotiationBriefing({ scenario }: { scenario: Scenario }) {
  const objectives = scenario.objectives ?? []
  const currentOffer = asNumber(scenario.initialState.currentOffer, 85_000)
  const targetSalary = asNumber(scenario.initialState.targetSalary, 100_000)
  const marketRate = asNumber(scenario.initialState.marketRate, 95_000)
  const max = Math.max(currentOffer, targetSalary, marketRate)

  return (
    <section className={componentCardClassName}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-4xl" aria-hidden>
              {scenario.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">Negotiation Desk</h3>
              <div className="mt-1 text-sm text-[#6E6E73]">Offer overview and talking points.</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#1D1D1F]">{scenario.description}</p>
        </div>

        <div className="hidden w-[280px] shrink-0 md:block">
          <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
            <div className="text-xs font-semibold text-[#6E6E73]">Goal</div>
            <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">{formatUsd(targetSalary)}</div>
            <div className="mt-2 text-xs text-[#6E6E73]">Aim to anchor above market and trade concessions.</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="text-xs font-semibold text-[#6E6E73]">Offer Ladder</div>
          <div className="mt-3 space-y-4">
            <BarRow label="Current" value={currentOffer} max={max} color="#0071E3" />
            <BarRow label="Market" value={marketRate} max={max} color="#FF9F0A" />
            <BarRow label="Target" value={targetSalary} max={max} color="#34C759" />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-[#6E6E73]">Checklist</div>
          <ul className="mt-3 space-y-2 text-sm">
            {objectives.slice(0, 4).map((objective) => (
              <li key={objective} className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5 text-[#0071E3]">
                  ●
                </span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function SalaryNegotiationMetrics({ resources }: { resources: Resource[] }) {
  return (
    <section className={componentCardClassName}>
      <h3 className="text-[#1D1D1F] text-xl font-bold mb-4">📈 Negotiation Signals</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <MetricTile key={resource.name} resource={resource} />
        ))}
      </div>
    </section>
  )
}

export function SalaryNegotiationActions({
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
          <h3 className="text-[#1D1D1F] text-xl font-bold">🗣️ Talking Points</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">Pick a move and keep the tone calm.</div>
        </div>
        {disabled && <div className="text-xs font-semibold text-[#6E6E73]">Busy…</div>}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const rawSuccess = action.successRate
          const successRate =
            typeof rawSuccess === "number" && Number.isFinite(rawSuccess)
              ? Math.max(0, Math.min(100, rawSuccess))
              : null

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
                    <div className="mt-1 text-xs text-[#6E6E73]">
                      {actionDescriptions[action.id] ?? "Continue the conversation with intent."}
                    </div>
                  </div>
                </div>

                {typeof successRate === "number" && (
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-semibold text-[#6E6E73]">Success</div>
                    <div className="text-sm font-bold text-[#1D1D1F]">{Math.round(successRate)}%</div>
                  </div>
                )}
              </div>

              {typeof successRate === "number" && (
                <div className="mt-3 h-2 w-full rounded-full bg-[#D2D2D7]">
                  <div
                    className="h-2 rounded-full bg-[#0071E3]"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
