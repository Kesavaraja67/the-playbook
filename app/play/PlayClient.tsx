"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, RotateCcw, Send } from "lucide-react"
import { TamboProvider, useTamboThread, useTamboThreadInput } from "@tambo-ai/react"

import {
  ComponentCanvas,
  componentCardClassName,
} from "@/components/play/ComponentCanvas"
import { Button } from "@/components/ui/button"
import { getScenarioById, type Scenario } from "@/lib/scenarios"
import { PLAYBOOK_UI_EVENT_PREFIX } from "@/lib/tambo-protocol"
import { components } from "@/lib/tambo"
import { cn } from "@/lib/utils"

type PlayClientProps = {
  scenarioId: string
  systemPrompt: string
  apiKey: string | undefined
}

export function PlayClient({ scenarioId, systemPrompt, apiKey }: PlayClientProps) {
  const router = useRouter()
  const scenario = getScenarioById(scenarioId)
  const [resetKey, setResetKey] = React.useState(0)

  if (!scenario) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] grid place-items-center p-6">
        <div className={cn(componentCardClassName, "max-w-[520px]")}>
          <div className="text-lg font-bold">Scenario not found</div>
          <div className="mt-2 text-sm text-[#6E6E73]">
            The requested scenario doesn’t exist.
          </div>
          <Button className="mt-5" onClick={() => router.push("/scenarios")}>
            Back to Scenarios
          </Button>
        </div>
      </div>
    )
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] grid place-items-center p-6">
        <div className={cn(componentCardClassName, "max-w-[560px]")}>
          <div className="text-lg font-bold">Missing Tambo API key</div>
          <div className="mt-2 text-sm text-[#6E6E73]">
            Set <code className="px-1.5 py-0.5 rounded bg-[#1D1D1F] text-white">NEXT_PUBLIC_TAMBO_API_KEY</code> in
            your environment, then reload this page.
          </div>
          <Button className="mt-5" onClick={() => router.push("/scenarios")}>
            Back to Scenarios
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TamboProvider
      key={`${scenarioId}:${resetKey}`}
      apiKey={apiKey}
      components={components}
      initialMessages={[
        {
          role: "system",
          content: [{ type: "text", text: systemPrompt }],
        },
      ]}
    >
      <PlayThreadUI
        scenario={scenario}
        onReset={() => {
          setResetKey((v) => v + 1)
        }}
      />
    </TamboProvider>
  )
}

