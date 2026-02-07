"use client"

import { motion, useReducedMotion } from "framer-motion"

import {
  scenarioCategoryMeta,
  scenarioCategoryOrder,
  type ScenarioCategory,
} from "@/lib/scenarios"
import { cn } from "@/lib/utils"

export type ScenarioCategoryFilter = "all" | ScenarioCategory

interface CategoryFilterProps {
  value: ScenarioCategoryFilter
  onChange: (value: ScenarioCategoryFilter) => void
}

const categories: Array<{ value: ScenarioCategoryFilter; label: string }> = [
  { value: "all", label: "All" },
  ...scenarioCategoryOrder.map((category) => ({
    value: category,
    label: scenarioCategoryMeta[category].label,
  })),
]

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {categories.map((category) => {
        const isActive = value === category.value

        return (
          <motion.button
            key={category.value}
            type="button"
            aria-pressed={isActive}
            className={cn(
              "relative overflow-hidden rounded-full border px-5 py-2.5 text-[14px] font-medium",
              "transition-[box-shadow,border-color,color,background-color,transform] duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
              isActive
                ? "border-medium text-text-inverse"
                : "border-light bg-bg-secondary text-text-secondary hover:bg-bg-primary hover:border-medium hover:shadow-sm"
            )}
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            onClick={() => {
              if (isActive) return
              onChange(category.value)
            }}
          >
            {isActive ? (
              <motion.span
                layoutId="playbook-category-pill"
                className="absolute inset-0 bg-bg-dark"
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            ) : null}
            <span className="relative z-10">{category.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
