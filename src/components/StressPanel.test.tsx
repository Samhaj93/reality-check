import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StressPanel, stressLine } from './StressPanel'
import { byId, PROPERTIES } from '../data/properties'

const ridge = byId('ridge')

describe('stressLine — the sign flip (RC-5)', () => {
  it('positive cushion reads "can come in … below"', () => {
    const line = stressLine(ridge, 0.03, 'a 3% net yield')
    expect(line.pass).toBe(true)
    expect(line.sentence).toMatch(/can come in .*% below our estimate/)
  })

  it('negative cushion inverts to "has to come in … above"', () => {
    const line = stressLine(ridge, 0.06, 'a 6% net yield')
    expect(line.pass).toBe(false)
    expect(line.sentence).toMatch(/has to come in .*% above our estimate/)
  })

  it('the same unit shows both forms across the three targets', () => {
    const forms = [0.03, 0.045, 0.06].map((t) => stressLine(ridge, t, 't').pass)
    expect(forms).toContain(true) // passes an easy target
    expect(forms).toContain(false) // fails a hard one
  })
})

describe('StressPanel rendering (RC-5)', () => {
  it('borders teal on pass and rose on fail', () => {
    const { container } = render(<StressPanel properties={PROPERTIES} />)
    const lines = [...container.querySelectorAll('[data-testid="stress-line"]')]
    const pass = lines.find((l) => l.getAttribute('data-pass') === 'true')
    const fail = lines.find((l) => l.getAttribute('data-pass') === 'false')
    expect(pass?.className).toContain('border-teal-600')
    expect(fail?.className).toContain('border-rose-600')
  })
})
