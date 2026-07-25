import type { Property } from '../engine/types'
import { rentCushion } from '../engine/calc'
import { aed, cx, pctAbs } from '../lib/format'
import { ProvenanceDot } from './ProvenanceDot'

// Three net-yield targets, from cautious to ambitious. Each asks the same
// question at a stricter bar, so a single unit typically passes the easy ones
// and fails the hard ones — the sign flip the copy has to survive.
const SCENARIOS = [
  { target: 0.03, label: 'a 3% net yield' },
  { target: 0.045, label: 'a 4.5% net yield' },
  { target: 0.06, label: 'a 6% net yield' },
] as const

export interface StressLine {
  target: number
  label: string
  cushion: number
  pass: boolean
  sentence: string
}

// The grammar inverts on the sign of the cushion. This is the likeliest copy
// bug in the build, so the logic lives in one testable function.
export function stressLine(
  p: Property,
  target: number,
  label: string,
): StressLine {
  const cushion = rentCushion(p, target)
  const pass = cushion >= 0
  const sentence = pass
    ? `Rent can come in ${pctAbs(cushion)} below our estimate (${aed(p.estRent)}) before this unit slips under ${label}.`
    : `Rent has to come in ${pctAbs(cushion)} above our estimate (${aed(p.estRent)}) just to reach ${label}.`
  return { target, label, cushion, pass, sentence }
}

export function StressPanel({ properties }: { properties: Property[] }) {
  return (
    <div className="grid gap-4">
      {properties.map((p) => (
        <div key={p.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-slate-900">{p.name}</h3>
          <ul className="grid gap-2">
            {SCENARIOS.map((s) => {
              const line = stressLine(p, s.target, s.label)
              return (
                <li
                  key={s.target}
                  data-testid="stress-line"
                  data-target={s.target}
                  data-pass={line.pass}
                  className={cx(
                    'flex items-start gap-2 border-l-4 py-1.5 pl-3 text-sm',
                    line.pass ? 'border-teal-600' : 'border-rose-600',
                  )}
                >
                  <span className="mt-1.5 shrink-0">
                    <ProvenanceDot provenance="estimate" />
                  </span>
                  <span className="text-slate-700">{line.sentence}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
