"use client"

import type { ScenarioCategory } from "@/lib/scenarios"

export type ScenarioCategoryFilter = "all" | ScenarioCategory

const categories: Array<{ value: ScenarioCategoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "game", label: "Games" },
  { value: "professional", label: "Professional" },
  { value: "simulation", label: "Simulation" },
  { value: "educational", label: "Educational" },
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
          <button
            key={category.value}
            type="button"
            aria-pressed={isActive}
            className={
              "rounded-[8px] border-2 px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2" +
              (isActive
                ? " border-[#0071E3] bg-[#1D1D1F] text-white"
                : " border-transparent bg-[#F5F5F7] text-[#6E6E73] hover:border-[#D2D2D7]")
            }
            onClick={() => onChange(category.value)}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
