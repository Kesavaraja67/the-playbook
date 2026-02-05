/**
* Best for optional scenario fields (cosmetic/default UI values), not required runtime inputs.
*/
export function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

/**
* Best for optional scenario fields (cosmetic/default UI values), not required runtime inputs.
*/
export function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback
}
