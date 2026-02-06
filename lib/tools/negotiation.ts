import { defineTool } from "@tambo-ai/react"
import { z } from "zod"

import { randomInRange } from "./utils"

const counterJustificationSchema = z.enum([
  "market_data",
  "experience",
  "competing_offer",
  "skills",
  "cost_of_living",
])

const negotiationToneSchema = z.enum(["professional", "assertive", "collaborative"])

export const presentCounterOfferTool = defineTool({
  name: "presentCounterOffer",
  description:
    "Present a counter-offer with justification and tone. Returns a new offer, relationship change, and recruiter response.",
  inputSchema: z.object({
    offeredSalary: z.number(),
    justification: counterJustificationSchema,
    tone: negotiationToneSchema,
    currentOffer: z.number(),
    maxBudget: z.number(),
  }),
  outputSchema: z.object({
    newOffer: z.number(),
    relationshipChange: z.number(),
    leverageUsed: z.boolean(),
    recruiterResponse: z.string(),
    offerAccepted: z.boolean(),
  }),
  tool: async ({ offeredSalary, justification, tone, currentOffer, maxBudget }) => {
    const toneEffects = {
      professional: 5,
      assertive: -3,
      collaborative: 8,
    } satisfies Record<z.infer<typeof negotiationToneSchema>, number>

    const justificationRanges = {
      market_data: [10_000, 15_000],
      experience: [7_000, 10_000],
      competing_offer: [15_000, 20_000],
      skills: [6_000, 9_000],
      cost_of_living: [4_000, 7_000],
    } satisfies Record<z.infer<typeof counterJustificationSchema>, readonly [number, number]>

    const [minIncrease, maxIncrease] = justificationRanges[justification]
    const targetIncrease = randomInRange(minIncrease, maxIncrease)
    const idealOffer = currentOffer + targetIncrease

    const boundedMax = Math.max(currentOffer, maxBudget)
    let newOffer = Math.min(boundedMax, idealOffer)

    if (offeredSalary > boundedMax) {
      newOffer = boundedMax
    } else if (offeredSalary < currentOffer) {
      newOffer = currentOffer
    } else if (offeredSalary < currentOffer + targetIncrease / 2) {
      newOffer = Math.floor((offeredSalary + currentOffer) / 2)
    }

    const increaseAmount = newOffer - currentOffer
    const responseType =
      increaseAmount < 6_000
        ? "low"
        : increaseAmount < 12_000
          ? "mid"
          : increaseAmount < 18_000
            ? "high"
            : "max"

    const responses = {
      low: "I appreciate your perspective. Let me see what I can do about that.",
      mid: `That's a fair point based on ${justification.replace(/_/g, " ")}. I can move our offer up.`,
      high: "You've made a compelling case. Let me discuss this with leadership.",
      max: "That's at the very top of our range, but given your background, I think we can make it work.",
    } satisfies Record<"low" | "mid" | "high" | "max", string>

    return {
      newOffer,
      relationshipChange: toneEffects[tone],
      leverageUsed: justification === "competing_offer",
      recruiterResponse: responses[responseType],
      offerAccepted: newOffer >= offeredSalary * 0.95,
    }
  },
})

