import { useEffect, useMemo, useRef, useState } from 'react'
import type { Property, Verdict } from '../engine/types'
import { MAX_BAND_SCORE, scoreBands, verdict as computeVerdict } from '../engine/bands'
import { agentQuestions } from '../engine/questions'
import {
  buildDecision,
  decisionDrivers,
  findDriver,
  isComplete,
  meetsTarget,
  noneWorkable,
} from '../engine/decision'
import type { DecisionForm, DriverMetric, Position } from '../engine/decision'
import { buildDecisionRecord } from '../lib/decisionRecord'
import { aed, cx, pct } from '../lib/format'
import { ProvenanceDot } from './ProvenanceDot'

const VERDICT_TONE: Record<Verdict, string> = {
  Workable: 'bg-teal-100 text-teal-800 border-teal-300',
  Marginal: 'bg-amber-100 text-amber-800 border-amber-300',
  Fragile: 'bg-rose-100 text-rose-800 border-rose-300',
}

const POSITION_COPY: Record<Position, { label: string; hint: string }> = {
  proceed: { label: 'Proceed', hint: 'I am ready to commit to this unit.' },
  hold: { label: 'Hold — questions first', hint: 'I need answers before I can say yes.' },
  walk: { label: 'Walk away', hint: 'None of these clears my bar.' },
}

const METRIC_LABEL: Record<DriverMetric, string> = {
  netYield: 'Net yield',
  rentCushion: 'Rent cushion',
  cashBeforeFirstRent: 'Cash before first rent',
  acquisitionCost: 'Acquisition cost',
}

const isRate = (m: DriverMetric) => m === 'netYield' || m === 'rentCushion'

interface DecisionPanelProps {
  properties: Property[]
  target: number
  onTargetChange: (target: number) => void
}

export function DecisionPanel({ properties, target, onTargetChange }: DecisionPanelProps) {
  return (
    // A sheet, not a tab panel: moving here should feel like moving from a
    // screen you read to a document you sign.
    <div className="overflow-hidden rounded-xl border border-brand-line bg-white">
      <header className="bg-brand-deep px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Decide</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          This page adds no new information. Everything above informs; this one asks
          you for a position.
        </p>
      </header>

      <div className="p-5">
        <TargetControl target={target} onTargetChange={onTargetChange} />

        <p className="mb-4 rounded-lg border border-brand-line bg-brand-lavender px-4 py-3 text-sm text-slate-600">
          No band or verdict here is a recommendation to buy. They summarise how much
          of each deal is verified and how much rests on the seller's word — not
          whether you should sign.
        </p>

        <div className="grid gap-4 lg:grid-cols-3">
          {properties.map((p) => (
            <DecisionCard key={p.id} property={p} target={target} />
          ))}
        </div>

        <DecisionCapture properties={properties} target={target} />
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
        className="h-2 w-48 cursor-pointer accent-brand-violet-deep"
      />
      <span className="w-12 text-sm font-semibold tabular-nums text-brand-ink">
        {pct(target)}
      </span>
    </div>
  )
}

