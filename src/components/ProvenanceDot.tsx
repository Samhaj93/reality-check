import type { Provenance } from '../engine/types'
import { PROVENANCE_META, PROVENANCE_ORDER } from '../lib/provenance'
import { cx } from '../lib/format'

// The spine of the product made visible: a coloured dot declaring where a
// figure came from. Rendered beside every number that reaches the UI.
export function ProvenanceDot({ provenance }: { provenance: Provenance }) {
  const meta = PROVENANCE_META[provenance]
  return (
    <span
      data-testid="provenance-dot"
      data-provenance={provenance}
      title={`${meta.label}: ${meta.description}`}
      aria-label={`Provenance: ${meta.label}`}
      role="img"
      className={cx(
        'inline-block h-2 w-2 shrink-0 rounded-full ring-1 ring-black/10',
        meta.dot,
      )}
    />
  )
}

// Fixed to the table footer (RC-2) and reused wherever dots appear.
export function ProvenanceLegend({ className }: { className?: string }) {
  return (
    <ul className={cx('flex flex-wrap gap-x-5 gap-y-1.5', className)}>
      {PROVENANCE_ORDER.map((p) => {
        const meta = PROVENANCE_META[p]
        return (
          <li key={p} className="flex items-center gap-2 text-xs text-slate-600">
            <ProvenanceDot provenance={p} />
            <span>
              <span className="font-semibold text-slate-800">{meta.label}</span>
              {' — '}
              {meta.description}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
