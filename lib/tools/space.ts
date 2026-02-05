import { defineTool } from "@tambo-ai/react"
import { z } from "zod"

import { randomInRange, successCheck } from "./utils"

const stationSystemSchema = z.enum([
  "oxygen_generator",
  "water_recycler",
  "solar_panels",
  "communications",
  "life_support",
])

const systemStatusSchema = z.enum(["online", "degraded", "offline"])

const commsStatusSchema = z.enum(["online", "degraded", "offline"])

const rationLevelSchema = z.enum(["light", "moderate", "severe"])

export const repairSystemTool = defineTool({
  name: "repairSystem",
  description:
    "Attempt to repair a failing station system. Success chance is based on power allocated compared to required power.",
  inputSchema: z.object({
    system: stationSystemSchema,
    powerAllocated: z.number().min(0).max(50),
  }),
  outputSchema: z.object({
    repairSuccess: z.boolean(),
    systemStatus: systemStatusSchema,
    powerConsumed: z.number(),
    timeSpent: z.number(),
    crewMoraleImpact: z.number(),
    description: z.string(),
  }),
  tool: async ({ system, powerAllocated }) => {
    const requiredPower = {
      oxygen_generator: 20,
      water_recycler: 15,
      solar_panels: 25,
      communications: 10,
      life_support: 30,
    } satisfies Record<z.infer<typeof stationSystemSchema>, number>

    const needed = requiredPower[system]
    const successChance = needed <= 0 ? 0 : Math.min(0.95, powerAllocated / needed)
    const repairSuccess = successCheck(successChance)

    let systemStatus: z.infer<typeof systemStatusSchema>
    let description: string

    if (repairSuccess) {
      systemStatus = "online"
      description = `Successfully repaired ${system.replace(/_/g, " ")}. System fully operational.`
    } else if (powerAllocated >= needed * 0.5) {
      systemStatus = "degraded"
      description = `Partial repair of ${system.replace(/_/g, " ")}. System functioning at reduced capacity.`
    } else {
      systemStatus = "offline"
      description = `Insufficient power for ${system.replace(/_/g, " ")} repair. System remains offline.`
    }

    const morale =
      systemStatus === "online"
        ? randomInRange(8, 12)
        : systemStatus === "degraded"
          ? randomInRange(-2, 2)
          : randomInRange(-8, -4)

    return {
      repairSuccess,
      systemStatus,
      powerConsumed: powerAllocated,
      timeSpent: 1,
      crewMoraleImpact: morale,
      description,
    }
  },
})

export const rationResourcesTool = defineTool({
  name: "rationResources",
  description:
    "Reduce daily consumption to extend resources. Returns consumption reduction, morale impact, and the number of days extended.",
  inputSchema: z.object({
    rationLevel: rationLevelSchema,
  }),
  outputSchema: z.object({
    dailyConsumptionReduction: z.object({
      oxygen: z.number(),
      power: z.number(),
      food: z.number(),
    }),
    crewMoraleImpact: z.number(),
    daysExtended: z.number(),
    crewResponse: z.string(),
  }),
  tool: async ({ rationLevel }) => {
    const reductions = {
      light: {
        oxygen: 1,
        power: 1,
        food: 1,
        morale: -2,
        days: 2,
        response: "Crew accepts light rationing. Minor grumbling but understood.",
      },
      moderate: {
        oxygen: 2,
        power: 2,
        food: 2,
        morale: -5,
        days: 4,
        response:
          "Crew unhappy with moderate rationing. Some complaints about hunger and cold.",
      },
      severe: {
        oxygen: 3,
        power: 3,
        food: 3,
        morale: -10,
        days: 6,
        response:
          "Crew morale dropping significantly. Severe rationing causing tension and fatigue.",
      },
    } satisfies Record<
      z.infer<typeof rationLevelSchema>,
      { oxygen: number; power: number; food: number; morale: number; days: number; response: string }
    >

    const r = reductions[rationLevel]

    return {
      dailyConsumptionReduction: {
        oxygen: r.oxygen,
        power: r.power,
        food: r.food,
      },
      crewMoraleImpact: r.morale,
      daysExtended: r.days,
      crewResponse: r.response,
    }
  },
})

export const attemptEmergencyContactTool = defineTool({
  name: "attemptEmergencyContact",
  description:
    "Try to contact mission control or a nearby ship. Success depends on comms status, power, and random interference.",
  inputSchema: z.object({
    powerToUse: z.number().min(5).max(20),
    communicationsStatus: commsStatusSchema,
  }),
  outputSchema: z.object({
    contactEstablished: z.boolean(),
    responseReceived: z.boolean(),
    helpArrivalDays: z.number(),
    powerUsed: z.number(),
    message: z.string(),
  }),
  tool: async ({ powerToUse, communicationsStatus }) => {
    const baseSuccessChance =
      communicationsStatus === "online"
        ? 0.5
        : communicationsStatus === "degraded"
          ? 0.3
          : 0.05

    const powerBonus = (powerToUse - 5) * 0.03
    const finalChance = Math.min(0.9, baseSuccessChance + powerBonus)

    const contactEstablished = successCheck(finalChance)
    const responseReceived = contactEstablished && successCheck(0.7)

    let helpArrivalDays = 0
    let message = ""

    if (responseReceived) {
      helpArrivalDays = randomInRange(3, 7)
      message = `Emergency signal received. Rescue ship dispatched. ETA: ${helpArrivalDays} days.`
    } else if (contactEstablished) {
      message = "Signal sent but no response yet. Will keep trying."
    } else {
      message = "Unable to establish contact. Signal too weak or communications damaged."
    }

    return {
      contactEstablished,
      responseReceived,
      helpArrivalDays,
      powerUsed: powerToUse,
      message,
    }
  },
})

export const spaceTools = [
  repairSystemTool,
  rationResourcesTool,
  attemptEmergencyContactTool,
]
