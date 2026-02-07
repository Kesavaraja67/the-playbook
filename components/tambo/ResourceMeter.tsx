"use client"

import * as React from "react"
import { z } from "zod"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion"

import { componentCardClassName } from "@/components/play/ComponentCanvas"
import { cn } from "@/lib/utils"

export const resourceSchema = z.object({
  name: z.string(),
  value: z.number().min(0).max(100),
  color: z.string(),
  icon: z.string().optional(),
})

export const resourceMeterSchema = z.object({
  resources: z.array(resourceSchema),
})

export type ResourceMeterProps = z.input<typeof resourceMeterSchema>

type Resource = z.infer<typeof resourceSchema>

function Gauge({ resource }: { resource: Resource }) {
  const shouldReduceMotion = useReducedMotion()
  const size = 120
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const clamped = Math.max(0, Math.min(100, resource.value))
  const progress = useMotionValue(clamped)
  const dashOffset = useTransform(progress, (value) =>
    circumference * (1 - Math.max(0, Math.min(100, value)) / 100)
  )

  const [displayValue, setDisplayValue] = React.useState(() => Math.round(clamped))
  const isCritical = clamped <= 20

  React.useEffect(() => {
    if (shouldReduceMotion) {
      progress.set(clamped)
      setDisplayValue(Math.round(clamped))
      return
    }

    const controls = animate(progress, clamped, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest))
      },
    })

    return () => {
      controls.stop()
    }
  }, [clamped, progress, shouldReduceMotion])

  return (
    <motion.div
      className={cn(
        "rounded-xl border border-light bg-bg-secondary p-4 shadow-sm",
        "transition-[transform,box-shadow,border-color] duration-200 ease-out"
      )}
      whileHover={shouldReduceMotion ? undefined : { y: -2, boxShadow: "var(--shadow-md)" }}
      animate={
        shouldReduceMotion || !isCritical
          ? undefined
          : {
              boxShadow: ["var(--shadow-sm)", "0 0 0 4px rgba(239,68,68,0.12)", "var(--shadow-sm)"],
            }
      }
      transition={
        shouldReduceMotion || !isCritical
          ? { duration: 0 }
          : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div className="mx-auto w-[120px]">
        <div className="relative size-[120px]">
          <svg
            className="size-[120px] -rotate-90"
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={resource.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">{displayValue}</div>
              {resource.icon && (
                <div className="mt-1 text-xl leading-none" aria-hidden>
                  {resource.icon}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-sm font-semibold text-text-primary">
          {resource.name}
        </div>
      </div>
    </motion.div>
  )
}

export function ResourceMeter({ resources }: ResourceMeterProps) {
  return (
    <section className={componentCardClassName}>
      <h3 className="mb-4 text-xl font-semibold text-text-primary">📊 Resources</h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {resources.map((resource) => (
          <Gauge key={resource.name} resource={resource} />
        ))}
      </div>
    </section>
  )
}
