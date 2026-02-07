"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

export type EvidenceItem = {
  id: string
  icon: string
  title: string
  summary: string
  details: string
  location: string
  timestamp: string
  collected: boolean
}

export type EvidenceBoardProps = {
  evidence: EvidenceItem[]
  className?: string
  onInspectEvidence?: (evidenceId: string) => void
}

export function EvidenceBoard({ evidence, className, onInspectEvidence }: EvidenceBoardProps) {
  const shouldReduceMotion = useReducedMotion()
  const [selectedId, setSelectedId] = React.useState<string>(() => evidence.find((item) => item.collected)?.id ?? "")

  const selected = React.useMemo(
    () => evidence.find((item) => item.id === selectedId) ?? null,
    [evidence, selectedId]
  )

  React.useEffect(() => {
    if (selectedId) return
    const firstCollected = evidence.find((item) => item.collected)
    if (firstCollected) setSelectedId(firstCollected.id)
  }, [evidence, selectedId])

  return (
    <section className={cn(componentCardClassName, className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Evidence Board</h3>
          <div className="mt-1 text-xs text-text-secondary">
            Click a piece of evidence to inspect details.
          </div>
        </div>
        <div className="text-xs font-semibold text-text-secondary">
          Collected {evidence.filter((item) => item.collected).length}/{evidence.length}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {evidence.map((item) => {
          const isDisabled = !item.collected
          const isSelected = item.id === selectedId

          return (
            <motion.button
              key={item.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return
                setSelectedId(item.id)
                onInspectEvidence?.(item.id)
              }}
              className={cn(
                "rounded-xl border p-4 text-left shadow-sm",
                "transition-[border-color,box-shadow,transform,background-color] duration-200 ease-out",
                isDisabled
                  ? "cursor-not-allowed border-light bg-bg-secondary opacity-60"
                  : "border-light bg-tertiary hover:border-medium hover:shadow-md",
                isSelected && !isDisabled ? "border-accent-primary" : ""
              )}
              whileHover={
                isDisabled || shouldReduceMotion
                  ? undefined
                  : {
                      y: -6,
                      boxShadow: "var(--shadow-lg)",
                    }
              }
              whileTap={
                isDisabled || shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.98,
                      y: -2,
                    }
              }
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              <div style={{ perspective: 1200 }}>
                <motion.div
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={shouldReduceMotion ? undefined : { rotateY: isSelected ? 180 : 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div style={{ backfaceVisibility: "hidden" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-3xl" aria-hidden>
                        {item.icon}
                      </div>
                      {item.collected ? (
                        <motion.span
                          initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="rounded-full border border-accent-success bg-tertiary px-2 py-0.5 text-[11px] font-semibold text-accent-success"
                        >
                          Collected
                        </motion.span>
                      ) : (
                        <span className="rounded-full border border-light bg-bg-secondary px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                          Unfound
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="text-sm font-semibold text-text-primary">{item.title}</div>
                      <div className="mt-1 text-xs text-text-secondary">{item.summary}</div>
                    </div>
                  </div>

                  <div
                    className="absolute inset-0"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-text-secondary">INSPECT</div>
                        <div className="mt-2 text-sm font-semibold text-text-primary">
                          {item.icon} {item.title}
                        </div>
                        <div className="mt-2 text-xs text-text-secondary line-clamp-3">{item.details}</div>
                      </div>
                      <div className="mt-4 text-xs font-semibold text-accent-primary">
                        View details ↓
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-5 rounded-xl border border-light bg-bg-secondary p-4 shadow-sm">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.div
              key={selected.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-text-secondary">INSPECTION</div>
                  <div className="mt-1 text-sm font-semibold text-text-primary">
                    {selected.icon} {selected.title}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-text-secondary">Location</div>
                  <div className="text-xs font-semibold text-text-primary">{selected.location}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-text-primary">{selected.details}</div>
              <div className="mt-3 text-xs text-text-secondary">Logged: {selected.timestamp}</div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="text-sm text-text-secondary"
            >
              Collect evidence to begin an inspection.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
