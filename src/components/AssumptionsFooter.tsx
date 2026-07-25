import type { Provenance } from '../engine/types'
import { ASSUMPTIONS } from '../engine/assumptions'
import { aed, pct } from '../lib/format'
import { ProvenanceDot, ProvenanceLegend } from './ProvenanceDot'

interface AssumptionRow {
  label: string
  value: string
  provenance: Provenance
}

// Every constant the engine uses, surfaced so no rate is hidden (CLAUDE.md
// rule 4 made visible). Rendered on every tab (QA P4).
const ROWS: AssumptionRow[] = [
  { label: 'DLD transfer fee', value: pct(ASSUMPTIONS.dldFeePct, 0), provenance: 'registry' },
  { label: 'Registration + trustee', value: aed(ASSUMPTIONS.fixedFeesAed), provenance: 'registry' },
  { label: 'Letting management', value: pct(ASSUMPTIONS.mgmtFeePct, 0), provenance: 'estimate' },
  { label: 'Vacancy provision', value: pct(ASSUMPTIONS.vacancyPct, 0), provenance: 'estimate' },
  { label: 'Maintenance + insurance', value: `${aed(ASSUMPTIONS.maintAed)}/yr`, provenance: 'estimate' },
  { label: 'Agent commission', value: pct(ASSUMPTIONS.agentCommPct, 0), provenance: 'estimate' },
]

export function AssumptionsFooter() {
  return (
    <footer className="mt-8 border-t border-slate-200 pt-5 text-slate-600">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-800">Assumptions</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {ROWS.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-2">
                <dt className="text-slate-500">{r.label}</dt>
                <dd className="flex items-center gap-1.5 font-medium text-slate-800">
                  {r.value}
                  <ProvenanceDot provenance={r.provenance} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-800">What the dots mean</h2>
          <ProvenanceLegend />
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-slate-500">
        <span className="font-semibold text-slate-700">Prototype — mock data.</span>{' '}
        Reality Check recomputes 2–3 shortlisted off-plan Dubai units on one engine
        and labels where every number comes from. It is not a listings site, a CRM,
        or a forecaster: it does not predict resale prices or future value, and
        nothing here is investment advice.
      </p>
    </footer>
  )
}
