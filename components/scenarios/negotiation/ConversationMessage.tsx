import * as React from "react"

import { cn } from "@/lib/utils"

export type ConversationSender = "recruiter" | "you"

export type ConversationMessageProps = {
  sender: ConversationSender
  avatar: string
  time?: string
  children: React.ReactNode
}

const senderLabel: Record<ConversationSender, string> = {
  recruiter: "Recruiter",
  you: "You",
}

export function ConversationMessage({ sender, avatar, time, children }: ConversationMessageProps) {
  const isYou = sender === "you"

  return (
    <div className={cn("flex w-full", isYou ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "w-fit max-w-[720px] rounded-[14px] border-2 p-4 shadow-sm",
          isYou
            ? "bg-accent-primary border-accent-primary text-inverse"
            : "bg-secondary border-light text-primary"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-3 text-xs",
            isYou ? "text-inverse/80" : "text-secondary"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none" aria-hidden>
              {avatar}
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
      </div>
    </div>
  )
}
