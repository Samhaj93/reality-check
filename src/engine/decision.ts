// Decision capture (RC-13). The Decide screen is the only place the product
// asks the user for a position rather than giving them one. This module holds
// the logic behind that: which figures may be cited as the reason, whether the
// form is complete, and how the shortlist ranks.
//
// Pure engine: no React, no formatting, no side effects (CLAUDE.md rule 3).
// The record's *text* is a presentation concern and lives in lib/decisionRecord.
import {
  acquisitionCost,
  cashBeforeFirstRent,
  netYield,
  rentCushion,
} from './calc'
import { bandTotal, verdict } from './bands'
import type { Property, Provenance, Verdict } from './types'

// The three positions are peers. "Walk away" is deliberately not a secondary
// link — declining is a decision, not a failure to decide.
export type Position = 'proceed' | 'hold' | 'walk'

export const POSITIONS: Position[] = ['proceed', 'hold', 'walk']

// The figures a user may cite as the one that decided it. Free text would let
// them write "felt right"; this forces the reason to be a number already on
// screen. Raw values only — the UI formats them.
export type DriverMetric =
  | 'netYield'
  | 'rentCushion'
  | 'cashBeforeFirstRent'
  | 'acquisitionCost'

export interface DecisionDriver {
  id: string // `${propertyId}:${metric}` — stable, used as the select value
  propertyId: string
  propertyName: string
  metric: DriverMetric
  value: number
  provenance: Provenance
}

const METRIC_PROVENANCE: Record<DriverMetric, Provenance> = {
  netYield: 'estimate',
  rentCushion: 'estimate',
  // Both are built on the seller's price, and a figure is only as trustworthy
  // as its shakiest input.
  cashBeforeFirstRent: 'claim',
  acquisitionCost: 'claim',
}

export function decisionDrivers(properties: Property[], target: number): DecisionDriver[] {
  const drivers: DecisionDriver[] = []
  for (const p of properties) {
    const values: Record<DriverMetric, number> = {
      netYield: netYield(p, p.estRent),
      rentCushion: rentCushion(p, target),
      cashBeforeFirstRent: cashBeforeFirstRent(p),
      acquisitionCost: acquisitionCost(p),
    }
    for (const metric of Object.keys(values) as DriverMetric[]) {
      drivers.push({
        id: `${p.id}:${metric}`,
        propertyId: p.id,
        propertyName: p.name,
        metric,
        value: values[metric],
        provenance: METRIC_PROVENANCE[metric],
      })
    }
  }
  return drivers
}

export const findDriver = (
  drivers: DecisionDriver[],
  id: string,
): DecisionDriver | undefined => drivers.find((d) => d.id === id)

// Ranked as checked — band total first, then net yield on our own rent as the
// tie-break. Never ranked on the brochure's figures.
export function rankedShortlist(properties: Property[], target: number): Property[] {
  return [...properties].sort(
    (a, b) =>
      bandTotal(b, target) - bandTotal(a, target) ||
      netYield(b, b.estRent) - netYield(a, a.estRent),
  )
}

// Does this unit clear the bar the user themselves set? Cited below, so the
// record can note when someone proceeds on a unit under their own target.
export const meetsTarget = (p: Property, target: number): boolean =>
  netYield(p, p.estRent) >= target

// True when nothing on the shortlist reaches Workable — the walk-away prompt.
export const noneWorkable = (properties: Property[], target: number): boolean =>
  properties.every((p) => verdict(p, target) !== 'Workable')

export interface DecisionForm {
  position: Position | null
  driverId: string
  changeMind: string
}

// All three are required. A position without a cited number and a falsifiable
// condition is a guess, and the product says so out loud.
export const isComplete = (form: DecisionForm): boolean =>
  form.position !== null && form.driverId !== '' && form.changeMind.trim() !== ''

export interface DecisionRecord {
  position: Position
  driver: DecisionDriver
  changeMind: string
  ranked: { property: Property; verdict: Verdict }[]
  target: number
  belowOwnTarget: boolean
  takenAt: Date
}

// Assembles the record. `takenAt` is injected rather than read from the clock,
// so this stays pure and the tests are deterministic.
export function buildDecision(
  properties: Property[],
  target: number,
  form: DecisionForm,
  takenAt: Date,
): DecisionRecord | null {
  if (!isComplete(form)) return null
  const driver = findDriver(decisionDrivers(properties, target), form.driverId)
  if (!driver) return null

  const cited = properties.find((p) => p.id === driver.propertyId)

  return {
    position: form.position as Position,
    driver,
    changeMind: form.changeMind.trim(),
    ranked: rankedShortlist(properties, target).map((p) => ({
      property: p,
      verdict: verdict(p, target),
    })),
    target,
    // Only meaningful when they're proceeding on the unit they cited.
    belowOwnTarget:
      form.position === 'proceed' && cited !== undefined && !meetsTarget(cited, target),
    takenAt,
  }
}
