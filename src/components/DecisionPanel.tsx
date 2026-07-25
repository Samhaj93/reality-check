import type { Property, Verdict } from '../engine/types'
import { MAX_BAND_SCORE, scoreBands, verdict as computeVerdict } from '../engine/bands'
import { agentQuestions } from '../engine/questions'
import { cx, pct } from '../lib/format'
import { ProvenanceDot } from './ProvenanceDot'

const VERDICT_TONE: Record<Verdict, string> = {
  Workable: 'bg-teal-100 text-teal-800 border-teal-300',
  Marginal: 'bg-amber-100 text-amber-800 border-amber-300',
  Fragile: 'bg-rose-100 text-rose-800 border-rose-300',
}

interface DecisionPanelProps {
  properties: Property[]
  target: number
  onTargetChange: (target: number) => void
}

export function DecisionPanel({ properties, target, onTargetChange }: DecisionPanelProps) {
  return (
    <div>
      <TargetControl target={target} onTargetChange={onTargetChange} />

      <p className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        No band or verdict here is a recommendation to buy. They summarise how much
        of each deal is verified and how much rests on the seller's word — not
        whether you should sign.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {properties.map((p) => (
          <DecisionCard key={p.id} property={p} target={target} />
        ))}
      </div>
    </div>
  )
}

function TargetControl({
  target,
  onTargetChange,
}: {
  target: number
  onTargetChange: (t: number) => void
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <label htmlFor="target-yield" className="text-sm font-medium text-slate-700">
        Your target net yield
      </label>
      <input
        id="target-yield"
        type="range"
        min={0.025}
        max={0.06}
        step={0.0025}
        value={target}
        onChange={(e) => onTargetChange(Number(e.target.value))}
        aria-valuetext={pct(target)}
        className="h-2 w-48 cursor-pointer accent-teal-600"
      />
      <span className="w-12 text-sm font-semibold tabular-nums text-slate-900">
        {pct(target)}
      </span>
    </div>
  )
}

function DecisionCard({ property: p, target }: { property: Property; target: number }) {
  const bands = scoreBands(p, target)
  const v = computeVerdict(p, target)
  const questions = agentQuestions(p)

  return (
    <div
      data-testid="decision-card"
      data-id={p.id}
      className="flex flex-col rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{p.name}</h3>
        <span
          data-testid="verdict"
          className={cx('rounded-full border px-2.5 py-0.5 text-xs font-semibold', VERDICT_TONE[v])}
        >
          {v}
        </span>
      </div>

      {/* Bands, always decomposed: pips + the sentence that produced the score. */}
      <ul className="grid gap-3">
        {bands.map((b) => (
          <li key={b.key} data-testid="band">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                {b.label}
                <ProvenanceDot provenance={b.provenance} />
              </span>
              <PipMeter score={b.score} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{b.sentence}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Questions for the agent
        </h4>
        <ul className="grid list-disc gap-1.5 pl-4 text-xs text-slate-600">
          {questions.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PipMeter({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Score ${score} of ${MAX_BAND_SCORE}`}>
      {Array.from({ length: MAX_BAND_SCORE }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cx('h-2 w-2 rounded-full', i < score ? 'bg-slate-800' : 'bg-slate-200')}
        />
      ))}
    </span>
  )
}
