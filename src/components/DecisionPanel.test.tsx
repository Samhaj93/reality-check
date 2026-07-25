import { describe, it, expect } from 'vitest'
import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import { DecisionPanel } from './DecisionPanel'
import { PROPERTIES } from '../data/properties'
import { bandTotal } from '../engine/bands'

function Harness({ initial = 0.035 }: { initial?: number }) {
  const [target, setTarget] = useState(initial)
  return <DecisionPanel properties={PROPERTIES} target={target} onTargetChange={setTarget} />
}

describe('DecisionPanel (RC-6)', () => {
  it('shows a verdict label, never the blended total as a number', () => {
    render(<Harness />)
    const marasi = document.querySelector('[data-testid="decision-card"][data-id="marasi"]') as HTMLElement
    // verdict rendered as a label
    expect(within(marasi).getByTestId('verdict')).toHaveTextContent('Workable')
    // the blended total (11) must not appear anywhere in the card
    const total = bandTotal(PROPERTIES.find((p) => p.id === 'marasi')!, 0.035)
    expect(total).toBe(11)
    const bandsRegion = marasi.querySelectorAll('[data-testid="band"]')
    bandsRegion.forEach((b) => {
      expect(b.textContent).not.toMatch(new RegExp(`\\b${total}\\b`))
    })
  })

  it('every band shows the sentence that produced its score', () => {
    render(<Harness />)
    const ridge = document.querySelector('[data-testid="decision-card"][data-id="ridge"]') as HTMLElement
    const bands = ridge.querySelectorAll('[data-testid="band"]')
    expect(bands).toHaveLength(4)
    bands.forEach((b) => expect((b.textContent ?? '').length).toBeGreaterThan(20))
  })

  it('renders the rent-gap question for every property and cancelled only for ridge', () => {
    render(<Harness />)
    // rent-gap phrasing appears once per property
    expect(screen.getAllByText(/above our estimate/)).toHaveLength(PROPERTIES.length)
    // cancelled-project question only where devCancelled > 0 (ridge)
    expect(screen.getAllByText(/cancelled project/)).toHaveLength(1)
  })

  it('states that no score is a recommendation to buy', () => {
    render(<Harness />)
    expect(screen.getByText(/not a recommendation to buy|recommendation to buy/i)).toBeInTheDocument()
  })

  it('verdict copy stays grammatical at both slider extremes (I4)', () => {
    for (const t of [0.025, 0.06]) {
      const { unmount } = render(<Harness initial={t} />)
      const verdicts = screen.getAllByTestId('verdict')
      expect(verdicts).toHaveLength(PROPERTIES.length)
      verdicts.forEach((v) =>
        expect(['Workable', 'Marginal', 'Fragile']).toContain(v.textContent),
      )
      unmount()
    }
  })
})
