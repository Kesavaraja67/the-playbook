"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { scenarioCategoryMeta, type ScenarioCategory } from "@/lib/scenarios"
import { cn } from "@/lib/utils"

interface ScenarioCardProps {
  title: string
  description: string
  category: ScenarioCategory
  tags: string[]
  onClick: () => void
  disabled?: boolean
}

export function ScenarioCard({
  title,
  description,
  category,
  tags,
  onClick,
  disabled = false,
}: ScenarioCardProps) {
  const categoryMeta = scenarioCategoryMeta[category]

  return (
    <motion.button
      type="button"
      aria-label={`Start scenario: ${title}`}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      className={cn(
        "group relative h-[408px] w-full max-w-[340px] appearance-none overflow-hidden rounded-xl border border-light bg-tertiary p-6 text-left shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      )}
      whileHover={
        disabled
          ? undefined
          : {
              y: -12,
              boxShadow: "var(--shadow-xl)",
              borderColor: "rgba(74,144,226,0.28)",
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.98,
              y: -6,
            }
      }
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 18% 12%, ${categoryMeta.color}22, transparent 55%)`,
        }}
      />

      <div className="flex h-full flex-col">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-light bg-bg-secondary px-4 py-2">
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ backgroundColor: categoryMeta.color }}
          />
          <span className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
            {categoryMeta.label}
          </span>
        </div>

        <h3 className="mt-4 text-[22px] font-semibold tracking-tight text-text-primary">{title}</h3>

        <p className="mt-2 line-clamp-3 text-[14px] leading-[1.55] text-text-secondary">{description}</p>

        <div className="mt-auto">
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={`${title}-${tag}`}
                className="rounded-full border border-light bg-bg-secondary px-3 py-1 text-[12px] text-text-secondary transition-colors duration-200 group-hover:bg-bg-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <div aria-hidden="true" className="flex items-center justify-center">
            <div
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-bg-dark px-4 py-3 text-[15px] font-semibold text-text-inverse",
                "transition-[background-color,box-shadow,transform] duration-200 ease-out",
                "group-hover:bg-accent-primary group-hover:shadow-md"
              )}
            >
              Start Scenario
              <span
                className={cn(
                  "inline-flex transition-transform duration-200",
                  disabled ? undefined : "group-hover:translate-x-1"
                )}
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
