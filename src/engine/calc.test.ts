import { describe, it, expect } from 'vitest'
import {
  acquisitionCost,
  serviceCharge,
  opex,
  netIncome,
  netYield,
  grossYield,
  pricePerSqft,
  cashBeforeFirstRent,
  breakEvenRent,
  rentCushion,
  delayCost,
  serviceShock,
  cashSegments,
  realisticMonths,
  deliveryRatio,
} from './calc'
import type { Property } from './types'
import { byId, PROPERTIES } from '../data/properties'

const aurea = byId('aurea')
const marasi = byId('marasi')
const ridge = byId('ridge')

// Assert a net yield in percentage points, honouring the spec's ±0.01 tolerance.
const expectPct = (got: number, wantPct: number) =>
  expect(Math.abs(got * 100 - wantPct)).toBeLessThanOrEqual(0.01)

describe('acquisitionCost', () => {
  it('normal: price × (1 + dld) + fixed fees', () => {
    expect(acquisitionCost(aurea)).toBe(1_197_630)
  })
  it('boundary: a zero-price unit still carries the fixed fees', () => {
    const free: Property = { ...aurea, price: 0 }
    expect(acquisitionCost(free)).toBe(1630)
  })
})

describe('serviceCharge', () => {
  it('normal: sqft × rate', () => {
    expect(serviceCharge(aurea)).toBe(745 * 16)
  })
  it('boundary: zero area → zero charge', () => {
    expect(serviceCharge({ ...aurea, sqft: 0 })).toBe(0)
  })
})

describe('opex', () => {
  it('normal: service charge + mgmt + vacancy + maintenance', () => {
    // 11920 + 71000*0.05 + 71000*0.08 + 3000
    expect(opex(aurea, 71_000)).toBeCloseTo(24_150, 6)
  })
  it('boundary: zero rent leaves only fixed running costs', () => {
    expect(opex(aurea, 0)).toBe(serviceCharge(aurea) + 3000)
  })
})

describe('netIncome', () => {
  it('normal: rent minus opex', () => {
    expect(netIncome(aurea, 71_000)).toBeCloseTo(46_850, 6)
  })
  it('boundary: zero rent yields a negative net income', () => {
    expect(netIncome(aurea, 0)).toBeLessThan(0)
  })
})

describe('netYield — the headline number', () => {
  it('aurea @ est rent ≈ 3.91%', () => expectPct(netYield(aurea, 71_000), 3.91))
  it('marasi @ est rent ≈ 4.02%', () => expectPct(netYield(marasi, 108_000), 4.02))
  it('ridge @ est rent ≈ 3.51%', () => expectPct(netYield(ridge, 52_000), 3.51))
  it('boundary: zero-rent property has a negative net yield, no crash (E3)', () => {
    const y = netYield(ridge, 0)
    expect(y).toBeLessThan(0)
    expect(Number.isFinite(y)).toBe(true)
  })
})

describe('grossYield — shown only to be discredited', () => {
  it('normal: rent ÷ price', () => {
    expect(grossYield(aurea, 78_000)).toBeCloseTo(78_000 / 1_150_000, 10)
  })
  it('boundary: zero rent → zero gross', () => {
    expect(grossYield(aurea, 0)).toBe(0)
  })
})

describe('pricePerSqft', () => {
  it('aurea ≈ 1,544', () => {
    expect(pricePerSqft(aurea)).toBeCloseTo(1544, 0)
  })
  it('boundary: larger area lowers price per sqft', () => {
    expect(pricePerSqft({ ...aurea, sqft: 1490 })).toBeCloseTo(
      pricePerSqft(aurea) / 2,
      6,
    )
  })
})

describe('cashBeforeFirstRent', () => {
  it('marasi = 1,496,830 (post-handover tail excluded)', () => {
    expect(cashBeforeFirstRent(marasi)).toBe(1_496_830)
  })
  it('boundary: a 100%-pre plan equals price + dld + fixed', () => {
    const p: Property = { ...aurea, preHandoverPct: 1, atHandoverPct: 0, postHandoverPct: 0 }
    expect(cashBeforeFirstRent(p)).toBe(1_150_000 + 1_150_000 * 0.04 + 1630)
  })
})

