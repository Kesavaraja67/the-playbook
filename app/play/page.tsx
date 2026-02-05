"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RotateCcw, Send } from "lucide-react"

import { ComponentCanvas, componentCardClassName } from "@/components/play/ComponentCanvas"
import {
  SalaryNegotiationActions,
  SalaryNegotiationBriefing,
  SalaryNegotiationMetrics,
} from "@/components/play/SalaryNegotiationUI"
import { CaseFileHeader } from "@/components/scenarios/detective/CaseFileHeader"
import { ClueDisplay } from "@/components/scenarios/detective/ClueDisplay"
import { EvidenceBoard, type EvidenceItem } from "@/components/scenarios/detective/EvidenceBoard"
import { InvestigationActions } from "@/components/scenarios/detective/InvestigationActions"
import { SuspectCards, type Suspect } from "@/components/scenarios/detective/SuspectCards"
import {
  SpaceStationBriefing,
  SpaceStationCommands,
  SpaceStationTelemetry,
} from "@/components/play/SpaceStationUI"
import { ActionMatrix } from "@/components/tambo/ActionMatrix"
import { GameBoard } from "@/components/tambo/GameBoard"
import { ResourceMeter } from "@/components/tambo/ResourceMeter"
import { TacticalAlert } from "@/components/tambo/TacticalAlert"
import { Button } from "@/components/ui/button"
import { getScenarioById, type Scenario } from "@/lib/scenarios"
import { cn } from "@/lib/utils"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

const MAX_MESSAGES = 100

type TacticalAlertState = Omit<React.ComponentProps<typeof TacticalAlert>, "onDismiss">

type BoardState = React.ComponentProps<typeof GameBoard>
type Resource = React.ComponentProps<typeof ResourceMeter>["resources"][number]
type Action = React.ComponentProps<typeof ActionMatrix>["actions"][number]
type ActionInput = string | { id: string; suspectId?: string }

type InitialState = {
  day: number
  totalDays: number
  board: BoardState
  resources: Resource[]
  actions: Action[]
  messages: ChatMessage[]
  alert: TacticalAlertState | null
}

