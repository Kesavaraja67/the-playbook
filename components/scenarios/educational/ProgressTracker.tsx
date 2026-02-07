"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

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
  const shouldReduceMotion = useReducedMotion()
  const percent = totalConcepts === 0 ? 0 : Math.round((conceptsMastered / totalConcepts) * 100)
  const safePercent = Math.max(0, Math.min(100, percent))

  return (
    <section className={componentCardClassName}>
      <h3 className="text-xl font-semibold text-text-primary">Progress Tracker</h3>

      <div className="mt-4">
        <div className="text-sm font-semibold text-text-primary">Your Progress:</div>
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "flex items-center gap-2 rounded-full border bg-tertiary px-3 py-2 shadow-sm",
                step.status === "completed" && "border-accent-success",
                step.status === "active" && "border-accent-primary",
                step.status === "locked" && "border-light opacity-70"
              )}
              aria-label={`${step.label}: ${step.status}`}
            >
              <span aria-hidden>{statusIcon(step.status)}</span>
              <span className="text-xs font-semibold text-text-primary">{step.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-text-primary">Concepts Mastered:</div>
          <div className="font-semibold text-text-primary">
            {conceptsMastered}/{totalConcepts}
          </div>
        </div>

        <div className="mt-3">
          <Progress value={safePercent} />
          <div className="mt-2 text-xs text-text-secondary">{safePercent}%</div>
        </div>
      </div>
    </section>
  )
}
