"use client"

import * as React from "react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

export type ClueDisplayProps = {
  clue: string
  className?: string
}

export function ClueDisplay({ clue, className }: ClueDisplayProps) {
  const [rendered, setRendered] = React.useState("")

  React.useEffect(() => {
    if (!clue) {
      setRendered("")
      return
    }

    let frame = 0
    setRendered("")

    const id = setInterval(() => {
      frame += 1
      setRendered(clue.slice(0, frame))
      if (frame >= clue.length) clearInterval(id)
    }, 16)

    return () => {
      clearInterval(id)
    }
  }, [clue])

  return (
    <section
      className={cn(
        componentCardClassName,
        "border-[#0071E3] bg-gradient-to-br from-white to-[#F5F5F7]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#1D1D1F]">Latest Clue</h3>
          <div className="mt-1 text-xs text-[#6E6E73]">Log it. Connect it. Move.</div>
        </div>
        <div className="text-xs font-semibold text-[#6E6E73]" aria-hidden>
          💬
        </div>
      </div>

      <div className="mt-4 rounded-lg border-2 border-[#D2D2D7] bg-white p-4">
        {rendered ? (
          <p className="text-sm text-[#1D1D1F]">“{rendered}”</p>
        ) : (
          <p className="text-sm text-[#6E6E73]">No new clue yet.</p>
        )}
      </div>
    </section>
  )
}
