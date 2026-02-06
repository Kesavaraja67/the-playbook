"use client"

import * as React from "react"
import { z } from "zod"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export const tacticalAlertSchema = z.object({
  type: z.enum(["warning", "hint", "info", "success"]),
  title: z.string(),
  message: z.string(),
})

export type TacticalAlertProps = z.input<typeof tacticalAlertSchema> & {
  onDismiss?: () => void
}

const alertStyles: Record<
  z.infer<typeof tacticalAlertSchema>["type"],
  { bg: string; icon: string }
> = {
  warning: { bg: "#EF4444", icon: "⚠️" },
  hint: { bg: "#F59E0B", icon: "💡" },
  info: { bg: "#4A90E2", icon: "ℹ️" },
  success: { bg: "#10B981", icon: "✅" },
}

export function TacticalAlert({ type, title, message, onDismiss }: TacticalAlertProps) {
  const shouldReduceMotion = useReducedMotion()
  const style = alertStyles[type]

  return (
    <motion.aside
      initial={shouldReduceMotion ? false : { opacity: 0, x: 32, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, x: 40 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 30 }
      }
      className={cn(
        "fixed right-6 top-[84px] z-50 w-[360px] max-w-[calc(100vw-48px)]",
        "rounded-xl border border-light shadow-xl overflow-hidden"
      )}
      style={{ backgroundColor: style.bg }}
      role="status"
    >
      <div className="relative p-4 text-white">
        <button
          type="button"
          onClick={() => {
            onDismiss?.()
          }}
          className={cn(
            "absolute right-3 top-3 grid size-7 place-items-center rounded-md",
            "border border-white/50 text-white/90 transition-colors hover:border-white hover:text-white"
          )}
          aria-label="Dismiss"
        >
          ×
        </button>

        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none" aria-hidden>
            {style.icon}
          </div>
          <div className="pr-8">
            <div className="text-sm font-bold">{title}</div>
            <div className="mt-1 text-sm text-white/90">{message}</div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
