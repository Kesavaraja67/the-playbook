"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const VoiceInput = dynamic(
  () => import("@/components/play/VoiceInput").then((mod) => mod.VoiceInput),
  { ssr: false }
)

type TutorMessage = {
  id: string
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
  const shouldReduceMotion = useReducedMotion()
  const [messages, setMessages] = React.useState<TutorMessage[]>(() => [
    {
      id: "welcome",
      role: "tutor",
      content:
        "Hi! I’m your tutor. Ask anything — I’ll keep it beginner-friendly and help you move forward.",
    },
  ])
  const [input, setInput] = React.useState("")
  const [isTutorTyping, setIsTutorTyping] = React.useState(false)

  const listRef = React.useRef<HTMLDivElement | null>(null)
  const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return

    el.scrollTo({
      top: el.scrollHeight,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    })
  }, [messages, shouldReduceMotion])

  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const send = React.useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-student`, role: "student", content: trimmed },
      ])
      setInput("")

      const reply = generateTutorReply(trimmed, { stepIndex, stepTitle, stepHint })

      setIsTutorTyping(true)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      const delayMs = shouldReduceMotion ? 0 : 450
      typingTimeoutRef.current = setTimeout(() => {
        setIsTutorTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-tutor`, role: "tutor", content: reply },
        ])
      }, delayMs)
    },
    [shouldReduceMotion, stepHint, stepIndex, stepTitle]
  )

  const quickQuestions = [
    "What is a variable?",
    "Show me an example",
    "I don't understand",
  ]

  return (
    <section className={componentCardClassName}>
      <h3 className="text-xl font-semibold text-text-primary">💬 Your AI Tutor</h3>

      <div
        ref={listRef}
        className={cn(
          "mt-4 max-h-[240px] overflow-y-auto rounded-xl border border-light bg-tertiary p-4",
          "text-sm text-text-primary shadow-sm"
        )}
      >
        {messages.map((msg) => {
          const isStudent = msg.role === "student"

          return (
            <motion.div
              key={msg.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.4, 0, 0.2, 1] }}
              className={cn("mb-3 flex", isStudent ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-[14px] border px-3 py-2 shadow-sm",
                  isStudent
                    ? "border-accent-primary bg-accent-primary text-text-inverse"
                    : "border-light bg-bg-secondary text-text-primary"
                )}
              >
                <div className={cn("text-xs font-semibold", isStudent ? "text-text-inverse/80" : "text-text-secondary")}>
                  {isStudent ? "You" : "Tutor"}
                </div>
                <div className="mt-1 whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </motion.div>
          )
        })}

        {isTutorTyping ? (
          <div className="mb-3 flex justify-start">
            <div className="rounded-[14px] border border-light bg-bg-secondary px-3 py-2 shadow-sm">
              <div className="text-xs font-semibold text-text-secondary">Tutor</div>
              <div className="mt-2 flex items-center gap-1" aria-label="Tutor is typing">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.span
                    key={index}
                    className="size-1.5 rounded-full bg-text-tertiary"
                    animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.6,
                      repeat: shouldReduceMotion ? 0 : Infinity,
                      ease: "easeInOut",
                      delay: index * 0.12,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <VoiceInput
        className="mt-4"
        value={input}
        onChange={setInput}
        onSubmit={(value) => send(value)}
        placeholder="Ask a question…"
        sendLabel="Send"
        inputClassName={cn(
          "h-11 rounded-lg bg-tertiary border-light px-3",
          "text-text-primary placeholder:text-text-tertiary",
          "focus:border-accent-primary"
        )}
      />

      <div className="mt-4">
        <div className="text-xs font-semibold text-text-secondary">Quick Questions</div>
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
