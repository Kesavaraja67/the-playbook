"use client"

import * as React from "react"
import { MotionConfig } from "framer-motion"

export function AppMotionShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
       <div className="min-h-screen">
          {children}
       </div>
    </MotionConfig>
  )
}
