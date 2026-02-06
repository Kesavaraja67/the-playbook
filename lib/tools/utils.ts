/**
* Utility functions used by scenario tools to generate varied outcomes.
*/

export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function rollDice(sides: number): number {
  return randomInRange(1, sides)
}

export function successCheck(probability: number): boolean {
  const p = Math.min(
    1,
    Math.max(0, Number.isFinite(probability) ? probability : 0)
  )
  return Math.random() < p
}

export function calculateDamage(base: number, variance: number): number {
  const variation = randomInRange(-variance, variance)
  return Math.max(0, base + variation)
}

/**
* Select an item by weight.
*
* `items` must be non-empty.
*/
export function weightedRandom<T>(items: Array<{ item: T; weight: number }>): T {
  if (items.length === 0) {
    throw new Error("weightedRandom: items must not be empty")
  }

  let totalWeight = 0
  for (const { weight } of items) {
    if (!Number.isFinite(weight) || weight < 0) {
      throw new Error("weightedRandom: weights must be finite and >= 0")
    }
    totalWeight += weight
  }
  if (totalWeight <= 0) {
    throw new Error("weightedRandom: total weight must be > 0")
  }
  let random = Math.random() * totalWeight

  for (const { item, weight } of items) {
    random -= weight
    if (random <= 0) return item
  }

  return items[items.length - 1].item
}
