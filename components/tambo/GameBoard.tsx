"use client"

import * as React from "react"
import { z } from "zod"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

const positionSchema = z.object({
  x: z.number().int(),
  y: z.number().int(),
})

const markerSchema = positionSchema.extend({
  type: z.string().optional(),
  label: z.string().optional(),
})

export const gameBoardSchema = z.object({
  playerPosition: positionSchema,
  enemies: z.array(markerSchema).optional(),
  resources: z.array(markerSchema).optional(),
  gridSize: z.number().int().min(2).max(20).optional(),
})

export type GameBoardProps = z.input<typeof gameBoardSchema>

type Marker = z.infer<typeof markerSchema>

const boardBgColor = "var(--bg-secondary)"
const boardGridLineColor = "rgba(0, 0, 0, 0.08)"

function clampToGrid(value: number, gridSize: number) {
  return Math.max(0, Math.min(gridSize - 1, value))
}

function getMarkerLabel(marker: Marker, fallback: string) {
  return marker.label ?? marker.type ?? fallback
}

function iconForEnemy(marker: Marker) {
  const t = `${marker.type ?? ""} ${marker.label ?? ""}`.toLowerCase()
  if (t.includes("failure")) return "⚠️"
  if (t.includes("suspect")) return "🕵️"
  return "🧟"
}

function iconForResource(marker: Marker) {
  const t = `${marker.type ?? ""} ${marker.label ?? ""}`.toLowerCase()
  if (t.includes("spare") || t.includes("part")) return "🧰"
  if (t.includes("evidence")) return "🧾"
  return "📦"
}

function MarkerDot({
  x,
  y,
  cellSize,
  icon,
  bg,
  label,
  className,
  animateIn = true,
}: {
  x: number
  y: number
  cellSize: number
  icon: string
  bg: string
  label: string
  className?: string
  animateIn?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()
  const size = 40

  const px = x * cellSize + cellSize / 2 - size / 2
  const py = y * cellSize + cellSize / 2 - size / 2

  return (
    <motion.div
      className={cn(
        "group relative absolute left-0 top-0 grid place-items-center rounded-full text-xl text-white",
        "border border-light shadow-sm",
        "transition-[box-shadow,transform] duration-200 ease-out",
        className
      )}
      style={{ width: size, height: size, backgroundColor: bg }}
      aria-label={label}
      initial={
        shouldReduceMotion || !animateIn
          ? false
          : {
              opacity: 0,
              scale: 0,
              rotate: -10,
            }
      }
      animate={{ x: px, y: py, opacity: 1, scale: 1, rotate: 0 }}
      exit={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 0,
              scale: 0.6,
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 420,
              damping: 28,
            }
      }
    >
      <span aria-hidden>{icon}</span>
      <div
        className={cn(
          "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2",
          "whitespace-nowrap rounded-md border border-light bg-tertiary px-2 py-1",
          "text-xs font-medium text-text-primary shadow-md",
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        )}
      >
        {label}
      </div>
    </motion.div>
  )
}

export function GameBoard({
  playerPosition,
  enemies = [],
  resources = [],
  gridSize = 10,
}: GameBoardProps) {
  const shouldReduceMotion = useReducedMotion()
  const safeGridSize = Math.max(2, Math.min(20, Math.floor(gridSize)))
  const cellSize = 50
  const boardSize = safeGridSize * cellSize

  const clampedPlayer = {
    x: clampToGrid(playerPosition.x, safeGridSize),
    y: clampToGrid(playerPosition.y, safeGridSize),
  }

  return (
    <section className={componentCardClassName}>
      <h3 className="mb-4 text-xl font-semibold text-text-primary">🎮 Game Board</h3>

      <div className="flex justify-center">
        <div className="max-w-full overflow-x-auto">
          <div
            className={cn("relative mx-auto rounded-xl border border-light shadow-sm")}
            style={{
              width: boardSize,
              height: boardSize,
              backgroundColor: boardBgColor,
              backgroundImage: `linear-gradient(${boardGridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${boardGridLineColor} 1px, transparent 1px)`,
              backgroundSize: `${cellSize}px ${cellSize}px`,
            }}
          >
            <MarkerDot
              x={clampedPlayer.x}
              y={clampedPlayer.y}
              cellSize={cellSize}
              icon="📍"
              bg="#4A90E2"
              label="You"
              animateIn={false}
              className={cn(
                "z-10",
                shouldReduceMotion
                  ? undefined
                  : "after:absolute after:inset-0 after:rounded-full after:bg-white/25 after:animate-ping"
              )}
            />

            <AnimatePresence>
              {enemies.map((enemy, index) => (
                <MarkerDot
                  key={`${enemy.x}-${enemy.y}-${index}`}
                  x={clampToGrid(enemy.x, safeGridSize)}
                  y={clampToGrid(enemy.y, safeGridSize)}
                  cellSize={cellSize}
                  icon={iconForEnemy(enemy)}
                  bg="#EF4444"
                  label={getMarkerLabel(enemy, "Enemy")}
                  className={cn(
                    "animate-playbook-wiggle",
                    shouldReduceMotion ? undefined : "shadow-md"
                  )}
                />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {resources.map((resource, index) => (
                <MarkerDot
                  key={`${resource.x}-${resource.y}-${index}`}
                  x={clampToGrid(resource.x, safeGridSize)}
                  y={clampToGrid(resource.y, safeGridSize)}
                  cellSize={cellSize}
                  icon={iconForResource(resource)}
                  bg="#10B981"
                  label={getMarkerLabel(resource, "Loot")}
                  className="animate-playbook-float"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-text-primary">
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded-full border border-light shadow-sm"
            style={{ backgroundColor: "#4A90E2" }}
          />
          <span>You</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded-full border border-light shadow-sm"
            style={{ backgroundColor: "#EF4444" }}
          />
          <span>Enemies</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded-full border border-light shadow-sm"
            style={{ backgroundColor: "#10B981" }}
          />
          <span>Resources</span>
        </div>
      </div>
    </section>
  )
}
