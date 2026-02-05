"use client"

import { useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Send } from "lucide-react"
import { TamboProvider, useTamboThread, useTamboThreadInput } from "@tambo-ai/react"

import { ComponentStack } from "@/components/playbook/ComponentStack"
import { Button } from "@/components/ui/button"
import { getScenarioById } from "@/lib/scenarios"
import { components, PLAYBOOK_SYSTEM_PROMPT, TAMBO_API_KEY } from "@/lib/tambo"
import scenarioData from "@/public/data/scenarios.json"

type ScenarioData = typeof scenarioData

function buildSystemPrompt(scenarioId: string): string {
  const scenario = getScenarioById(scenarioId)
  const scenarioPrompt = (scenarioData as ScenarioData).scenarios.find(
    (s) => s.id === scenarioId
  )?.systemPrompt

  const parts: string[] = [PLAYBOOK_SYSTEM_PROMPT]

  if (scenarioPrompt) {
    parts.push("", "SCENARIO PROMPT:", scenarioPrompt)
  }

  if (!scenario) return parts.join("\n")

  parts.push(
    "",
    `Scenario: ${scenario.title}`,
    `Description: ${scenario.description}`,
    "Objectives:",
    ...scenario.objectives.map((o) => `- ${o}`),
    "",
    `Initial state: ${JSON.stringify(scenario.initialState)}`
  )

  return parts.join("\n")
}

function PlayPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const scenarioId = searchParams.get("scenario") || "zombie-survival"
  const scenario = getScenarioById(scenarioId)

  const systemPrompt = useMemo(() => buildSystemPrompt(scenarioId), [scenarioId])

  if (!scenario) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Scenario not found</h1>
          <Button onClick={() => router.push("/scenarios")}>Back to Scenarios</Button>
        </div>
      </div>
    )
  }

  if (!TAMBO_API_KEY) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-2xl font-semibold text-white">Missing Tambo API key</h1>
          <p className="text-slate-300">
            Set <code className="px-1.5 py-0.5 rounded bg-slate-800">NEXT_PUBLIC_TAMBO_API_KEY</code> in
            your environment, then reload this page.
          </p>
          <Button onClick={() => router.push("/scenarios")}>Back to Scenarios</Button>
        </div>
      </div>
    )
  }

  return (
    <TamboProvider
      key={scenarioId}
      apiKey={TAMBO_API_KEY}
      components={components}
      initialMessages={[
        {
          role: "system",
          content: [{ type: "text", text: systemPrompt }],
        },
      ]}
    >
      <PlayUI scenarioId={scenarioId} />
    </TamboProvider>
  )
}

function PlayUI({ scenarioId }: { scenarioId: string }) {
  const router = useRouter()
  const scenario = getScenarioById(scenarioId)
  const { thread, streaming } = useTamboThread()
  const { value, setValue, submit, isPending } = useTamboThreadInput()

  const handleSubmit = () => {
    if (!value.trim() || isPending || streaming) return
    void submit()
  }

  const canvasComponents = useMemo(() => {
    return thread.messages
      .filter((m) => m.role === "assistant" && m.renderedComponent)
      .map((m) => ({
        id: m.id,
        type: "TamboComponent",
        component: m.renderedComponent!,
        timestamp: m.createdAt ? new Date(m.createdAt).valueOf() : 0,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
  }, [thread.messages])

  const visibleMessages = thread.messages.filter((m) => m.role !== "system")

  if (!scenario) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--void-dark)] via-[var(--space-blue)] to-[var(--nebula-purple)] flex">
      {/* Sidebar - Scenario Info & Chat */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0, width: "380px" }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 border-r border-slate-700 glass-strong flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/scenarios")}
            className="text-slate-400 hover:text-white mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{scenario.icon}</span>
            <div>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {scenario.title}
              </h1>
              <p className="text-xs text-slate-400">Live Simulation</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-cyan-900/50 text-white"
                    : "bg-slate-800/50 text-slate-200"
                }`}
              >
                <p className="text-xs whitespace-pre-wrap">
                  {extractText(msg.content) || (msg.role === "assistant" ? "…" : "")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit()
              }}
              placeholder={streaming ? "Generating…" : "Type your action…"}
              disabled={isPending || streaming}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
            />
            <Button
              onClick={handleSubmit}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
              disabled={isPending || streaming}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <ComponentStack components={canvasComponents} />
        </div>
      </div>
    </div>
  )
}

function extractText(content: unknown): string {
  if (typeof content === "string") return content
  if (!Array.isArray(content)) return "[Unsupported message format]"

  const textParts = content
    .map((part) => {
      if (!part || typeof part !== "object") return ""
      const maybeType = (part as { type?: unknown }).type
      if (maybeType !== "text") return ""
      const maybeText = (part as { text?: unknown }).text
      return typeof maybeText === "string" ? maybeText : ""
    })
    .filter(Boolean)

  if (textParts.length === 0) {
    return content.length > 0 ? "[Non-text response omitted]" : ""
  }

  return textParts.join(" ")
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <p className="text-white">Loading…</p>
        </div>
      }
    >
      <PlayPageContent />
    </Suspense>
  )
}
