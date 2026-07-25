import { describe, it, expect } from 'vitest'
import {
  buildDecision,
  decisionDrivers,
  findDriver,
  isComplete,
  meetsTarget,
  noneWorkable,
  rankedShortlist,
} from './decision'
import { netYield } from './calc'
import { byId, PROPERTIES } from '../data/properties'

const TARGET = 0.035 // the app's default target net yield
const AT = new Date('2026-07-25T12:00:00.000Z')

const complete = {
  position: 'proceed' as const,
  driverId: 'marasi:netYield',
  changeMind: 'A signed tenancy contract below AED 100k.',
}

describe('decisionDrivers', () => {
  it('offers four figures per property, each carrying its provenance', () => {
    const drivers = decisionDrivers(PROPERTIES, TARGET)
    expect(drivers).toHaveLength(PROPERTIES.length * 4)
    for (const d of drivers) {
      expect(['registry', 'estimate', 'claim']).toContain(d.provenance)
    }
  })

  it('tags the price-derived figures as claim and our own as estimate', () => {
    const drivers = decisionDrivers(PROPERTIES, TARGET)
    expect(findDriver(drivers, 'marasi:netYield')?.provenance).toBe('estimate')
    expect(findDriver(drivers, 'marasi:acquisitionCost')?.provenance).toBe('claim')
  })

  it('gives every driver a unique id', () => {
    const ids = decisionDrivers(PROPERTIES, TARGET).map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('isComplete', () => {
  it('accepts a fully answered form', () => {
    expect(isComplete(complete)).toBe(true)
  })

  // Boundary: whitespace is not an answer.
  it('rejects a whitespace-only change-my-mind', () => {
    expect(isComplete({ ...complete, changeMind: '   ' })).toBe(false)
  })

  it('rejects a missing position or driver', () => {
    expect(isComplete({ ...complete, position: null })).toBe(false)
    expect(isComplete({ ...complete, driverId: '' })).toBe(false)
  })
})

describe('rankedShortlist', () => {
  it('ranks on checked figures, best first', () => {
    const ranked = rankedShortlist(PROPERTIES, TARGET).map((p) => p.id)
    expect(ranked).toEqual(['marasi', 'aurea', 'ridge'])
  })

  it('does not mutate the input array', () => {
    const before = PROPERTIES.map((p) => p.id)
    rankedShortlist(PROPERTIES, TARGET)
    expect(PROPERTIES.map((p) => p.id)).toEqual(before)
  })
})

describe('meetsTarget', () => {
  it('is false when the unit sits under the target', () => {
    expect(meetsTarget(byId('ridge'), 0.05)).toBe(false)
  })

  // Boundary: the target is a bar to clear, so exactly meeting it passes.
  it('is true when the yield exactly equals the target', () => {
    const p = byId('aurea')
    expect(meetsTarget(p, netYield(p, p.estRent))).toBe(true)
  })
})

describe('noneWorkable', () => {
  it('is false at the default target, where one unit is Workable', () => {
    expect(noneWorkable(PROPERTIES, TARGET)).toBe(false)
  })

  it('is true once the target rises past what any unit can reach', () => {
    expect(noneWorkable(PROPERTIES, 0.06)).toBe(true)
  })
})

describe('buildDecision', () => {
  it('returns null until the form is complete', () => {
    expect(buildDecision(PROPERTIES, TARGET, { ...complete, changeMind: '' }, AT)).toBeNull()
  })

  it('returns null for a driver that is not on the shortlist', () => {
    expect(buildDecision(PROPERTIES, TARGET, { ...complete, driverId: 'nope:netYield' }, AT)).toBeNull()
  })

  it('records the position, the cited figure and the ranked shortlist', () => {
    const record = buildDecision(PROPERTIES, TARGET, complete, AT)
    expect(record?.position).toBe('proceed')
    expect(record?.driver.propertyName).toBe('Marasi Point')
    expect(record?.ranked.map((r) => r.property.id)).toEqual(['marasi', 'aurea', 'ridge'])
    expect(record?.takenAt).toBe(AT)
  })

  it('trims the change-my-mind text', () => {
    const record = buildDecision(PROPERTIES, TARGET, { ...complete, changeMind: '  later  ' }, AT)
    expect(record?.changeMind).toBe('later')
  })

  // The point of the flag: proceeding on a unit under your own stated bar.
  it('flags proceeding on a unit below the user’s own target', () => {
    const form = { ...complete, driverId: 'ridge:netYield' }
    expect(buildDecision(PROPERTIES, 0.05, form, AT)?.belowOwnTarget).toBe(true)
  })

  it('does not flag below-target when the position is not proceed', () => {
    const form = { ...complete, position: 'hold' as const, driverId: 'ridge:netYield' }
    expect(buildDecision(PROPERTIES, 0.05, form, AT)?.belowOwnTarget).toBe(false)
  })
})
