"use client"

import type { TamboComponent } from "@tambo-ai/react"

import { ActionMatrix, actionMatrixSchema } from "@/components/tambo/ActionMatrix"
import { GameBoard, gameBoardSchema } from "@/components/tambo/GameBoard"
import { ResourceMeter, resourceMeterSchema } from "@/components/tambo/ResourceMeter"
import { TacticalAlert, tacticalAlertSchema } from "@/components/tambo/TacticalAlert"

/**
  * Registered visual components for Tambo.
  */
export const components: TamboComponent[] = [
  {
    name: "GameBoard",
    description:
      "Grid board showing playerPosition + enemy/resource markers. Update each turn.",
    component: GameBoard,
    propsSchema: gameBoardSchema,
  },
  {
    name: "ResourceMeter",
    description: "Resource gauges (0-100). Use to show current stats.",
    component: ResourceMeter,
    propsSchema: resourceMeterSchema,
  },
  {
    name: "ActionMatrix",
    description:
      "Interactive action grid. Provide 4-6 actions with successRate and costs.",
    component: ActionMatrix,
    propsSchema: actionMatrixSchema,
  },
  {
    name: "TacticalAlert",
    description: "High priority alert. Use sparingly.",
    component: TacticalAlert,
    propsSchema: tacticalAlertSchema,
  },
]
