"use client"

import * as React from "react"

import { TamboClientProvider } from "@tambo-ai/react"

import { TAMBO_API_KEY } from "@/lib/config"

export function TamboClientRootProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (TAMBO_API_KEY) return
    console.warn(
      "NEXT_PUBLIC_TAMBO_API_KEY is not set; voice transcription fallback will be disabled."
    )
  }, [])

  return <TamboClientProvider apiKey={TAMBO_API_KEY}>{children}</TamboClientProvider>
}
