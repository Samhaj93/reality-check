// Confidence decomposition (RC-6). Four bands, each scored 0–3. The blended
// total drives a verdict label but is NEVER shown to the user as a number
// (that rule is enforced in the UI, not here). Pure engine: imports only within
// the engine folder.
import {
  cashBeforeFirstRent,
  deliveryRatio,
  netYield,
  rentCushion,
} from './calc'
import type { BandScore, Property, Verdict } from './types'

const clamp03 = (n: number): 0 | 1 | 2 | 3 =>
  (n < 0 ? 0 : n > 3 ? 3 : n) as 0 | 1 | 2 | 3

// Formatting is a UI concern, but these sentences are the score's rationale and
// are part of the engine's output contract, so a little inline formatting is
// unavoidable. Kept tiny and local.
const pct = (frac: number, dp = 1) => `${(frac * 100).toFixed(dp)}%`
const pctAbs = (frac: number) => `${Math.abs(frac * 100).toFixed(0)}%`
const aed = (n: number) => `AED ${Math.round(n).toLocaleString('en-US')}`
const months = (n: number) => `${n} month${n === 1 ? '' : 's'}`

// Band 1 — the return itself, on our checked rent.
function yieldBand(p: Property): BandScore {
  const y = netYield(p, p.estRent)
  const score = clamp03(y >= 0.04 ? 3 : y >= 0.035 ? 2 : y >= 0.03 ? 1 : 0)
  const tail =
    score >= 3
      ? 'clears a healthy bar.'
      : score === 2
        ? 'solid, not spectacular.'
        : score === 1
          ? 'thin once costs are in.'
          : 'barely covers its costs.'
  return {
    key: 'yield',
    label: 'Return',
    score,
    provenance: 'estimate',
    sentence: `Net yield of ${pct(y)} on our checked rent — ${tail}`,
  }
}

// Band 2 — margin of safety in the rent, at the user's target. Target-dependent.
function cushionBand(p: Property, target: number): BandScore {
  const c = rentCushion(p, target)
  const score = clamp03(c >= 0.15 ? 3 : c >= 0.07 ? 2 : c >= 0 ? 1 : 0)
  const sentence =
    c >= 0
      ? `At a ${pct(target)} target, rent can fall ${pctAbs(c)} below our estimate before the deal stops working.`
      : `At a ${pct(target)} target, rent would have to beat our estimate by ${pctAbs(c)} — no cushion at all.`
  return { key: 'cushion', label: 'Rent cushion', score, provenance: 'estimate', sentence }
}

// Band 3 — the developer's delivery record.
function developerBand(p: Property): BandScore {
  let s = 3
  if (p.devAvgLateMo >= 6) s = Math.min(s, 1)
  else if (p.devAvgLateMo >= 3) s = Math.min(s, 2)
  if (p.devCancelled > 0) s -= 1
  if (deliveryRatio(p) < 0.6) s -= 1
  const cancelledClause =
    p.devCancelled > 0 ? `, ${p.devCancelled} cancelled` : ', none cancelled'
  return {
    key: 'developer',
    label: 'Developer',
    score: clamp03(s),
    provenance: 'registry',
    sentence: `Delivered ${p.delivered} of ${p.total} projects, averages ${months(p.devAvgLateMo)} late${cancelledClause}.`,
  }
}

// Band 4 — how much you commit before any rent arrives.
function cashBand(p: Property): BandScore {
  const exposure = cashBeforeFirstRent(p) / p.price
  const score = clamp03(exposure <= 0.9 ? 3 : exposure <= 1.0 ? 2 : exposure <= 1.05 ? 1 : 0)
  return {
    key: 'cash',
    label: 'Cash exposure',
    score,
    provenance: 'claim',
    sentence: `You commit ${aed(cashBeforeFirstRent(p))} — ${pct(exposure, 0)} of price — before the first dirham of rent.`,
  }
}

export function scoreBands(p: Property, target: number): BandScore[] {
  return [yieldBand(p), cushionBand(p, target), developerBand(p), cashBand(p)]
}

export function bandTotal(p: Property, target: number): number {
  return scoreBands(p, target).reduce((sum, b) => sum + b.score, 0)
}

// Total → verdict. Thresholds on a 0–12 scale. The number never leaves here.
export function verdict(p: Property, target: number): Verdict {
  const total = bandTotal(p, target)
  return total >= 10 ? 'Workable' : total >= 7 ? 'Marginal' : 'Fragile'
}

export const MAX_BAND_SCORE = 3
