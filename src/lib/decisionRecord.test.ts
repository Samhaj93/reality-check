import { describe, it, expect } from 'vitest'
import { buildDecision } from '../engine/decision'
import type { Position } from '../engine/decision'
import { buildDecisionRecord } from './decisionRecord'
import { PROPERTIES } from '../data/properties'

const TARGET = 0.035
const AT = new Date('2026-07-25T12:00:00.000Z')

const recordFor = (position: Position, driverId = 'marasi:netYield', target = TARGET) => {
  const decision = buildDecision(
    PROPERTIES,
    target,
    { position, driverId, changeMind: 'A signed tenancy contract below AED 100k.' },
    AT,
  )
  if (!decision) throw new Error('expected a complete decision')
  return buildDecisionRecord(decision)
}

describe('buildDecisionRecord', () => {
  it('states the position, the cited figure and its provenance', () => {
    const text = recordFor('proceed')
    expect(text).toContain('Position: Proceed')
    expect(text).toContain('Marasi Point — net yield')
    expect(text).toContain('[estimate]')
  })

  it('carries the assumptions and the not-advice disclaimer', () => {
    const text = recordFor('proceed')
    expect(text).toContain('Assumptions in force')
    expect(text).toContain('DLD transfer fee 4%')
    expect(text).toContain('Nothing here is')
    expect(text).toContain('investment advice')
  })

  it('makes no forecast', () => {
    const text = recordFor('proceed')
    expect(text).not.toMatch(/appreciation|capital growth|guaranteed/i)
  })

  it('ranks the shortlist as checked', () => {
    const text = recordFor('proceed')
    expect(text).toContain('1. Marasi Point')
    expect(text).toContain('3. The Ridge')
  })

  it('includes the agent questions only when the position is Hold', () => {
    expect(recordFor('hold')).toContain('Questions to put to the agent')
    expect(recordFor('proceed')).not.toContain('Questions to put to the agent')
    expect(recordFor('walk')).not.toContain('Questions to put to the agent')
  })

  // Boundary: the note appears only for a proceed on a unit under the target.
  it('notes when the cited unit sits below the user’s own target', () => {
    expect(recordFor('proceed', 'ridge:netYield', 0.05)).toContain('below the 5.0% target')
    expect(recordFor('hold', 'ridge:netYield', 0.05)).not.toContain('below the 5.0% target')
  })

  it('formats money drivers as AED and rate drivers as a percentage', () => {
    expect(recordFor('proceed', 'marasi:cashBeforeFirstRent')).toContain('AED 1,496,830')
    expect(recordFor('proceed', 'marasi:netYield')).toMatch(/net yield: \d+\.\d%/)
  })
})
