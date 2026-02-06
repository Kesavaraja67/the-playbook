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
  const animationIdRef = React.useRef(0)

  React.useEffect(() => {
    if (!clue) {
      setRendered("")
      return
    }

    const raf = typeof window === "undefined" ? null : window.requestAnimationFrame
    const caf = typeof window === "undefined" ? null : window.cancelAnimationFrame

    if (!raf || !caf || typeof performance === "undefined") {
      setRendered(clue)
      return
    }

    setRendered("")

    animationIdRef.current += 1
    const animationIdAtStart = animationIdRef.current

    let frameId = 0
    const start = performance.now()
    const msPerChar = 40

    const tick = (now: number) => {
      if (animationIdRef.current !== animationIdAtStart) return
      const elapsed = now - start
      const charsToShow = Math.min(clue.length, Math.floor(elapsed / msPerChar))
      const nextRendered = clue.slice(0, charsToShow)
      setRendered((prev) => (prev === nextRendered ? prev : nextRendered))

      if (charsToShow < clue.length) {
        frameId = raf(tick)
      }
    }

    frameId = raf(tick)

    return () => {
      caf(frameId)
    }
  }, [clue])

  return (
    <section
      className={cn(
        componentCardClassName,
        "border-accent-primary",
        className
      )}
      style={{
        background:
          "radial-gradient(circle at 18% 20%, rgba(74,144,226,0.10), transparent 55%), var(--bg-tertiary)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Latest Clue</h3>
          <div className="mt-1 text-xs text-text-secondary">Log it. Connect it. Move.</div>
        </div>
        <div className="text-xs font-semibold text-text-secondary" aria-hidden>
          💬
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-light bg-bg-secondary p-4 shadow-sm">
        {rendered ? (
          <p className="text-sm text-text-primary">“{rendered}”</p>
        ) : (
          <p className="text-sm text-text-secondary">No new clue yet.</p>
        )}
      </div>
    </section>
  )
}
