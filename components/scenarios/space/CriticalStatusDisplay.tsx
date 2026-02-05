"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

export type StatusLevel = "normal" | "warning" | "critical"

export type StatusMetric = {
  label: string
  value: number
  detail: string
  status: StatusLevel
}

export type StatusSection = {
  title: string
  metrics: StatusMetric[]
}

export function CriticalStatusDisplay({
  alerts,
  sections,
}: {
  alerts: string[]
  sections: [StatusSection, StatusSection, StatusSection]
}) {
  return (
    <section className={componentCardClassName}>
      <h3 className="text-[#1D1D1F] text-xl font-bold mb-4">CRITICAL STATUS DISPLAY</h3>

      <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
        <div className="text-sm font-bold text-[#1D1D1F]">🔴 CRITICAL ALERTS</div>
        <ul className="mt-2 space-y-1 text-sm text-[#1D1D1F]">
          {alerts.slice(0, 4).map((alert) => (
            <li key={alert}>• {alert}</li>
          ))}
          {alerts.length === 0 && <li>• No active alerts</li>}
        </ul>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border-2 border-[#D2D2D7] bg-white p-4">
            <div className="text-xs font-bold tracking-wide text-[#6E6E73]">{section.title}</div>
            <div className="mt-4 space-y-4">
              {section.metrics.map((metric) => (
                <MetricRow key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function colorForStatus(status: StatusLevel) {
  if (status === "normal") return "#34C759"
  if (status === "warning") return "#FF9F0A"
  return "#FF3B30"
}

function MetricRow({ metric }: { metric: StatusMetric }) {
  const clamped = Math.max(0, Math.min(100, metric.value))
  const statusColor = colorForStatus(metric.status)

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[#1D1D1F]">{metric.label}</div>
          <div className="mt-0.5 text-xs text-[#6E6E73]">{metric.detail}</div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "font-mono text-sm font-bold",
              metric.status === "critical" && "text-[#FF3B30]"
            )}
          >
            {Math.round(clamped)}%
          </div>
        </div>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-[#D2D2D7]">
        <div className="h-2 rounded-full" style={{ width: `${clamped}%`, backgroundColor: statusColor }} />
      </div>
    </div>
  )
}
