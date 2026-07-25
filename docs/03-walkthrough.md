# 03 · Walkthrough

*Half-page write-up. Doubles as a script if you'd rather record the 3–5 min Loom.*

---

## The 90-second demo path

1. **Land on the Compare tab, in Checked mode.** Three shortlisted units, side by
   side, every figure carrying a small coloured **provenance dot** — teal *registry*,
   amber *estimate*, rose *claim*. The headline row is **net yield** (~3.5–4%). Gross
   yield sits below it, **struck through**, captioned *"Not the number to decide on."*

2. **Flip the Evidence switch to Brochure.** An amber banner names exactly what you're
   now looking at. Rent jumps to the brochure figure, gross yield un-strikes and looks
   great again (~7%). This is the gap, made physical — you *toggle reality on and off*.
   Switch tabs and the control resets to Checked, so you're never left reading
   marketing numbers by accident.

3. **Cash timeline tab.** One stacked bar per unit — fees, during construction, at
   handover, post-handover — summing to total outflow. Beside it: advertised handover
   vs **"on track record"** (advertised months + the developer's average lateness,
   tagged *registry*), and the **delay cost in AED** — the rent you forgo while the
   developer runs late. For The Ridge that's ~AED 30,000.

4. **Stress test tab.** Three break-evens per unit as sentences a non-expert reads in
   one pass — and the grammar **inverts on the sign**: *"Rent can come in 8% below our
   estimate before…"* becomes *"Rent has to come in 20% above our estimate to…"* when
   the cushion goes negative. Teal border when it passes, rose when it fails.

5. **Decide — a destination, not a tab.** It sits behind a divider, apart from the
   three tabs that inform, and renders as a **document with a deep indigo header**
   rather than another panel. It opens by saying so: *"This page adds no new
   information. Everything above informs; this one asks you for a position."*
   Inside: four confidence bands (Return, Rent cushion, Developer, Cash exposure),
   each **shown decomposed** — a 0–3 score *and the sentence that produced it*. They
   roll up to a plain label — **Workable / Marginal / Fragile** — but the blended
   number is **never shown**. Below each unit: **auto-generated questions for the
   agent**, built from the unverified fields (a rent-gap question for every unit; a
   cancelled-project question only where the developer has one). A slider lets Ana set
   her own target net yield and watch the cushions and verdicts move.
   A line states plainly: **no score here is a recommendation to buy.**

6. **Take a position, and keep the record.** Three peer options — **Proceed**,
   **Hold, questions first**, **Walk away**. Walking away is a radio button, not a
   hidden exit. Two inputs are required alongside it: **the one number that decided
   it**, picked from figures already on screen rather than typed free-hand, and
   **what would change my mind**, prompted with *"if you can't finish this sentence,
   you haven't decided yet — you've guessed."* Nothing records until all three are
   answered.

   The output is a timestamped **decision record**: the position, the cited figure
   *with its provenance*, the shortlist ranked as checked, the assumptions in force,
   and — only if she chose Hold — the agent questions. Proceed on a unit below her own
   target and the record says so. Set the target where nothing clears it and a prompt
   appears above the form pointing out that walking away is a legitimate outcome.
   This is the closing beat of the demo: the record shows *brochure gross 7.0%* next
   to *checked net 3.5%* for the same unit, which is the whole product in two numbers.

Throughout, the **assumptions footer** shows every rate the engine used, each tagged by
provenance, on every tab. A **Copy summary** button puts a plain-text digest on the
clipboard for her spreadsheet or a message to a partner. Terms a first-time buyer
wouldn't know — net yield, cash before first rent, delay cost, on track record — carry
a small **ⓘ** that opens a plain-English definition at the point of use, so the tool
never assumes expertise it told her she didn't need.

## The two hardest calls (worth 30 seconds on camera)

- **Refusing to forecast.** The easiest way to make an investor feel confident is to
  show them a number going up. I designed the product to *never* do that, and enforced
  it with a test that fails the build if speculative language ships. Confidence comes
  from provenance and downside legibility, not prediction.
- **Never showing a blended score.** A single "deal score" would be false precision and
  invite gaming. Decomposed bands + a plain verdict label keep the *reasoning* visible.

## How it was built (execution note)

**Engine-first.** All financial logic lives in a pure, dependency-free `src/engine/`
that does arithmetic and nothing else — no React, no formatting. The UI never
calculates; it only renders and labels. That's what lets the provenance guarantee
actually hold. The decision record follows the same split: the logic of what may be
cited and whether the form is complete sits in `src/engine/decision.ts`, while the
record's wording and number formatting live in `src/lib/decisionRecord.ts`, because
formatting is presentation. The record takes its timestamp as an argument rather than
reading the clock, which keeps it pure and its tests deterministic.

Before writing a line of TypeScript I ported the formulas to a throwaway script and
verified every target value and the ranking-flip thesis independently — so the spec's
own numbers were proven before the build depended on them. The result is **109 passing
tests**, including the product thesis expressed *as* tests: the brochure-vs-net ranking
flip, "every rendered number has a provenance dot," band-ranking stability across the
whole target range, and a grep of the shipped bundle for banned forward-looking terms.
The glossary is tested too — its definitions read their rates from `ASSUMPTIONS`, so
the explanatory copy cannot drift away from the engine it describes.
`npm run build` is clean; the app is ~72 kB gzipped.

## Where it's honestly thin

The entire "Checked" position rests on one modelled number — the rent estimate — which
in v1 is mock and tagged *estimate*, not *registry*. That's not hidden; it's the first
thing [doc 04](./04-if-i-had-another-week.md) would fix.