function ScenarioBriefingCard({ scenario }: { scenario: Scenario }) {
  const objectives = scenario.objectives ?? []
  const hasObjectives = objectives.length > 0

  return (
    <section className={componentCardClassName}>
      <div className="flex items-start gap-4">
        <div className="text-4xl" aria-hidden>
          {scenario.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">Briefing</h3>
          <div className="mt-1 text-sm font-semibold">{scenario.title}</div>
          <div className="mt-3 text-sm text-[#6E6E73]">{scenario.description}</div>

          {hasObjectives && (
            <div className="mt-5">
              <div className="text-xs font-semibold text-[#6E6E73]">Objectives</div>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 text-xs text-[#6E6E73]">
            Use the actions below (when available) or type your next move in the command bar.
          </div>
        </div>
      </div>
    </section>
  )
}

function PlayThreadUI({
  scenario,
  onReset,
}: {
  scenario: Scenario
  onReset: () => void
}) {
  const router = useRouter()
  const { thread, isIdle, cancel } = useTamboThread()
  const { value, setValue, submit, isPending } = useTamboThreadInput()
  const canSubmit = isIdle && !isPending
  const canReset = !isPending

  const handleSubmit = React.useCallback(() => {
    if (!value.trim()) return
    if (!canSubmit) return
    void submit()
  }, [canSubmit, submit, value])

  const renderedComponents = React.useMemo(() => {
    const componentsForRender = thread.messages
      .filter((m) => m.role === "assistant" && m.renderedComponent)
      .slice(-20)
      .slice()
      .reverse()

    return componentsForRender
  }, [thread.messages])

  const visibleMessages = React.useMemo(() => {
    return thread.messages.filter((m) => m.role !== "system")
  }, [thread.messages])

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
      <header className="sticky top-0 z-40 h-[60px] bg-white border-b-2 border-[#D2D2D7]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          <button
            type="button"
            onClick={() => router.push("/scenarios")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D1D1F] hover:text-[#0071E3]"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <div className="text-center">
            <div className="text-sm font-bold">{scenario.title}</div>
            <div className="text-xs text-[#6E6E73]">Live simulation</div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isIdle) {
                void cancel()
              }
              onReset()
            }}
            disabled={!canReset}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold text-[#1D1D1F]",
              !canReset
                ? "cursor-not-allowed opacity-60"
                : "hover:text-[#0071E3]"
            )}
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </header>

      <main className="pb-[96px]">
        <ComponentCanvas>
          <div className="space-y-6">
            <ScenarioBriefingCard scenario={scenario} />

            {renderedComponents.length > 0 ? (
              renderedComponents.map((m) => (
                <React.Fragment key={m.id}>{m.renderedComponent}</React.Fragment>
              ))
            ) : (
              <section className={componentCardClassName}>
                <div className="text-sm font-semibold">Awaiting visuals</div>
                <div className="mt-2 text-sm text-[#6E6E73]">
                  Send a message to start the simulation. The AI will render components here.
                </div>
              </section>
            )}

            <section className={cn(componentCardClassName, "mt-4 p-4")}>
              <div className="text-xs font-semibold text-[#6E6E73]">Chat</div>
              <div className="mt-2 max-h-[280px] overflow-y-auto pr-2 text-sm">
                {visibleMessages.map((msg) => {
                  const row = formatTranscriptRow(msg.role, msg.content)
                  if (!row) return null

                  const text = row.text
                  const label = msg.role === "user" ? "You" : "AI"
                  const hasRenderedComponent = Boolean(
                    msg.role === "assistant" && msg.renderedComponent
                  )

                  return (
                    <div key={msg.id} className="mb-2 whitespace-pre-wrap">
                      <span className="font-semibold">{label}:</span>{" "}
                      {text ? (
                        <span className="text-[#1D1D1F]">{text}</span>
                      ) : hasRenderedComponent ? (
                        <span className="text-xs text-[#6E6E73]">
                          Visual component rendered.
                        </span>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </ComponentCanvas>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-40 h-[80px] bg-white border-t-2 border-[#D2D2D7]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-3 px-6">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              const isPlainEnter =
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.metaKey

              if (!isPlainEnter) return
              if (e.nativeEvent.isComposing) return

              e.preventDefault()
              handleSubmit()
            }}
            disabled={!canSubmit}
            placeholder={canSubmit ? "Type your action..." : "Generating…"}
            className={cn(
              "h-12 flex-1 rounded-full border-2 border-[#D2D2D7] bg-white px-4",
              "text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]",
              "focus:outline-none focus:border-[#0071E3]",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "grid size-12 place-items-center rounded-lg",
              "bg-[#0071E3] text-white",
              "shadow-[2px_2px_0px_#1D1D1F]",
              "hover:bg-[#005BB5]",
              "disabled:bg-[#0071E3]/60 disabled:cursor-not-allowed"
            )}
            aria-label="Send"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function extractText(content: unknown): string {
  if (typeof content === "string") return content
  if (!Array.isArray(content)) return ""

  const textParts = content
    .filter(
      (p): p is { type: "text"; text: string } =>
        Boolean(p) &&
        typeof p === "object" &&
        (p as { type?: unknown }).type === "text" &&
        typeof (p as { text?: unknown }).text === "string"
    )
    .map((p) => p.text)

  return textParts.join("\n").trim()
}

function formatTranscriptRow(role: string, content: unknown): { text: string } | null {
  const text = extractText(content)

  if (role === "user" && text.startsWith(PLAYBOOK_UI_EVENT_PREFIX)) {
    const jsonPart = text.slice(PLAYBOOK_UI_EVENT_PREFIX.length).trim()
    try {
      const event = JSON.parse(jsonPart) as { kind?: unknown; label?: unknown; actionId?: unknown }
      if (event.kind === "action_selected") {
        const label = typeof event.label === "string" ? event.label : null
        const actionId = typeof event.actionId === "string" ? event.actionId : null
        const chosen = label || actionId
        return chosen ? { text: `Selected action: ${chosen}` } : null
      }
    } catch {
      return null
    }

    return null
  }

  if (!text) return { text: "" }
  return { text }
}
