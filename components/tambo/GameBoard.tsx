"use client"

import * as React from "react"
import { z } from "zod"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
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

const boardGridColor = "#D2D2D7"
const boardBgColor = "#F5F5F7"

function clampToGrid(value: number, gridSize: number) {
  return Math.max(0, Math.min(gridSize - 1, value))
}

function getMarkerLabel(marker: Marker, fallback: string) {
  return marker.label ?? marker.type ?? fallback
}

function MarkerDot({
  x,
  y,
  cellSize,
  icon,
  bg,
  label,
  className,
}: {
  x: number
  y: number
  cellSize: number
  icon: string
  bg: string
  label: string
  className?: string
}) {
  const left = x * cellSize + cellSize / 2
  const top = y * cellSize + cellSize / 2

  return (
    <div
      className={cn(
        "group absolute grid size-10 place-items-center rounded-full text-xl text-white",
        "border-[3px] border-[#1D1D1F]",
        "shadow-[2px_2px_0px_#1D1D1F]",
        className
      )}
      style={{ left, top, transform: "translate(-50%, -50%)", backgroundColor: bg }}
      aria-label={label}
    >
      <span aria-hidden>{icon}</span>
      <div
        className={cn(
          "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2",
          "whitespace-nowrap rounded-md border-2 border-[#1D1D1F] bg-white px-2 py-1",
          "text-xs font-medium text-[#1D1D1F] shadow-[2px_2px_0px_#1D1D1F]",
          "opacity-0 transition-opacity group-hover:opacity-100"
        )}
      >
        {label}
      </div>
    </div>
  )
}

export function GameBoard({
  playerPosition,
  enemies = [],
  resources = [],
  gridSize = 10,
}: GameBoardProps) {
  const safeGridSize = Math.max(2, Math.min(20, Math.floor(gridSize)))
  const cellSize = 50
  const boardSize = safeGridSize * cellSize

  const clampedPlayer = {
    x: clampToGrid(playerPosition.x, safeGridSize),
    y: clampToGrid(playerPosition.y, safeGridSize),
  }

  return (
    <section className={cn(componentCardClassName, "min-h-[600px]")}>
      <h3 className="text-[#1D1D1F] text-xl font-bold mb-4">🎮 Game Board</h3>

      <div className="flex justify-center">
        <div className="max-w-full overflow-x-auto">
          <div
            className={cn(
              "relative mx-auto rounded-lg border-2",
              "border-[#D2D2D7]"
            )}
            style={{
              width: boardSize,
              height: boardSize,
              backgroundColor: boardBgColor,
              backgroundImage: `linear-gradient(${boardGridColor} 1px, transparent 1px), linear-gradient(90deg, ${boardGridColor} 1px, transparent 1px)`,
              backgroundSize: `${cellSize}px ${cellSize}px`,
            }}
          >
            <MarkerDot
              x={clampedPlayer.x}
              y={clampedPlayer.y}
              cellSize={cellSize}
              icon="📍"
              bg="#0071E3"
              label="You"
              className="z-10"
            />

            {enemies.map((enemy, index) => (
              <MarkerDot
                key={`${enemy.x}-${enemy.y}-${index}`}
                x={clampToGrid(enemy.x, safeGridSize)}
                y={clampToGrid(enemy.y, safeGridSize)}
                cellSize={cellSize}
                icon="🧟"
                bg="#FF3B30"
                label={getMarkerLabel(enemy, "Enemy")}
                className="animate-pulse"
              />
            ))}

            {resources.map((resource, index) => (
              <MarkerDot
                key={`${resource.x}-${resource.y}-${index}`}
                x={clampToGrid(resource.x, safeGridSize)}
                y={clampToGrid(resource.y, safeGridSize)}
                cellSize={cellSize}
                icon="📦"
                bg="#34C759"
                label={getMarkerLabel(resource, "Loot")}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#1D1D1F]">
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded-full border-2 border-[#1D1D1F]"
            style={{ backgroundColor: "#0071E3" }}
          />
          <span>You</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded-full border-2 border-[#1D1D1F]"
            style={{ backgroundColor: "#FF3B30" }}
          />
          <span>Enemies</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded-full border-2 border-[#1D1D1F]"
            style={{ backgroundColor: "#34C759" }}
          />
          <span>Loot</span>
        </div>
      </div>
    </section>
  )
}
