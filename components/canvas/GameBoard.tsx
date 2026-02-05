"use client"

import { motion } from "framer-motion"
import { useRef } from "react"

interface Position {
  x: number
  y: number
}

interface GameBoardProps {
  playerPosition: Position
  zombieLocations?: Position[]
  resourcePoints?: Position[]
  gridSize?: number
  theme?: "apocalyptic" | "sci-fi" | "noir"
}

/**
 * GameBoard - GENERATIVE CANVAS COMPONENT
 * 
 * Interactive SVG-based game board showing spatial relationships:
 * - Player position (animated marker)
 * - Enemy/zombie positions (pulsing icons)
 * - Resource point markers (glowing)
 * - Grid background with visual theming
 * 
 * Optimized for 60fps with 50+ entities
 */
export function GameBoard({
  playerPosition,
  zombieLocations = [],
  resourcePoints = [],
  gridSize = 10,
  theme = "apocalyptic"
}: GameBoardProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Theme-based colors
  const themeColors = {
    apocalyptic: {
      player: "var(--accent-primary)",
      enemy: "var(--accent-danger)",
      resource: "var(--accent-warning)",
      grid: "var(--border-light)",
      background: "var(--bg-primary)",
    },
    "sci-fi": {
      player: "var(--accent-primary)",
      enemy: "var(--accent-tambo)",
      resource: "var(--accent-info)",
      grid: "var(--border-light)",
      background: "var(--bg-primary)",
    },
    noir: {
      player: "var(--accent-warning)",
      enemy: "var(--accent-danger)",
      resource: "var(--accent-info)",
      grid: "var(--border-light)",
      background: "var(--bg-primary)",
    }
  }

  const colors = themeColors[theme]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="ds-card relative w-full aspect-square overflow-hidden"
      style={{ background: colors.background }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid Background */}
        <defs>
          <pattern
            id={`grid-${theme}`}
            width={500 / gridSize}
            height={500 / gridSize}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={500 / gridSize}
              height={500 / gridSize}
              fill="none"
              stroke={colors.grid}
              strokeWidth="1"
            />
          </pattern>

        </defs>

        {/* Grid */}
        <rect width="500" height="500" fill={`url(#grid-${theme})`} />

        {/* Resource Points */}
        {resourcePoints.map((point, index) => (
          <motion.g
            key={`resource-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill={colors.resource}
              animate={{
                opacity: [0.6, 1, 0.6],
                r: [8, 10, 8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={colors.resource}
              opacity="0.8"
            />
          </motion.g>
        ))}

        {/* Zombie/Enemy Locations */}
        {zombieLocations.map((zombie, index) => (
          <motion.g
            key={`zombie-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {/* Danger radius */}
            <motion.circle
              cx={zombie.x}
              cy={zombie.y}
              r="20"
              fill={colors.enemy}
              opacity="0.1"
              animate={{
                r: [20, 25, 20],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Enemy marker */}
            <motion.circle
              cx={zombie.x}
              cy={zombie.y}
              r="6"
              fill={colors.enemy}
              stroke={colors.enemy}
              strokeWidth="2"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        ))}

        {/* Player Position */}
        <motion.g
          animate={{
            x: [0, 0],
            y: [0, 0]
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Player glow */}
          <motion.circle
            cx={playerPosition.x}
            cy={playerPosition.y}
            r="15"
            fill={colors.player}
            opacity="0.2"
            animate={{
              r: [15, 20, 15],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Player marker */}
          <motion.circle
            cx={playerPosition.x}
            cy={playerPosition.y}
            r="8"
            fill={colors.player}
            animate={{
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Player center dot */}
          <circle
            cx={playerPosition.x}
            cy={playerPosition.y}
            r="3"
            fill="white"
          />
        </motion.g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-xs">
        <div className="flex gap-3 bg-primary border-2 border-medium shadow-sm px-3 py-1.5 rounded">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: colors.player }}
            />
            <span className="text-secondary">You</span>
          </div>
          {zombieLocations.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: colors.enemy }}
              />
              <span className="text-secondary">Threats</span>
            </div>
          )}
          {resourcePoints.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: colors.resource }}
              />
              <span className="text-secondary">Resources</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
