"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

function formatTime(seconds: number) {
  const clamped = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(clamped / 3600)
  const minutes = Math.floor((clamped % 3600) / 60)
  const secs = clamped % 60

  const padded = (value: number) => String(value).padStart(2, "0")
  return `${hours}h ${padded(minutes)}m ${padded(secs)}s`
}

export type CaseFileHeaderProps = {
  caseTitle: string
  caseSummary: string
  timeRemainingSeconds: number
  suspectCount: number
  evidenceCollected: number
  evidenceTotal: number
  className?: string
}

export function CaseFileHeader({
  caseTitle,
  caseSummary,
  timeRemainingSeconds,
  suspectCount,
  evidenceCollected,
  evidenceTotal,
  className,
}: CaseFileHeaderProps) {
  const shouldReduceMotion = useReducedMotion()
  const formattedTime = React.useMemo(
    () => formatTime(timeRemainingSeconds),
    [timeRemainingSeconds]
  )

  const urgency = timeRemainingSeconds <= 6 * 3600 ? "high" : timeRemainingSeconds <= 18 * 3600 ? "medium" : "low"

  return (
    <section className={cn(componentCardClassName, className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="text-4xl" aria-hidden>
            🕵️
          </div>
          <div>
            <div className="text-xs font-semibold text-text-secondary">CASE FILE</div>
            <h3 className="mt-1 text-xl font-semibold text-text-primary">{caseTitle}</h3>
            <p className="mt-2 text-sm text-text-secondary">{caseSummary}</p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-semibold text-text-secondary">TIME REMAINING</div>
          <motion.div
            className={cn(
              "mt-1 text-lg font-semibold",
              urgency === "high"
                ? "text-accent-danger"
                : urgency === "medium"
                  ? "text-accent-warning"
                  : "text-text-primary"
            )}
            animate={
              shouldReduceMotion || urgency !== "high"
                ? undefined
                : {
                    scale: [1, 1.03, 1],
                  }
            }
            transition={
              shouldReduceMotion || urgency !== "high"
                ? { duration: 0 }
                : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {formattedTime}
          </motion.div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-light bg-bg-secondary p-4 shadow-sm">
          <div className="text-xs font-semibold text-text-secondary">Suspects</div>
          <div className="mt-2 text-2xl font-semibold text-text-primary">{suspectCount}</div>
          <div className="mt-2 text-xs text-text-secondary">Keep their stories straight.</div>
        </div>
        <div className="rounded-xl border border-light bg-bg-secondary p-4 shadow-sm">
          <div className="text-xs font-semibold text-text-secondary">Evidence</div>
          <div className="mt-2 text-2xl font-semibold text-text-primary">
            {evidenceCollected}/{evidenceTotal}
          </div>
          <div className="mt-2 text-xs text-text-secondary">Collect and connect the dots.</div>
        </div>
        <div className="rounded-xl border border-light bg-bg-secondary p-4 shadow-sm">
          <div className="text-xs font-semibold text-text-secondary">Case status</div>
          <div className="mt-2 text-2xl font-semibold text-text-primary">
            {urgency === "high" ? "Critical" : urgency === "medium" ? "Active" : "Open"}
          </div>
          <div className="mt-2 text-xs text-text-secondary">No mistakes. No do-overs.</div>
        </div>
      </div>
    </section>
  )
}
