"use client"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

export type Suspect = {
  id: string
  avatar: string
  name: string
  role: string
  shortBio: string
  suspicion: number
  interviewed: boolean
}

export type SuspectCardsProps = {
  suspects: Suspect[]
  className?: string
  disabled?: boolean
  onInterviewSuspect: (suspectId: string) => void
}

function getSuspicionColor(level: number) {
  if (level >= 75) return "#FF3B30"
  if (level >= 45) return "#FF9F0A"
  return "#34C759"
}

export function SuspectCards({ suspects, className, disabled, onInterviewSuspect }: SuspectCardsProps) {
  return (
    <section className={cn(componentCardClassName, className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#1D1D1F]">Suspects</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">
            Interview suspects and track suspicion.
          </div>
        </div>
        {disabled && <div className="text-xs font-semibold text-[#6E6E73]">Busy…</div>}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {suspects.map((suspect) => {
          const clamped = Math.max(0, Math.min(100, suspect.suspicion))
          const barColor = getSuspicionColor(clamped)

          return (
            <div
              key={suspect.id}
              className={cn(
                "rounded-lg border-2 border-[#D2D2D7] bg-white p-4",
                "shadow-[2px_2px_0px_#1D1D1F]"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="grid size-10 place-items-center rounded-lg border-2 border-[#1D1D1F] bg-[#F5F5F7] text-xl"
                    aria-hidden
                  >
                    {suspect.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1D1D1F]">{suspect.name}</div>
                    <div className="text-xs font-semibold text-[#6E6E73]">{suspect.role}</div>
                    <div className="mt-2 text-xs text-[#6E6E73]">{suspect.shortBio}</div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-semibold text-[#6E6E73]">Suspicion</div>
                  <div className="mt-1 text-sm font-bold" style={{ color: barColor }}>
                    {Math.round(clamped)}%
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-[#D2D2D7]">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${clamped}%`, backgroundColor: barColor }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                {suspect.interviewed ? (
                  <span className="rounded-full border-2 border-[#34C759] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#34C759]">
                    Interviewed
                  </span>
                ) : (
                  <span className="rounded-full border-2 border-[#D2D2D7] bg-[#F5F5F7] px-2 py-0.5 text-[11px] font-semibold text-[#6E6E73]">
                    Uninterviewed
                  </span>
                )}

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return
                    onInterviewSuspect(suspect.id)
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-semibold",
                    "shadow-[2px_2px_0px_#1D1D1F] transition-all",
                    disabled
                      ? "cursor-not-allowed border-[#D2D2D7] bg-[#F5F5F7] opacity-60"
                      : "border-[#1D1D1F] bg-white hover:border-[#0071E3] hover:-translate-y-0.5"
                  )}
                >
                  🗣️ Interview
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
