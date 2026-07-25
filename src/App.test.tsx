import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App interactions', () => {
  it('resets evidence to Checked and hides the switch on tab change (I3)', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Enter Brochure mode on the Compare tab.
    await user.click(screen.getByRole('button', { name: 'Brochure' }))
    expect(screen.getByRole('status')).toBeInTheDocument() // brochure banner

    // Move to another tab: the evidence switch is gone (no dead control).
    await user.click(screen.getByRole('tab', { name: 'Cash timeline' }))
    expect(screen.queryByRole('button', { name: 'Brochure' })).not.toBeInTheDocument()

    // Return to Compare: mode has reset to Checked, banner gone.
    await user.click(screen.getByRole('tab', { name: 'Compare' }))
    expect(screen.getByRole('button', { name: 'Checked' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('copies a summary to the clipboard and confirms (I5)', async () => {
    // userEvent.setup() installs its own clipboard stub, so override afterwards.
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Copy summary' }))
    expect(writeText).toHaveBeenCalledOnce()
    expect(writeText.mock.calls[0][0]).toContain('Reality Check')
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('keeps the assumptions footer visible on every tab (P4)', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const name of ['Compare', 'Cash timeline', 'Stress test', 'Decide']) {
      await user.click(screen.getByRole('tab', { name }))
      expect(screen.getByRole('heading', { name: 'Assumptions' })).toBeInTheDocument()
    }
  })
})
