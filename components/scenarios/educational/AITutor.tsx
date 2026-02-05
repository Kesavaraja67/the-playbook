"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const VoiceInput = dynamic(
  () => import("@/components/play/VoiceInput").then((mod) => mod.VoiceInput),
  { ssr: false }
)

type TutorMessage = {
  role: "student" | "tutor"
  content: string
}

export type AITutorProps = {
  stepIndex: number
  stepTitle: string
  stepHint?: string
}

function generateTutorReply(input: string, opts: { stepIndex: number; stepTitle: string; stepHint?: string }) {
  const normalized = input.trim().toLowerCase()

  if (normalized.includes("variable")) {
    return "A variable is a named place to store a value. In Python, you create one by writing `name = value` (no extra keywords needed)."
  }

  if (normalized.includes("function")) {
    return "A function is a reusable block of code. In Python, you define one with `def name(parameters):` and then you can call it later like `name(...)`."
  }

  if (normalized.includes("example")) {
    if (opts.stepIndex <= 1) {
      return "Example:\n\nfavorite_color = \"blue\"\nprint(favorite_color)"
    }

    if (opts.stepIndex <= 3) {
      return "Example:\n\ndef greet(name):\n    return \"Hello, \" + name\n\nmessage = greet(\"Alice\")\nprint(message)"
    }

    return "Example:\n\ndef add(a, b):\n    return a + b\n\nresult = add(2, 3)\nprint(result)"
  }

  if (normalized.includes("stuck") || normalized.includes("hint") || normalized.includes("i don't understand")) {
    return (
      opts.stepHint ??
      `You’re on Step ${opts.stepIndex + 1} (${opts.stepTitle}). Tell me what you tried, and I’ll guide you one piece at a time.`
    )
  }

  if (normalized.includes("print")) {
    return "To print something in Python, use `print(...)`. Example: `print(favorite_color)`."
  }

  return `Got it. What part of “${opts.stepTitle}” feels confusing right now — the syntax, or the idea?`
}

export function AITutor({ stepIndex, stepTitle, stepHint }: AITutorProps) {
  const [messages, setMessages] = React.useState<TutorMessage[]>(() => [
    {
      role: "tutor",
      content:
        "Hi! I’m your tutor. Ask anything — I’ll keep it beginner-friendly and help you move forward.",
    },
  ])
  const [input, setInput] = React.useState("")

  const listRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const send = React.useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      setMessages((prev) => [...prev, { role: "student", content: trimmed }])
      setInput("")

      const reply = generateTutorReply(trimmed, { stepIndex, stepTitle, stepHint })
      setMessages((prev) => [...prev, { role: "tutor", content: reply }])
    },
    [stepHint, stepIndex, stepTitle]
  )

  const quickQuestions = [
    "What is a variable?",
    "Show me an example",
    "I don't understand",
  ]

  return (
    <section className={componentCardClassName}>
      <h3 className="text-xl font-bold text-[#1D1D1F]">💬 Your AI Tutor</h3>

      <div
        ref={listRef}
        className={cn(
          "mt-4 max-h-[240px] overflow-y-auto rounded-lg border-2 border-[#D2D2D7] bg-white p-4",
          "text-sm text-[#1D1D1F]"
        )}
      >
        {messages.map((msg, index) => (
          <div key={index} className="mb-3">
            <div className="text-xs font-semibold text-[#6E6E73]">
              {msg.role === "student" ? "You" : "Tutor"}
            </div>
            <div className="mt-1 whitespace-pre-wrap leading-relaxed">{msg.content}</div>
          </div>
        ))}
      </div>

      <VoiceInput
        className="mt-4"
        value={input}
        onChange={setInput}
        onSubmit={(value) => send(value)}
        placeholder="Ask a question…"
        sendLabel="Send"
        inputClassName={cn(
          "h-11 rounded-lg border-[#D2D2D7] bg-white px-3",
          "text-[#1D1D1F] placeholder:text-[#6E6E73]",
          "focus:border-[#0071E3]"
        )}
      />

      <div className="mt-4">
        <div className="text-xs font-semibold text-[#6E6E73]">Quick Questions</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {quickQuestions.map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => send(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
