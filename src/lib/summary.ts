import type { Property } from '../engine/types'
import {
  acquisitionCost,
  cashBeforeFirstRent,
  grossYield,
  netYield,
} from '../engine/calc'
import { verdict } from '../engine/bands'
import { aed, pct } from './format'

// Plain-text summary for the clipboard (RC-7 / I5). Checked figures only, with
// the verdict — never a price forecast.
export function buildSummary(properties: Property[], target: number): string {
  const lines: string[] = [
    'Reality Check — shortlist comparison (checked figures)',
    `Target net yield: ${pct(target)}`,
    '',
  ]
  for (const p of properties) {
    lines.push(
      `${p.name} — ${p.area}`,
      `  Net yield (checked est rent): ${pct(netYield(p, p.estRent))}   vs brochure gross: ${pct(grossYield(p, p.claimRent))}`,
      `  Acquisition cost: ${aed(acquisitionCost(p))}   Cash before first rent: ${aed(cashBeforeFirstRent(p))}`,
      `  Verdict: ${verdict(p, target)}`,
      '',
    )
  }
  lines.push(
    'Prototype with mock data. Every figure is labelled by provenance; no resale-price forecasts.',
  )
  return lines.join('\n')
}