// The commitment step. Three peer positions, a cited figure, and a falsifiable
// condition — then a record you can keep (RC-13).
function DecisionCapture({ properties, target }: { properties: Property[]; target: number }) {
  const [form, setForm] = useState<DecisionForm>({
    position: null,
    driverId: '',
    changeMind: '',
  })
  const [record, setRecord] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current)
    },
    [],
  )

  const drivers = useMemo(() => decisionDrivers(properties, target), [properties, target])

  // Changing the shortlist or the target can strand a cited figure; drop it
  // rather than record a number that is no longer on screen.
  useEffect(() => {
    setForm((f) =>
      f.driverId && !findDriver(drivers, f.driverId) ? { ...f, driverId: '' } : f,
    )
    setRecord(null)
  }, [drivers])

  const cited = findDriver(drivers, form.driverId)
  const citedProperty = properties.find((p) => p.id === cited?.propertyId)
  const willNoteBelowTarget =
    form.position === 'proceed' && citedProperty !== undefined && !meetsTarget(citedProperty, target)

  const ready = isComplete(form)

  const handleRecord = () => {
    const decision = buildDecision(properties, target, form, new Date())
    if (decision) setRecord(buildDecisionRecord(decision))
  }

  const handleCopy = async () => {
    if (!record) return
    try {
      await navigator.clipboard.writeText(record)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — the text is on screen.
    }
  }

  return (
    <section className="mt-6 border-t border-brand-line pt-5">
      <h3 className="text-base font-semibold text-brand-ink">Record your decision</h3>

      {noneWorkable(properties, target) && (
        <p
          data-testid="walk-away-prompt"
          className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          At a {pct(target)} target, nothing on this shortlist reaches Workable. Walking
          away is a legitimate outcome, and it is the third option below.
        </p>
      )}

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-slate-700">Your position</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {(Object.keys(POSITION_COPY) as Position[]).map((p) => (
            <label
              key={p}
              className={cx(
                'flex cursor-pointer gap-2 rounded-lg border p-3 text-sm transition-colors',
                form.position === p
                  ? 'border-brand-violet-deep bg-brand-lavender'
                  : 'border-brand-line hover:border-brand-violet',
              )}
            >
              <input
                type="radio"
                name="position"
                value={p}
                checked={form.position === p}
                onChange={() => setForm((f) => ({ ...f, position: p }))}
                className="mt-0.5 accent-brand-violet-deep"
              />
              <span>
                <span className="block font-medium text-brand-ink">{POSITION_COPY[p].label}</span>
                <span className="block text-xs text-slate-500">{POSITION_COPY[p].hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="driver" className="text-sm font-medium text-slate-700">
            The one number that decided it
          </label>
          <select
            id="driver"
            value={form.driverId}
            onChange={(e) => setForm((f) => ({ ...f, driverId: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-brand-line bg-white px-3 py-2 text-sm text-brand-ink"
          >
            <option value="">Pick a figure from your comparison…</option>
            {properties.map((p) => (
              <optgroup key={p.id} label={p.name}>
                {drivers
                  .filter((d) => d.propertyId === p.id)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {METRIC_LABEL[d.metric]}:{' '}
                      {isRate(d.metric) ? pct(d.value) : aed(d.value)}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Chosen from the figures already on screen — not free text.
          </p>
        </div>

        <div>
          <label htmlFor="change-mind" className="text-sm font-medium text-slate-700">
            What would change my mind
          </label>
          <textarea
            id="change-mind"
            rows={3}
            value={form.changeMind}
            onChange={(e) => setForm((f) => ({ ...f, changeMind: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-brand-line bg-white px-3 py-2 text-sm text-brand-ink"
            placeholder="A signed tenancy contract showing rent below AED 100k."
          />
          <p className="mt-1 text-xs text-slate-500">
            If you can't finish this sentence, you haven't decided yet — you've guessed.
          </p>
        </div>
      </div>

      {willNoteBelowTarget && (
        <p
          data-testid="below-target-note"
          className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          This unit's net yield sits below your {pct(target)} target. The record will say so.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRecord}
          disabled={!ready}
          className={cx(
            'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
            ready
              ? 'bg-brand-deep text-white hover:bg-brand-violet-deep'
              : 'cursor-not-allowed bg-slate-200 text-slate-400',
          )}
        >
          Create decision record
        </button>
        {!ready && (
          <span className="text-xs text-slate-500">
            All three are required — a position without a number and a condition is a guess.
          </span>
        )}
      </div>

      {record && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-brand-ink">Your decision record</h4>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-brand-line bg-white px-3 py-1.5 text-sm font-medium text-brand-ink transition-colors hover:border-brand-violet"
            >
              {copied ? 'Copied' : 'Copy record'}
            </button>
          </div>
          <pre
            data-testid="decision-record"
            className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-brand-line bg-brand-lavender p-4 text-xs leading-relaxed text-slate-700"
          >
            {record}
          </pre>
        </div>
      )}
    </section>
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
      className="flex flex-col rounded-lg border border-brand-line bg-white p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-brand-ink">{p.name}</h3>
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
          className={cx('h-2 w-2 rounded-full', i < score ? 'bg-brand-ink' : 'bg-slate-200')}
        />
      ))}
    </span>
  )
}
