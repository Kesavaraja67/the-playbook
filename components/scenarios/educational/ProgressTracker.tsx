"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export type TutorialStepStatus = "completed" | "active" | "locked"

export type TutorialStep = {
  id: string
  label: string
  status: TutorialStepStatus
}

export type ProgressTrackerProps = {
  steps: TutorialStep[]
  conceptsMastered: number
  totalConcepts: number
}

function statusIcon(status: TutorialStepStatus) {
  if (status === "completed") return "✅"
  if (status === "active") return "🔄"
  return "⬜"
}

export function ProgressTracker({
  steps,
  conceptsMastered,
  totalConcepts,
}: ProgressTrackerProps) {
  const percent = totalConcepts === 0 ? 0 : Math.round((conceptsMastered / totalConcepts) * 100)
  const safePercent = Math.max(0, Math.min(100, percent))

  return (
    <section className={componentCardClassName}>
      <h3 className="text-xl font-bold text-[#1D1D1F]">Progress Tracker</h3>

      <div className="mt-4">
        <div className="text-sm font-semibold text-[#1D1D1F]">Your Progress:</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border-2 border-[#D2D2D7] bg-white px-3 py-2",
                "shadow-[2px_2px_0px_#1D1D1F]"
              )}
              aria-label={`${step.label}: ${step.status}`}
            >
              <span aria-hidden>{statusIcon(step.status)}</span>
              <span className="text-xs font-semibold text-[#1D1D1F]">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-[#1D1D1F]">Concepts Mastered:</div>
          <div className="font-semibold text-[#1D1D1F]">
            {conceptsMastered}/{totalConcepts}
          </div>
        </div>

        <div className="mt-3">
          <Progress value={safePercent} />
          <div className="mt-2 text-xs text-[#6E6E73]">{safePercent}%</div>
        </div>
      </div>
    </section>
  )
}
