"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RotateCcw, Send } from "lucide-react"

import { ComponentCanvas, componentCardClassName } from "@/components/play/ComponentCanvas"
import { ActionMatrix } from "@/components/tambo/ActionMatrix"
import { GameBoard } from "@/components/tambo/GameBoard"
import { ResourceMeter } from "@/components/tambo/ResourceMeter"
import { TacticalAlert } from "@/components/tambo/TacticalAlert"
import { Button } from "@/components/ui/button"
import { getScenarioById } from "@/lib/scenarios"
import { cn } from "@/lib/utils"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type TacticalAlertState = Omit<React.ComponentProps<typeof TacticalAlert>, "onDismiss">

type BoardState = React.ComponentProps<typeof GameBoard>
type Resource = React.ComponentProps<typeof ResourceMeter>["resources"][number]
type Action = React.ComponentProps<typeof ActionMatrix>["actions"][number]

function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function getZombieInitialState() {
  const board: BoardState = {
    gridSize: 10,
    playerPosition: { x: 5, y: 5 },
    enemies: [
      { x: 3, y: 4, type: "Zombie" },
      { x: 6, y: 6, type: "Zombie" },
    ],
    resources: [{ x: 8, y: 3, type: "Loot" }],
  }

  const resources: Resource[] = [
    { name: "Health", value: 85, color: "#FF3B30", icon: "❤️" },
    { name: "Ammo", value: 12, color: "#FF9F0A", icon: "🔫" },
    { name: "Food", value: 3, color: "#34C759", icon: "🍖" },
    { name: "Water", value: 2, color: "#0071E3", icon: "💧" },
  ]

  const actions: Action[] = [
    {
      id: "scavenge",
      label: "Scavenge",
      icon: "🔍",
      costs: [{ resource: "Energy", amount: 10 }],
      successRate: 75,
      description: "Search nearby for supplies",
    },
    {
      id: "fortify",
      label: "Fortify",
      icon: "🛡️",
      costs: [{ resource: "Materials", amount: 20 }],
      successRate: 90,
      description: "Reinforce your position",
    },
    {
      id: "move",
      label: "Move",
      icon: "🏃",
      costs: [{ resource: "Energy", amount: 15 }],
      successRate: 60,
      description: "Relocate to a safer spot",
    },
    {
      id: "rest",
      label: "Rest",
      icon: "😴",
      successRate: 100,
      description: "Recover and plan",
    },
  ]

  const initialAssistantMessage: ChatMessage = {
    role: "assistant",
    content: "You hear zombies nearby. What do you do?",
  }

  return {
    day: 1,
    totalDays: 7,
    board,
    resources,
    actions,
    messages: [initialAssistantMessage],
    alert: null as TacticalAlertState | null,
  }
}

function getInitialState(scenarioId: string) {
  if (scenarioId === "zombie-survival") return getZombieInitialState()

  if (scenarioId === "salary-negotiation") {
    const initialAssistantMessage: ChatMessage = {
      role: "assistant",
      content: "The hiring manager is waiting. What’s your next move?",
    }

    return {
      day: 1,
      totalDays: 1,
      board: {
        gridSize: 8,
        playerPosition: { x: 3, y: 4 },
        enemies: [],
        resources: [],
      } satisfies BoardState,
      resources: [
        { name: "Confidence", value: 60, color: "#0071E3", icon: "🗣️" },
        { name: "Leverage", value: 50, color: "#FF9F0A", icon: "⚖️" },
        { name: "Offer", value: 70, color: "#34C759", icon: "💼" },
        { name: "Market", value: 80, color: "#FF3B30", icon: "📊" },
      ] as Resource[],
      actions: [
        { id: "counter", label: "Counter", icon: "✍️", successRate: 65 },
        { id: "benefits", label: "Benefits", icon: "🎁", successRate: 75 },
        { id: "pause", label: "Pause", icon: "⏸️", successRate: 90 },
        { id: "accept", label: "Accept", icon: "✅", successRate: 40 },
      ] as Action[],
      messages: [initialAssistantMessage],
      alert: null as TacticalAlertState | null,
    }
  }

  if (scenarioId === "space-station") {
    const initialAssistantMessage: ChatMessage = {
      role: "assistant",
      content: "Multiple systems are failing. What do you tackle first?",
    }

    return {
      day: 1,
      totalDays: 7,
      board: {
        gridSize: 10,
        playerPosition: { x: 4, y: 4 },
        enemies: [{ x: 6, y: 6, label: "Failure" }],
        resources: [{ x: 2, y: 7, label: "Spare Parts" }],
      } satisfies BoardState,
      resources: [
        { name: "Oxygen", value: 75, color: "#0071E3", icon: "💨" },
        { name: "Power", value: 60, color: "#FF9F0A", icon: "⚡" },
        { name: "Water", value: 40, color: "#34C759", icon: "💧" },
        { name: "Hull", value: 90, color: "#FF3B30", icon: "🛡️" },
      ] as Resource[],
      actions: [
        { id: "repair", label: "Repair", icon: "🧰", successRate: 70 },
        { id: "reroute", label: "Reroute", icon: "🔀", successRate: 55 },
        { id: "scan", label: "Scan", icon: "📡", successRate: 85 },
        { id: "report", label: "Report", icon: "📞", successRate: 95 },
      ] as Action[],
      messages: [initialAssistantMessage],
      alert: null as TacticalAlertState | null,
    }
  }

  const initialAssistantMessage: ChatMessage = {
    role: "assistant",
    content: "A new lead appears. What do you do next?",
  }

  return {
    day: 1,
    totalDays: 1,
    board: {
      gridSize: 10,
      playerPosition: { x: 5, y: 5 },
      enemies: [{ x: 7, y: 4, label: "Suspect" }],
      resources: [{ x: 3, y: 7, label: "Evidence" }],
    } satisfies BoardState,
    resources: [
      { name: "Evidence", value: 25, color: "#34C759", icon: "🧾" },
      { name: "Leads", value: 40, color: "#0071E3", icon: "🧠" },
      { name: "Time", value: 60, color: "#FF9F0A", icon: "⏳" },
      { name: "Pressure", value: 70, color: "#FF3B30", icon: "🚨" },
    ] as Resource[],
    actions: [
      { id: "interview", label: "Interview", icon: "🗣️", successRate: 65 },
      { id: "analyze", label: "Analyze", icon: "🔬", successRate: 80 },
      { id: "stakeout", label: "Stakeout", icon: "👀", successRate: 55 },
      { id: "accuse", label: "Accuse", icon: "⚖️", successRate: 35 },
    ] as Action[],
    messages: [initialAssistantMessage],
    alert: null as TacticalAlertState | null,
  }
}

