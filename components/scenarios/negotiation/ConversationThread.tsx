import * as React from "react"

import {
  ConversationMessage,
  type ConversationSender,
} from "@/components/scenarios/negotiation/ConversationMessage"
import { cn } from "@/lib/utils"

export type ConversationThreadMessage = {
  id?: string
  sender: ConversationSender
  avatar?: string
  time?: string
  content: string
}

const STICKY_BOTTOM_THRESHOLD_PX = 48

export function ConversationThread({
  messages,
  className,
}: {
  messages: ConversationThreadMessage[]
  // `className` is applied to the scroll container.
  className?: string
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const endRef = React.useRef<HTMLDivElement | null>(null)
  const stickToBottomRef = React.useRef(true)

  const lastSender = messages.length ? messages[messages.length - 1].sender : null

  React.useEffect(() => {
    if (stickToBottomRef.current || lastSender === "you") {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches

      endRef.current?.scrollIntoView({
        block: "end",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      })
    }
  }, [messages.length, lastSender])

  return (
    <div
      ref={containerRef}
      onScroll={() => {
        const el = containerRef.current
        if (!el) return

        const distanceFromBottom =
          el.scrollHeight - el.scrollTop - el.clientHeight

        stickToBottomRef.current =
          distanceFromBottom < STICKY_BOTTOM_THRESHOLD_PX
      }}
      className={cn("space-y-4 overflow-y-auto", className)}
    >
      {messages.map((message, index) => (
        <ConversationMessage
          key={message.id ?? `${message.sender}-${index}`}
          sender={message.sender}
          avatar={message.avatar}
          time={message.time}
        >
          {message.content}
        </ConversationMessage>
      ))}
      <div ref={endRef} />
    </div>
  )
}
