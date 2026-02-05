"use client"

import { z } from "zod"

import { cn } from "@/lib/utils"

export const tacticalAlertSchema = z.object({
  type: z.enum(["warning", "danger", "hint", "info", "success"]),
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
  warning: { bg: "#FF9F0A", icon: "⚠️" },
  danger: { bg: "#FF3B30", icon: "🚨" },
  hint: { bg: "#FF9F0A", icon: "💡" },
  info: { bg: "#0071E3", icon: "ℹ️" },
  success: { bg: "#34C759", icon: "✅" },
}

export function TacticalAlert({ type, title, message, onDismiss }: TacticalAlertProps) {
  const style = alertStyles[type]

  return (
    <aside
      className={cn(
        "fixed right-6 top-[76px] z-50 w-[360px] max-w-[calc(100vw-48px)]",
        "border-[3px] border-[#1D1D1F]",
        "shadow-[4px_4px_0px_#1D1D1F]"
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
            "border-2 border-white/60 text-white/90 hover:border-white hover:text-white"
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
    </aside>
  )
}
