"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { TamboProvider, useTamboThread } from "@tambo-ai/react"
import { MCPTransport } from "@tambo-ai/react/mcp"

import { TamboCitationGuard } from "@/components/providers/TamboCitationGuard"
import { HAS_TAMBO_API_KEY, TAMBO_API_KEY } from "@/lib/config"
import { components, tools } from "@/lib/tambo-client"
import { DEFAULT_TAMBO_MCP_SERVER_URL } from "@/lib/mcp/constants"
import { DEFAULT_SCENARIO_ID, getScenarioById } from "@/lib/scenarios"

const tamboMissingApiKeyLogKey = "tambo.missingApiKeyLogged"
const tamboMissingApiKeyWindowFlag = "__tamboMissingApiKeyLogged" as const

type TamboWindow = Window & Partial<Record<typeof tamboMissingApiKeyWindowFlag, boolean>>

function ScenarioKeySync({
  pathname,
  setScenarioId,
}: {
  pathname: string
  setScenarioId: (scenarioId: string | null) => void
}) {
  const searchParams = useSearchParams()
  const scenarioParam = searchParams.get("scenario") ?? ""

  React.useEffect(() => {
    const isPlayRoute = pathname === "/play" || pathname.startsWith("/play/")
    if (!isPlayRoute) {
      setScenarioId(null)
      return
    }

    const rawScenarioId = scenarioParam.trim()
    const candidateScenarioId = rawScenarioId.length > 0 ? rawScenarioId : DEFAULT_SCENARIO_ID
    setScenarioId(getScenarioById(candidateScenarioId)?.id ?? DEFAULT_SCENARIO_ID)
  }, [pathname, scenarioParam, setScenarioId])

  return null
}

function ScenarioThreadReset({ scenarioId }: { scenarioId: string | null }) {
  const { startNewThread } = useTamboThread()
  const lastScenarioIdRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!scenarioId) return
    if (lastScenarioIdRef.current === scenarioId) return

    lastScenarioIdRef.current = scenarioId
    startNewThread()
  }, [scenarioId, startNewThread])

  return null
}

export function TamboProviderWrapper({ children }: { children: React.ReactNode }) {
  // `NEXT_PUBLIC_*` env vars are exposed to the browser. This API key is expected to
  // be scoped as a public/client token (not a secret with elevated privileges).
  const apiKey = TAMBO_API_KEY
  const isDevelopment = process.env.NODE_ENV === "development"

  const pathname = usePathname()

  const [scenarioId, setScenarioId] = React.useState<string | null>(null)

  const scenarioKeySync = (
    <React.Suspense fallback={null}>
      <ScenarioKeySync pathname={pathname} setScenarioId={setScenarioId} />
    </React.Suspense>
  )

  const scenarioSystemPrompt = React.useMemo(() => {
    if (!scenarioId) return null
    return getScenarioById(scenarioId)?.systemPrompt ?? null
  }, [scenarioId])

  const initialMessages = React.useMemo(() => {
    if (!scenarioSystemPrompt) return []

    return [
      {
        role: "system" as const,
        content: [{ type: "text" as const, text: scenarioSystemPrompt }],
      },
    ]
  }, [scenarioSystemPrompt])

  const mcpServers = React.useMemo(() => {
    const rawUrl = (process.env.NEXT_PUBLIC_TAMBO_MCP_URL ?? "").trim()
    const url = rawUrl.length > 0 ? rawUrl : DEFAULT_TAMBO_MCP_SERVER_URL

    return [
      {
        name: "tambo-docs",
        serverKey: "tambo-docs",
        description: "Tambo documentation and support (remote MCP server)",
        transport: MCPTransport.HTTP,
        url,
      },
    ]
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const win = window as TamboWindow

    if (HAS_TAMBO_API_KEY) {
      try {
        window.sessionStorage.removeItem(tamboMissingApiKeyLogKey)
      } catch {
        // Ignore sessionStorage failures (for example: restricted storage environments).
      }

      delete win[tamboMissingApiKeyWindowFlag]

      return
    }

    if (win[tamboMissingApiKeyWindowFlag] === true) return

    try {
      if (window.sessionStorage.getItem(tamboMissingApiKeyLogKey) === "true") {
        win[tamboMissingApiKeyWindowFlag] = true
        return
      }
      window.sessionStorage.setItem(tamboMissingApiKeyLogKey, "true")
    } catch {
      // Ignore sessionStorage failures (for example: restricted storage environments).
    }

    win[tamboMissingApiKeyWindowFlag] = true
    console.warn("NEXT_PUBLIC_TAMBO_API_KEY is not set; running without TamboProvider")
  }, [])

  if (!HAS_TAMBO_API_KEY) {
    if (!isDevelopment) return <>{children}</>

    return (
      <>
        {scenarioKeySync}
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
    <>
      {scenarioKeySync}
      <TamboProvider
        apiKey={apiKey}
        components={components}
        tools={tools}
        mcpServers={mcpServers}
        initialMessages={initialMessages}
        contextKey={scenarioId ?? undefined}
      >
        <ScenarioThreadReset scenarioId={scenarioId} />
        <TamboCitationGuard />
        {children}
      </TamboProvider>
    </>
  )
}
