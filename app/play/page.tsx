"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RotateCcw } from "lucide-react"

import { ComponentCanvas, componentCardClassName } from "@/components/play/ComponentCanvas"
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
import { PythonTutorialUI } from "@/components/play/PythonTutorialUI"
import { HowToPlayPanel } from "@/components/scenarios/HowToPlayPanel"
import { ConversationThread } from "@/components/scenarios/negotiation/ConversationThread"
import { NegotiationDashboard } from "@/components/scenarios/negotiation/NegotiationDashboard"
import { QuickResponseButtons } from "@/components/scenarios/negotiation/QuickResponseButtons"
import { ActionMatrix } from "@/components/tambo/ActionMatrix"
import { GameBoard } from "@/components/tambo/GameBoard"
import { ResourceMeter } from "@/components/tambo/ResourceMeter"
import { TacticalAlert } from "@/components/tambo/TacticalAlert"
import { Button } from "@/components/ui/button"
import { getScenarioById, type Scenario } from "@/lib/scenarios"
import { cn } from "@/lib/utils"

const VoiceInput = dynamic(
  () => import("@/components/play/VoiceInput").then((mod) => mod.VoiceInput),
  { ssr: false }
)

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

const MAX_MESSAGES = 100

type TacticalAlertState = Omit<React.ComponentProps<typeof TacticalAlert>, "onDismiss">

type BoardState = React.ComponentProps<typeof GameBoard>
type Resource = React.ComponentProps<typeof ResourceMeter>["resources"][number]
type Action = React.ComponentProps<typeof ActionMatrix>["actions"][number]

type InitialState = {
  day: number
  totalDays: number
  board: BoardState
  resources: Resource[]
  actions: Action[]
  messages: ChatMessage[]
  alert: TacticalAlertState | null
}

type SpaceStationDecision = {
  deltas: Array<{ name: string; delta: number }>
  alert: TacticalAlertState
}

function applySpaceStationDecision(normalized: string): SpaceStationDecision | null {
  const isRepairO2 =
    normalized === "repair_o2" ||
    normalized.includes("repair o2") ||
    (normalized.includes("repair") && (normalized.includes("oxygen") || normalized.includes("o2")))

  if (isRepairO2) {
    return {
      deltas: [
        { name: "Oxygen", delta: +12 },
        { name: "Power", delta: -8 },
      ],
      alert: {
        type: "success",
        title: "Repair Attempt",
        message: "Oxygen generation stabilizes. Continue monitoring telemetry.",
      },
    }
  }

  const isRestorePower =
    normalized === "restore_power" ||
    normalized.includes("restore power") ||
    normalized.includes("restore_power")

  if (isRestorePower) {
    return {
      deltas: [
        { name: "Power", delta: +15 },
        { name: "Solar Output", delta: +8 },
        { name: "Oxygen", delta: -2 },
      ],
      alert: {
        type: "info",
        title: "Power Routing",
        message: "Power distribution rebalanced. Watch for secondary failures.",
      },
    }
  }

  const isInspectWater =
    normalized === "inspect_water" ||
    normalized.includes("inspect water") ||
    (normalized.includes("inspect") && normalized.includes("water"))

  if (isInspectWater) {
    return {
      deltas: [
        { name: "Water", delta: +10 },
        { name: "Power", delta: -4 },
      ],
      alert: {
        type: "success",
        title: "Water Recycler",
        message: "Recycler performance improves. Reduced risk of rationing.",
      },
    }
  }

  const isRealignSolar =
    normalized === "realign_solar" ||
    normalized.includes("realign solar") ||
    (normalized.includes("realign") && normalized.includes("solar"))

  if (isRealignSolar) {
    return {
      deltas: [
        { name: "Solar Output", delta: +15 },
        { name: "Power", delta: +6 },
      ],
      alert: {
        type: "success",
        title: "Solar Array",
        message: "Solar capture efficiency increases. Power reserves climbing.",
      },
    }
  }

  const isBoostMorale =
    normalized === "boost_morale" ||
    normalized.includes("boost morale") ||
    (normalized.includes("boost") && normalized.includes("morale"))

  if (isBoostMorale) {
    return {
      deltas: [
        { name: "Morale", delta: +10 },
        { name: "Food", delta: -5 },
      ],
      alert: {
        type: "info",
        title: "Crew Update",
        message: "Crew morale improves. Maintain clear, calm directives.",
      },
    }
  }

  const isCallForHelp =
    normalized === "call_for_help" ||
    normalized.includes("call for help") ||
    (normalized.includes("call") && normalized.includes("help"))

  if (isCallForHelp) {
    return {
      deltas: [
        { name: "Power", delta: -2 },
        { name: "Morale", delta: +4 },
      ],
      alert: {
        type: "info",
        title: "Mission Control",
        message: "Mission control acknowledges. Awaiting updated status report.",
      },
    }
  }

  return null
}

