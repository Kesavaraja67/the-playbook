"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import type { ActionMatrixProps } from "@/components/tambo/ActionMatrix"
import type { ResourceMeterProps } from "@/components/tambo/ResourceMeter"
import type { Scenario } from "@/lib/scenarios"
import { cn } from "@/lib/utils"

type Resource = ResourceMeterProps["resources"][number]
type Action = ActionMatrixProps["actions"][number]

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function statusFor(value: number) {
  if (value >= 75) return { label: "Nominal", color: "#34C759" }
  if (value >= 45) return { label: "Caution", color: "#FF9F0A" }
  return { label: "Critical", color: "#FF3B30" }
}

function TelemetryRow({ resource }: { resource: Resource }) {
  const clamped = Math.max(0, Math.min(100, resource.value))
  const status = statusFor(clamped)

  return (
    <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="mt-1 size-2 rounded-full"
            style={{ backgroundColor: status.color }}
            aria-hidden
          />
          <div>
            <div className="text-sm font-bold text-[#1D1D1F]">
              {resource.icon ? `${resource.icon} ` : ""}
              {resource.name}
            </div>
            <div className="mt-1 text-xs text-[#6E6E73]">Status: {status.label}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-[#1D1D1F]">{Math.round(clamped)}%</div>
          <div className="mt-1 text-[11px] font-semibold text-[#6E6E73]">Telemetry</div>
        </div>
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

const commandHints: Record<string, string> = {
  repair: "Stabilize the highest-impact subsystem.",
  reroute: "Shift power to prevent cascade failures.",
  scan: "Run diagnostics and identify new faults.",
  report: "Transmit telemetry to mission control.",
}

export function SpaceStationBriefing({ scenario }: { scenario: Scenario }) {
  const objectives = scenario.objectives ?? []
  const crew = asNumber(scenario.initialState.crew, 6)
  const orbit = asString(scenario.initialState.orbit, "decaying")
  const systems = asString(scenario.initialState.systems, "degraded")

  return (
    <section className={componentCardClassName}>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="text-4xl" aria-hidden>
              {scenario.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">Mission Console</h3>
              <div className="mt-1 text-sm text-[#6E6E73]">Prioritize fixes and keep the station stable.</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#1D1D1F]">{scenario.description}</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {objectives.slice(0, 4).map((objective) => (
              <div
                key={objective}
                className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-3 text-sm"
              >
                <span aria-hidden className="mr-2 text-[#0071E3]">
                  ▸
                </span>
                {objective}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full shrink-0 space-y-3 md:w-[320px]">
          <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
            <div className="text-xs font-semibold text-[#6E6E73]">Crew</div>
            <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">{crew} onboard</div>
            <div className="mt-2 text-xs text-[#6E6E73]">Keep life support and comms online.</div>
          </div>
          <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
            <div className="text-xs font-semibold text-[#6E6E73]">Orbit</div>
            <div className="mt-2 text-sm font-bold text-[#1D1D1F]">{orbit}</div>
            <div className="mt-3 text-xs font-semibold text-[#6E6E73]">Systems</div>
            <div className="mt-1 text-sm font-bold text-[#1D1D1F]">{systems}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SpaceStationTelemetry({ resources }: { resources: Resource[] }) {
  return (
    <section className={componentCardClassName}>
      <h3 className="text-[#1D1D1F] text-xl font-bold mb-4">🛰️ Station Telemetry</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {resources.map((resource) => (
          <TelemetryRow key={resource.name} resource={resource} />
        ))}
      </div>
    </section>
  )
}

export function SpaceStationCommands({
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
          <h3 className="text-[#1D1D1F] text-xl font-bold">🧰 Command Deck</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">Run commands carefully. Confirm outcomes.</div>
        </div>
        {disabled && <div className="text-xs font-semibold text-[#6E6E73]">Busy…</div>}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const hint = commandHints[action.id] ?? "Execute a command and watch readouts."

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
                    <div className="mt-1 text-xs text-[#6E6E73]">{hint}</div>
                  </div>
                </div>
                <div className="rounded-md border-2 border-[#1D1D1F] bg-white px-2 py-1 text-[11px] font-bold">
                  CMD
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
