import * as React from "react"

import { cn } from "@/lib/utils"

function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

function clampPct(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, value))
}

function relationshipLabel(score: number) {
  if (score >= 80) return { emoji: "😊", label: "Positive" }
  if (score >= 60) return { emoji: "🙂", label: "Professional" }
  if (score >= 40) return { emoji: "😐", label: "Neutral" }
  return { emoji: "⚠️", label: "Tense" }
}

export type NegotiationDashboardProps = {
  currentOffer: number
  targetSalary: number
  leveragePoints: string[]
  relationshipScore: number
  marketRate?: number
  className?: string
}

export function NegotiationDashboard({
  currentOffer,
  targetSalary,
  marketRate,
  leveragePoints,
  relationshipScore,
  className,
}: NegotiationDashboardProps) {
  const offerPct =
    targetSalary > 0
      ? clampPct((currentOffer / targetSalary) * 100)
      : 0

  const relationshipPct = clampPct(relationshipScore)
  const relationship = relationshipLabel(relationshipPct)

  return (
    <div className={cn("space-y-5", className)}>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-sm font-semibold text-primary">Current Offer</div>
          <div className="text-sm font-semibold text-primary">
            {formatUsd(currentOffer)}
            <span className="text-secondary"> → </span>
            {formatUsd(targetSalary)}
          </div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full border-2 border-light bg-secondary">
          <div className="h-full bg-accent-primary" style={{ width: `${offerPct}%` }} />
        </div>
        {typeof marketRate === "number" && Number.isFinite(marketRate) ? (
          <div className="mt-2 text-xs text-secondary">
            Market reference: <span className="font-semibold text-primary">{formatUsd(marketRate)}</span>
          </div>
        ) : null}
      </div>

      <div>
        <div className="text-sm font-semibold text-primary">Your Leverage</div>
        <ul className="mt-2 space-y-2 text-sm text-primary">
          {leveragePoints.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-0.5 text-accent-success" aria-hidden>
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-primary">Relationship Status</div>
          <div className="text-sm font-semibold text-primary">
            <span aria-hidden>{relationship.emoji}</span> {relationship.label} ({Math.round(relationshipPct)}/100)
          </div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full border-2 border-light bg-secondary">
          <div className="h-full bg-accent-success" style={{ width: `${relationshipPct}%` }} />
        </div>
      </div>
    </div>
  )
}