describe('breakEvenRent', () => {
  it('ridge @ 3.5% target ≈ 51,923', () => {
    expect(breakEvenRent(ridge, 0.035)).toBeCloseTo(51_923, 0)
  })
  it('boundary: a higher target demands a higher break-even rent', () => {
    expect(breakEvenRent(ridge, 0.05)).toBeGreaterThan(breakEvenRent(ridge, 0.035))
  })
})

describe('rentCushion', () => {
  it("ridge's cushion at 3.5% is razor thin (< 0.02)", () => {
    expect(rentCushion(ridge, 0.035)).toBeLessThan(0.02)
  })
  it('boundary: cushion goes negative once the target rent exceeds the estimate', () => {
    expect(rentCushion(ridge, 0.06)).toBeLessThan(0)
  })
})

describe('delayCost', () => {
  it('ridge ≈ 29,810 AED (11 months late)', () => {
    expect(delayCost(ridge)).toBeCloseTo(29_810, 0)
  })
  it('boundary: an on-time developer has zero delay cost', () => {
    expect(delayCost({ ...ridge, devAvgLateMo: 0 })).toBe(0)
  })
})

describe('serviceShock', () => {
  it('normal: a +30% service-charge shock lowers net yield', () => {
    expect(serviceShock(aurea, 0.3)).toBeLessThan(netYield(aurea, aurea.estRent))
  })
  it('boundary: a zero shock equals the ordinary net yield at est rent', () => {
    expect(serviceShock(aurea, 0)).toBeCloseTo(netYield(aurea, aurea.estRent), 10)
  })
})

describe('cashSegments', () => {
  it('segments sum to the total outflow (RC-4)', () => {
    const s = cashSegments(marasi)
    expect(s.fees + s.duringConstruction + s.atHandover + s.postHandover).toBeCloseTo(
      s.total,
      6,
    )
  })
  it('boundary: postHandoverPct = 0 → no post-handover segment (E4)', () => {
    expect(cashSegments(aurea).postHandover).toBe(0)
  })
})

describe('realisticMonths', () => {
  it('normal: advertised months + average lateness', () => {
    expect(realisticMonths(ridge)).toBe(30 + 11)
  })
  it('boundary: an on-time developer matches the advertised horizon', () => {
    expect(realisticMonths({ ...ridge, devAvgLateMo: 0 })).toBe(30)
  })
})

describe('deliveryRatio', () => {
  it('normal: delivered ÷ total', () => {
    expect(deliveryRatio(ridge)).toBeCloseTo(4 / 7, 6)
  })
  it('boundary: a developer with no projects does not divide by zero', () => {
    expect(deliveryRatio({ ...ridge, delivered: 0, total: 0 })).toBe(0)
  })
})

// ── The product thesis, expressed as tests ──────────────────────────────────

describe('ranking flip', () => {
  const byGrossClaim = [...PROPERTIES].sort(
    (a, b) => grossYield(b, b.claimRent) - grossYield(a, a.claimRent),
  )
  const byNetEst = [...PROPERTIES].sort(
    (a, b) => netYield(b, b.estRent) - netYield(a, a.estRent),
  )

  it('brochure gross ranks ridge above aurea', () => {
    const ids = byGrossClaim.map((p) => p.id)
    expect(ids.indexOf('ridge')).toBeLessThan(ids.indexOf('aurea'))
  })
  it('net yield ranks aurea above ridge', () => {
    const ids = byNetEst.map((p) => p.id)
    expect(ids.indexOf('aurea')).toBeLessThan(ids.indexOf('ridge'))
  })
})

describe('invariant: the checked number is always worse than the brochure number', () => {
  it('netYield(estRent) < grossYield(claimRent) for every property', () => {
    for (const p of PROPERTIES) {
      expect(netYield(p, p.estRent)).toBeLessThan(grossYield(p, p.claimRent))
    }
  })
})

// ── QA matrix E2: target-yield sweep must stay numerically clean ─────────────

describe('E2: target yield swept 2.5% → 6% in 0.1% steps', () => {
  it('no NaN, no Infinity, no negative service charge', () => {
    for (const p of PROPERTIES) {
      expect(serviceCharge(p)).toBeGreaterThanOrEqual(0)
      for (let t = 0.025; t <= 0.06 + 1e-9; t += 0.001) {
        const be = breakEvenRent(p, t)
        const c = rentCushion(p, t)
        expect(Number.isFinite(be)).toBe(true)
        expect(Number.isFinite(c)).toBe(true)
      }
    }
  })
})
