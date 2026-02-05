export const PLAYBOOK_TRANSITION_STORAGE_KEY = "playbook:transition"

export function setPlaybookTransitionFlag() {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(PLAYBOOK_TRANSITION_STORAGE_KEY, "1")
  } catch {
    // Ignore storage failures (private mode, disabled cookies, etc.)
  }
}

export function consumePlaybookTransitionFlag(): boolean {
  if (typeof window === "undefined") return false
  try {
    const shouldShow =
      window.sessionStorage.getItem(PLAYBOOK_TRANSITION_STORAGE_KEY) === "1"
    if (!shouldShow) return false

    window.sessionStorage.removeItem(PLAYBOOK_TRANSITION_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
