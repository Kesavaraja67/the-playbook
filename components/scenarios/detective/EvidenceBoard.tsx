"use client"

import * as React from "react"

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
          <h3 className="text-xl font-bold text-[#1D1D1F]">Evidence Board</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">
            Click a piece of evidence to inspect details.
          </div>
        </div>
        <div className="text-xs font-semibold text-[#6E6E73]">
          Collected {evidence.filter((item) => item.collected).length}/{evidence.length}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {evidence.map((item) => {
          const isDisabled = !item.collected
          const isSelected = item.id === selectedId

          return (
            <button
              key={item.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return
                setSelectedId(item.id)
                onInspectEvidence?.(item.id)
              }}
              className={cn(
                "rounded-lg border-2 p-4 text-left transition-all",
                "shadow-[2px_2px_0px_#1D1D1F]",
                isDisabled
                  ? "cursor-not-allowed border-[#D2D2D7] bg-[#F5F5F7] opacity-60"
                  : "border-[#D2D2D7] bg-white hover:border-[#0071E3] hover:-translate-y-0.5",
                isSelected && !isDisabled ? "border-[#0071E3]" : ""
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-3xl" aria-hidden>
                  {item.icon}
                </div>
                {item.collected ? (
                  <span className="rounded-full border-2 border-[#34C759] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#34C759]">
                    Collected
                  </span>
                ) : (
                  <span className="rounded-full border-2 border-[#D2D2D7] bg-[#F5F5F7] px-2 py-0.5 text-[11px] font-semibold text-[#6E6E73]">
                    Unfound
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="text-sm font-bold text-[#1D1D1F]">{item.title}</div>
                <div className="mt-1 text-xs text-[#6E6E73]">{item.summary}</div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-5 rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4">
        {selected ? (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#6E6E73]">INSPECTION</div>
                <div className="mt-1 text-sm font-bold text-[#1D1D1F]">
                  {selected.icon} {selected.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#6E6E73]">Location</div>
                <div className="text-xs font-semibold text-[#1D1D1F]">{selected.location}</div>
              </div>
            </div>

            <div className="mt-3 text-sm text-[#1D1D1F]">{selected.details}</div>
            <div className="mt-3 text-xs text-[#6E6E73]">Logged: {selected.timestamp}</div>
          </div>
        ) : (
          <div className="text-sm text-[#6E6E73]">Collect evidence to begin an inspection.</div>
        )}
      </div>
    </section>
  )
}
