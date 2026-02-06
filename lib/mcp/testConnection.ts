import { DEFAULT_TAMBO_MCP_SERVER_URL } from "./constants"

export type McpConnectionTestResult =
  | {
      ok: true
      url: string
      status: number
      serverInfo: unknown
    }
  | {
      ok: false
      url: string
      status?: number
      error: string
      kind: "http" | "network" | "timeout"
    }

export async function testMCPConnection(
  url: string = DEFAULT_TAMBO_MCP_SERVER_URL,
  { timeoutMs = 10_000 }: { timeoutMs?: number } = {}
): Promise<McpConnectionTestResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      return {
        ok: false,
        url,
        status: response.status,
        error: `MCP endpoint returned HTTP ${response.status}`,
        kind: "http",
      }
    }

    const serverInfo = (await response.json()) as unknown

    return {
      ok: true,
      url,
      status: response.status,
      serverInfo,
    }
  } catch (error) {
    const isAbortError =
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")

    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)

    return {
      ok: false,
      url,
      error: isAbortError ? `Timeout after ${timeoutMs}ms` : message,
      kind: isAbortError ? "timeout" : "network",
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