function clamp(min: number, value: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

const DETECTIVE_CASE_TITLE = "The Dockside Murder"
const DETECTIVE_INITIAL_TIME_SECONDS = 48 * 60 * 60
const DETECTIVE_INITIAL_CLUE =
  "A witness saw someone running from the docks at 10 PM. What do you do next?"
const DETECTIVE_SECONDS_PER_TICK = 60

function getDetectiveSuspicionDelta(rand: () => number = Math.random) {
  return rand() > 0.5 ? 12 : -8
}

function getDetectiveTimeCostHours(action: Action | null): number | null {
  const timeCost = action?.costs?.find((cost) => cost.resource === "Time")?.amount ?? null
  return typeof timeCost === "number" ? timeCost : null
}

function getDetectiveInitialEvidence(): EvidenceItem[] {
  return [
    {
      id: "fingerprint",
      icon: "🔍",
      title: "Fingerprint",
      summary: "Partial print lifted from a rusted railing.",
      details:
        "A partial fingerprint, smudged but distinct enough for comparison. The ridge pattern suggests a right thumb.",
      location: "Pier 7 railing",
      timestamp: "10:22 PM",
      collected: true,
    },
    {
      id: "witness-statement",
      icon: "📄",
      title: "Witness Statement",
      summary: "A dockhand saw someone running at 10 PM.",
      details:
        "A witness reports a figure sprinting from the docks at exactly 10:00 PM. The person limped slightly and kept their head down.",
      location: "Harbor lookout",
      timestamp: "10:58 PM",
      collected: true,
    },
    {
      id: "broken-watch",
      icon: "⌚",
      title: "Broken Watch",
      summary: "Stopped at 10:14 PM. Glass shattered.",
      details:
        "A cheap wristwatch with cracked glass. The hands are jammed at 10:14 PM, possibly the moment of impact.",
      location: "Near warehouse door",
      timestamp: "11:03 PM",
      collected: true,
    },
    {
      id: "dock-ledger",
      icon: "📒",
      title: "Dock Ledger",
      summary: "Shipping log with torn pages.",
      details:
        "A ledger used to track cargo. Several pages are missing, ripped out cleanly. The remaining entries mention a late-night transfer.",
      location: "Office drawer",
      timestamp: "—",
      collected: false,
    },
    {
      id: "security-photo",
      icon: "📷",
      title: "Security Photo",
      summary: "Blurry image near the loading cranes.",
      details:
        "A still from a security feed. The timestamp is corrupted, but the silhouette matches someone wearing a heavy coat.",
      location: "Camera tower",
      timestamp: "—",
      collected: false,
    },
    {
      id: "tide-report",
      icon: "🌊",
      title: "Tide Report",
      summary: "High tide at 10:30 PM, low visibility.",
      details:
        "A harbor report showing weather and tides. High tide peaked around 10:30 PM; fog rolled in shortly after, reducing visibility.",
      location: "Harbor master",
      timestamp: "—",
      collected: false,
    },
  ]
}

function getDetectiveInitialSuspects(): Suspect[] {
  return [
    {
      id: "alex-chen",
      avatar: "👤",
      name: "Alex Chen",
      role: "Warehouse Worker",
      shortBio: "Clocked out late. Claims they heard an argument.",
      suspicion: 35,
      interviewed: false,
    },
    {
      id: "maria-lopez",
      avatar: "👤",
      name: "Maria Lopez",
      role: "Ship Captain",
      shortBio: "Insists the victim wasn’t supposed to be on the pier.",
      suspicion: 40,
      interviewed: false,
    },
    {
      id: "jordan-price",
      avatar: "👤",
      name: "Jordan Price",
      role: "Dock Foreman",
      shortBio: "Controls schedules. Nervous when asked about cargo logs.",
      suspicion: 55,
      interviewed: false,
    },
    {
      id: "evelyn-hart",
      avatar: "👤",
      name: "Evelyn Hart",
      role: "Night Security",
      shortBio: "Claims the cameras glitched during the outage.",
      suspicion: 45,
      interviewed: false,
    },
  ]
}

const detectiveInvestigationActions: Action[] = [
  {
    id: "interview",
    icon: "🗣️",
    label: "Interview a suspect",
    description: "Press for details and watch for inconsistencies.",
    successRate: 65,
    costs: [{ resource: "Time", amount: 4 }],
  },
  {
    id: "analyze",
    icon: "🔍",
    label: "Analyze evidence",
    description: "Compare patterns, run quick lab checks, connect clues.",
    successRate: 80,
    costs: [{ resource: "Time", amount: 3 }],
  },
  {
    id: "visit",
    icon: "📍",
    label: "Visit crime scene",
    description: "Reconstruct the timeline and search the area.",
    successRate: 55,
    costs: [{ resource: "Time", amount: 6 }],
  },
  {
    id: "accuse",
    icon: "🚔",
    label: "Make an accusation",
    description: "High stakes. If you’re wrong, the case collapses.",
    successRate: 35,
    costs: [{ resource: "Time", amount: 8 }],
  },
  {
    id: "break",
    icon: "⏸️",
    label: "Take a break",
    description: "Regroup and reduce pressure before the next step.",
    successRate: 100,
    costs: [{ resource: "Time", amount: 1 }],
  },
]

function getZombieInitialState(): InitialState {
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
    { name: "Energy", value: 70, color: "#AF52DE", icon: "⚡" },
    { name: "Materials", value: 40, color: "#8E8E93", icon: "🧱" },
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
    alert: null,
  }
}

