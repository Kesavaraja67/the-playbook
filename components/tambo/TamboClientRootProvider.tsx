"use client"

import * as React from "react"

import { TamboClientProvider } from "@tambo-ai/react"

export function TamboClientRootProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY ?? ""

  return <TamboClientProvider apiKey={apiKey}>{children}</TamboClientProvider>
}
