"use client"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "framer-motion"

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
  if (level >= 75) return "#EF4444"
  if (level >= 45) return "#F59E0B"
  return "#10B981"
}

export function SuspectCards({ suspects, className, disabled, onInterviewSuspect }: SuspectCardsProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className={cn(componentCardClassName, className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Suspects</h3>
          <div className="mt-1 text-xs text-text-secondary">
            Interview suspects and track suspicion.
          </div>
        </div>
        {disabled && <div className="text-xs font-semibold text-text-secondary">Busy…</div>}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {suspects.map((suspect) => {
          const clamped = Math.max(0, Math.min(100, suspect.suspicion))
          const barColor = getSuspicionColor(clamped)

          return (
            <motion.div
              key={suspect.id}
              className={cn(
                "rounded-xl border border-light bg-tertiary p-4 shadow-sm",
                "transition-[box-shadow,transform,border-color] duration-200 ease-out"
              )}
              whileHover={
                disabled || shouldReduceMotion
                  ? undefined
                  : { y: -4, boxShadow: "var(--shadow-md)", borderColor: "var(--border-medium)" }
              }
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="grid size-10 place-items-center rounded-lg border border-light bg-bg-secondary text-xl shadow-sm"
                    aria-hidden
                  >
                    {suspect.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{suspect.name}</div>
                    <div className="text-xs font-semibold text-text-secondary">{suspect.role}</div>
                    <div className="mt-2 text-xs text-text-secondary">{suspect.shortBio}</div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-semibold text-text-secondary">Suspicion</div>
                  <div className="mt-1 text-sm font-bold" style={{ color: barColor }}>
                    {Math.round(clamped)}%
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border-light">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: barColor }}
                  initial={shouldReduceMotion ? false : { width: 0 }}
                  animate={{ width: `${clamped}%` }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                {suspect.interviewed ? (
                  <span className="rounded-full border border-accent-success bg-tertiary px-2 py-0.5 text-[11px] font-semibold text-accent-success">
                    Interviewed
                  </span>
                ) : (
                  <span className="rounded-full border border-light bg-bg-secondary px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                    Uninterviewed
                  </span>
                )}

                <motion.button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return
                    onInterviewSuspect(suspect.id)
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm",
                    "transition-[box-shadow,transform,border-color,background-color] duration-200 ease-out",
                    disabled
                      ? "cursor-not-allowed border-light bg-bg-secondary opacity-60"
                      : "border-light bg-tertiary hover:border-accent-primary hover:shadow-md"
                  )}
                  whileHover={disabled || shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.96, y: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  🗣️ Interview
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