function LoadingCard({ title, height }: { title: string; height: string }) {
  return (
    <section className={cn(componentCardClassName, "animate-pulse")}>
      <div className="h-6 w-48 rounded bg-[#D2D2D7]" aria-label={title} />
      <div className={cn("mt-6 rounded-lg bg-[#F5F5F7]", height)} />
    </section>
  )
}

function PlayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scenarioId = searchParams.get("scenario") || "zombie-survival"
  const scenario = getScenarioById(scenarioId)

  const [day, setDay] = React.useState(1)
  const [totalDays, setTotalDays] = React.useState(7)
  const [board, setBoard] = React.useState<BoardState | null>(null)
  const [resources, setResources] = React.useState<Resource[]>([])
  const [actions, setActions] = React.useState<Action[]>([])
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [alert, setAlert] = React.useState<TacticalAlertState | null>(null)
  const [input, setInput] = React.useState("")
  const [isLoadingBoard, setIsLoadingBoard] = React.useState(true)
  const [isLoadingResources, setIsLoadingResources] = React.useState(true)
  const [isLoadingActions, setIsLoadingActions] = React.useState(true)

  const reset = React.useCallback(() => {
    const init = getInitialState(scenarioId)

    setDay(init.day)
    setTotalDays(init.totalDays)
    setBoard(null)
    setResources([])
    setActions([])
    setMessages(init.messages)
    setAlert(init.alert)
    setInput("")

    setIsLoadingBoard(true)
    setIsLoadingResources(true)
    setIsLoadingActions(true)

    window.setTimeout(() => {
      setBoard(init.board)
      setIsLoadingBoard(false)
    }, 350)

    window.setTimeout(() => {
      setResources(init.resources)
      setIsLoadingResources(false)
    }, 450)

    window.setTimeout(() => {
      setActions(init.actions)
      setIsLoadingActions(false)
    }, 550)
  }, [scenarioId])

  React.useEffect(() => {
    if (!scenario) return
    reset()
  }, [scenarioId, scenario, reset])

  const progressLabel = scenarioId === "zombie-survival" ? `Day ${day}/${totalDays}` : ""

  const latestAssistantText = React.useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant")
    return last?.content ?? ""
  }, [messages])

  const updateResource = React.useCallback((name: string, delta: number) => {
    setResources((prev) =>
      prev.map((r) =>
        r.name === name
          ? { ...r, value: clamp(0, r.value + delta, 100) }
          : r
      )
    )
  }, [])

  const nudgePlayer = React.useCallback((dx: number, dy: number) => {
    setBoard((prev) => {
      if (!prev) return prev
      const gridSize = prev.gridSize ?? 10
      return {
        ...prev,
        playerPosition: {
          x: clamp(0, prev.playerPosition.x + dx, gridSize - 1),
          y: clamp(0, prev.playerPosition.y + dy, gridSize - 1),
        },
      }
    })
  }, [])

  const runAction = React.useCallback(
    (actionIdOrText: string) => {
      if (!actionIdOrText.trim()) return

      const normalized = actionIdOrText.toLowerCase()
      const userText =
        actions.find((a) => a.id === actionIdOrText)?.label ?? actionIdOrText

      setMessages((prev) => [...prev, { role: "user", content: userText }])
      setInput("")

      window.setTimeout(() => {
        const aiResponse = generateMockResponse(userText)
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])

        if (scenarioId !== "zombie-survival") {
          if (Math.random() > 0.65) {
            setAlert({
              type: "info",
              title: "Update",
              message: "New information comes in. Adjust your plan.",
            })
          }
          return
        }

        if (normalized.includes("move")) {
          nudgePlayer(Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1)
          updateResource("Water", -1)
          setAlert({
            type: "info",
            title: "Relocated",
            message: "You changed position. Stay quiet and keep moving.",
          })
          return
        }

        if (normalized.includes("scavenge")) {
          updateResource("Food", +2)
          updateResource("Ammo", +5)
          setAlert({
            type: "success",
            title: "Supplies Found",
            message: "You found usable supplies in the area.",
          })
          return
        }

        if (normalized.includes("rest")) {
          updateResource("Health", +10)
          setDay((d) => clamp(1, d + 1, totalDays))
          setAlert({
            type: "hint",
            title: "Regroup",
            message: "Resting helps, but time is still passing.",
          })
          return
        }

        if (normalized.includes("fortify")) {
          updateResource("Food", -1)
          setAlert({
            type: "warning",
            title: "Noise",
            message: "Fortifying draws attention. Stay alert.",
          })
          return
        }

        if (Math.random() > 0.7) {
          setAlert({
            type: "warning",
            title: "Nearby Movement",
            message: "You hear shuffling footsteps close by.",
          })
        }
      }, 650)
    },
    [actions, nudgePlayer, scenarioId, totalDays, updateResource]
  )

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
            {progressLabel && (
              <div className="text-xs text-[#6E6E73]">{progressLabel}</div>
            )}
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D1D1F] hover:text-[#0071E3]"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </header>

      {alert && (
        <TacticalAlert
          {...alert}
          onDismiss={() => {
            setAlert(null)
          }}
        />
      )}

      <main className="pb-[96px]">
        <ComponentCanvas>
          {isLoadingBoard || !board ? (
            <LoadingCard title="Game Board" height="h-[520px]" />
          ) : (
            <GameBoard {...board} />
          )}

          {isLoadingResources ? (
            <LoadingCard title="Resources" height="h-[220px]" />
          ) : (
            <ResourceMeter resources={resources} />
          )}

          {isLoadingActions ? (
            <LoadingCard title="Actions" height="h-[220px]" />
          ) : (
            <ActionMatrix actions={actions} onActionClick={runAction} />
          )}

          <section className={cn(componentCardClassName, "mt-4 p-4")}>
            <div className="text-xs font-semibold text-[#6E6E73]">Chat</div>
            <div className="mt-2 max-h-[240px] overflow-y-auto pr-2 text-sm">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{msg.role === "user" ? "You" : "AI"}:</span>{" "}
                  <span className="text-[#1D1D1F]">{msg.content}</span>
                </div>
              ))}
            </div>
            {latestAssistantText && (
              <div className="mt-3 text-xs text-[#6E6E73]">Latest: {latestAssistantText}</div>
            )}
          </section>
        </ComponentCanvas>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-40 h-[80px] bg-white border-t-2 border-[#D2D2D7]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-3 px-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runAction(input)
            }}
            placeholder="Type your action..."
            className={cn(
              "h-12 flex-1 rounded-full border-2 border-[#D2D2D7] bg-white px-4",
              "text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]",
              "focus:outline-none focus:border-[#0071E3]"
            )}
          />
          <button
            type="button"
            onClick={() => runAction(input)}
            className={cn(
              "grid size-12 place-items-center rounded-lg",
              "bg-[#0071E3] text-white",
              "shadow-[2px_2px_0px_#1D1D1F]",
              "hover:bg-[#005BB5]"
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

export default function PlayPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F7] grid place-items-center">
          <div className="text-sm text-[#1D1D1F]">Loading…</div>
        </div>
      }
    >
      <PlayPageContent />
    </React.Suspense>
  )
}

function generateMockResponse(input: string) {
  const normalized = input.toLowerCase()

  if (normalized.includes("move")) {
    return "You move carefully. The city feels too quiet."
  }

  if (normalized.includes("scavenge")) {
    return "You search nearby buildings and gather anything useful."
  }

  if (normalized.includes("rest")) {
    return "You take a moment to breathe. Every sound matters."
  }

  if (normalized.includes("fortify")) {
    return "You reinforce your position, trying not to make too much noise."
  }

  const responses = [
    "You hesitate. Something is watching from the shadows.",
    "A distant groan cuts through the silence.",
    "You keep your senses sharp and plan your next move.",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
