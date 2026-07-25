import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CashTimeline } from './CashTimeline'
import { PROPERTIES } from '../data/properties'

const card = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-testid="cash-card"][data-id="${id}"]`) as HTMLElement

describe('CashTimeline (RC-4)', () => {
  it('segment widths sum to 100% of total outflow for every property', () => {
    const { container } = render(<CashTimeline properties={PROPERTIES} />)
    for (const p of PROPERTIES) {
      const segs = card(container, p.id).querySelectorAll('[data-testid="cash-segment"]')
      const sum = [...segs].reduce((a, s) => a + Number(s.getAttribute('data-pct')), 0)
      expect(sum).toBeCloseTo(100, 4)
    }
  })

  it('renders the post-handover segment only when postHandoverPct > 0', () => {
    const { container } = render(<CashTimeline properties={PROPERTIES} />)
    // aurea: post = 0 → no post-handover segment
    expect(
      card(container, 'aurea').querySelector('[data-key="postHandover"]'),
    ).toBeNull()
    // marasi: post = 0.20 → segment present
    expect(
      card(container, 'marasi').querySelector('[data-key="postHandover"]'),
    ).not.toBeNull()
  })

  it('realistic timeline = months + avg late, tagged registry', () => {
    const { container } = render(<CashTimeline properties={PROPERTIES} />)
    const ridge = card(container, 'ridge')
    // 30 + 11 = 41 mo
    const fig = [...ridge.querySelectorAll('[data-testid="figure"]')].find((f) =>
      f.textContent?.includes('41 mo'),
    )
    expect(fig).toBeTruthy()
    expect(
      fig?.querySelector('[data-testid="provenance-dot"]')?.getAttribute('data-provenance'),
    ).toBe('registry')
  })

  it('shows the delay cost in AED, not months alone', () => {
    const { container } = render(<CashTimeline properties={PROPERTIES} />)
    // ridge delay cost = 29,810 AED
    expect(card(container, 'ridge').textContent).toContain('AED 29,810')
  })
})
