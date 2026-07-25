import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InfoTip } from './InfoTip'
import { GLOSSARY } from '../lib/glossary'

const trigger = () => screen.getByRole('button', { name: /what is net yield\?/i })

describe('InfoTip', () => {
  it('starts closed, and says so', () => {
    render(<InfoTip term="netYield" />)
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('opens on click and shows the definition', async () => {
    const user = userEvent.setup()
    render(<InfoTip term="netYield" />)
    await user.click(trigger())

    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('tooltip')).toHaveTextContent(GLOSSARY.netYield.definition)
  })

  it('points the trigger at the panel it controls', async () => {
    const user = userEvent.setup()
    render(<InfoTip term="netYield" />)
    await user.click(trigger())

    expect(trigger().getAttribute('aria-controls')).toBe(screen.getByRole('tooltip').id)
  })

  it('closes again on a second click', async () => {
    const user = userEvent.setup()
    render(<InfoTip term="netYield" />)
    await user.click(trigger())
    await user.click(trigger())
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  // Keyboard reachability is a definition-of-done item, so it is asserted.
  it('opens from the keyboard and closes on Escape, keeping focus', async () => {
    const user = userEvent.setup()
    render(<InfoTip term="netYield" />)

    await user.tab()
    expect(trigger()).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(trigger()).toHaveFocus()
  })

  it('closes when the click lands outside it', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <InfoTip term="netYield" />
        <button type="button">elsewhere</button>
      </div>,
    )
    await user.click(trigger())
    await user.click(screen.getByRole('button', { name: 'elsewhere' }))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
