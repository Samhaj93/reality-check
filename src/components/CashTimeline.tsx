import type { Property, Provenance } from '../engine/types'
import type { CashSegments } from '../engine/calc'
import { cashSegments, delayCost, realisticMonths } from '../engine/calc'
import { aed, cx, months, pct } from '../lib/format'
import { Figure } from './Figure'
import { InfoTip } from './InfoTip'
import { ProvenanceDot } from './ProvenanceDot'

interface SegmentDef {
  key: keyof Omit<CashSegments, 'total'>
  label: string
  color: string
  provenance: Provenance
}

// Fees are a published schedule (registry); every instalment is sized off the
// developer's price list and payment plan (claim).
const SEGMENTS: SegmentDef[] = [
  { key: 'fees', label: 'Fees (DLD + admin)', color: 'bg-slate-400', provenance: 'registry' },
  { key: 'duringConstruction', label: 'During construction', color: 'bg-sky-500', provenance: 'claim' },
  { key: 'atHandover', label: 'At handover', color: 'bg-indigo-500', provenance: 'claim' },
  { key: 'postHandover', label: 'Post-handover', color: 'bg-amber-500', provenance: 'claim' },
]

export function CashTimeline({ properties }: { properties: Property[] }) {
  return (
    <div className="grid gap-4">
      {properties.map((p) => (
        <CashCard key={p.id} property={p} />
      ))}
    </div>
  )
}

function CashCard({ property: p }: { property: Property }) {
  const seg = cashSegments(p)
  // Post-handover segment renders only when postHandoverPct > 0 (RC-4).
  const visible = SEGMENTS.filter((s) => seg[s.key] > 0)

  return (
    <div
      data-testid="cash-card"
      data-id={p.id}
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-semibold text-slate-900">{p.name}</h3>
        <span className="text-sm text-slate-500">
          Total outflow <Figure value={aed(seg.total)} provenance="claim" />
        </span>
      </div>

      {/* Stacked outflow bar — segment widths sum to 100% of total outflow. */}
      <div className="flex h-6 w-full overflow-hidden rounded-md" role="img" aria-label="Outflow breakdown">
        {visible.map((s) => {
          const pctOfTotal = (seg[s.key] / seg.total) * 100
          return (
            <div
              key={s.key}
              data-testid="cash-segment"
              data-key={s.key}
              data-pct={pctOfTotal}
              className={cx(s.color)}
              style={{ width: `${pctOfTotal}%` }}
              title={`${s.label}: ${aed(seg[s.key])}`}
            />
          )
        })}
      </div>

      {/* Segment breakdown */}
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {visible.map((s) => (
          <li key={s.key} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <span className={cx('h-2.5 w-2.5 rounded-sm', s.color)} aria-hidden="true" />
              {s.label}
              <span className="text-slate-400">{pct(seg[s.key] / seg.total, 0)}</span>
            </span>
            <Figure value={aed(seg[s.key])} provenance={s.provenance} />
          </li>
        ))}
      </ul>

      {/* Timeline: advertised vs on-the-track-record, with the delay in AED. */}
      <div className="mt-4 grid gap-2 border-t border-slate-100 pt-3 text-sm sm:grid-cols-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Advertised</div>
          <Figure value={`${months(p.monthsToHandover)} · ${p.handover}`} provenance="claim" />
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
            On track record <ProvenanceDot provenance="registry" />
            <InfoTip term="onTrackRecord" />
          </div>
          <div className="flex items-center gap-2">
            <Figure value={months(realisticMonths(p))} provenance="registry" />
            {p.devAvgLateMo > 0 && (
              <span className="text-xs text-claim">+{months(p.devAvgLateMo)} late</span>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
            Delay cost <InfoTip term="delayCost" />
          </div>
          <Figure value={aed(delayCost(p))} provenance="estimate" />
          <div className="text-xs text-slate-400">rent foregone while late</div>
        </div>
      </div>
    </div>
  )
}
