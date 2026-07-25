// Provenance is the spine of the product. Every figure that reaches the UI must
// declare where it came from. Never rename these to "source type",
// "confidence", or "verification" (CLAUDE.md vocabulary rule).
//
//   registry — a verifiable public record (DLD schedule, RERA area, fee table)
//   estimate — a figure this tool modelled (our rent, service-charge shock)
//   claim    — supplied by the seller / brochure, unverified
export type Provenance = 'registry' | 'estimate' | 'claim'

// A value carried together with the provenance the UI must display beside it.
export interface Tagged<T> {
  value: T
  provenance: Provenance
}

export const tag = <T>(value: T, provenance: Provenance): Tagged<T> => ({
  value,
  provenance,
})

// When a figure is derived from inputs of mixed provenance, the weakest one
// governs: a number is only as trustworthy as its shakiest input.
const RANK: Record<Provenance, number> = { registry: 0, estimate: 1, claim: 2 }
export const worstProvenance = (...ps: Provenance[]): Provenance =>
  ps.reduce((worst, p) => (RANK[p] > RANK[worst] ? p : worst), 'registry')

// A single off-plan unit. Raw values only — no formatting, no derived figures.
// The engine computes everything else from these.
export interface Property {
  id: string
  name: string
  area: string
  developer: string
  price: number // AED, developer price list
  sqft: number // RERA registered area
  svcRate: number // AED per sqft per year, service charge
  claimRent: number // AED/yr, the brochure's rental figure
  estRent: number // AED/yr, this tool's modelled rent
  plan: string // human label for the payment plan
  preHandoverPct: number // share of price paid during construction
  atHandoverPct: number // share of price paid at handover
  postHandoverPct: number // share of price paid after handover
  handover: string // advertised handover, e.g. 'Q4 2027'
  monthsToHandover: number // advertised months to handover
  delivered: number // developer's delivered project count
  total: number // developer's total project count
  devAvgLateMo: number // developer's average delivery lateness, months
  devCancelled: number // developer's cancelled project count
}

// One confidence band in the decision panel. Always rendered decomposed: the
// sentence that produced the score is shown next to it (RC-6).
export interface BandScore {
  key: string
  label: string
  score: 0 | 1 | 2 | 3
  sentence: string
  provenance: Provenance
}

export type Verdict = 'Workable' | 'Marginal' | 'Fragile'
