"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { scenarioCategoryMeta, type ScenarioCategory } from "@/lib/scenarios"

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
    <motion.button
      type="button"
      aria-label={`Start scenario: ${title}`}
      className="group h-[400px] w-full max-w-[320px] cursor-pointer appearance-none rounded-[16px] border-2 border-[#D2D2D7] bg-white p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
      style={{ boxShadow: "4px 4px 0px #1D1D1F" }}
      whileHover={{
        boxShadow: "8px 8px 0px #1D1D1F",
        x: -2,
        y: -2,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
    >
      <div className="flex h-full flex-col">
        <div
          className="inline-flex w-fit items-center rounded-[8px] border-2 border-[#1D1D1F] px-4 py-2"
          style={{ backgroundColor: scenarioCategoryMeta[category].color }}
        >
          <span className="text-[12px] font-bold uppercase tracking-wide text-white">
            {scenarioCategoryMeta[category].label}
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
                key={`${title}-${tag}`}
                className="rounded-[6px] border border-[#D2D2D7] bg-[#F5F5F7] px-3 py-1 text-[12px] text-[#6E6E73]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#1D1D1F] px-4 py-3 text-[16px] font-bold text-white transition-colors duration-200 group-hover:bg-[#0071E3] group-focus-visible:bg-[#0071E3]"
            aria-hidden="true"
          >
            Start Scenario
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.button>
  )
}
