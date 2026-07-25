import { describe, it, expect } from 'vitest'
import { scoreBands, bandTotal, verdict } from './bands'
import { agentQuestions } from './questions'
import { byId, PROPERTIES } from '../data/properties'

const TARGET = 0.035 // the app's default target net yield

describe('scoreBands (RC-6)', () => {
  it('every band is scored 0–3 and carries its rationale sentence', () => {
    for (const p of PROPERTIES) {
      for (const b of scoreBands(p, TARGET)) {
        expect(b.score).toBeGreaterThanOrEqual(0)
        expect(b.score).toBeLessThanOrEqual(3)
        expect(b.sentence.length).toBeGreaterThan(0)
      }
    }
  })

  it('maps the three units to the intended verdicts at the default target', () => {
    expect(verdict(byId('marasi'), TARGET)).toBe('Workable') // total 11
    expect(verdict(byId('aurea'), TARGET)).toBe('Marginal') // total 7
    expect(verdict(byId('ridge'), TARGET)).toBe('Fragile') // total 4
  })

  // Marasi runs exactly 1 month late — the singular boundary.
  it('pluralises the developer delay correctly', () => {
    const sentence = (id: string) =>
      scoreBands(byId(id), TARGET).find((b) => b.key === 'developer')!.sentence
    expect(sentence('marasi')).toContain('averages 1 month late')
    expect(sentence('aurea')).toContain('averages 4 months late')
  })
})

// RC-6 / E5: ranking must be stable and monotonic across the whole target range.
describe('ranking is stable and monotonic across 2.5%–6%', () => {
  const order = (t: number) =>
    [...PROPERTIES].sort((a, b) => bandTotal(b, t) - bandTotal(a, t)).map((p) => p.id)

  it('the ranking order never oscillates', () => {
    const base = order(0.025)
    for (let t = 0.025; t <= 0.06 + 1e-9; t += 0.0005) {
      expect(order(t)).toEqual(base)
    }
    expect(base).toEqual(['marasi', 'aurea', 'ridge'])
  })

  it("each property's band total is monotonic non-increasing as the target rises", () => {
    for (const p of PROPERTIES) {
      let prev = Infinity
      for (let t = 0.025; t <= 0.06 + 1e-9; t += 0.0005) {
        const total = bandTotal(p, t)
        expect(total).toBeLessThanOrEqual(prev)
        prev = total
      }
    }
  })
})

describe('agentQuestions (RC-6 / C2)', () => {
  it('includes the rent-gap question for every property', () => {
    for (const p of PROPERTIES) {
      expect(agentQuestions(p).some((q) => q.id === 'rent-gap')).toBe(true)
    }
  })

  it('includes the cancelled-project question only where devCancelled > 0', () => {
    for (const p of PROPERTIES) {
      const hasCancelledQ = agentQuestions(p).some((q) => q.id === 'cancelled-project')
      expect(hasCancelledQ).toBe(p.devCancelled > 0)
    }
  })

  it('pluralises the delay in the handover question', () => {
    const handover = (id: string) =>
      agentQuestions(byId(id)).find((q) => q.id === 'handover')!.question
    expect(handover('marasi')).toContain('about 1 month late')
    expect(handover('aurea')).toContain('about 4 months late')
  })

  it('covers every claim-tagged figure with a matching question (C2)', () => {
    const claimFields = ['price', 'claimRent', 'handover', 'plan'] as const
    for (const p of PROPERTIES) {
      const fields = new Set(agentQuestions(p).map((q) => q.field))
      for (const f of claimFields) expect(fields.has(f)).toBe(true)
    }
  })
})
