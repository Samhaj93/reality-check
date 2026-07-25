import type { Provenance } from '../engine/types'
import { ProvenanceDot } from './ProvenanceDot'
import { cx } from '../lib/format'

interface FigureProps {
  value: string
  provenance: Provenance
  struck?: boolean // gross yield in Checked mode
  emphasis?: boolean // the headline net yield
}

// Every rendered figure goes through here, so a number can never reach the UI
// without a provenance dot (CLAUDE.md rule 1). Tests rely on this invariant.
export function Figure({ value, provenance, struck, emphasis }: FigureProps) {
  return (
    <span
      data-testid="figure"
      className="inline-flex items-center gap-1.5 whitespace-nowrap"
    >
      <span
        className={cx(
          struck && 'text-slate-400 line-through',
          emphasis && 'font-bold text-slate-900',
          !struck && !emphasis && 'text-slate-800',
        )}
      >
        {value}
      </span>
      <ProvenanceDot provenance={provenance} />
    </span>
  )
}
