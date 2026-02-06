"use client"

import { motion } from "framer-motion"

import {
  scenarioCategoryMeta,
  scenarioCategoryOrder,
  type ScenarioCategory,
} from "@/lib/scenarios"

export type ScenarioCategoryFilter = "all" | ScenarioCategory

const categories: Array<{ value: ScenarioCategoryFilter; label: string }> = [
  { value: "all", label: "All" },
  ...scenarioCategoryOrder.map((value) => ({
    value,
    label: scenarioCategoryMeta[value].label,
  })),
]

interface CategoryFilterProps {
  value: ScenarioCategoryFilter
  onChange: (value: ScenarioCategoryFilter) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {categories.map((category) => {
        const isActive = value === category.value

        return (
          <motion.button
            key={category.value}
            type="button"
            aria-pressed={isActive}
            whileHover={isActive ? undefined : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => onChange(category.value)}
            className={
              "relative isolate rounded-[10px] border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2" +
              (isActive
                ? " border-[#0071E3] text-white"
                : " border-transparent bg-[#F5F5F7] text-[#6E6E73] hover:border-[#D2D2D7]")
            }
          >
            {isActive ? (
              <motion.span
                layoutId="playbook-category-pill"
                className="absolute inset-0 -z-10 rounded-[10px] bg-[#1D1D1F]"
                transition={{ type: "spring", stiffness: 520, damping: 38 }}
              />
            ) : null}
            {category.label}
          </motion.button>
        )
      })}
    </div>
  )
}
