import { useEffect, useRef, useState } from 'react'
import type { EvidenceMode } from './lib/provenance'
import { cx } from './lib/format'
import { buildSummary } from './lib/summary'
import { PROPERTIES } from './data/properties'
import { ShortlistBar } from './components/ShortlistBar'
import { EvidenceSwitch, BrochureBanner } from './components/EvidenceSwitch'
import { CompareTable } from './components/CompareTable'
import { CashTimeline } from './components/CashTimeline'
import { StressPanel } from './components/StressPanel'
import { DecisionPanel } from './components/DecisionPanel'
import { AssumptionsFooter } from './components/AssumptionsFooter'

type TabId = 'compare' | 'cash' | 'stress' | 'decide'

const TABS: { id: TabId; label: string }[] = [
  { id: 'compare', label: 'Compare' },
  { id: 'cash', label: 'Cash timeline' },
  { id: 'stress', label: 'Stress test' },
  { id: 'decide', label: 'Decide' },
]

const DEFAULT_TARGET = 0.035

export default function App() {
  const [selected, setSelected] = useState<string[]>(PROPERTIES.map((p) => p.id))
  const [tab, setTab] = useState<TabId>('compare')
  const [mode, setMode] = useState<EvidenceMode>('checked')
  const [target, setTarget] = useState(DEFAULT_TARGET)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current)
    },
    [],
  )

  // Keep property order stable regardless of toggle order.
  const shortlisted = PROPERTIES.filter((p) => selected.includes(p.id))

  const toggle = (id: string) =>
    setSelected((s) => {
      if (s.includes(id)) {
        if (s.length <= 2) return s // enforced minimum of two
        return s.filter((x) => x !== id)
      }
      return [...s, id]
    })

  // Switching tabs resets evidence to Checked — no dead controls (RC-3).
  const changeTab = (id: TabId) => {
    setTab(id)
    setMode('checked')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(shortlisted, target))
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail quietly.
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6">
      <header className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reality Check</h1>
              <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Prototype · mock data
              </span>
            </div>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Compare shortlisted off-plan Dubai units on one engine. Every figure is
              labelled by where it came from, and the brochure's numbers are shown only
              beside the ones you'd actually decide on.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
          >
            {copied ? 'Copied' : 'Copy summary'}
          </button>
        </div>
      </header>

      <div className="mb-4">
        <ShortlistBar properties={PROPERTIES} selected={selected} onToggle={toggle} />
      </div>

      <div
        role="tablist"
        aria-label="Views"
        className="mb-4 flex flex-wrap gap-1 border-b border-slate-200"
      >
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => changeTab(t.id)}
              className={cx(
                '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-teal-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'compare' && (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Toggle between the seller's figures and this tool's recomputed ones.
              </p>
              <EvidenceSwitch mode={mode} onChange={setMode} />
            </div>
            {mode === 'brochure' && <BrochureBanner />}
            <CompareTable properties={shortlisted} mode={mode} />
          </div>
        )}

        {tab === 'cash' && <CashTimeline properties={shortlisted} />}
        {tab === 'stress' && <StressPanel properties={shortlisted} />}
        {tab === 'decide' && (
          <DecisionPanel
            properties={shortlisted}
            target={target}
            onTargetChange={setTarget}
          />
        )}
      </div>

      <AssumptionsFooter />
    </div>
  )
}
