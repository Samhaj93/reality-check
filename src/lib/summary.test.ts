import { describe, it, expect } from 'vitest'
import { buildSummary } from './summary'
import { PROPERTIES } from '../data/properties'

describe('buildSummary (RC-7 / I5)', () => {
  const s = buildSummary(PROPERTIES, 0.035)

  it('lists each property with net yield and a verdict', () => {
    for (const p of PROPERTIES) expect(s).toContain(p.name)
    expect(s).toContain('Net yield')
    expect(s).toContain('Verdict:')
  })

  it('contains no forward-looking or guarantee language (C1)', () => {
    const lower = s.toLowerCase()
    expect(lower).not.toContain('appreciation')
    expect(lower).not.toContain('guaranteed')
    expect(lower).not.toContain('roi projection')
  })
})
