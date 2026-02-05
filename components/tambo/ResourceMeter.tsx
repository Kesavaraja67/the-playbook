"use client"

import * as React from "react"
import { z } from "zod"

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
  const size = 120
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const clamped = Math.max(0, Math.min(100, resource.value))
  const dashOffset = circumference * (1 - clamped / 100)

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-[#D2D2D7] bg-[#F5F5F7] p-4",
        "shadow-[2px_2px_0px_#1D1D1F]"
      )}
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
              stroke="#D2D2D7"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={resource.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1D1D1F]">
                {Math.round(clamped)}
              </div>
              {resource.icon && (
                <div className="mt-1 text-xl leading-none" aria-hidden>
                  {resource.icon}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-sm font-semibold text-[#1D1D1F]">
          {resource.name}
        </div>
      </div>
    </div>
  )
}

export function ResourceMeter({ resources }: ResourceMeterProps) {
  return (
    <section className={componentCardClassName}>
      <h3 className="text-[#1D1D1F] text-xl font-bold mb-4">📊 Resources</h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {resources.map((resource) => (
          <Gauge key={resource.name} resource={resource} />
        ))}
      </div>
    </section>
  )
}
