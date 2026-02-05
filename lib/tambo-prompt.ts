import { getScenarioById } from "@/lib/scenarios"
import { PLAYBOOK_UI_EVENT_PREFIX } from "@/lib/tambo-protocol"
import scenarioData from "@/public/data/scenarios.json"

type ScenarioData = typeof scenarioData

export const PLAYBOOK_SYSTEM_PROMPT = `You are the AI Game Master for "Reality Forge V4.0" - a generative UI simulation engine.

CRITICAL: You MUST render visual components, not just text.

Every turn, you should:
1. Render GameBoard showing current positions and movement options
2. Render ResourceMeter showing current stats
3. Render ActionMatrix with 4-6 available actions
4. Use TacticalAlert only for high-priority warnings/info/danger/success
5. Add a SHORT text response (1-2 sentences max)

ALWAYS render components FIRST, then minimal text. Show, don't tell.

AVAILABLE COMPONENTS:
- GameBoard: grid board with playerPosition + enemies/resources markers
- ResourceMeter: resource gauges (0-100)
- ActionMatrix: interactive action grid (clicks send UI events)
- TacticalAlert: high priority notices

UI EVENT FORMAT:
- When the user clicks an action in ActionMatrix, you will receive a user message starting with:
  ${PLAYBOOK_UI_EVENT_PREFIX}
  followed by a JSON payload like {"kind":"action_selected","actionId":"...","label":"..."}.
- Treat that as the user's selected action.
- Never output messages starting with ${PLAYBOOK_UI_EVENT_PREFIX}.

Be creative, visually engaging, and maintain immersion with the chosen scenario.`

function safeJson(value: unknown, maxLen = 900): string {
  try {
    const json = JSON.stringify(value)
    if (json.length <= maxLen) return json

    const sliceLen = Math.max(0, maxLen - 1)
    return `${json.slice(0, sliceLen)}…`
  } catch {
    return "[unserializable]"
  }
}

export function buildSystemPrompt(scenarioId: string): string {
  const scenario = getScenarioById(scenarioId)
  const scenarioPrompt = (scenarioData as ScenarioData).scenarios.find(
    (s) => s.id === scenarioId
  )?.systemPrompt

  const parts: string[] = [PLAYBOOK_SYSTEM_PROMPT]

  if (scenarioPrompt) {
    parts.push("", "SCENARIO PROMPT:", scenarioPrompt)
  }

  if (!scenario) return parts.join("\n")

  const objectives = scenario.objectives ?? []

  parts.push(
    "",
    `Scenario: ${scenario.title}`,
    `Description: ${scenario.description}`
  )

  if (objectives.length > 0) {
    parts.push("Objectives:", ...objectives.map((o) => `- ${o}`))
  }

  parts.push("", `Initial state: ${safeJson(scenario.initialState)}`)

  return parts.join("\n")
}
