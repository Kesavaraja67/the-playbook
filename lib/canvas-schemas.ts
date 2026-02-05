import { z } from "zod"

/**
 * Zod Schemas for Canvas Components
 * 
 * These schemas define the props for each canvas component
 * and enable Tambo to generate them dynamically
 */

// Core Components

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number()
})

export const GameBoardSchema = z.object({
  playerPosition: PositionSchema,
  zombieLocations: z.array(PositionSchema).optional(),
  resourcePoints: z.array(PositionSchema).optional(),
  gridSize: z.number().optional(),
  theme: z.enum(["apocalyptic", "sci-fi", "noir"]).optional()
})

export const ResourceSchema = z.object({
  name: z.string(),
  value: z.number().min(0).max(100),
  color: z.string(),
  icon: z.string().optional()
})

export const ResourceMeterSchema = z.object({
  resources: z.array(ResourceSchema)
})

export const ActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string(),
  costs: z.array(z.object({
    resource: z.string(),
    amount: z.number()
  })).optional(),
  successRate: z.number().min(0).max(100).optional(),
  description: z.string().optional()
})

export const ActionMatrixSchema = z.object({
  actions: z.array(ActionSchema)
})

export const DiscoveryCardSchema = z.object({
  item: z.string(),
  quantity: z.number().optional(),
  rarity: z.enum(["common", "rare", "epic", "legendary"]).optional(),
  animation: z.enum(["sparkle", "glow", "pulse"]).optional(),
  icon: z.string().optional()
})

export const TacticalAlertSchema = z.object({
  type: z.enum(["warning", "info", "danger", "success"]),
  title: z.string(),
  message: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional()
})

export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["completed", "active", "locked"]),
  progress: z.number().min(0).max(100).optional()
})

export const ProgressTrackerSchema = z.object({
  milestones: z.array(MilestoneSchema),
  title: z.string().optional()
})

// Scenario-Specific Components

export const LeveragePointSchema = z.object({
  title: z.string(),
  description: z.string(),
  value: z.number()
})

export const NegotiationDashboardSchema = z.object({
  currentOffer: z.number(),
  targetSalary: z.number(),
  marketRate: z.number(),
  leveragePoints: z.array(LeveragePointSchema),
  relationshipScore: z.number().min(0).max(100)
})

export const SystemStatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["operational", "warning", "failing", "critical"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  icon: z.string(),
  repairCost: z.number().optional()
})

export const SpaceResourceSchema = z.object({
  name: z.string(),
  level: z.number().min(0).max(100),
  color: z.string()
})

export const SpaceStationControlSchema = z.object({
  systems: z.array(SystemStatusSchema),
  resources: z.array(SpaceResourceSchema),
  daysLeft: z.number()
})

export const EvidenceSchema = z.object({
  id: z.string(),
  type: z.enum(["physical", "testimony", "document", "digital"]),
  description: z.string(),
  location: z.string(),
  timestamp: z.string()
})

export const SuspectSchema = z.object({
  id: z.string(),
  name: z.string(),
  alibi: z.string(),
  suspicionLevel: z.number().min(0).max(100),
  connections: z.array(z.string())
})

export const TimelineEventSchema = z.object({
  time: z.string(),
  event: z.string(),
  verified: z.boolean()
})

export const DetectiveBoardSchema = z.object({
  evidence: z.array(EvidenceSchema),
  suspects: z.array(SuspectSchema),
  timeline: z.array(TimelineEventSchema)
})

// Type exports
export type GameBoardProps = z.infer<typeof GameBoardSchema>
export type ResourceMeterProps = z.infer<typeof ResourceMeterSchema>
export type ActionMatrixProps = z.infer<typeof ActionMatrixSchema>
export type DiscoveryCardProps = z.infer<typeof DiscoveryCardSchema>
export type TacticalAlertProps = z.infer<typeof TacticalAlertSchema>
export type ProgressTrackerProps = z.infer<typeof ProgressTrackerSchema>
export type NegotiationDashboardProps = z.infer<typeof NegotiationDashboardSchema>
export type SpaceStationControlProps = z.infer<typeof SpaceStationControlSchema>
export type DetectiveBoardProps = z.infer<typeof DetectiveBoardSchema>
