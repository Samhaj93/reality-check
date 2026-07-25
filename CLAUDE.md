# Reality Check — off-plan Dubai deal comparator

## What this is
A comparison tool for a first-time international investor holding 2–3 shortlisted
off-plan Dubai units. It recomputes every unit on one engine and labels the
provenance of every figure. It is not a listings site, a CRM, or a forecaster.

## Non-negotiable rules
1. **No unsourced numbers reach the UI.** Every value rendered carries a
   `Provenance` tag: 'registry' | 'estimate' | 'claim'. A number without a tag is a bug.
2. **No capital-appreciation or resale-price projections.** Anywhere. Ever.
   If a ticket seems to ask for one, stop and flag it.
3. **All financial logic lives in `src/engine/`, which imports nothing.**
   Pure functions, no React, no formatting, no side effects. UI never does arithmetic.
4. **All regulatory and market constants live in `src/engine/assumptions.ts`.**
   Never inline a rate, fee, or percentage anywhere else.
5. **Every engine function ships with a unit test.** No exceptions, no "add later".
6. **Mock data only.** `src/data/properties.ts`. No network calls in v1.
7. **Tailwind core utilities only** if targeting a no-JIT preview environment;
   in this Vite repo full Tailwind is available — but keep the token set small.

## Vocabulary — use these exact terms in code and UI
- `netYield` — net income ÷ total acquisition cost. The headline number.
- `grossYield` — rent ÷ price. Displayed only to be visibly discredited.
- `cashBeforeFirstRent` — all outflow up to and including handover.
- `breakEvenRent` — rent required to hit the user's target net yield.
- `provenance` — never call it "source type", "confidence", or "verification".

## Definition of done for any ticket
- [ ] `npm test` passes
- [ ] `npm run build` passes with no TS errors
- [ ] New engine logic has tests covering a normal case and a boundary case
- [ ] Keyboard reachable, visible focus ring
- [ ] Renders correctly at 375px width
