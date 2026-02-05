"use client"

import { useTamboThread } from "@tambo-ai/react"

import { ActionMatrix as BaseActionMatrix } from "@/components/canvas/ActionMatrix"
import type { ActionMatrixProps } from "@/lib/canvas-schemas"
import { ActionMatrixSchema as actionMatrixSchema } from "@/lib/canvas-schemas"

export { actionMatrixSchema }

export function ActionMatrix({ actions }: ActionMatrixProps) {
  const { sendThreadMessage, streaming } = useTamboThread()

  return (
    <BaseActionMatrix
      actions={actions}
      onActionClick={(actionId) => {
        if (streaming) return

        const action = actions.find((a) => a.id === actionId)
        const userIntent = action ? `I choose: ${action.label}` : `I choose: ${actionId}`
        void sendThreadMessage(userIntent)
      }}
    />
  )
}
