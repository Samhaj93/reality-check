import type { EvidenceMode } from '../lib/provenance'
import { cx } from '../lib/format'

const OPTIONS: { value: EvidenceMode; label: string }[] = [
  { value: 'checked', label: 'Checked' },
  { value: 'brochure', label: 'Brochure' },
]

// The core mechanic (RC-3). A segmented toggle between the seller's numbers
// (Brochure) and this tool's recomputed numbers (Checked). Keyboard-operable;
// aria-pressed reflects state on each segment.
export function EvidenceSwitch({
  mode,
  onChange,
}: {
  mode: EvidenceMode
  onChange: (mode: EvidenceMode) => void
}) {
  return (
    <div
      role="group"
      aria-label="Evidence mode"
      className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-0.5"
    >
      {OPTIONS.map((o) => {
        const active = mode === o.value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cx(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// Brochure mode names exactly what is being shown, so no one mistakes marketing
// figures for verified ones (RC-3 acceptance: explanatory banner).
export function BrochureBanner() {
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <span className="font-semibold">You are viewing the brochure's numbers.</span>{' '}
      Annual rent, gross yield, net income and net yield below use the{' '}
      <span className="font-semibold">seller's advertised rent</span> — a marketing
      claim, not a verified figure. Switch to{' '}
      <span className="font-semibold">Checked</span> to see the same deal on this
      tool's recomputed rent.
    </div>
  )
}
