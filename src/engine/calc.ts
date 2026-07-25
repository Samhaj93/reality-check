// Pure financial engine. Imports nothing outside the engine folder; no React,
// no formatting, no side effects (CLAUDE.md rule 3). The UI never does
// arithmetic — it calls these.
import { ASSUMPTIONS as A } from './assumptions'
import type { Property } from './types'

// Total cash to own the asset outright: price + DLD transfer fee + fixed fees.
export const acquisitionCost = (p: Property): number =>
  p.price * (1 + A.dldFeePct + A.agentCommPct) + A.fixedFeesAed

// Annual service charge, from RERA area × the building's AED/sqft rate.
export const serviceCharge = (p: Property): number => p.sqft * p.svcRate

// Annual running cost at a given rent: service charge + management + vacancy
// provision + maintenance.
export const opex = (p: Property, rent: number): number =>
  serviceCharge(p) + rent * A.mgmtFeePct + rent * A.vacancyPct + A.maintAed

// Rent left after running costs.
export const netIncome = (p: Property, rent: number): number => rent - opex(p, rent)

// The headline number: net income as a fraction of total acquisition cost.
export const netYield = (p: Property, rent: number): number =>
  netIncome(p, rent) / acquisitionCost(p)

// Rent ÷ price. Displayed only to be visibly discredited — it ignores every
// cost of actually owning and letting the unit.
export const grossYield = (p: Property, rent: number): number => rent / p.price

export const pricePerSqft = (p: Property): number => p.price / p.sqft

// All outflow up to and including handover: the plan instalments due by
// handover plus the DLD fee and fixed fees paid at booking. (Post-handover
// instalments are excluded — they fall after the keys are handed over.)
export const cashBeforeFirstRent = (p: Property): number =>
  p.price * (p.preHandoverPct + p.atHandoverPct) + p.price * A.dldFeePct + A.fixedFeesAed

// The rent required to hit a target net yield, given fixed costs.
export const breakEvenRent = (p: Property, target: number): number =>
  (target * acquisitionCost(p) + serviceCharge(p) + A.maintAed) /
  (1 - A.mgmtFeePct - A.vacancyPct)

// How far our estimated rent sits above (positive) or below (negative) the
// break-even rent, as a fraction of the estimate. This is the margin of safety.
export const rentCushion = (p: Property, target: number): number =>
  (p.estRent - breakEvenRent(p, target)) / p.estRent

// The income foregone while the developer runs late, in AED.
export const delayCost = (p: Property): number =>
  p.devAvgLateMo * (netIncome(p, p.estRent) / 12)

// Net yield if the service charge is shocked up by fraction b (e.g. 0.3 = +30%).
export const serviceShock = (p: Property, b: number): number =>
  (p.estRent -
    (serviceCharge(p) * (1 + b) +
      p.estRent * (A.mgmtFeePct + A.vacancyPct) +
      A.maintAed)) /
  acquisitionCost(p)

// Cash-outflow breakdown for the timeline (RC-4). Segments sum to the total
// outflow, which for a fully-scheduled plan equals acquisitionCost.
export interface CashSegments {
  fees: number // DLD + fixed fees, at booking
  duringConstruction: number // pre-handover instalments
  atHandover: number // handover instalment
  postHandover: number // post-handover instalments
  total: number
}

export const cashSegments = (p: Property): CashSegments => {
  const fees = p.price * A.dldFeePct + A.fixedFeesAed
  const duringConstruction = p.price * p.preHandoverPct
  const atHandover = p.price * p.atHandoverPct
  const postHandover = p.price * p.postHandoverPct
  return {
    fees,
    duringConstruction,
    atHandover,
    postHandover,
    total: fees + duringConstruction + atHandover + postHandover,
  }
}

// Realistic handover horizon: advertised months plus the developer's average
// lateness. Tagged registry in the UI because it is built from the track record.
export const realisticMonths = (p: Property): number =>
  p.monthsToHandover + p.devAvgLateMo

// Delivery track record as a simple ratio (v1 limitation: ignores project size
// and recency — see doc 04).
export const deliveryRatio = (p: Property): number =>
  p.total === 0 ? 0 : p.delivered / p.total
