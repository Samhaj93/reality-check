import type { Property } from '../engine/types'
import { cx } from '../lib/format'

const MIN_SELECTED = 2

interface ShortlistBarProps {
  properties: Property[]
  selected: string[]
  onToggle: (id: string) => void
}

// Enforces a minimum of two selected properties by disabling the control
// (RC-2) — it never errors when you try to go below two.
export function ShortlistBar({ properties, selected, onToggle }: ShortlistBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Shortlist">
      <span className="mr-1 text-sm font-medium text-slate-500">Shortlist</span>
      {properties.map((p) => {
        const isSelected = selected.includes(p.id)
        const lockedOn = isSelected && selected.length <= MIN_SELECTED
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={isSelected}
            disabled={lockedOn}
            onClick={() => onToggle(p.id)}
            title={lockedOn ? 'Keep at least two properties to compare' : undefined}
            className={cx(
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              isSelected
                ? 'border-teal-600 bg-teal-600 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400',
              lockedOn && 'cursor-not-allowed opacity-60',
            )}
          >
            <span aria-hidden="true" className="mr-1.5 font-semibold">
              {isSelected ? '✓' : '+'}
            </span>
            {p.name}
          </button>
        )
      })}
      <span className="ml-1 text-sm text-slate-500" aria-live="polite">
        Comparing {selected.length} of {properties.length}
      </span>
    </div>
  )
}
