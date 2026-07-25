import type { Property } from '../engine/types'

// Mock data only (CLAUDE.md rule 6). These numbers are invented but tuned:
//   aurea  — the balanced unit: moderate everything, decent developer.
//   marasi — expensive, best rent cushion, but a thin (3/3) developer record
//            and a big post-handover tail.
//   ridge  — looks like the value play on price per sqft, finishes last on
//            everything that matters (worst developer, razor-thin cushion).
// Do not "tidy" these — the spread is the teaching mechanism.
export const PROPERTIES: Property[] = [
  {
    id: 'aurea',
    name: 'Aurea Residences',
    area: 'Jumeirah Village Circle',
    developer: 'Vantara Developments',
    price: 1_150_000,
    sqft: 745,
    svcRate: 16,
    claimRent: 78_000,
    estRent: 71_000,
    plan: '60/40 on handover',
    preHandoverPct: 0.6,
    atHandoverPct: 0.4,
    postHandoverPct: 0,
    handover: 'Q4 2027',
    monthsToHandover: 17,
    delivered: 6,
    total: 8,
    devAvgLateMo: 4,
    devCancelled: 0,
  },
  {
    id: 'marasi',
    name: 'Marasi Point',
    area: 'Business Bay',
    developer: 'Kessler Homes',
    price: 1_780_000,
    sqft: 690,
    svcRate: 24,
    claimRent: 125_000,
    estRent: 108_000,
    plan: '80/20 post-handover',
    preHandoverPct: 0.65,
    atHandoverPct: 0.15,
    postHandoverPct: 0.2,
    handover: 'Q2 2028',
    monthsToHandover: 23,
    delivered: 3,
    total: 3,
    devAvgLateMo: 1,
    devCancelled: 0,
  },
  {
    id: 'ridge',
    name: 'The Ridge',
    area: 'Dubai South',
    developer: 'NorthQuay Group',
    price: 890_000,
    sqft: 810,
    svcRate: 12,
    claimRent: 62_000,
    estRent: 52_000,
    plan: '70/30 on handover',
    preHandoverPct: 0.7,
    atHandoverPct: 0.3,
    postHandoverPct: 0,
    handover: 'Q1 2029',
    monthsToHandover: 30,
    delivered: 4,
    total: 7,
    devAvgLateMo: 11,
    devCancelled: 1,
  },
]

export const byId = (id: string): Property => {
  const p = PROPERTIES.find((x) => x.id === id)
  if (!p) throw new Error(`Unknown property id: ${id}`)
  return p
}
