"use client"

import type { TamboComponent, TamboTool } from "@tambo-ai/react"
import { z } from "zod"

import { SourceCitation } from "@/components/scenarios/educational/SourceCitation"

export const components: TamboComponent[] = [
  {
    name: "SourceCitation",
    description:
      "Display a citation for externally sourced documentation. Use this whenever MCP data is used in responses.",
    component: SourceCitation,
    propsSchema: z.object({
      source: z.string(),
      url: z.string().url().optional(),
      fetchedAt: z.string().datetime().optional(),
    }),
  },
]

export const tools: TamboTool[] = []