function getInitialState(scenarioId: string): InitialState {
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
      alert: null,
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
      alert: null,
    }
  }

  if (scenarioId === "detective-mystery") {
    const initialAssistantMessage: ChatMessage = {
      role: "assistant",
      content: DETECTIVE_INITIAL_CLUE,
    }

    return {
      day: 1,
      totalDays: 1,
      board: {
        gridSize: 1,
        playerPosition: { x: 0, y: 0 },
        enemies: [],
        resources: [],
      } satisfies BoardState,
      resources: [
        { name: "Evidence", value: 35, color: "#34C759", icon: "🧾" },
        { name: "Leads", value: 40, color: "#0071E3", icon: "🧠" },
        { name: "Time", value: 85, color: "#FF9F0A", icon: "⏳" },
        { name: "Pressure", value: 45, color: "#FF3B30", icon: "🚨" },
      ] as Resource[],
      actions: detectiveInvestigationActions,
      messages: [initialAssistantMessage],
      alert: null,
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
    alert: null,
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
            Use the actions below or type your next move in the command bar to continue.
          </div>
        </div>
      </div>
    </section>
  )
}

function PlayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scenarioId = searchParams.get("scenario") || "zombie-survival"
  const scenario = getScenarioById(scenarioId)
  const isBoardScenario = scenario?.layout === "board"

  const [day, setDay] = React.useState(1)
  const [totalDays, setTotalDays] = React.useState(7)
  const [board, setBoard] = React.useState<BoardState | null>(null)
  const [resources, setResources] = React.useState<Resource[]>([])
  const [actions, setActions] = React.useState<Action[]>([])
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [alert, setAlert] = React.useState<TacticalAlertState | null>(null)
  const [input, setInput] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isLoadingBoard, setIsLoadingBoard] = React.useState(true)
  const [isLoadingResources, setIsLoadingResources] = React.useState(true)
  const [isLoadingActions, setIsLoadingActions] = React.useState(true)

  const [detectiveEvidence, setDetectiveEvidence] = React.useState<EvidenceItem[]>(() =>
    getDetectiveInitialEvidence()
  )
  const [detectiveSuspects, setDetectiveSuspects] = React.useState<Suspect[]>(() =>
    getDetectiveInitialSuspects()
  )
  const [detectiveTimeRemainingSeconds, setDetectiveTimeRemainingSeconds] = React.useState(
    DETECTIVE_INITIAL_TIME_SECONDS
  )
  const [detectiveLatestClue, setDetectiveLatestClue] = React.useState(DETECTIVE_INITIAL_CLUE)

  const initTimeoutsRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([])
  const actionTimeoutsRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([])
  const resetVersionRef = React.useRef(0)
  const detectiveEvidenceRef = React.useRef<EvidenceItem[]>(detectiveEvidence)
  const detectiveSuspectsRef = React.useRef<Suspect[]>(detectiveSuspects)
  const detectiveTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const detectiveOutOfTimeAlertShownRef = React.useRef(false)

  React.useEffect(() => {
    return () => {
      for (const id of initTimeoutsRef.current) clearTimeout(id)
      initTimeoutsRef.current = []

      for (const id of actionTimeoutsRef.current) clearTimeout(id)
      actionTimeoutsRef.current = []

      if (detectiveTimerRef.current) {
        clearInterval(detectiveTimerRef.current)
        detectiveTimerRef.current = null
      }
    }
  }, [])

  React.useEffect(() => {
    detectiveEvidenceRef.current = detectiveEvidence
  }, [detectiveEvidence])

  React.useEffect(() => {
    detectiveSuspectsRef.current = detectiveSuspects
  }, [detectiveSuspects])

  React.useEffect(() => {
    if (scenarioId !== "detective-mystery") {
      detectiveOutOfTimeAlertShownRef.current = false

      if (detectiveTimerRef.current) {
        clearInterval(detectiveTimerRef.current)
        detectiveTimerRef.current = null
      }

      return
    }

    if (detectiveTimeRemainingSeconds <= 0) {
      if (detectiveTimerRef.current) {
        clearInterval(detectiveTimerRef.current)
        detectiveTimerRef.current = null
      }

      if (!detectiveOutOfTimeAlertShownRef.current) {
        detectiveOutOfTimeAlertShownRef.current = true
        setAlert({
          type: "warning",
          title: "Case went cold",
          message: "You ran out of time. Reset the case file to try again.",
        })
      }

      return
    }

    detectiveOutOfTimeAlertShownRef.current = false

    if (detectiveTimerRef.current) return

    detectiveTimerRef.current = setInterval(() => {
      setDetectiveTimeRemainingSeconds((prev) =>
        prev > 0 ? Math.max(0, prev - DETECTIVE_SECONDS_PER_TICK) : prev
      )
    }, 1000)
  }, [scenarioId, detectiveTimeRemainingSeconds, setAlert])

  const reset = React.useCallback(() => {
    resetVersionRef.current += 1
    const resetVersion = resetVersionRef.current

    const shouldLoadBoard = getScenarioById(scenarioId)?.layout === "board"

    for (const id of initTimeoutsRef.current) clearTimeout(id)
    initTimeoutsRef.current = []

    for (const id of actionTimeoutsRef.current) clearTimeout(id)
    actionTimeoutsRef.current = []

    const init = getInitialState(scenarioId)

    setDay(init.day)
    setTotalDays(init.totalDays)
    setBoard(null)
    setResources([])
    setActions([])
    setMessages(init.messages)
    setAlert(init.alert)
    setInput("")
    setIsProcessing(false)

    if (scenarioId === "detective-mystery") {
      setDetectiveEvidence(getDetectiveInitialEvidence())
      setDetectiveSuspects(getDetectiveInitialSuspects())
      setDetectiveTimeRemainingSeconds(DETECTIVE_INITIAL_TIME_SECONDS)
      setDetectiveLatestClue(DETECTIVE_INITIAL_CLUE)
    } else {
      setDetectiveEvidence([])
      setDetectiveSuspects([])
      setDetectiveTimeRemainingSeconds(0)
      setDetectiveLatestClue("")
    }

    setIsLoadingBoard(shouldLoadBoard)
    setIsLoadingResources(true)
    setIsLoadingActions(true)

    if (shouldLoadBoard) {
      initTimeoutsRef.current.push(
        setTimeout(() => {
          if (resetVersionRef.current !== resetVersion) return

          setBoard(init.board)
          setIsLoadingBoard(false)
        }, 350)
      )
    }

    initTimeoutsRef.current.push(
      setTimeout(() => {
        if (resetVersionRef.current !== resetVersion) return

        setResources(init.resources)
        setIsLoadingResources(false)
      }, 450)
    )

    initTimeoutsRef.current.push(
      setTimeout(() => {
        if (resetVersionRef.current !== resetVersion) return

        setActions(init.actions)
        setIsLoadingActions(false)
      }, 550)
    )
  }, [scenarioId])

  React.useEffect(() => {
    if (!scenario) return
    reset()
  }, [scenarioId, scenario, reset])

  const progressLabel = scenarioId === "zombie-survival" ? `Day ${day}/${totalDays}` : ""

  const latestAssistantText = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") return messages[i].content
    }
    return ""
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

  const effectiveIsLoadingBoard = isBoardScenario && isLoadingBoard
  const isInitializing = effectiveIsLoadingBoard || isLoadingResources || isLoadingActions
  const isBusy = isProcessing || isInitializing
  const isDetectiveOutOfTime =
    scenarioId === "detective-mystery" && detectiveTimeRemainingSeconds <= 0
  const canReset = !isBusy

  const runAction = React.useCallback(
    (actionInput: ActionInput) => {
      const actionIdOrText = typeof actionInput === "string" ? actionInput : actionInput.id
      const interviewSuspectIdAtCall =
        typeof actionInput === "string" ? null : actionInput.suspectId ?? null

      if (!actionIdOrText.trim() || isBusy) return

      if (scenarioId === "detective-mystery" && detectiveTimeRemainingSeconds <= 0) {
        setAlert({
          type: "warning",
          title: "Case went cold",
          message: "You ran out of time. Reset the case file to try again.",
        })
        return
      }

      const scenarioAtCall = scenarioId
      const totalDaysAtCall = totalDays
      const resetVersionAtCall = resetVersionRef.current
      const normalized = actionIdOrText.toLowerCase()
      const userText =
        actions.find((a) => a.id === actionIdOrText)?.label ?? actionIdOrText

      setMessages((prev) => {
        const next = [...prev, { role: "user" as const, content: userText }]
        return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
      })
      setInput("")
      setIsProcessing(true)

      const timeoutId = setTimeout(() => {
        actionTimeoutsRef.current = actionTimeoutsRef.current.filter((id) => id !== timeoutId)
        if (resetVersionRef.current !== resetVersionAtCall) return

        const aiResponse = generateMockResponse(userText, scenarioAtCall)
        setMessages((prev) => {
          const next = [...prev, { role: "assistant" as const, content: aiResponse }]
          return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
        })

        if (scenarioAtCall === "detective-mystery") {
          setDetectiveLatestClue(aiResponse)

          const actionDef =
            actions.find((action) => action.id === actionIdOrText) ??
            actions.find((action) => action.label.toLowerCase() === normalized.trim()) ??
            null

          const timeCostHours = getDetectiveTimeCostHours(actionDef)

          if (typeof timeCostHours === "number") {
            setDetectiveTimeRemainingSeconds((prev) =>
              Math.max(0, prev - timeCostHours * 60 * 60)
            )
          }

          const revealNextEvidence = (timestamp: string) => {
            if (!detectiveEvidenceRef.current.some((item) => !item.collected)) return false

            setDetectiveEvidence((prev) =>
              (() => {
                const nextEvidence = prev.find((item) => !item.collected)
                if (!nextEvidence) return prev

                return prev.map((item) =>
                  item.id === nextEvidence.id
                    ? { ...item, collected: true, timestamp }
                    : item
                )
              })()
            )

            return true
          }

          if (actionDef?.id === "interview") {
            const suspectId =
              interviewSuspectIdAtCall ??
              detectiveSuspectsRef.current.find((suspect) => !suspect.interviewed)?.id ??
              detectiveSuspectsRef.current[0]?.id

            if (suspectId) {
              setDetectiveSuspects((prev) =>
                prev.map((suspect) => {
                  if (suspect.id !== suspectId) return suspect
                  const delta = getDetectiveSuspicionDelta()
                  return {
                    ...suspect,
                    interviewed: true,
                    suspicion: clamp(0, suspect.suspicion + delta, 100),
                  }
                })
              )

              setAlert({
                type: "info",
                title: "Interview logged",
                message: "You note inconsistencies and tighten the timeline.",
              })
            }

            setIsProcessing(false)
            return
          }

          if (actionDef?.id === "analyze") {
            const foundEvidence = revealNextEvidence("Just now")

            if (foundEvidence) {
              setAlert({
                type: "success",
                title: "Evidence analyzed",
                message: "A detail stands out. The case board gets sharper.",
              })
            } else {
              setAlert({
                type: "hint",
                title: "No new samples",
                message: "You’ve already processed everything on hand.",
              })
            }

            setIsProcessing(false)
            return
          }

          if (actionDef?.id === "visit") {
            const foundEvidence = revealNextEvidence("Recovered")

            if (foundEvidence) {
              setAlert({
                type: "success",
                title: "Scene revisited",
                message: "You recover something everyone missed the first time.",
              })
            } else {
              setAlert({
                type: "info",
                title: "Quiet scene",
                message: "Nothing new. The docks feel colder than before.",
              })
            }

            setIsProcessing(false)
            return
          }

          if (actionDef?.id === "accuse") {
            const successRate = actionDef?.successRate ?? 35
            const succeeded = Math.random() * 100 < successRate

            setAlert(
              succeeded
                ? {
                    type: "success",
                    title: "Accusation hits",
                    message: "Your theory rattles them. Something slips.",
                  }
                : {
                    type: "warning",
                    title: "Accusation backfires",
                    message: "You don’t have enough. The room turns against you.",
                  }
            )

            setIsProcessing(false)
            return
          }

          if (actionDef?.id === "break") {
            setAlert({
              type: "hint",
              title: "Take a breath",
              message: "You regroup and return with clearer eyes.",
            })
            setIsProcessing(false)
            return
          }

          setIsProcessing(false)
          return
        }

        if (scenarioAtCall !== "zombie-survival") {
          if (Math.random() > 0.65) {
            setAlert({
              type: "info",
              title: "Update",
              message: "New information comes in. Adjust your plan.",
            })
          }
          setIsProcessing(false)
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
          setIsProcessing(false)
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
          setIsProcessing(false)
          return
        }

        if (normalized.includes("rest")) {
          updateResource("Health", +10)
          setDay((d) => clamp(1, d + 1, totalDaysAtCall))
          setAlert({
            type: "hint",
            title: "Regroup",
            message: "Resting helps, but time is still passing.",
          })
          setIsProcessing(false)
          return
        }

        if (normalized.includes("fortify")) {
          updateResource("Food", -1)
          setAlert({
            type: "warning",
            title: "Noise",
            message: "Fortifying draws attention. Stay alert.",
          })
          setIsProcessing(false)
          return
        }

        if (Math.random() > 0.7) {
          setAlert({
            type: "warning",
            title: "Nearby Movement",
            message: "You hear shuffling footsteps close by.",
          })
        }

        setIsProcessing(false)
      }, 650)

      actionTimeoutsRef.current.push(timeoutId)
    },
    [
      actions,
      detectiveTimeRemainingSeconds,
      isBusy,
      nudgePlayer,
      scenarioId,
      totalDays,
      updateResource,
    ]
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

  const resolvedScenario = scenario

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
            <div className="text-sm font-bold">{resolvedScenario.title}</div>
            {progressLabel && (
              <div className="text-xs text-[#6E6E73]">{progressLabel}</div>
            )}
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={!canReset}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold text-[#1D1D1F]",
              !canReset ? "cursor-not-allowed opacity-60" : "hover:text-[#0071E3]"
            )}
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
          {isBoardScenario ? (
            isLoadingBoard || !board ? (
              <LoadingCard title="Game Board" height="h-[520px]" />
            ) : (
              <GameBoard {...board} />
            )
          ) : scenarioId === "salary-negotiation" ? (
            <SalaryNegotiationBriefing scenario={scenario} />
          ) : scenarioId === "space-station" ? (
            <SpaceStationBriefing scenario={scenario} />
          ) : scenarioId === "detective-mystery" ? (
            <CaseFileHeader
              caseTitle={DETECTIVE_CASE_TITLE}
              caseSummary={scenario.description}
              timeRemainingSeconds={detectiveTimeRemainingSeconds}
              suspectCount={detectiveSuspects.length}
              evidenceCollected={detectiveEvidence.filter((item) => item.collected).length}
              evidenceTotal={detectiveEvidence.length}
            />
          ) : (
            <ScenarioBriefingCard scenario={resolvedScenario} />
          )}

          {isLoadingResources ? (
            <LoadingCard
              title={
                isBoardScenario
                  ? "Resources"
                  : scenarioId === "salary-negotiation"
                    ? "Negotiation Signals"
                    : scenarioId === "space-station"
                      ? "Station Telemetry"
                      : scenarioId === "detective-mystery"
                        ? "Evidence Board"
                        : "Resources"
              }
              height={scenarioId === "detective-mystery" ? "h-[420px]" : "h-[220px]"}
            />
          ) : isBoardScenario ? (
            <ResourceMeter resources={resources} />
          ) : scenarioId === "salary-negotiation" ? (
            <SalaryNegotiationMetrics resources={resources} />
          ) : scenarioId === "space-station" ? (
            <SpaceStationTelemetry resources={resources} />
          ) : scenarioId === "detective-mystery" ? (
            <>
              <EvidenceBoard evidence={detectiveEvidence} />
              <SuspectCards
                className="mt-4"
                suspects={detectiveSuspects}
                disabled={isBusy || isDetectiveOutOfTime}
                onInterviewSuspect={(suspectId) => {
                  if (isBusy || isDetectiveOutOfTime) return
                  runAction({ id: "interview", suspectId })
                }}
              />
            </>
          ) : (
            <ResourceMeter resources={resources} />
          )}

          {isLoadingActions ? (
            <LoadingCard
              title={
                isBoardScenario
                  ? "Actions"
                  : scenarioId === "salary-negotiation"
                    ? "Talking Points"
                    : scenarioId === "space-station"
                      ? "Command Deck"
                      : scenarioId === "detective-mystery"
                        ? "Investigation Actions"
                        : "Actions"
              }
              height="h-[220px]"
            />
          ) : isBoardScenario ? (
            <ActionMatrix
              actions={actions}
              onActionClick={runAction}
              disabled={isBusy}
            />
          ) : scenarioId === "salary-negotiation" ? (
            <SalaryNegotiationActions actions={actions} onActionClick={runAction} disabled={isBusy} />
          ) : scenarioId === "space-station" ? (
            <SpaceStationCommands actions={actions} onActionClick={runAction} disabled={isBusy} />
          ) : scenarioId === "detective-mystery" ? (
            <InvestigationActions
              actions={actions}
              onActionClick={runAction}
              disabled={isBusy || isDetectiveOutOfTime}
            />
          ) : (
            <ActionMatrix
              actions={actions}
              onActionClick={runAction}
              disabled={isBusy}
            />
          )}

          {scenarioId === "detective-mystery" && (
            <ClueDisplay className="mt-4" clue={detectiveLatestClue} />
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
              const isPlainEnter =
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.metaKey

              if (!isPlainEnter) return
              if (e.nativeEvent.isComposing) return
              if (!input.trim()) return

              e.preventDefault()
              runAction(input)
            }}
            disabled={isBusy || isDetectiveOutOfTime}
            placeholder="Type your action..."
            className={cn(
              "h-12 flex-1 rounded-full border-2 border-[#D2D2D7] bg-white px-4",
              "text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]",
              "focus:outline-none focus:border-[#0071E3]",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          />
          <button
            type="button"
            onClick={() => {
              if (!isBusy && !isDetectiveOutOfTime) runAction(input)
            }}
            disabled={isBusy || isDetectiveOutOfTime}
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

function generateMockResponse(input: string, scenarioId: string) {
  const normalized = input.toLowerCase()

  if (scenarioId === "salary-negotiation") {
    if (normalized.includes("counter")) return "You counter with a clear, confident number."
    if (normalized.includes("benefit")) return "You ask about benefits and flexibility instead of only salary."
    if (normalized.includes("pause")) return "You take a beat to gather your leverage and stay composed."
    if (normalized.includes("accept")) return "You accept, but you note the key terms you want in writing."

    const responses = [
      "You keep the conversation friendly and focused.",
      "They listen closely and consider your reasoning.",
      "You ask a direct question and wait for their response.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (scenarioId === "space-station") {
    if (normalized.includes("repair")) return "You start repairs and monitor the system readouts."
    if (normalized.includes("reroute")) return "You reroute power and stabilize the most critical subsystem."
    if (normalized.includes("scan")) return "Diagnostics reveal more issues than expected."
    if (normalized.includes("report")) return "Mission control acknowledges and requests updated telemetry."

    const responses = [
      "Alarms fade for a moment, then another warning comes online.",
      "The station shudders slightly as systems re-balance.",
      "You prioritize based on risk and available resources.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (scenarioId === "detective-mystery") {
    if (normalized.includes("interview")) return "You press for details and watch for inconsistencies."
    if (normalized.includes("analyze")) return "You analyze the evidence and identify a useful pattern."
    if (normalized.includes("stakeout")) return "You wait it out. Someone slips up."
    if (normalized.includes("accuse")) return "You make your accusation and gauge the reaction."

    const responses = [
      "A new clue narrows the timeline.",
      "One lead goes cold, but another gets hotter.",
      "You connect two facts that didn’t seem related before.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

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
