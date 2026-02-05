/** Scenario types and utilities for The Playbook */

export interface Scenario {
  id: string
  title: string
  description: string
  systemPrompt?: string
  category: ScenarioCategory
  tags: string[]
  difficulty: "easy" | "medium" | "hard" | "extreme"
  layout: ScenarioLayout
  // Optional: some scenarios may rely on implicit or dynamically generated objectives.
  objectives?: string[]
  initialState: Record<string, unknown>
  icon: string
}

export type ScenarioLayout = "board" | "briefing" | "tutorial"

export type ScenarioCategory =
  | "game"
  | "professional"
  | "simulation"
  | "educational"

export const scenarioCategoryOrder: readonly ScenarioCategory[] = [
  "game",
  "professional",
  "simulation",
  "educational",
]

export const scenarioCategoryMeta = {
  game: { label: "Games", color: "#5E5CE6" },
  professional: { label: "Professional", color: "#0071E3" },
  simulation: { label: "Simulation", color: "#34C759" },
  educational: { label: "Educational", color: "#FF9F0A" },
} satisfies Record<ScenarioCategory, { label: string; color: string }>

export const scenarios: Scenario[] = [
  {
    id: "zombie-survival",
    title: "Zombie Survival",
    description:
      "Navigate a post-apocalyptic city overrun by the undead. Manage resources, find survivors, and make it to the evacuation point.",
    category: "game",
    tags: ["Survival", "Strategy", "Resources"],
    difficulty: "hard",
    layout: "board",
    objectives: [
      "Find medical supplies",
      "Rescue 3 survivors",
      "Reach the evacuation point",
      "Survive 24 hours",
    ],
    initialState: {
      health: 100,
      ammo: 24,
      food: 3,
      survivors: 0,
      location: "Abandoned Warehouse",
      timeRemaining: 24,
    },
    icon: "🧟",
  },
  {
    id: "salary-negotiation",
    title: "Salary Negotiation",
    description:
      "You've received a job offer. Navigate the delicate art of negotiation to maximize your compensation package.",
    category: "professional",
    tags: ["Negotiation", "Career", "Communication"],
    difficulty: "medium",
    layout: "briefing",
    objectives: [
      "Research market rates",
      "Build your case",
      "Counter the initial offer",
      "Secure a 20% increase",
    ],
    initialState: {
      currentOffer: 120000,
      targetSalary: 150000,
      marketRate: 135000,
      leverage: 50,
      confidence: 60,
      relationshipScore: 75,
      round: 1,
    },
    icon: "💼",
  },
  {
    id: "space-station",
    title: "Space Station Crisis",
    description:
      "You are the emergency response coordinator for Mars Colony Alpha. Multiple systems are failing, and a crew of 6 depends on your decisions. Resupply arrives in 14 days.",
    systemPrompt:
      "Run a serious emergency simulation. Provide clear, technical updates. Avoid game language (no levels, scores, achievements). Prioritize life support and crew safety. Present tradeoffs, constraints, and next actions.",
    category: "simulation",
    tags: ["Crisis", "Engineering", "Teamwork"],
    difficulty: "extreme",
    layout: "briefing",
    objectives: [
      "Restore oxygen generation",
      "Stabilize power distribution",
      "Maintain water recycler throughput",
      "Keep crew health and morale stable",
      "Coordinate with mission control",
    ],
    initialState: {
      oxygen: 75,
      power: 60,
      crew: 6,
      systems: "degraded",
      location: "Mars Colony Alpha",
      resupplyDays: 14,
    },
    icon: "🚀",
  },
  {
    id: "detective-mystery",
    title: "Detective Mystery",
    description:
      "The Dockside Murder lands on your desk. Interview suspects, gather evidence, and solve the crime before the trail goes cold.",
    category: "game",
    tags: ["Mystery", "Investigation", "Logic"],
    difficulty: "medium",
    layout: "briefing",
    objectives: [
      "Interview all suspects",
      "Collect physical evidence",
      "Identify the motive",
      "Make an arrest",
    ],
    initialState: {
      evidence: 0,
      suspects: 4,
      leads: 2,
      time: 48,
      reputation: 70,
      location: "Crime Scene",
    },
    icon: "🔍",
  },
  {
    id: "python-tutorial",
    title: "Learn Python: Variables & Functions",
    description:
      "Interactive Python tutorial with real documentation. Learn by doing with verified examples from official Python docs.",
    systemPrompt: `You are a patient, encouraging Python tutor teaching complete beginners.

MCP INTEGRATION:
When teaching concepts (syntax, standard library behavior, edge cases), prefer verified information from MCP servers (official documentation).

If you use MCP data in your response, ALWAYS render the React component "SourceCitation" with:
- source: human-readable name (for example: "Python 3.12 Official Documentation")
- url: the canonical docs link
- fetchedAt: an ISO timestamp (for example: new Date().toISOString())

If MCP is unavailable or the docs cannot be fetched, clearly say you could not verify with MCP and proceed with best-effort guidance.

Be patient, encouraging, and keep explanations beginner-friendly.`,
    category: "educational",
    tags: ["Python", "Programming", "Tutorial", "Beginner", "Interactive", "Verified"],
    difficulty: "easy",
    layout: "tutorial",
    objectives: [
      "Understand what variables are",
      "Create variables of different types",
      "Write a simple function",
      "Call functions and use return values",
      "Complete all interactive exercises",
    ],
    initialState: {},
    icon: "📚",
  },
]

/** Get scenario by ID */
export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id)
}

/** Get difficulty color */
export function getDifficultyColor(difficulty: Scenario["difficulty"]): string {
  const colors = {
    easy: "text-accent-success",
    medium: "text-accent-info",
    hard: "text-accent-warning",
    extreme: "text-accent-danger",
  }
  return colors[difficulty]
}

/** Get difficulty badge variant */
export function getDifficultyVariant(
  difficulty: Scenario["difficulty"]
): "default" | "secondary" | "destructive" | "outline" {
  const variants = {
    easy: "secondary" as const,
    medium: "default" as const,
    hard: "default" as const,
    extreme: "destructive" as const,
  }
  return variants[difficulty]
}
