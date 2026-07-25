import { describe, it, expect } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EvidenceSwitch, BrochureBanner } from './EvidenceSwitch'
import { CompareTable } from './CompareTable'
import type { EvidenceMode } from '../lib/provenance'
import { PROPERTIES } from '../data/properties'

// Mirrors how App wires the switch to the table on the Compare tab.
function Harness() {
  const [mode, setMode] = useState<EvidenceMode>('checked')
  return (
    <div>
      <EvidenceSwitch mode={mode} onChange={setMode} />
      {mode === 'brochure' && <BrochureBanner />}
      <CompareTable properties={PROPERTIES} mode={mode} />
    </div>
  )
}

describe('EvidenceSwitch — the core mechanic (RC-3)', () => {
  it('aria-pressed reflects state', () => {
    render(<Harness />)
    expect(screen.getByRole('button', { name: 'Checked' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Brochure' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('defaults to Checked: est rent shown, gross struck with caption, no banner', () => {
    render(<Harness />)
    expect(screen.getByText('AED 71,000')).toBeInTheDocument() // aurea est rent
    expect(screen.queryByText('AED 78,000')).not.toBeInTheDocument() // aurea claim rent hidden
    expect(screen.getAllByText('Not the number to decide on')).toHaveLength(PROPERTIES.length)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('toggling to Brochure changes rent/gross/net cells and shows the banner', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Brochure' }))

    expect(screen.getByRole('button', { name: 'Brochure' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('AED 78,000')).toBeInTheDocument() // now claim rent
    expect(screen.queryByText('AED 71,000')).not.toBeInTheDocument()
    // gross yield no longer discredited in Brochure mode
    expect(screen.queryByText('Not the number to decide on')).not.toBeInTheDocument()
    // explanatory banner present
    expect(screen.getByRole('status')).toHaveTextContent(/brochure's numbers/i)
  })

  it('is operable by keyboard alone', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const brochure = screen.getByRole('button', { name: 'Brochure' })
    brochure.focus()
    expect(brochure).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(brochure).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('AED 78,000')).toBeInTheDocument()
  })

  it('stays consistent after toggling 10 times, no stale figures (I2)', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const checked = screen.getByRole('button', { name: 'Checked' })
    const brochure = screen.getByRole('button', { name: 'Brochure' })
    for (let i = 0; i < 10; i++) {
      await user.click(brochure)
      expect(screen.getByText('AED 78,000')).toBeInTheDocument()
      expect(screen.queryByText('AED 71,000')).not.toBeInTheDocument()
      await user.click(checked)
      expect(screen.getByText('AED 71,000')).toBeInTheDocument()
      expect(screen.queryByText('AED 78,000')).not.toBeInTheDocument()
    }
  })

  it('gross yield is struck through in Checked mode only', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    // Checked: aurea gross on est rent = 71000/1150000 = 6.2%, struck
    const grossChecked = screen.getByText('6.2%')
    expect(grossChecked.className).toContain('line-through')

    await user.click(screen.getByRole('button', { name: 'Brochure' }))
    // Brochure: aurea gross on claim rent = 78000/1150000 = 6.8%, not struck
    const grossBrochure = screen.getByText('6.8%')
    expect(grossBrochure.className).not.toContain('line-through')
  })
})
