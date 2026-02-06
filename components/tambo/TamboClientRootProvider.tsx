"use client"

import * as React from "react"

import { TamboClientProvider } from "@tambo-ai/react"

import { TAMBO_API_KEY } from "@/lib/config"

// This must wrap any part of the app that uses `@tambo-ai/react` hooks.
export function TamboClientRootProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    if (TAMBO_API_KEY) return
    console.warn(
      "NEXT_PUBLIC_TAMBO_API_KEY is not set; Tambo transcription is disabled (browser speech may still work)."
    )
  }, [])

  return <TamboClientProvider apiKey={TAMBO_API_KEY}>{children}</TamboClientProvider>
}
