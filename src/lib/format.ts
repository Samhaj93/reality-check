// Presentation helpers. Formatting is a UI concern and lives here, never in the
// engine (CLAUDE.md rule 3).

export const aed = (n: number): string => `AED ${Math.round(n).toLocaleString('en-US')}`

// Compact AED for tight spaces (bars, chips): AED 1.20m / AED 640k.
export const aedShort = (n: number): string => {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}m`
  if (abs >= 1_000) return `AED ${Math.round(n / 1_000)}k`
  return aed(n)
}

export const pct = (frac: number, dp = 1): string => `${(frac * 100).toFixed(dp)}%`

// Magnitude only — the sign is expressed by the surrounding sentence/colour.
export const pctAbs = (frac: number, dp = 0): string =>
  `${(Math.abs(frac) * 100).toFixed(dp)}%`

export const months = (n: number): string => `${n} mo`

// Tiny classnames joiner (avoids a clsx dependency).
export const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')
