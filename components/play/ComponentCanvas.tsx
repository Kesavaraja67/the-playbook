"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export const componentCardClassName =
  "ds-card p-6"

type ComponentCanvasProps = {
  children: React.ReactNode
  className?: string
}

export function ComponentCanvas({ children, className }: ComponentCanvasProps) {
  return (
    <div className={cn("bg-secondary", className)}>
      <div className="mx-auto max-w-[1200px] px-6 py-6">{children}</div>
    </div>
  )
}
