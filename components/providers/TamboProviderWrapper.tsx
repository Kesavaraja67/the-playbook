"use client"

import * as React from "react"
import { TamboProvider } from "@tambo-ai/react"
import { MCPTransport } from "@tambo-ai/react/mcp"

import { components, tools } from "@/lib/tambo-client"

const defaultMcpUrl = "https://mcp.tambo.co/mcp"

const mcpServers = [
  {
    name: "tambo",
    description: "Tambo documentation and support (remote MCP server)",
    transport: MCPTransport.HTTP,
    url: process.env.NEXT_PUBLIC_TAMBO_MCP_URL ?? defaultMcpUrl,
  },
]

export function TamboProviderWrapper({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("NEXT_PUBLIC_TAMBO_API_KEY is not set; running without TamboProvider")
    }

    return <>{children}</>
  }

  return (
    <TamboProvider apiKey={apiKey} components={components} tools={tools} mcpServers={mcpServers}>
      {children}
    </TamboProvider>
  )
}
