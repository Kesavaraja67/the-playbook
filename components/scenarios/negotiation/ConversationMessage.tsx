import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export type ConversationSender = "recruiter" | "you"

export type ConversationMessageProps = {
  sender: ConversationSender
  avatar?: string
  time?: string
  children: React.ReactNode
}

const senderLabel: Record<ConversationSender, string> = {
  recruiter: "Recruiter",
  you: "You",
}

const defaultAvatar: Record<ConversationSender, string> = {
  recruiter: "👔",
  you: "👤",
}

export function ConversationMessage({ sender, avatar, time, children }: ConversationMessageProps) {
  const shouldReduceMotion = useReducedMotion()
  const isYou = sender === "you"
  const resolvedAvatar = avatar ?? defaultAvatar[sender]

  const initialX = isYou ? 18 : -18

  return (
    <div className={cn("flex w-full", isYou ? "justify-end" : "justify-start")}>
      <motion.div
        className={cn(
          "w-fit max-w-[720px] rounded-[14px] border p-4 shadow-sm",
          "transition-[box-shadow,transform,border-color] duration-200 ease-out",
          isYou
            ? "bg-accent-primary border-accent-primary text-inverse"
            : "bg-secondary border-light text-primary"
        )}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10, x: initialX, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.4, 0, 0.2, 1] }
        }
      >
        <div
          className={cn(
            "flex items-center justify-between gap-3 text-xs",
            isYou ? "text-inverse/80" : "text-secondary"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none" aria-hidden>
              {resolvedAvatar}
            </span>
            <span className={cn("font-semibold", isYou ? "text-inverse" : "text-primary")}>
              {senderLabel[sender]}
            </span>
          </div>
          {time ? <span>{time}</span> : null}
        </div>

        <div className={cn("mt-2 whitespace-pre-wrap text-sm leading-relaxed", isYou && "text-inverse")}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
