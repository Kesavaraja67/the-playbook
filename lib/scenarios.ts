/** Scenario types and utilities for The Playbook */

export interface Scenario {
  id: string
  title: string
  description: string
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
      currentOffer: 85000,
      targetSalary: 100000,
      leverage: 50,
      confidence: 60,
      relationship: "neutral",
      round: 1,
    },
    icon: "💼",
  },
  {
    id: "space-station",
    title: "Space Station Crisis",
    description:
      "A critical malfunction threatens the ISS. Coordinate with mission control and your crew to prevent disaster.",
    category: "simulation",
    tags: ["Crisis", "Engineering", "Teamwork"],
    difficulty: "extreme",
    layout: "briefing",
    objectives: [
      "Diagnose the malfunction",
      "Repair oxygen systems",
      "Stabilize orbit",
      "Evacuate if necessary",
    ],
    initialState: {
      oxygen: 75,
      power: 60,
      hull: 100,
      crew: 6,
      systems: "degraded",
      orbit: "decaying",
    },
    icon: "🚀",
  },
  {
    id: "detective-mystery",
    title: "Detective Mystery",
    description:
      "A high-profile murder case lands on your desk. Interview suspects, gather evidence, and solve the crime before the trail goes cold.",
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
      "Interactive tutorial teaching Python fundamentals. Perfect for complete beginners. Learn by doing with an AI tutor guiding you.",
    category: "educational",
    tags: ["Python", "Programming", "Tutorial", "Beginner", "Interactive"],
    difficulty: "easy",
    layout: "tutorial",
    objectives: [
      "Understand what variables are",
      "Create variables of different types",
      "Write a simple function",
      "Call functions and use return values",
      "Complete all interactive exercises",
    ],
    initialState: {
      current_step: 1,
      total_steps: 5,
      concepts_mastered: 0,
      total_concepts: 5,
      attempts: 0,
      hints_used: 0,
    },
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
