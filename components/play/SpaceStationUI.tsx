"use client"

import * as React from "react"

import {
  CriticalStatusDisplay,
  type StatusLevel,
  type StatusSection,
} from "@/components/scenarios/space/CriticalStatusDisplay"
import { EmergencyActionsPanel } from "@/components/scenarios/space/EmergencyActionsPanel"
import {
  SystemsTable,
  type SystemPriority,
  type SystemRow,
  type SystemStatus,
} from "@/components/scenarios/space/SystemsTable"
import { SimulationBriefing } from "@/components/scenarios/space/SimulationBriefing"
import { TimeRemaining } from "@/components/scenarios/space/TimeRemaining"
import type { ActionMatrixProps } from "@/components/tambo/ActionMatrix"
import type { ResourceMeterProps } from "@/components/tambo/ResourceMeter"
import type { Scenario } from "@/lib/scenarios"

type Resource = ResourceMeterProps["resources"][number]
type Action = ActionMatrixProps["actions"][number]

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function resourceValue(resources: Resource[], name: string, fallback: number) {
  const match = resources.find((resource) => resource.name.toLowerCase() === name.toLowerCase())
  return match ? asNumber(match.value, fallback) : fallback
}

function clampToPct(value: number) {
  return Math.max(0, Math.min(100, value))
}

function statusFor(value: number): StatusLevel {
  const pct = clampToPct(value)
  if (pct >= 75) return "normal"
  if (pct >= 45) return "warning"
  return "critical"
}

function systemStatusFor(value: number): SystemStatus {
  const pct = clampToPct(value)
  if (pct >= 80) return "nominal"
  if (pct >= 50) return "degraded"
  return "offline"
}

function priorityForStatus(status: SystemStatus): SystemPriority {
  if (status === "offline") return "critical"
  if (status === "degraded") return "medium"
  return "low"
}

function supplyDays(value: number, multiplier: number) {
  return Math.max(0, Math.round((clampToPct(value) / 100) * multiplier))
}

export function SpaceStationBriefing({ scenario }: { scenario: Scenario }) {
  return <SimulationBriefing scenario={scenario} />
}

export function SpaceStationTelemetry({
  resources,
  day,
  totalDays,
  onActionClick,
  disabled,
}: {
  resources: Resource[]
  day: number
  totalDays: number
  onActionClick: (id: string) => void
  disabled: boolean
}) {
  const oxygen = resourceValue(resources, "Oxygen", 75)
  const power = resourceValue(resources, "Power", 60)
  const water = resourceValue(resources, "Water", 65)
  const food = resourceValue(resources, "Food", 55)
  const solar = resourceValue(resources, "Solar Output", 60)
  const health = resourceValue(resources, "Crew Health", 100)
  const morale = resourceValue(resources, "Morale", 80)

  const oxygenSystemStatus = systemStatusFor(oxygen)
  const powerSystemStatus = systemStatusFor(power)
  const waterSystemStatus = systemStatusFor(water)
  const solarSystemStatus = systemStatusFor(solar)

  const alerts: string[] = []
  if (oxygenSystemStatus !== "nominal") alerts.push("Oxygen generator offline")
  if (powerSystemStatus !== "nominal") alerts.push(`Power reserves at ${Math.round(clampToPct(power))}%`)
  if (alerts.length === 0) alerts.push("No critical alerts")

  const sections = [
    {
      title: "LIFE SUPPORT",
      metrics: [
        {
          label: "Oxygen",
          value: oxygen,
          detail: `${supplyDays(oxygen, 18)} days supply`,
          status: statusFor(oxygen),
        },
        {
          label: "Water",
          value: water,
          detail: `${supplyDays(water, 16)} days supply`,
          status: statusFor(water),
        },
        {
          label: "Food",
          value: food,
          detail: `${supplyDays(food, 14)} days supply`,
          status: statusFor(food),
        },
      ],
    },
    {
      title: "POWER SYSTEMS",
      metrics: [
        {
          label: "Reserves",
          value: power,
          detail: `${supplyDays(power, 17)} days supply`,
          status: statusFor(power),
        },
        {
          label: "Solar",
          value: solar,
          detail: "Array efficiency",
          status: statusFor(solar),
        },
      ],
    },
    {
      title: "CREW STATUS",
      metrics: [
        {
          label: "Health",
          value: health,
          detail: "6/6 healthy",
          status: statusFor(health),
        },
        {
          label: "Morale",
          value: morale,
          detail: "Stress indicators trending upward",
          status: statusFor(morale),
        },
      ],
    },
  ] satisfies StatusSection[]

  const systems: SystemRow[] = [
    {
      id: "o2-generator",
      system: "O2 Generator",
      status: oxygenSystemStatus,
      priority: priorityForStatus(oxygenSystemStatus),
      actionLabel: oxygenSystemStatus === "nominal" ? undefined : "Repair",
      actionId: oxygenSystemStatus === "nominal" ? undefined : "repair_o2",
    },
    {
      id: "power-bus",
      system: "Power Bus",
      status: powerSystemStatus,
      priority: priorityForStatus(powerSystemStatus),
      actionLabel: powerSystemStatus === "nominal" ? undefined : "Restore",
      actionId: powerSystemStatus === "nominal" ? undefined : "restore_power",
    },
    {
      id: "water-recycler",
      system: "Water Recycler",
      status: waterSystemStatus,
      priority: priorityForStatus(waterSystemStatus),
      actionLabel: waterSystemStatus === "nominal" ? undefined : "Inspect",
      actionId: waterSystemStatus === "nominal" ? undefined : "inspect_water",
    },
    {
      id: "solar-panels",
      system: "Solar Panels",
      status: solarSystemStatus,
      priority: priorityForStatus(solarSystemStatus),
      actionLabel: solarSystemStatus === "nominal" ? undefined : "Realign",
      actionId: solarSystemStatus === "nominal" ? undefined : "realign_solar",
    },
    {
      id: "communications",
      system: "Communications",
      status: "nominal",
      priority: "low",
    },
  ]

  return (
    <div className="space-y-4">
      <CriticalStatusDisplay
        alerts={alerts}
        sections={sections as [StatusSection, StatusSection, StatusSection]}
      />
      <SystemsTable systems={systems} disabled={disabled} onActionClick={onActionClick} />
      <TimeRemaining day={day} totalDays={totalDays} />
    </div>
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
  return <EmergencyActionsPanel actions={actions} onActionClick={onActionClick} disabled={disabled} />
}
