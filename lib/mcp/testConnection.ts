import { DEFAULT_TAMBO_MCP_SERVER_URL } from "./constants"

/**
* @deprecated Import `DEFAULT_TAMBO_MCP_SERVER_URL` directly from "./constants" instead. This
* re-export will be removed in a future version.
*/
export { DEFAULT_TAMBO_MCP_SERVER_URL }

/**
* Result of testing connectivity to an MCP server.
*
* - `kind: "http"`: server responded with a non-2xx HTTP status
* - `kind: "network"`: request failed or was aborted for non-timeout reasons
* - `kind: "timeout"`: request exceeded `timeoutMs` and was aborted
*/
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
  let didTimeout = false
  const timeoutId = setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, timeoutMs)

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
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)

    const isAbortError = error instanceof Error && error.name === "AbortError"
    const isTimeout = didTimeout && isAbortError

    return {
      ok: false,
      url,
      error: isTimeout ? `Timeout after ${timeoutMs}ms` : message,
      kind: isTimeout ? "timeout" : "network",
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
