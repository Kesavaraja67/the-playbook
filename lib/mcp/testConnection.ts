export const DEFAULT_TAMBO_MCP_SERVER_URL = "https://mcp.tambo.co/mcp"

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
      error: string
    }

export async function testMCPConnection(
  url: string = DEFAULT_TAMBO_MCP_SERVER_URL
): Promise<McpConnectionTestResult> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        url,
        error: `MCP endpoint returned HTTP ${response.status}`,
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
    const message = error instanceof Error ? error.message : String(error)

    return {
      ok: false,
      url,
      error: message,
    }
  }
}
