import * as React from "react"

import {
  ConversationMessage,
  type ConversationSender,
} from "@/components/scenarios/negotiation/ConversationMessage"
import { cn } from "@/lib/utils"

export type ConversationThreadMessage = {
  id?: string
  sender: ConversationSender
  avatar: string
  time?: string
  content: string
}

export function ConversationThread({
  messages,
  className,
}: {
  messages: ConversationThreadMessage[]
  className?: string
}) {
  const endRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages.length])

  return (
    <div className={cn("space-y-4", className)}>
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
