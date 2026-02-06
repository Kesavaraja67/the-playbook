"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

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
  const shouldReduceMotion = useReducedMotion()
  const hasAlerts = alerts.length > 0

  return (
    <section className={componentCardClassName}>
      <h3 className="mb-4 text-xl font-semibold text-text-primary">CRITICAL STATUS DISPLAY</h3>

      <motion.div
        className={cn(
          "rounded-xl border bg-bg-secondary p-4 shadow-sm",
          hasAlerts ? "border-accent-danger" : "border-light"
        )}
        animate={
          shouldReduceMotion || !hasAlerts
            ? undefined
            : {
                boxShadow: [
                  "var(--shadow-sm)",
                  "0 0 0 4px rgba(239,68,68,0.10)",
                  "var(--shadow-sm)",
                ],
              }
        }
        transition={
          shouldReduceMotion || !hasAlerts
            ? { duration: 0 }
            : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="text-sm font-semibold text-text-primary">🔴 CRITICAL ALERTS</div>
        <ul className="mt-2 space-y-1 text-sm text-text-primary">
          {alerts.slice(0, 4).map((alert) => (
            <li key={alert}>• {alert}</li>
          ))}
          {alerts.length === 0 && <li>• No active alerts</li>}
        </ul>
      </motion.div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-light bg-tertiary p-4 shadow-sm">
            <div className="text-xs font-semibold tracking-wide text-text-secondary">{section.title}</div>
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
  if (status === "normal") return "#10B981"
  if (status === "warning") return "#F59E0B"
  return "#EF4444"
}

function MetricRow({ metric }: { metric: StatusMetric }) {
  const shouldReduceMotion = useReducedMotion()
  const clamped = Math.max(0, Math.min(100, metric.value))
  const statusColor = colorForStatus(metric.status)

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-text-primary">{metric.label}</div>
          <div className="mt-0.5 text-xs text-text-secondary">{metric.detail}</div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "font-mono text-sm font-semibold",
              metric.status === "critical" && "text-accent-danger"
            )}
          >
            {Math.round(clamped)}%
          </div>
        </div>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border-light">
        <motion.div
          className="h-2 rounded-full"
          style={{ backgroundColor: statusColor }}
          initial={shouldReduceMotion ? false : { width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}
