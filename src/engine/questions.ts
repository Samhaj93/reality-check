// Agent-question generator (RC-6). Turns every unverified figure into a
// specific question the investor can put to the agent. Pure engine.
import type { Property } from './types'

export interface AgentQuestion {
  id: string
  // The claim-tagged figure this question interrogates. Every claim figure in
  // the compare table must have a matching question here (QA C2).
  field: 'price' | 'claimRent' | 'handover' | 'plan' | 'devCancelled'
  question: string
}

const aed = (n: number) => `AED ${Math.round(n).toLocaleString('en-US')}`
const pctAbs = (frac: number) => `${Math.abs(frac * 100).toFixed(0)}%`
const months = (n: number) => `${n} month${n === 1 ? '' : 's'}`

export function agentQuestions(p: Property): AgentQuestion[] {
  const rentGap = (p.claimRent - p.estRent) / p.claimRent

  const questions: AgentQuestion[] = [
    {
      id: 'price',
      field: 'price',
      question: `Is ${aed(p.price)} the all-in price? Ask exactly what is excluded — DLD, oqood, admin, furniture, or a service-charge prepayment.`,
    },
    {
      // Rent-gap question — generated for every property (RC-6).
      id: 'rent-gap',
      field: 'claimRent',
      question: `The brochure rent (${aed(p.claimRent)}) sits ${pctAbs(rentGap)} above our estimate (${aed(p.estRent)}). Ask for signed tenancy contracts for comparable units in this building from the last 6 months.`,
    },
    {
      id: 'handover',
      field: 'handover',
      question:
        p.devAvgLateMo > 0
          ? `Handover is advertised as ${p.handover}, but this developer runs about ${months(p.devAvgLateMo)} late on average. Ask for the contractual completion date and the penalty for delay.`
          : `Handover is advertised as ${p.handover}. Ask for the contractual completion date and the penalty for delay.`,
    },
    {
      id: 'plan',
      field: 'plan',
      question: `Get the full "${p.plan}" schedule in writing — exact instalment amounts and the trigger date for each.`,
    },
  ]

  // Cancelled-project question — only where the developer has cancelled before.
  if (p.devCancelled > 0) {
    questions.push({
      id: 'cancelled-project',
      field: 'devCancelled',
      question: `${p.developer} has ${p.devCancelled} cancelled project${p.devCancelled > 1 ? 's' : ''}. Ask which, why it was cancelled, and what happened to buyers' funds held in escrow.`,
    })
  }

  return questions
}
