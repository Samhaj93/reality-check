// Plain-English definitions for the terms a first-time buyer won't know.
// Presentation copy, so it lives in lib/ rather than the engine.
//
// Two rules hold here:
//   1. Any definition that cites a rate reads it from ASSUMPTIONS. A fee or
//      percentage is never inlined (CLAUDE.md rule 4), so the copy cannot drift
//      away from the engine that uses it.
//   2. The product's vocabulary is fixed: netYield, grossYield,
//      cashBeforeFirstRent, breakEvenRent, provenance. Never "source type",
//      "confidence", or "verification".
import { ASSUMPTIONS as A } from '../engine/assumptions'
import { aed, pct } from './format'

export type TermId =
  | 'netYield'
  | 'grossYield'
  | 'acquisitionCost'
  | 'cashBeforeFirstRent'
  | 'serviceCharge'
  | 'breakEvenRent'
  | 'rentCushion'
  | 'delayCost'
  | 'onTrackRecord'
  | 'pricePerSqft'
  | 'paymentPlan'
  | 'dldFee'
  | 'oqood'
  | 'deliveryRecord'
  | 'verdict'
  | 'registry'
  | 'estimate'
  | 'claim'

export interface Term {
  /** Short name, used in the trigger's accessible label. */
  label: string
  definition: string
}

export const GLOSSARY: Record<TermId, Term> = {
  netYield: {
    label: 'net yield',
    definition: `What you actually earn after costs, as a share of what the unit actually costs you to acquire. Rent minus service charge, letting management, a vacancy provision and maintenance — divided by the full acquisition cost, not the headline price. This is the number to decide on.`,
  },
  grossYield: {
    label: 'gross yield',
    definition: `Rent divided by the asking price. It ignores every cost of owning and letting the unit, which is why it always looks better. It is shown here only so you can see how far it sits from the net yield.`,
  },
  acquisitionCost: {
    label: 'acquisition cost',
    definition: `The full cost of owning the unit outright: the price, plus the ${pct(A.dldFeePct, 0)} DLD transfer fee, plus ${aed(A.fixedFeesAed)} in registration and trustee fees. Yields here are calculated on this, not on the price alone.`,
  },
  cashBeforeFirstRent: {
    label: 'cash before first rent',
    definition: `Every dirham you must hand over before a tenant pays you anything — the instalments due up to and including handover, plus fees at booking. Post-handover instalments are excluded, because by then rent can be coming in. No brochure prints this number, and it is the one that decides whether a deal is possible for you.`,
  },
  serviceCharge: {
    label: 'service charge',
    definition: `The annual building charge, billed per square foot of registered area. It is the quiet killer of net yield: it is owed whether or not the unit is let.`,
  },
  breakEvenRent: {
    label: 'break-even rent',
    definition: `The rent this unit would have to achieve to hit the target net yield you set. Below it, the deal stops working on your own terms.`,
  },
  rentCushion: {
    label: 'rent cushion',
    definition: `How far the rent could come in below our estimate before the deal stops hitting your target — your margin of safety. A negative cushion means the rent already has to beat our estimate for the deal to work.`,
  },
  delayCost: {
    label: 'delay cost',
    definition: `The rent you forgo while the developer runs late, based on their average lateness rather than their advertised date. Late handover is not just an inconvenience; it is income you never collect.`,
  },
  onTrackRecord: {
    label: 'on track record',
    definition: `The advertised handover date plus this developer's average lateness across their delivered projects. It is what their history suggests, not what their brochure promises.`,
  },
  pricePerSqft: {
    label: 'price per sqft',
    definition: `Price divided by the RERA registered area. Useful for comparing units of different sizes — but a low price per sqft does not make a unit a better deal, as the comparison here shows.`,
  },
  paymentPlan: {
    label: 'payment plan',
    definition: `How the price is split across construction, handover and the period after handover. The split matters as much as the price: it determines how much cash you are committing before any rent arrives.`,
  },
  dldFee: {
    label: 'DLD transfer fee',
    definition: `The Dubai Land Department transfer fee, ${pct(A.dldFeePct, 0)} of the price, payable at booking. It is part of what the unit costs you and is included in the acquisition cost here.`,
  },
  oqood: {
    label: 'oqood registration',
    definition: `Registration of an off-plan sale with the Dubai Land Department, plus trustee admin — ${aed(A.fixedFeesAed)} in total here.`,
  },
  deliveryRecord: {
    label: 'delivery record',
    definition: `How many of this developer's projects have actually been delivered, how late they ran on average, and how many were cancelled. Off-plan means paying for something that does not exist yet, so who you are buying from is part of the deal.`,
  },
  verdict: {
    label: 'verdict',
    definition: `A plain label summarising the four bands — Workable, Marginal or Fragile. It describes how much of the deal is verified and how much rests on the seller's word. It is not a recommendation to buy, and the underlying total is deliberately never shown as a score.`,
  },
  registry: {
    label: 'registry',
    definition: `A verifiable public record — the DLD fee schedule, RERA registered area, a published fee table. The strongest provenance a figure here can carry.`,
  },
  estimate: {
    label: 'estimate',
    definition: `A figure this tool modelled from the assumptions listed in the footer. Interrogable, but not a record.`,
  },
  claim: {
    label: 'claim',
    definition: `Supplied by the seller or the brochure and not verified by anyone. Every claim figure has a matching question for the agent on the Decide page.`,
  },
}

export const TERM_IDS = Object.keys(GLOSSARY) as TermId[]
