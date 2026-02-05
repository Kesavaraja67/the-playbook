"use client"

import * as React from "react"
import { TamboProvider } from "@tambo-ai/react"
import { MCPTransport } from "@tambo-ai/react/mcp"

import { components, tools } from "@/lib/tambo-client"
import { DEFAULT_TAMBO_MCP_SERVER_URL } from "@/lib/mcp/constants"

const mcpServers = [
  {
    name: "tambo-docs",
    description: "Tambo documentation and support (remote MCP server)",
    transport: MCPTransport.HTTP,
    url: process.env.NEXT_PUBLIC_TAMBO_MCP_URL ?? DEFAULT_TAMBO_MCP_SERVER_URL,
  },
]

export function TamboProviderWrapper({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY

  React.useEffect(() => {
    if (apiKey) return
    console.warn("NEXT_PUBLIC_TAMBO_API_KEY is not set; running without TamboProvider")
  }, [apiKey])

  if (!apiKey) {
    return (
      <>
        <div
          role="alert"
          className={
            "fixed right-3 top-3 z-50 max-w-sm rounded-lg border-2 border-[#FF3B30] bg-white p-3 text-xs text-[#1D1D1F] shadow-[4px_4px_0_0_rgba(0,0,0,0.12)]"
          }
        >
          <div className="font-semibold text-[#FF3B30]">Tambo is disabled</div>
          <div className="mt-1">
            Set <code className="font-mono">NEXT_PUBLIC_TAMBO_API_KEY</code> to enable
            MCP-backed documentation and citations.
          </div>
        </div>
        {children}
      </>
    )
  }

  return (
    <TamboProvider apiKey={apiKey} components={components} tools={tools} mcpServers={mcpServers}>
      {children}
    </TamboProvider>
  )
}
