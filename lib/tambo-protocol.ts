export const PLAYBOOK_UI_EVENT_PREFIX = "__PLAYBOOK_UI_EVENT__"

export type PlaybookUiEvent =
  | {
      kind: "action_selected"
      actionId: string
      label?: string
    }

export function formatPlaybookUiEvent(event: PlaybookUiEvent): string {
  return `${PLAYBOOK_UI_EVENT_PREFIX} ${JSON.stringify(event)}`
}
