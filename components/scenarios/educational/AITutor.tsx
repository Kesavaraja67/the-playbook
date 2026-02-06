"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTamboThread, type TamboThreadMessage } from "@tambo-ai/react"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { Button } from "@/components/ui/button"
import { HAS_TAMBO_API_KEY } from "@/lib/config"
import { cn } from "@/lib/utils"

const VoiceInput = dynamic(
  () => import("@/components/play/VoiceInput").then((mod) => mod.VoiceInput),
  { ssr: false }
)

type TutorMessage = {
  role: "student" | "tutor"
  content: string
}

function getTextFromTamboMessage(message: TamboThreadMessage) {
  return message.content
    .map((part) => (part.type === "text" ? (part.text ?? "") : ""))
    .filter(Boolean)
    .join("")
}

export type AITutorProps = {
  stepIndex: number
  stepTitle: string
  stepHint?: string
  scenarioId?: string
}

function generateTutorReply(
  input: string,
  opts: { stepIndex: number; stepTitle: string; stepHint?: string }
) {
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

function LocalAITutor({ stepIndex, stepTitle, stepHint }: AITutorProps) {
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

function TamboAITutor({ stepIndex, stepTitle, stepHint, scenarioId }: AITutorProps) {
  const { thread, sendThreadMessage, generationStage, generationStatusMessage, isIdle, startNewThread } =
    useTamboThread()

  const [input, setInput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const listRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    startNewThread()
  }, [scenarioId, startNewThread])

  const visibleMessages = React.useMemo(() => {
    return thread.messages.filter((message) => message.role !== "system" && message.role !== "tool")
  }, [thread.messages])

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [visibleMessages])

  const send = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      if (!isIdle) return

      setInput("")
      setError(null)

      try {
        await sendThreadMessage(trimmed, {
          contextKey: scenarioId,
          additionalContext: {
            tutorialStep: {
              index: stepIndex,
              title: stepTitle,
              hint: stepHint,
            },
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    },
    [isIdle, scenarioId, sendThreadMessage, stepHint, stepIndex, stepTitle]
  )

  const quickQuestions = [
    "How do I define a function in Python?",
    "What's the syntax for variable assignment in Python 3.12?",
    "How do I use return values in Python functions?",
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
        {visibleMessages.length === 0 && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-[#6E6E73]">Tutor</div>
            <div className="mt-1 whitespace-pre-wrap leading-relaxed">
              Hi! I’m your tutor. Ask anything — I’ll keep it beginner-friendly and help you move
              forward.
            </div>
          </div>
        )}

        {visibleMessages.map((message) => {
          const label = message.role === "user" ? "You" : "Tutor"
          const text = getTextFromTamboMessage(message)

          return (
            <div key={message.id} className="mb-3">
              <div className="text-xs font-semibold text-[#6E6E73]">{label}</div>
              {text && <div className="mt-1 whitespace-pre-wrap leading-relaxed">{text}</div>}
              {message.renderedComponent && (
                <div className={cn(text ? "mt-3" : "mt-1")}>{message.renderedComponent}</div>
              )}
            </div>
          )
        })}

        {!isIdle && (
          <div className="text-xs text-[#6E6E73]">
            {generationStatusMessage || `Tutor is working… (${generationStage})`}
          </div>
        )}
        {error && <div className="mt-2 text-xs text-[#FF3B30]">{error}</div>}
      </div>

      <VoiceInput
        className="mt-4"
        value={input}
        onChange={setInput}
        onSubmit={(value) => {
          void send(value)
        }}
        disabled={!isIdle}
        placeholder="Ask a question…"
        sendLabel={isIdle ? "Send" : "Working…"}
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
              onClick={() => {
                void send(question)
              }}
              disabled={!isIdle}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AITutor(props: AITutorProps) {
  if (!HAS_TAMBO_API_KEY) {
    return <LocalAITutor {...props} />
  }

  return <TamboAITutor {...props} />
}
