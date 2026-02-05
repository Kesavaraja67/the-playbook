"use client"

import * as React from "react"

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
            <div className="text-xs font-semibold text-[#6E6E73]">CASE FILE</div>
            <h3 className="mt-1 text-xl font-bold text-[#1D1D1F]">{caseTitle}</h3>
            <p className="mt-2 text-sm text-[#6E6E73]">{caseSummary}</p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-semibold text-[#6E6E73]">TIME REMAINING</div>
          <div
            className={cn(
              "mt-1 text-lg font-bold",
              urgency === "high"
                ? "text-[#FF3B30]"
                : urgency === "medium"
                  ? "text-[#FF9F0A]"
                  : "text-[#1D1D1F]"
            )}
          >
            {formattedTime}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Suspects</div>
          <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">{suspectCount}</div>
          <div className="mt-2 text-xs text-[#6E6E73]">Keep their stories straight.</div>
        </div>
        <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Evidence</div>
          <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">
            {evidenceCollected}/{evidenceTotal}
          </div>
          <div className="mt-2 text-xs text-[#6E6E73]">Collect and connect the dots.</div>
        </div>
        <div className="rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
          <div className="text-xs font-semibold text-[#6E6E73]">Case status</div>
          <div className="mt-2 text-2xl font-bold text-[#1D1D1F]">
            {urgency === "high" ? "Critical" : urgency === "medium" ? "Active" : "Open"}
          </div>
          <div className="mt-2 text-xs text-[#6E6E73]">No mistakes. No do-overs.</div>
        </div>
      </div>
    </section>
  )
}