function clamp(min: number, value: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

function asNumber(value: unknown, fallback: number, fieldName?: string) {
  const isValid = typeof value === "number" && Number.isFinite(value)

  if (!isValid && fieldName && process.env.NODE_ENV !== "production") {
    console.warn(`Invalid numeric value for ${fieldName}; using fallback.`, {
      value,
      fallback,
    })
  }

  return isValid ? value : fallback
}

function getSalaryNegotiationConfig(initialState: Record<string, unknown>) {
  return {
    currentOffer: asNumber(
      initialState["currentOffer"],
      120_000,
      "salary-negotiation.currentOffer"
    ),
    targetSalary: asNumber(
      initialState["targetSalary"],
      150_000,
      "salary-negotiation.targetSalary"
    ),
    marketRate: asNumber(initialState["marketRate"], 135_000, "salary-negotiation.marketRate"),
    relationshipScore: asNumber(
      initialState["relationshipScore"],
      75,
      "salary-negotiation.relationshipScore"
    ),
  }
}

const DETECTIVE_CASE_TITLE = "The Dockside Murder"
const DETECTIVE_INITIAL_TIME_SECONDS = 48 * 60 * 60
const DETECTIVE_INITIAL_CLUE =
  "A witness saw someone running from the docks at 10 PM. What do you do next?"
const DETECTIVE_SECONDS_PER_TICK = 60

function getDetectiveTimeCostHours(action: Action | null): number | null {
  const timeCost = action?.costs?.find((cost) => cost.resource === "Time")?.amount ?? null
  return typeof timeCost === "number" && Number.isFinite(timeCost) ? timeCost : null
}

function getDetectiveTimeCostSeconds(action: Action | null): number | null {
  const timeCostHours = getDetectiveTimeCostHours(action)
  return typeof timeCostHours === "number" ? timeCostHours * 60 * 60 : null
}

function getDetectiveSuspicionDelta(rand: () => number = Math.random) {
  return rand() > 0.5 ? 12 : -8
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
    const currentOffer = 120_000
    const targetSalary = 150_000
    const marketRate = 135_000

    const initialAssistantMessage: ChatMessage = {
      role: "assistant",
      content:
        "We’re excited to offer you the Senior Developer position at $120,000/year. What are your thoughts?",
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
        { name: "Relationship", value: 75, color: "#34C759", icon: "🤝" },
        { name: "Confidence", value: 70, color: "#0071E3", icon: "🗣️" },
        { name: "Leverage", value: 65, color: "#FF9F0A", icon: "⚖️" },
        {
          name: "Offer",
          value: Math.round((currentOffer / targetSalary) * 100),
          color: "#0071E3",
          icon: "💼",
        },
        {
          name: "Market",
          value: Math.round((marketRate / targetSalary) * 100),
          color: "#FF3B30",
          icon: "📊",
        },
      ] as Resource[],
      actions: [
        { id: "market-data", label: "Share market data", icon: "📊" },
        { id: "counter", label: "Counter offer", icon: "✍️" },
        { id: "benefits", label: "Ask about benefits", icon: "🎁" },
        { id: "accept", label: "Accept offer", icon: "✅" },
      ] as Action[],
      messages: [initialAssistantMessage],
      alert: null,
    }
  }

  if (scenarioId === "space-station") {
    const initialAssistantMessage: ChatMessage = {
      role: "assistant",
      content: "Emergency protocols active. State your first priority.",
    }

    return {
      day: 1,
      totalDays: 14,
      board: {
        gridSize: 10,
        playerPosition: { x: 4, y: 4 },
        enemies: [{ x: 6, y: 6, label: "Failure" }],
        resources: [{ x: 2, y: 7, label: "Spare Parts" }],
      } satisfies BoardState,
      resources: [
        { name: "Oxygen", value: 75, color: "#0071E3", icon: "⚙️" },
        { name: "Power", value: 60, color: "#FF9F0A", icon: "⚡" },
        { name: "Solar Output", value: 60, color: "#34C759", icon: "📡" },
        { name: "Water", value: 65, color: "#34C759", icon: "⚙️" },
        { name: "Food", value: 55, color: "#FF9F0A", icon: "📦" },
        { name: "Crew Health", value: 100, color: "#34C759", icon: "⚕️" },
        { name: "Morale", value: 80, color: "#5E5CE6", icon: "📈" },
      ] as Resource[],
      actions: [
        {
          id: "repair_o2",
          label: "Repair O2 Generator",
          icon: "🔧",
          costs: [
            { resource: "Power", amount: 10 },
            { resource: "Time", amount: 4 },
          ],
        },
        {
          id: "restore_power",
          label: "Restore Power",
          icon: "⚡",
          costs: [
            { resource: "Time", amount: 3 },
          ],
        },
        {
          id: "inspect_water",
          label: "Inspect Water Recycler",
          icon: "⚙️",
          costs: [
            { resource: "Power", amount: 5 },
            { resource: "Time", amount: 2 },
          ],
        },
        {
          id: "realign_solar",
          label: "Realign Solar Panels",
          icon: "📊",
          costs: [
            { resource: "Time", amount: 2 },
          ],
        },
        {
          id: "boost_morale",
          label: "Boost Crew Morale",
          icon: "👥",
          costs: [
            { resource: "Time", amount: 2 },
          ],
        },
        {
          id: "call_for_help",
          label: "Call for Help",
          icon: "📡",
          costs: [
            { resource: "Power", amount: 3 },
            { resource: "Time", amount: 1 },
          ],
        },
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

  if (scenario && scenario.layout === "tutorial") {
    return <PythonTutorialUI scenario={scenario} />
  }

  return (
    <StandardPlayPageContent router={router} scenarioId={scenarioId} scenario={scenario} />
  )
}

function StandardPlayPageContent({
  router,
  scenarioId,
  scenario,
}: {
  router: ReturnType<typeof useRouter>
  scenarioId: string
  scenario: Scenario | undefined
}) {
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
  const [conversationStartMs, setConversationStartMs] = React.useState(() => Date.now())

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
  const detectiveOutOfTimeAlertShownRef = React.useRef(false)

  const showDetectiveOutOfTimeAlert = React.useCallback(() => {
    if (detectiveOutOfTimeAlertShownRef.current) return

    detectiveOutOfTimeAlertShownRef.current = true
    setAlert({
      type: "warning",
      title: "Case went cold",
      message: "You ran out of time. Reset the case file to try again.",
    })
  }, [setAlert])

  React.useEffect(() => {
    return () => {
      for (const id of initTimeoutsRef.current) clearTimeout(id)
      initTimeoutsRef.current = []

      for (const id of actionTimeoutsRef.current) clearTimeout(id)
      actionTimeoutsRef.current = []
    }
  }, [])

  React.useEffect(() => {
    detectiveEvidenceRef.current = detectiveEvidence
  }, [detectiveEvidence])

  React.useEffect(() => {
    detectiveSuspectsRef.current = detectiveSuspects
  }, [detectiveSuspects])

  const shouldRunDetectiveTimer =
    scenarioId === "detective-mystery" && detectiveTimeRemainingSeconds > 0

  React.useEffect(() => {
    if (!shouldRunDetectiveTimer) return

    const id = setInterval(() => {
      setDetectiveTimeRemainingSeconds((prev) =>
        prev > 0 ? Math.max(0, prev - DETECTIVE_SECONDS_PER_TICK) : prev
      )
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [shouldRunDetectiveTimer])

  React.useEffect(() => {
    if (scenarioId !== "detective-mystery") {
      detectiveOutOfTimeAlertShownRef.current = false
      return
    }

    if (detectiveTimeRemainingSeconds > 0) {
      detectiveOutOfTimeAlertShownRef.current = false
      return
    }

    showDetectiveOutOfTimeAlert()
  }, [scenarioId, detectiveTimeRemainingSeconds, showDetectiveOutOfTimeAlert])

  const reset = (nextScenarioId: string) => {
    resetVersionRef.current += 1
    const resetVersion = resetVersionRef.current

    const shouldLoadBoard = getScenarioById(nextScenarioId)?.layout === "board"

    for (const id of initTimeoutsRef.current) clearTimeout(id)
    initTimeoutsRef.current = []

    for (const id of actionTimeoutsRef.current) clearTimeout(id)
    actionTimeoutsRef.current = []

    const init = getInitialState(nextScenarioId)
    setConversationStartMs(Date.now())

    setDay(init.day)
    setTotalDays(init.totalDays)
    setBoard(null)
    setResources([])
    setActions([])
    setMessages(init.messages)
    setAlert(init.alert)
    setInput("")
    setIsProcessing(false)

    if (nextScenarioId === "detective-mystery") {
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
  }

  React.useEffect(() => {
    if (!scenario) return
    reset(scenarioId)
  }, [scenarioId, scenario])

  const progressLabel =
    scenarioId === "zombie-survival" || scenarioId === "space-station"
      ? `Day ${day}/${totalDays}`
      : ""

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

  const runAction = (
    actionIdOrText: string,
    options?: {
      clearInput?: boolean
    }
  ) => {
    const trimmed = actionIdOrText.trim()
    if (!trimmed || isBusy) return

    if (scenarioId === "detective-mystery" && detectiveTimeRemainingSeconds <= 0) {
      showDetectiveOutOfTimeAlert()
      return
    }

    const interviewSuspectIdAtCall =
      scenarioId === "detective-mystery" && trimmed.startsWith("interview:")
        ? trimmed.slice("interview:".length).trim() || null
        : null

    const actionIdAtCall = interviewSuspectIdAtCall ? "interview" : trimmed

    const scenarioAtCall = scenarioId
      const totalDaysAtCall = totalDays
      const resetVersionAtCall = resetVersionRef.current
      const normalized = actionIdAtCall.toLowerCase()
      const userText =
        actions.find((a) => a.id === actionIdAtCall)?.label ?? trimmed

      setMessages((prev) => {
        const next = [...prev, { role: "user" as const, content: userText }]
        return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
      })
      if (options?.clearInput !== false) setInput("")
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
            actions.find((action) => action.id === actionIdAtCall) ??
            actions.find((action) => action.label.toLowerCase() === normalized.trim()) ??
            null

          const timeCostSeconds = getDetectiveTimeCostSeconds(actionDef)

          if (typeof timeCostSeconds === "number" && timeCostSeconds > 0) {
            setDetectiveTimeRemainingSeconds((prev) =>
              Math.max(0, prev - timeCostSeconds)
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

        if (scenarioAtCall === "space-station") {
          setDay((d) => clamp(1, d + 1, totalDaysAtCall))

          const outcome = applySpaceStationDecision(normalized)
          if (outcome) {
            for (const delta of outcome.deltas) {
              updateResource(delta.name, delta.delta)
            }
            setAlert(outcome.alert)
            setIsProcessing(false)
            return
          }

          if (Math.random() > 0.6) {
            setAlert({
              type: "warning",
              title: "New Alert",
              message: "A new fault appears. Re-evaluate priorities.",
            })
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
  }

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
  const headerTitle =
    scenarioId === "space-station" ? "Space Station Emergency Simulation" : resolvedScenario.title

  const resolvedSalaryConfig =
    scenarioId === "salary-negotiation"
      ? getSalaryNegotiationConfig(resolvedScenario.initialState)
      : {
          currentOffer: 120_000,
          targetSalary: 150_000,
          marketRate: 135_000,
          relationshipScore: 75,
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
            <div className="text-sm font-bold">{headerTitle}</div>
            {progressLabel && (
              <div className="text-xs text-[#6E6E73]">{progressLabel}</div>
            )}
          </div>

          <button
            type="button"
            onClick={() => reset(scenarioId)}
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

      <main className={cn(scenarioId === "salary-negotiation" ? "pb-10" : "pb-[96px]")}>
        <ComponentCanvas>
          {scenarioId === "salary-negotiation" ? (
            <>
              <section className={componentCardClassName}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl" aria-hidden>
                    {resolvedScenario.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">Negotiation Guide</h3>
                    <div className="mt-1 text-sm text-secondary">
                      You’re negotiating for a Senior Developer role.
                    </div>
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-primary">
                      <li>Be professional and respectful.</li>
                      <li>Present your value clearly.</li>
                      <li>Listen to the recruiter’s concerns.</li>
                      <li>Look for win-win tradeoffs.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className={componentCardClassName}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Conversation</h3>
                    <div className="mt-1 text-sm text-secondary">
                      Keep it calm, clear, and collaborative.
                    </div>
                  </div>
                </div>

                <ConversationThread
                  className="mt-4 max-h-[420px] pr-2"
                  messages={messages.map((msg, index) => {
                    const sender = msg.role === "assistant" ? "recruiter" : "you"
                    const avatar = msg.role === "assistant" ? "👔" : "👤"
                    const time = new Date(
                      conversationStartMs + index * 2 * 60 * 1000
                    ).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })

                    return {
                      sender,
                      avatar,
                      time,
                      content: msg.content,
                    }
                  })}
                />
              </section>

              {isLoadingResources ? (
                <LoadingCard title="Negotiation Dashboard" height="h-[220px]" />
              ) : (
                <section className={componentCardClassName}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">Negotiation Dashboard</h3>
                      <div className="mt-1 text-sm text-secondary">Key info, without the game feel.</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <NegotiationDashboard
                      currentOffer={resolvedSalaryConfig.currentOffer}
                      targetSalary={resolvedSalaryConfig.targetSalary}
                      marketRate={resolvedSalaryConfig.marketRate}
                      relationshipScore={resolvedSalaryConfig.relationshipScore}
                      leveragePoints={[
                        "5+ years of experience shipping production systems",
                        "Specialized skills in AI/ML and performance optimization",
                        "Competing offer in hand",
                      ]}
                    />
                  </div>
                </section>
              )}

              {isLoadingActions ? (
                <LoadingCard title="Your Response" height="h-[220px]" />
              ) : (
                <section className={componentCardClassName}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">Your Response</h3>
                      <div className="mt-1 text-sm text-secondary">Write a clear, respectful message.</div>
                    </div>
                    {isBusy && <div className="text-xs font-semibold text-secondary">Busy…</div>}
                  </div>

                  <VoiceInput
                    className="mt-4"
                    value={input}
                    onChange={setInput}
                    onSubmit={(value) => runAction(value)}
                    disabled={isBusy}
                    placeholder="Write your response…"
                    multiline
                  />

                  <div className="mt-4">
                    <div className="text-xs font-semibold text-secondary">Quick Responses</div>
                    <QuickResponseButtons
                      className="mt-2"
                      actions={actions.map((action) => ({ id: action.id, label: action.label }))}
                      onSelect={runAction}
                      disabled={isBusy}
                    />
                  </div>
                </section>
              )}
            </>
          ) : (
            <>
              {isBoardScenario ? (
                <>
                  {scenarioId === "zombie-survival" && <HowToPlayPanel />}
                  {isLoadingBoard || !board ? (
                    <LoadingCard title="Game Board" height="h-[520px]" />
                  ) : (
                    <GameBoard {...board} />
                  )}
                </>
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
                      : scenarioId === "space-station"
                        ? "Station Telemetry"
                        : scenarioId === "detective-mystery"
                          ? "Case Metrics"
                          : "Resources"
                  }
                  height={scenarioId === "detective-mystery" ? "h-[420px]" : "h-[220px]"}
                />
              ) : isBoardScenario ? (
                <ResourceMeter resources={resources} />
              ) : scenarioId === "space-station" ? (
                <SpaceStationTelemetry
                  resources={resources}
                  day={day}
                  totalDays={totalDays}
                  onActionClick={runAction}
                  disabled={isBusy}
                />
              ) : scenarioId === "detective-mystery" ? (
                <>
                  <EvidenceBoard evidence={detectiveEvidence} />
                  <SuspectCards
                    className="mt-4"
                    suspects={detectiveSuspects}
                    disabled={isBusy || isDetectiveOutOfTime}
                    onInterviewSuspect={(suspectId) => {
                      if (isBusy || isDetectiveOutOfTime) return
                      runAction(`interview:${suspectId}`)
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
                      : scenarioId === "space-station"
                        ? "Command Deck"
                        : scenarioId === "detective-mystery"
                          ? "Investigation Notebook"
                          : "Actions"
                  }
                  height="h-[220px]"
                />
              ) : isBoardScenario ? (
                <ActionMatrix actions={actions} onActionClick={runAction} disabled={isBusy} />
              ) : scenarioId === "space-station" ? (
                <SpaceStationCommands actions={actions} onActionClick={runAction} disabled={isBusy} />
              ) : scenarioId === "detective-mystery" ? (
                <InvestigationActions
                  actions={actions}
                  onActionClick={runAction}
                  disabled={isBusy || isDetectiveOutOfTime}
                />
              ) : (
                <ActionMatrix actions={actions} onActionClick={runAction} disabled={isBusy} />
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
            </>
          )}
        </ComponentCanvas>
      </main>

      {scenarioId === "salary-negotiation" ? null : (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-[#D2D2D7] py-4">
          <div className="mx-auto max-w-[1200px] px-6">
            <VoiceInput
              value={input}
              onChange={setInput}
              onSubmit={(value) => runAction(value)}
              disabled={isBusy}
              placeholder={scenarioId === "space-station" ? "Type your decision..." : "Type your action..."}
              inputClassName="rounded-full bg-white border-[#D2D2D7] focus:border-[#0071E3]"
            />
          </div>
        </div>
      )}
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
    if (normalized.includes("market") || normalized.includes("data")) {
      return "Thanks for sharing — could you send the sources or the range you’re referencing? That’ll help me align with our compensation team."
    }
    if (normalized.includes("counter")) {
      return "I appreciate the context. Our initial offer is based on the level’s band, but we do have some flexibility. What range are you targeting, and what’s most important to you?"
    }
    if (normalized.includes("benefit")) {
      return "Absolutely. We can look at the full package — base, bonus, equity, and benefits. Are you optimizing more for base salary, total compensation, or flexibility?"
    }
    if (normalized.includes("pause") || normalized.includes("time")) {
      return "Of course — take the time you need. When would you like to reconnect, and is there anything I can send over in the meantime?"
    }
    if (normalized.includes("accept")) {
      return "Great — I’ll send the written offer and next steps shortly. Let me know if you’d like us to walk through benefits or start dates before you sign."
    }

    const responses = [
      "Thanks — that’s helpful context. Could you share what you’re optimizing for in this offer?",
      "Understood. Let me check internally and come back with a couple of options.",
      "That makes sense. If we can’t move base as far, would you be open to discussing a sign-on bonus or additional equity?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (scenarioId === "space-station") {
    if (normalized.includes("repair")) {
      return "You authorize the repair procedure and request live telemetry from the affected subsystem."
    }
    if (normalized.includes("restore") || normalized.includes("power")) {
      return "You reconfigure the power distribution network and isolate non-essential loads."
    }
    if (normalized.includes("inspect") || normalized.includes("water")) {
      return "You order an inspection of the water recycler and initiate a controlled flush cycle."
    }
    if (normalized.includes("realign") || normalized.includes("solar")) {
      return "You direct the solar array realignment and verify capture efficiency within tolerance."
    }
    if (normalized.includes("morale")) {
      return "You issue a clear plan and assign tasks. The crew reports improved confidence."
    }
    if (normalized.includes("help") || normalized.includes("mission control")) {
      return "Mission control responds with guidance and requests an updated status summary."
    }

    const responses = [
      "One alarm clears, but a secondary warning remains. Continue prioritizing life support.",
      "Telemetry stabilizes briefly. Watch for cascading failures.",
      "You confirm the next steps with the crew and continue monitoring critical readouts.",
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
