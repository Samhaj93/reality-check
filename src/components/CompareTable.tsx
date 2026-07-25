import type { ReactNode } from 'react'
import type { Property } from '../engine/types'
import type { EvidenceMode } from '../lib/provenance'
import {
  acquisitionCost,
  cashBeforeFirstRent,
  grossYield,
  netIncome,
  netYield,
  pricePerSqft,
  serviceCharge,
} from '../engine/calc'
import { aed, months, pct } from '../lib/format'
import { Figure } from './Figure'
import { ProvenanceLegend } from './ProvenanceDot'

interface RowDef {
  label: string
  cell: (p: Property, mode: EvidenceMode) => ReactNode
}
interface GroupDef {
  title: string
  rows: RowDef[]
}

// The rent that drives the "earn" rows depends on which evidence we trust.
const activeRent = (p: Property, mode: EvidenceMode): number =>
  mode === 'brochure' ? p.claimRent : p.estRent

const GROUPS: GroupDef[] = [
  {
    title: 'The deal on paper',
    rows: [
      { label: 'Price', cell: (p) => <Figure value={aed(p.price)} provenance="claim" /> },
      {
        label: 'Price per sqft',
        cell: (p) => <Figure value={aed(pricePerSqft(p))} provenance="claim" />,
      },
      { label: 'Payment plan', cell: (p) => <Figure value={p.plan} provenance="claim" /> },
      {
        label: 'Handover (advertised)',
        cell: (p) => <Figure value={p.handover} provenance="claim" />,
      },
    ],
  },
  {
    title: 'What you actually pay',
    rows: [
      {
        label: 'Acquisition cost',
        cell: (p) => <Figure value={aed(acquisitionCost(p))} provenance="claim" />,
      },
      {
        label: 'Cash before first rent',
        cell: (p) => <Figure value={aed(cashBeforeFirstRent(p))} provenance="claim" />,
      },
      {
        label: 'Service charge / yr',
        cell: (p) => <Figure value={aed(serviceCharge(p))} provenance="estimate" />,
      },
    ],
  },
  {
    title: 'What you actually earn',
    rows: [
      {
        label: 'Annual rent',
        cell: (p, mode) =>
          mode === 'brochure' ? (
            <Figure value={aed(p.claimRent)} provenance="claim" />
          ) : (
            <Figure value={aed(p.estRent)} provenance="estimate" />
          ),
      },
      {
        label: 'Gross yield',
        cell: (p, mode) =>
          mode === 'brochure' ? (
            <Figure value={pct(grossYield(p, p.claimRent))} provenance="claim" />
          ) : (
            <span className="inline-flex flex-col">
              <Figure value={pct(grossYield(p, p.estRent))} provenance="estimate" struck />
              <span className="text-[11px] italic text-slate-400">
                Not the number to decide on
              </span>
            </span>
          ),
      },
      {
        label: 'Net income / yr',
        cell: (p, mode) => (
          <Figure
            value={aed(netIncome(p, activeRent(p, mode)))}
            provenance={mode === 'brochure' ? 'claim' : 'estimate'}
          />
        ),
      },
      {
        label: 'Net yield',
        cell: (p, mode) => (
          <Figure
            value={pct(netYield(p, activeRent(p, mode)))}
            provenance={mode === 'brochure' ? 'claim' : 'estimate'}
            emphasis
          />
        ),
      },
    ],
  },
  {
    title: 'Who you are buying from',
    rows: [
      {
        label: 'Developer',
        cell: (p) => <span className="text-slate-700">{p.developer}</span>,
      },
      {
        label: 'Delivered / total',
        cell: (p) => <Figure value={`${p.delivered} / ${p.total}`} provenance="registry" />,
      },
      {
        label: 'Avg. delay',
        cell: (p) => <Figure value={months(p.devAvgLateMo)} provenance="registry" />,
      },
      {
        label: 'Cancelled projects',
        cell: (p) => <Figure value={String(p.devCancelled)} provenance="registry" />,
      },
    ],
  },
]

const LABEL_CELL = 'sticky left-0 z-10 bg-white'

export function CompareTable({
  properties,
  mode,
}: {
  properties: Property[]
  mode: EvidenceMode
}) {
  const colCount = properties.length + 1
  return (
    // The table owns its own horizontal scroll so the page never overflows (P1).
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Comparison of shortlisted off-plan properties, {mode} figures.
        </caption>
        <thead>
          <tr className="border-b border-slate-200">
            <th className={`${LABEL_CELL} min-w-[9.5rem] px-3 py-3 text-left`} scope="col">
              <span className="sr-only">Metric</span>
            </th>
            {properties.map((p) => (
              <th
                key={p.id}
                scope="col"
                className="min-w-[9.5rem] px-3 py-3 text-left align-bottom"
              >
                <span className="block font-semibold text-slate-900">{p.name}</span>
                <span className="block text-xs font-normal text-slate-500">{p.area}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((group) => (
            <GroupRows key={group.title} group={group} properties={properties} mode={mode} colCount={colCount} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={colCount} className="border-t border-slate-200 bg-slate-50 px-3 py-3">
              <ProvenanceLegend />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function GroupRows({
  group,
  properties,
  mode,
  colCount,
}: {
  group: GroupDef
  properties: Property[]
  mode: EvidenceMode
  colCount: number
}) {
  return (
    <>
      <tr>
        <th
          colSpan={colCount}
          scope="colgroup"
          className={`${LABEL_CELL} bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500`}
        >
          {group.title}
        </th>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label} className="border-t border-slate-100">
          <th
            scope="row"
            className={`${LABEL_CELL} px-3 py-2.5 text-left font-normal text-slate-500`}
          >
            {row.label}
          </th>
          {properties.map((p) => (
            <td key={p.id} className="px-3 py-2.5">
              {row.cell(p, mode)}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
