import { describe, it, expect } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShortlistBar } from './ShortlistBar'
import { PROPERTIES } from '../data/properties'

// Minimal stateful harness mirroring how App wires the bar.
function Harness() {
  const [selected, setSelected] = useState(PROPERTIES.map((p) => p.id))
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return <ShortlistBar properties={PROPERTIES} selected={selected} onToggle={toggle} />
}

describe('ShortlistBar — minimum of two (RC-2 / I1)', () => {
  it('blocks deselecting below two by disabling the control, no error', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    // Start at 3 selected. Deselect one → 2 remain.
    await user.click(screen.getByRole('button', { name: /The Ridge/ }))
    expect(screen.getByText('Comparing 2 of 3')).toBeInTheDocument()

    // The two remaining are now locked on: pressed + disabled.
    const aurea = screen.getByRole('button', { name: /Aurea Residences/ })
    const marasi = screen.getByRole('button', { name: /Marasi Point/ })
    expect(aurea).toBeDisabled()
    expect(marasi).toBeDisabled()
    expect(aurea).toHaveAttribute('aria-pressed', 'true')

    // Attempting a third deselect does nothing (still 2), no throw.
    await user.click(aurea)
    expect(screen.getByText('Comparing 2 of 3')).toBeInTheDocument()
  })
})
