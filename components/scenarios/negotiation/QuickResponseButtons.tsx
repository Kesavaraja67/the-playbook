import * as React from "react"

import { cn } from "@/lib/utils"

export type QuickResponseAction = {
  id: string
  label: string
}

export function QuickResponseButtons({
  actions,
  onSelect,
  disabled,
  maxButtons = 4,
  className,
}: {
  actions: QuickResponseAction[]
  onSelect: (id: string) => void
  disabled: boolean
  maxButtons?: number
  className?: string
}) {
  const visible = actions.slice(0, maxButtons)

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            onSelect(action.id)
          }}
          className={cn(
            "rounded-full border-2 border-light bg-secondary px-3 py-1",
            "text-xs font-semibold text-primary transition-colors",
            disabled
              ? "cursor-not-allowed opacity-60"
              : "hover:border-accent-primary"
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
