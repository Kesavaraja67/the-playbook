"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import type { ScenarioCategory } from "@/lib/scenarios"

const categoryColors: Record<ScenarioCategory, string> = {
  game: "#5E5CE6",
  professional: "#0071E3",
  simulation: "#34C759",
  educational: "#FF9F0A",
}

const categoryLabels: Record<ScenarioCategory, string> = {
  game: "Games",
  professional: "Professional",
  simulation: "Simulation",
  educational: "Educational",
}

interface ScenarioCardProps {
  title: string
  description: string
  category: ScenarioCategory
  tags: string[]
  onClick: () => void
}

export function ScenarioCard({
  title,
  description,
  category,
  tags,
  onClick,
}: ScenarioCardProps) {
  return (
    <motion.div
      className="h-[400px] w-full max-w-[320px] cursor-pointer rounded-[16px] border-2 border-[#D2D2D7] bg-white p-6"
      style={{ boxShadow: "4px 4px 0px #1D1D1F" }}
      whileHover={{
        boxShadow: "8px 8px 0px #1D1D1F",
        x: -2,
        y: -2,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex h-full flex-col">
        <div
          className="inline-flex w-fit items-center rounded-[8px] border-2 border-[#1D1D1F] px-4 py-2"
          style={{ backgroundColor: categoryColors[category] }}
        >
          <span className="text-[12px] font-bold uppercase tracking-wide text-white">
            {categoryLabels[category]}
          </span>
        </div>

        <h3 className="mt-4 text-[24px] font-bold text-[#1D1D1F]">{title}</h3>

        <p className="mt-2 line-clamp-3 text-[14px] leading-[1.5] text-[#6E6E73]">
          {description}
        </p>

        <div className="mt-auto">
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7] px-3 py-1 text-[12px] text-[#6E6E73]"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#1D1D1F] px-4 py-3 text-[16px] font-bold text-white transition-colors duration-200 hover:bg-[#0071E3]"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            Start Scenario
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function ScenarioCardSkeleton() {
  return (
    <div
      className="h-[400px] w-full max-w-[320px] rounded-[16px] border-2 border-[#D2D2D7] bg-white p-6"
      style={{ boxShadow: "4px 4px 0px #1D1D1F" }}
    >
      <div className="flex h-full animate-pulse flex-col">
        <div className="h-8 w-28 rounded-[8px] border-2 border-[#1D1D1F] bg-[#D2D2D7]" />

        <div className="mt-4 h-7 w-3/4 rounded bg-[#F5F5F7]" />
        <div className="mt-3 h-4 w-full rounded bg-[#F5F5F7]" />
        <div className="mt-2 h-4 w-11/12 rounded bg-[#F5F5F7]" />
        <div className="mt-2 h-4 w-2/3 rounded bg-[#F5F5F7]" />

        <div className="mt-auto">
          <div className="mb-4 flex gap-2">
            <div className="h-6 w-16 rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7]" />
            <div className="h-6 w-20 rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7]" />
            <div className="h-6 w-14 rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7]" />
          </div>
          <div className="h-12 w-full rounded-[8px] bg-[#1D1D1F]" />
        </div>
      </div>
    </div>
  )
}
