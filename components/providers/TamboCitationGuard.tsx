"use client"

import * as React from "react"
import {
  TamboMessageProvider,
  useTamboMcpServerInfos,
  useTamboThread,
  type TamboThreadMessage,
} from "@tambo-ai/react"

import { SourceCitation } from "@/components/scenarios/educational/SourceCitation"

const MCP_TOOL_NAME_SEPARATOR = "__"

function getMcpServerKeyFromToolName(toolName: string) {
  const separatorIndex = toolName.indexOf(MCP_TOOL_NAME_SEPARATOR)
  if (separatorIndex <= 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn("TamboCitationGuard: unexpected MCP tool name format", { toolName })
    }

    return null
  }
  return toolName.slice(0, separatorIndex)
}

function getFirstHttpUrlFromMessage(message: TamboThreadMessage) {
  for (const part of message.content) {
    if (part.type !== "resource") continue
    const uri = part.resource?.uri
    if (typeof uri !== "string") continue
    if (uri.startsWith("https://") || uri.startsWith("http://")) return uri
  }
  return null
}

function getFirstResourceNameFromMessage(message: TamboThreadMessage) {
  for (const part of message.content) {
    if (part.type !== "resource") continue
    const name = part.resource?.name
    if (typeof name === "string" && name.trim()) return name
  }
  return null
}

/**
* Minimal runtime guardrail for MCP-backed answers:
*
* If a turn includes at least one MCP tool call (tool name prefixed with
* `<serverKey>__`) and the assistant doesn't render a `SourceCitation`
* component, this appends a follow-up `SourceCitation` message using whatever
* URL/name can be inferred from MCP tool results.
*/
export function TamboCitationGuard() {
  const { thread, addThreadMessage } = useTamboThread()
  const mcpServerInfos = useTamboMcpServerInfos()

  const ensuredForMessageIdRef = React.useRef(new Set<string>())

  const mcpServerKeys = React.useMemo(() => {
    return new Set(mcpServerInfos.map((info) => info.serverKey))
  }, [mcpServerInfos])

  React.useEffect(() => {
    const messages = thread.messages
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "assistant") return
    if (lastMessage.component?.componentName === "SourceCitation") return
    if (lastMessage.toolCallRequest) return

    const assistantMessage = lastMessage
    if (ensuredForMessageIdRef.current.has(assistantMessage.id)) return

    const assistantIndex = messages.length - 1
    const userIndex = (() => {
      for (let index = assistantIndex - 1; index >= 0; index -= 1) {
        if (messages[index].role === "user") return index
      }
      return -1
    })()

    if (userIndex === -1) return

    const turnMessages = messages.slice(userIndex + 1, assistantIndex + 1)
    const hasCitationInTurn = turnMessages.some(
      (message) => message.component?.componentName === "SourceCitation"
    )
    if (hasCitationInTurn) return

    const toolCallById = new Map<string, string>()
    for (const message of turnMessages) {
      const toolCallId = message.tool_call_id
      const toolName = message.toolCallRequest?.toolName
      if (!toolCallId || !toolName) continue
      toolCallById.set(toolCallId, toolName)
    }

    const mcpToolResponses = turnMessages
      .filter(
        (
          message
        ): message is TamboThreadMessage & {
          role: "tool"
          tool_call_id: string
        } => message.role === "tool" && typeof message.tool_call_id === "string"
      )
      .map((message) => {
        const toolName = toolCallById.get(message.tool_call_id)
        return { toolName, message }
      })
      .filter(({ toolName }) => typeof toolName === "string")

    const mcpToolResponse = mcpToolResponses.find(({ toolName }) => {
      const serverKey = getMcpServerKeyFromToolName(toolName ?? "")
      return serverKey ? mcpServerKeys.has(serverKey) : false
    })

    if (!mcpToolResponse) return

    ensuredForMessageIdRef.current.add(assistantMessage.id)

    const toolName = mcpToolResponse.toolName ?? ""
    const serverKey = getMcpServerKeyFromToolName(toolName)
    const serverInfo = serverKey
      ? mcpServerInfos.find((info) => info.serverKey === serverKey) ?? null
      : null

    const toolMessage = mcpToolResponse.message
    const url = getFirstHttpUrlFromMessage(toolMessage) ?? undefined
    const resourceName = getFirstResourceNameFromMessage(toolMessage) ?? undefined

    const source =
      resourceName ??
      serverInfo?.name ??
      (serverInfo ? `MCP (${serverInfo.serverKey})` : "MCP source")

    const fetchedAt = toolMessage.createdAt

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `citation-${Date.now()}-${Math.random().toString(16).slice(2)}`

    const citationMessageBase: TamboThreadMessage = {
      id,
      threadId: assistantMessage.threadId,
      role: "assistant",
      createdAt: new Date().toISOString(),
      content: [],
      componentState: {},
      component: {
        componentName: "SourceCitation",
        componentState: {},
        message: "",
        props: {
          source,
          url,
          fetchedAt,
        },
      },
      metadata: {
        tamboCitationGuard: true,
        tamboCitationGuardParentId: assistantMessage.id,
      },
    }

    const citationMessage: TamboThreadMessage = {
      ...citationMessageBase,
      renderedComponent: (
        <TamboMessageProvider message={citationMessageBase}>
          <SourceCitation source={source} url={url} fetchedAt={fetchedAt} />
        </TamboMessageProvider>
      ),
    }

    void addThreadMessage(citationMessage, false)
  }, [addThreadMessage, mcpServerInfos, mcpServerKeys, thread.messages])

  return null
}
