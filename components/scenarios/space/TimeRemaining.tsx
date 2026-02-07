"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"

function clamp(min: number, value: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

function urgencyColor(pctComplete: number) {
  if (pctComplete <= 40) return "#10B981"
  if (pctComplete <= 75) return "#F59E0B"
  return "#EF4444"
}

export function TimeRemaining({ day, totalDays }: { day: number; totalDays: number }) {
  const shouldReduceMotion = useReducedMotion()
  const safeTotal = Math.max(1, Math.floor(totalDays))
  const safeDay = clamp(1, Math.floor(day), safeTotal)
  const pctComplete = clamp(0, Math.round((safeDay / safeTotal) * 100), 100)
  const barColor = urgencyColor(pctComplete)

  return (
    <section className={componentCardClassName}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">⏱️ Time Remaining</h3>
          <div className="mt-1 text-xs text-text-secondary">{safeTotal} days until resupply</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-semibold text-text-primary">
            Day {safeDay}/{safeTotal}
          </div>
          <div className="mt-1 text-xs font-semibold text-text-secondary">{pctComplete}% elapsed</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-border-light">
          <motion.div
            className="h-3 rounded-full"
            style={{ backgroundColor: barColor }}
            initial={shouldReduceMotion ? false : { width: 0 }}
            animate={{ width: `${pctComplete}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </section>
  )
}
