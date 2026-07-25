import { describe, it, expect } from 'vitest'
import { GLOSSARY, TERM_IDS } from './glossary'
import { ASSUMPTIONS as A } from '../engine/assumptions'
import { aed, pct } from './format'

describe('glossary', () => {
  it('gives every term a label and a definition', () => {
    expect(TERM_IDS.length).toBeGreaterThan(0)
    for (const id of TERM_IDS) {
      expect(GLOSSARY[id].label.trim().length).toBeGreaterThan(0)
      expect(GLOSSARY[id].definition.trim().length).toBeGreaterThan(20)
    }
  })

  // Same rule the bundle grep enforces: nothing here may imply a forecast.
  it('makes no forward-looking claim', () => {
    for (const id of TERM_IDS) {
      expect(GLOSSARY[id].definition).not.toMatch(
        /appreciation|capital growth|guaranteed|will rise|ROI projection/i,
      )
    }
  })

  // CLAUDE.md fixes the vocabulary; these are the banned synonyms for provenance.
  it('does not rename provenance', () => {
    for (const id of TERM_IDS) {
      expect(GLOSSARY[id].definition).not.toMatch(/source type|verification/i)
    }
  })

  // Rule 4: rates live in ASSUMPTIONS. If someone edits the rate, these fail
  // rather than letting the copy quietly disagree with the engine.
  it('quotes rates from ASSUMPTIONS rather than inlining them', () => {
    expect(GLOSSARY.dldFee.definition).toContain(pct(A.dldFeePct, 0))
    expect(GLOSSARY.oqood.definition).toContain(aed(A.fixedFeesAed))
    expect(GLOSSARY.acquisitionCost.definition).toContain(pct(A.dldFeePct, 0))
    expect(GLOSSARY.acquisitionCost.definition).toContain(aed(A.fixedFeesAed))
  })

  it('describes the three provenance values', () => {
    expect(GLOSSARY.registry.definition).toMatch(/record/i)
    expect(GLOSSARY.estimate.definition).toMatch(/modelled/i)
    expect(GLOSSARY.claim.definition).toMatch(/seller|brochure/i)
  })
})
