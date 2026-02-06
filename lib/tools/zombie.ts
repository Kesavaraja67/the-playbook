import { defineTool } from "@tambo-ai/react"
import { z } from "zod"

import { calculateDamage, randomInRange, successCheck } from "./utils"

const zombieLocationSchema = z.enum([
  "warehouse",
  "pharmacy",
  "gas_station",
  "apartment",
  "store",
])

const searchThoroughnessSchema = z.enum(["quick", "thorough"])

const lootTypeSchema = z.enum(["food", "water", "ammo", "medical", "materials"])

const combatStrategySchema = z.enum(["aggressive", "defensive", "stealth"])

export const searchLocationTool = defineTool({
  name: "searchLocation",
  description:
    "Search a location for supplies. Returns items found, whether zombies were attracted, and time/health costs.",
  inputSchema: z.object({
    location: zombieLocationSchema,
    searchThoroughness: searchThoroughnessSchema,
  }),
  outputSchema: z.object({
    items: z.array(
      z.object({
        type: lootTypeSchema,
        quantity: z.number(),
      })
    ),
    zombiesAttracted: z.boolean(),
    zombieCount: z.number(),
    healthCost: z.number(),
    timeSpent: z.number(),
  }),
  tool: async ({ location, searchThoroughness }) => {
    const lootTables = {
      warehouse: { food: 0.6, water: 0.4, materials: 0.9, ammo: 0.3, medical: 0.2 },
      pharmacy: { food: 0.3, water: 0.5, materials: 0.2, ammo: 0.1, medical: 0.95 },
      gas_station: { food: 0.8, water: 0.7, materials: 0.3, ammo: 0.3, medical: 0.4 },
      apartment: { food: 0.6, water: 0.6, materials: 0.5, ammo: 0.4, medical: 0.4 },
      store: { food: 0.9, water: 0.8, materials: 0.2, ammo: 0.2, medical: 0.5 },
    } satisfies Record<
      z.infer<typeof zombieLocationSchema>,
      Record<z.infer<typeof lootTypeSchema>, number>
    >

    const table = lootTables[location]
    const items: Array<{ type: z.infer<typeof lootTypeSchema>; quantity: number }> = []

    for (const [type, chance] of Object.entries(table)) {
      if (successCheck(chance)) {
        const quantity =
          searchThoroughness === "thorough"
            ? randomInRange(2, 6)
            : randomInRange(1, 3)

        items.push({
          type: type as z.infer<typeof lootTypeSchema>,
          quantity,
        })
      }
    }

    const baseZombieChance = 0.35
    const thoroughMultiplier = searchThoroughness === "thorough" ? 1.7 : 1
    const zombieChance = Math.min(0.95, baseZombieChance * thoroughMultiplier)
    const zombiesAttracted = successCheck(zombieChance)

    return {
      items,
      zombiesAttracted,
      zombieCount: zombiesAttracted ? randomInRange(2, 6) : 0,
      healthCost: searchThoroughness === "thorough" ? randomInRange(3, 7) : 0,
      timeSpent: searchThoroughness === "thorough" ? 2 : 1,
    }
  },
})

export const combatZombiesTool = defineTool({
  name: "combatZombies",
  description:
    "Engage zombies in combat. Returns kills, health lost, ammo used, and whether the threat was eliminated.",
  inputSchema: z.object({
    strategy: combatStrategySchema,
    ammoToUse: z.number().min(0),
    zombieCount: z.number().min(1),
  }),
  outputSchema: z.object({
    zombiesKilled: z.number(),
    healthLost: z.number(),
    ammoUsed: z.number(),
    success: z.boolean(),
    description: z.string(),
  }),
  tool: async ({ strategy, ammoToUse, zombieCount }) => {
    let zombiesKilled = 0
    let healthLost = 0
    const ammoUsed = Math.min(ammoToUse, zombieCount * 3)

    if (strategy === "aggressive") {
      const accuracy = 0.7
      zombiesKilled = Math.min(
        zombieCount,
        Math.max(0, Math.floor(ammoUsed * accuracy) + randomInRange(-1, 2))
      )
      healthLost = calculateDamage(zombieCount * 4, 6)
    } else if (strategy === "defensive") {
      const accuracy = 0.6
      zombiesKilled = Math.min(zombieCount, Math.max(0, Math.floor(ammoUsed * accuracy)))
      healthLost = calculateDamage(zombieCount * 2, 4)
    } else {
      const accuracy = 0.4
      zombiesKilled = Math.min(zombieCount, Math.max(0, Math.floor(ammoUsed * accuracy)))
      healthLost = successCheck(0.25) ? calculateDamage(8, 3) : 0
    }

    const success = zombiesKilled >= zombieCount

    const descriptions = {
      aggressive: {
        success: "You charge forward with guns blazing. All hostiles eliminated.",
        failure: "You fight aggressively but they overwhelm you. You barely escape.",
      },
      defensive: {
        success: "You hold your ground methodically. Threat neutralized.",
        failure: "You fight defensively but can't eliminate all of them.",
      },
      stealth: {
        success: "You silently take them out one by one.",
        failure: "They spot you mid-stealth. You retreat before it gets worse.",
      },
    } satisfies Record<z.infer<typeof combatStrategySchema>, { success: string; failure: string }>

    return {
      zombiesKilled,
      healthLost,
      ammoUsed,
      success,
      description: success ? descriptions[strategy].success : descriptions[strategy].failure,
    }
  },
})

export const fortifyLocationTool = defineTool({
  name: "fortifyLocation",
  description:
    "Use materials to fortify your current location. Returns fortification strength and expected zombie attack reduction.",
  inputSchema: z.object({
    materialsToUse: z.number().min(1).max(20),
  }),
  outputSchema: z.object({
    fortificationLevel: z.number(),
    materialsUsed: z.number(),
    timeSpent: z.number(),
    zombieAttackReduction: z.number(),
  }),
  tool: async ({ materialsToUse }) => {
    const efficiency = 0.85 + Math.random() * 0.15
    const fortificationLevel = Math.min(
      100,
      Math.floor(materialsToUse * 12 * efficiency)
    )
    const zombieAttackReduction = Math.floor(fortificationLevel * 0.6)

    return {
      fortificationLevel,
      materialsUsed: materialsToUse,
      timeSpent: Math.ceil(materialsToUse / 3),
      zombieAttackReduction,
    }
  },
})

export const zombieTools = [
  searchLocationTool,
  combatZombiesTool,
  fortifyLocationTool,
]
