"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export const componentCardClassName =
  "bg-white border-2 border-[#D2D2D7] rounded-[12px] p-6 shadow-[2px_2px_0px_#1D1D1F]"

type ComponentCanvasProps = {
  children: React.ReactNode
  className?: string
}

export function ComponentCanvas({ children, className }: ComponentCanvasProps) {
  return (
    <div className={cn("bg-[#F5F5F7]", className)}>
      <div className="mx-auto max-w-[1200px] px-6 py-6">{children}</div>
    </div>
  )
}
