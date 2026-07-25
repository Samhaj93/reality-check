import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CompareTable } from './CompareTable'
import { PROPERTIES } from '../data/properties'

describe('CompareTable — provenance coverage (RC-2 / P2)', () => {
  it('every cell that renders a number carries a provenance dot', () => {
    const { container } = render(<CompareTable properties={PROPERTIES} mode="checked" />)
    const cells = container.querySelectorAll('td, th')
    const offenders: string[] = []
    cells.forEach((cell) => {
      const text = cell.textContent ?? ''
      if (/\d/.test(text) && !cell.querySelector('[data-testid="provenance-dot"]')) {
        offenders.push(text.trim())
      }
    })
    expect(offenders).toEqual([])
  })

  it('handover date is tagged claim, not registry', () => {
    const { getByText } = render(<CompareTable properties={PROPERTIES} mode="checked" />)
    const dot = getByText('Q4 2027')
      .closest('[data-testid="figure"]')
      ?.querySelector('[data-testid="provenance-dot"]')
    expect(dot?.getAttribute('data-provenance')).toBe('claim')
  })

  it('service charge is tagged estimate', () => {
    const { getAllByText } = render(<CompareTable properties={PROPERTIES} mode="checked" />)
    // aurea service charge = 745 * 16 = 11,920
    const dot = getAllByText('AED 11,920')[0]
      .closest('[data-testid="figure"]')
      ?.querySelector('[data-testid="provenance-dot"]')
    expect(dot?.getAttribute('data-provenance')).toBe('estimate')
  })
})
