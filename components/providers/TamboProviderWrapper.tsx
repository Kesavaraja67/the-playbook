"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { TamboProvider, useTamboMcpServerInfos, useTamboThread } from "@tambo-ai/react"
import { MCPTransport, TamboMcpProvider, useTamboMcpServers } from "@tambo-ai/react/mcp"

import { TamboCitationGuard } from "@/components/providers/TamboCitationGuard"
import { HAS_TAMBO_API_KEY, TAMBO_API_KEY } from "@/lib/config"
import { components, tools } from "@/lib/tambo-client"
import { DEFAULT_TAMBO_MCP_SERVER_URL } from "@/lib/mcp/constants"
import { coerceScenarioId, getScenarioById } from "@/lib/scenarios"

const tamboMissingApiKeyLogKey = "tambo.missingApiKeyLogged"
const tamboMissingApiKeyWindowFlag = "__tamboMissingApiKeyLogged" as const

type TamboWindow = Window & Partial<Record<typeof tamboMissingApiKeyWindowFlag, boolean>>

function isPlayRoute(pathname: string) {
  return pathname === "/play" || pathname.startsWith("/play/")
}

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
    if (!isPlayRoute(pathname)) {
      setScenarioId(null)
      return
    }

    setScenarioId(coerceScenarioId(scenarioParam))
  }, [pathname, scenarioParam, setScenarioId])

  return null
}

type ScenarioThreadResetState = {
  lastScenarioId: string | null
  pendingResetScenarioId: string | null
}

function computeScenarioThreadReset(
  prev: ScenarioThreadResetState,
  scenarioId: string | null,
  isIdle: boolean
): { next: ScenarioThreadResetState; shouldReset: boolean } {
  if (!scenarioId) {
    return { next: { lastScenarioId: null, pendingResetScenarioId: null }, shouldReset: false }
  }

  if (prev.pendingResetScenarioId === scenarioId && isIdle) {
    return {
      next: { lastScenarioId: scenarioId, pendingResetScenarioId: null },
      shouldReset: true,
    }
  }

  const lastScenarioId = prev.lastScenarioId
  if (!lastScenarioId) {
    return { next: { lastScenarioId: scenarioId, pendingResetScenarioId: null }, shouldReset: false }
  }

  if (scenarioId === lastScenarioId) {
    return { next: prev, shouldReset: false }
  }

  if (isIdle) {
    return {
      next: { lastScenarioId: scenarioId, pendingResetScenarioId: null },
      shouldReset: true,
    }
  }

  return {
    next: { lastScenarioId: scenarioId, pendingResetScenarioId: scenarioId },
    shouldReset: false,
  }
}

function ScenarioThreadReset({ scenarioId }: { scenarioId: string | null }) {
  const { startNewThread, isIdle } = useTamboThread()

  // Resets the active Tambo thread when switching between `/play` scenarios.
  // If a generation/tool run is in progress, defer the reset until the thread is idle.
  const stateRef = React.useRef<ScenarioThreadResetState>({
    lastScenarioId: null,
    pendingResetScenarioId: null,
  })

  React.useEffect(() => {
    const { next, shouldReset } = computeScenarioThreadReset(stateRef.current, scenarioId, isIdle)
    stateRef.current = next
    if (shouldReset) startNewThread()
  }, [isIdle, scenarioId, startNewThread])

  return null
}

function TamboMcpDevDiagnostics() {
  const mcpServerInfos = useTamboMcpServerInfos()
  const mcpServers = useTamboMcpServers()

  const hasLoggedInfosRef = React.useRef(false)
  const hasLoggedServerKeysRef = React.useRef(new Set<string>())

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    if (hasLoggedInfosRef.current) return
    if (mcpServerInfos.length === 0) return

    hasLoggedInfosRef.current = true

    console.info("Tambo MCP: configured servers", {
      servers: mcpServerInfos.map((server) => ({
        name: server.name,
        serverKey: server.serverKey,
        transport: server.transport,
        url: server.url,
      })),
    })
  }, [mcpServerInfos])

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    if (mcpServers.length === 0) return

    for (const server of mcpServers) {
      if (hasLoggedServerKeysRef.current.has(server.serverKey)) continue
      hasLoggedServerKeysRef.current.add(server.serverKey)

      if (server.client) {
        // Dev-only diagnostics: `listTools()` makes a one-time network call per server.
        void server.client
          .listTools()
          .then((tools) => {
            console.info("Tambo MCP: tools discovered", {
              serverKey: server.serverKey,
              toolCount: tools.length,
              toolNames: tools.map((tool) => tool.name).slice(0, 8),
            })
          })
          .catch((error) => {
            console.warn("Tambo MCP: failed to list tools", {
              serverKey: server.serverKey,
              error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
            })
          })
        continue
      }

      if ("connectionError" in server) {
        console.warn("Tambo MCP: server failed to connect", {
          serverKey: server.serverKey,
          url: server.url,
          error:
            server.connectionError instanceof Error
              ? `${server.connectionError.name}: ${server.connectionError.message}`
              : String(server.connectionError),
        })
      }
    }
  }, [mcpServers])

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
    // `NEXT_PUBLIC_*` env vars are substituted at build time in Next.js client bundles.
    // We resolve the MCP server URL once to keep the provider props stable across renders.
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
        <TamboMcpProvider key={scenarioId ?? "default"} contextKey={scenarioId ?? undefined}>
          <TamboMcpDevDiagnostics />
          <ScenarioThreadReset scenarioId={scenarioId} />
          <TamboCitationGuard />
          {children}
        </TamboMcpProvider>
      </TamboProvider>
    </>
  )
}
