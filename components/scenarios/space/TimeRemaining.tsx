"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

function clamp(min: number, value: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

function urgencyColor(pctComplete: number) {
  if (pctComplete <= 40) return "#34C759"
  if (pctComplete <= 75) return "#FF9F0A"
  return "#FF3B30"
}

export function TimeRemaining({ day, totalDays }: { day: number; totalDays: number }) {
  const safeTotal = Math.max(1, Math.floor(totalDays))
  const safeDay = clamp(1, Math.floor(day), safeTotal)
  const pctComplete = Math.round((safeDay / safeTotal) * 100)
  const barColor = urgencyColor(pctComplete)

  return (
    <section className={componentCardClassName}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[#1D1D1F] text-xl font-bold">⏱️ Time Remaining</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">{safeTotal} days until resupply</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-[#1D1D1F]">
            Day {safeDay}/{safeTotal}
          </div>
          <div className="mt-1 text-xs font-semibold text-[#6E6E73]">{pctComplete}% elapsed</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-[#D2D2D7]">
          <div
            className={cn("h-3 rounded-full")}
            style={{ width: `${pctComplete}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    </section>
  )
}
