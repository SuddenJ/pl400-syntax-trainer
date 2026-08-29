/** Normalize technical answers for comparison without being overly fuzzy. */

export function normalizeAnswer(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/\u00a0/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\(\s*\)\s*$/u, '')
    .replace(/\s*([(){},.;=<>!&|+\-*/])\s*/g, '$1')
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .toLowerCase()
}

/** Extract PascalCase / camelCase / dotted identifiers for strict token checks. */
export function extractIdentifiers(input: string): string[] {
  const matches = input.match(/\b[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*\b/g)
  return matches ?? []
}

export function identifiersConflict(user: string, expected: string): boolean {
  const userIds = new Set(extractIdentifiers(user).map((s) => s.toLowerCase()))
  const expectedIds = extractIdentifiers(expected).map((s) => s.toLowerCase())
  if (expectedIds.length === 0) return false

  // If expected is a single identifier, user must match that exact id (not a longer sibling).
  if (expectedIds.length === 1) {
    const exp = expectedIds[0]
    if (userIds.has(exp)) return false
    for (const id of userIds) {
      if (id !== exp && (id.startsWith(exp) || exp.startsWith(id)) && Math.abs(id.length - exp.length) <= 20) {
        // IOrganizationService vs IOrganizationServiceFactory
        if (id.includes(exp) || exp.includes(id)) return true
      }
    }
    return userIds.size > 0 && !userIds.has(exp)
  }

  return false
}
