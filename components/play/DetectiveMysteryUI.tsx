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

const suspectList = [
  { name: "Avery Carter", note: "Last seen near the docks" },
  { name: "Morgan Lee", note: "Contradicting statements" },
  { name: "Riley Novak", note: "Unverified alibi" },
]

const evidenceList = [
  { label: "Fingerprint lift", tag: "lab" },
  { label: "Broken watch", tag: "physical" },
  { label: "Anonymous tip", tag: "lead" },
]

const timelineList = [
  { time: "10:00 PM", event: "Victim last seen" },
  { time: "10:28 PM", event: "Power outage reported" },
  { time: "10:45 PM", event: "Witness hears argument" },
]

const actionHints: Record<string, string> = {
  interview: "Question a suspect and note inconsistencies.",
  analyze: "Send evidence for analysis and connect patterns.",
  stakeout: "Observe quietly and wait for a slip.",
  accuse: "Present your theory and test their reaction.",
}

export function DetectiveMysteryBriefing({ scenario }: { scenario: Scenario }) {
  const suspects = asNumber(scenario.initialState.suspects, 4)
  const leads = asNumber(scenario.initialState.leads, 2)
  const time = asNumber(scenario.initialState.time, 48)

  return (
    <section className={componentCardClassName}>
      <div className="flex items-center gap-3">
        <div className="text-4xl" aria-hidden>
          {scenario.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold">Case Board</h3>
          <div className="mt-1 text-sm text-[#6E6E73]">Track suspects, evidence, and the clock.</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#1D1D1F]">{scenario.description}</p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Suspects</div>
          <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">{suspects}</div>
          <div className="mt-2 text-xs text-[#6E6E73]">Keep their stories straight.</div>
        </div>
        <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Leads</div>
          <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">{leads}</div>
          <div className="mt-2 text-xs text-[#6E6E73]">Follow up before they go cold.</div>
        </div>
        <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Time remaining</div>
          <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">{time}h</div>
          <div className="mt-2 text-xs text-[#6E6E73]">Pressure rises with every hour.</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border-2 border-[#D2D2D7] bg-white p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Suspects</div>
          <ul className="mt-3 space-y-2 text-sm">
            {suspectList.map((suspect) => (
              <li key={suspect.name}>
                <div className="font-semibold">{suspect.name}</div>
                <div className="text-xs text-[#6E6E73]">{suspect.note}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border-2 border-[#D2D2D7] bg-white p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Evidence</div>
          <ul className="mt-3 space-y-2 text-sm">
            {evidenceList.map((item) => (
              <li key={item.label} className="flex items-start justify-between gap-3">
                <span className="font-semibold">{item.label}</span>
                <span className="rounded-full border-2 border-[#D2D2D7] bg-[#F5F5F7] px-2 py-0.5 text-[11px] font-semibold text-[#6E6E73]">
                  {item.tag}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border-2 border-[#D2D2D7] bg-white p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Timeline</div>
          <ul className="mt-3 space-y-2 text-sm">
            {timelineList.map((item) => (
              <li key={item.time} className="flex items-start gap-3">
                <span className="w-[64px] shrink-0 text-xs font-bold text-[#1D1D1F]">{item.time}</span>
                <span className="text-sm">{item.event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function DetectiveMysteryMetrics({ resources }: { resources: Resource[] }) {
  return (
    <section className={componentCardClassName}>
      <h3 className="text-[#1D1D1F] text-xl font-bold mb-4">🗂️ Case Metrics</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {resources.map((resource) => {
          const clamped = Math.max(0, Math.min(100, resource.value))

          return (
            <div
              key={resource.name}
              className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-[#1D1D1F]">
                  {resource.icon ? `${resource.icon} ` : ""}
                  {resource.name}
                </div>
                <div className="text-sm font-bold text-[#1D1D1F]">{Math.round(clamped)}</div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-[#D2D2D7]">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${clamped}%`, backgroundColor: resource.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function DetectiveMysteryActions({
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
          <h3 className="text-[#1D1D1F] text-xl font-bold">📝 Investigation Notebook</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">Select your next step.</div>
        </div>
        {disabled && <div className="text-xs font-semibold text-[#6E6E73]">Busy…</div>}
      </div>

      <div className="mt-4 space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return
              onActionClick(action.id)
            }}
            className={cn(
              "w-full rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4 text-left",
              "shadow-[2px_2px_0px_#1D1D1F] transition-all",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:border-[#0071E3] hover:-translate-y-0.5"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-1 grid size-6 place-items-center rounded-md border-2 border-[#1D1D1F] bg-white text-sm font-bold"
                aria-hidden
              >
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-[#1D1D1F]">
                      {action.icon} {action.label}
                    </div>
                    <div className="mt-1 text-xs text-[#6E6E73]">
                      {actionHints[action.id] ?? "Document what you learn and follow the trail."}
                    </div>
                  </div>
                  {typeof action.successRate === "number" && (
                    <div className="shrink-0 text-right">
                      <div className="text-[11px] font-semibold text-[#6E6E73]">Success</div>
                      <div className="text-sm font-bold text-[#1D1D1F]">{Math.round(action.successRate)}%</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
