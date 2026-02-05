export function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

export function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback
}
