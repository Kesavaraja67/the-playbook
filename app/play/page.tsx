import { buildSystemPrompt } from "@/lib/tambo-prompt"

import { PlayClient } from "./PlayClient"

type PlayPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function PlayPage({ searchParams }: PlayPageProps) {
  const scenarioParam = searchParams?.scenario
  const scenarioId =
    typeof scenarioParam === "string"
      ? scenarioParam
      : Array.isArray(scenarioParam)
        ? scenarioParam[0] ?? "zombie-survival"
        : "zombie-survival"

  return (
    <PlayClient
      scenarioId={scenarioId}
      systemPrompt={buildSystemPrompt(scenarioId)}
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY}
    />
  )
}
