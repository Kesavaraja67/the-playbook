import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

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
  const shouldReduceMotion = useReducedMotion()
  const visible = actions.slice(0, maxButtons)

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((action) => (
        <motion.button
          key={action.id}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            onSelect(action.id)
          }}
          className={cn(
            "rounded-full border border-light bg-secondary px-3 py-1",
            "text-xs font-semibold text-primary transition-[border-color,box-shadow,transform,background-color] duration-200 ease-out",
            disabled
              ? "cursor-not-allowed opacity-60"
              : "hover:border-accent-primary hover:bg-tertiary hover:shadow-sm"
          )}
          whileHover={disabled || shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.96, y: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  )
}
