import type { Provenance } from '../engine/types'

// Brochure ↔ Checked. The core mechanic (RC-3): Brochure shows the seller's
// numbers, Checked shows this tool's recomputed numbers.
export type EvidenceMode = 'brochure' | 'checked'

interface ProvenanceMeta {
  label: string
  short: string
  description: string
  // Tailwind background token (defined in tailwind.config.js).
  dot: string
  text: string
}

export const PROVENANCE_META: Record<Provenance, ProvenanceMeta> = {
  registry: {
    label: 'Registry',
    short: 'registry',
    description: 'Verifiable public record — DLD schedule, RERA area, fee table.',
    dot: 'bg-registry',
    text: 'text-registry',
  },
  estimate: {
    label: 'Estimate',
    short: 'estimate',
    description: 'Modelled by this tool from the stated assumptions.',
    dot: 'bg-estimate',
    text: 'text-estimate',
  },
  claim: {
    label: 'Claim',
    short: 'claim',
    description: 'Supplied by the seller or brochure — unverified.',
    dot: 'bg-claim',
    text: 'text-claim',
  },
}

export const PROVENANCE_ORDER: Provenance[] = ['registry', 'estimate', 'claim']