export const researchMarketDataTool = defineTool({
  name: "researchMarketData",
  description:
    "Research market salary data for a role. Returns a realistic range with a confidence level and sample size.",
  inputSchema: z.object({
    jobTitle: z.string(),
    yearsExperience: z.number(),
    location: z.string(),
  }),
  outputSchema: z.object({
    averageSalary: z.number(),
    lowRange: z.number(),
    highRange: z.number(),
    percentile25: z.number(),
    percentile75: z.number(),
    confidenceLevel: z.enum(["high", "medium", "low"]),
    dataPoints: z.number(),
    sources: z.array(z.string()),
  }),
  tool: async ({ jobTitle, yearsExperience, location }) => {
    const baseSalaries: Record<string, number> = {
      "senior developer": 100_000,
      "senior software engineer": 110_000,
      "staff engineer": 140_000,
      "engineering manager": 150_000,
      "product manager": 120_000,
    }

    const baseKey = jobTitle.trim().toLowerCase()
    const baseSalary = baseSalaries[baseKey] ?? 100_000

    const experienceMultiplier = 1 + yearsExperience * 0.04
    const locationMultipliers: Record<string, number> = {
      "san francisco": 1.35,
      "new york": 1.3,
      seattle: 1.2,
      austin: 1.1,
      remote: 1.05,
    }

    const locKey = location.trim().toLowerCase()
    const locationMult = locationMultipliers[locKey] ?? 1

    const averageSalary = Math.floor(baseSalary * experienceMultiplier * locationMult)

    const isKnownTitle = baseKey in baseSalaries
    const isKnownLocation = locKey in locationMultipliers
    const confidenceLevel = isKnownTitle && isKnownLocation ? "high" : isKnownTitle ? "medium" : "low"
    const dataPoints =
      confidenceLevel === "high"
        ? randomInRange(220, 520)
        : confidenceLevel === "medium"
          ? randomInRange(120, 260)
          : randomInRange(40, 120)

    return {
      averageSalary,
      lowRange: Math.floor(averageSalary * 0.8),
      highRange: Math.floor(averageSalary * 1.2),
      percentile25: Math.floor(averageSalary * 0.9),
      percentile75: Math.floor(averageSalary * 1.1),
      confidenceLevel,
      dataPoints,
      sources: ["Glassdoor", "LinkedIn Salary", "Levels.fyi", "Payscale", "Built In"],
    }
  },
})

export const proposeCompTradeoffsTool = defineTool({
  name: "proposeCompTradeoffs",
  description:
    "Suggest non-base-salary tradeoffs (equity, sign-on, PTO, flexibility) to close compensation gaps while preserving relationship.",
  inputSchema: z.object({
    currentOffer: z.number(),
    targetSalary: z.number(),
    maxBudget: z.number(),
    priority: z.enum(["base", "equity", "flexibility"]),
  }),
  outputSchema: z.object({
    gap: z.number(),
    suggestions: z.array(
      z.object({
        type: z.enum(["sign_on", "equity", "pto", "remote", "review_cycle"]),
        description: z.string(),
        estimatedValue: z.number(),
      })
    ),
    message: z.string(),
  }),
  tool: async ({ currentOffer, targetSalary, maxBudget, priority }) => {
    const realisticCeiling = Math.max(currentOffer, maxBudget)
    const achievableSalary = Math.min(realisticCeiling, targetSalary)
    const gap = Math.max(0, targetSalary - achievableSalary)

    const signOn = {
      type: "sign_on" as const,
      description: "A one-time sign-on bonus to bridge the gap while keeping base aligned to band.",
      estimatedValue: randomInRange(5_000, 15_000),
    }
    const equity = {
      type: "equity" as const,
      description: "Additional equity grant to improve total compensation without exceeding base budget.",
      estimatedValue: randomInRange(10_000, 35_000),
    }
    const pto = {
      type: "pto" as const,
      description: "Extra PTO (or a flexible time-off arrangement) as a meaningful quality-of-life concession.",
      estimatedValue: randomInRange(2_000, 6_000),
    }
    const remote = {
      type: "remote" as const,
      description: "Remote / hybrid flexibility to reduce commute and increase autonomy.",
      estimatedValue: randomInRange(3_000, 8_000),
    }
    const reviewCycle = {
      type: "review_cycle" as const,
      description: "An earlier compensation review (60–90 days) with clear performance criteria.",
      estimatedValue: randomInRange(3_000, 10_000),
    }

    const suggestions =
      priority === "equity"
        ? [equity, signOn, reviewCycle]
        : priority === "flexibility"
          ? [remote, pto, reviewCycle]
          : [signOn, equity, reviewCycle]

    const message =
      gap === 0
        ? "Base can likely get close to target. Use tradeoffs only if you want more upside without pushing budget."
        : "If base can't reach target, propose a mix of tradeoffs to close the gap while keeping the tone collaborative."

    return {
      gap,
      suggestions,
      message,
    }
  },
})

export const negotiationTools = [
  presentCounterOfferTool,
  researchMarketDataTool,
  proposeCompTradeoffsTool,
]
