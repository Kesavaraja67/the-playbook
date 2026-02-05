"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

const defaultStorageKey = "playbook.zombieSurvival.howToPlay.isOpen"

export function HowToPlayPanel() {
  const [isOpen, setIsOpen] = React.useState(true)
  const panelId = React.useId()
  const labelId = `${panelId}-label`
  const contentId = `${panelId}-content`

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(defaultStorageKey)
      if (stored === "0") setIsOpen(false)
      if (stored === "1") setIsOpen(true)
    } catch {
      // Ignore storage errors (private mode, blocked, etc.)
    }
  }, [])

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(defaultStorageKey, next ? "1" : "0")
      } catch {
        // Ignore storage errors (private mode, blocked, etc.)
      }
      return next
    })
  }, [])

  return (
    <section
      className={cn(
        componentCardClassName,
        "border-accent-primary bg-[#E8F4FD] p-4"
      )}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-[10px] px-2 py-2",
          "text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg" aria-hidden>
            ℹ️
          </span>
          <div>
            <div id={labelId} className="text-sm font-bold text-text-primary">
              How to Play
            </div>
            <div className="text-xs text-text-secondary">
              {isOpen ? "Click to collapse" : "Click to expand"}
            </div>
          </div>
        </div>

        {isOpen ? (
          <ChevronDown className="size-4 text-accent-primary" aria-hidden />
        ) : (
          <ChevronRight className="size-4 text-accent-primary" aria-hidden />
        )}
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={labelId}
          className="mt-2 px-2"
        >
          <ul className="space-y-1 text-sm text-text-primary">
            <li>
              <span className="mr-2" aria-hidden>
                🎯
              </span>
              <strong>Goal:</strong> Survive 7 days and reach evacuation.
            </li>
            <li>
              <span className="mr-2" aria-hidden>
                📍
              </span>
              <strong>Your position:</strong> Blue circle on the map.
            </li>
            <li>
              <span className="mr-2" aria-hidden>
                🧟
              </span>
              <strong>Zombies:</strong> Red circles (avoid them!).
            </li>
            <li>
              <span className="mr-2" aria-hidden>
                📦
              </span>
              <strong>Resources:</strong> Green circles (collect them).
            </li>
            <li>
              <span className="mr-2" aria-hidden>
                ⚡
              </span>
              <strong>Actions:</strong> Choose action buttons below.
            </li>
            <li>
              <span className="mr-2" aria-hidden>
                💡
              </span>
              <strong>Tip:</strong> Watch your health and ammo carefully!
            </li>
          </ul>
        </div>
      )}
    </section>
  )
}
