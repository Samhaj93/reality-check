# 02 · Scope decisions

*The single artifact to read most closely. What's in v1, what I deliberately cut, and why.*

---

## The one-line scope

> Build the smallest thing that proves a single thesis: **relabelling every figure by
> provenance and recomputing all units on one honest engine gives a first-time buyer
> more confidence than any brochure or calculator can.** Everything that doesn't
> serve that thesis is cut.

## 1. What's in v1

| # | In scope | Why it earns its place |
|---|---|---|
| 1 | **One pure calculation engine**, every unit recomputed on it | The comparison is only trustworthy if all three units are computed identically. Non-negotiable. |
| 2 | **Provenance on every number** (`registry` / `estimate` / `claim`) | This *is* the product. A number with no source is the disease we're curing. |
| 3 | **Brochure ↔ Checked toggle** | The core mechanic. It makes the brochure-vs-reality gap a thing you *do*, not a thing you read. |
| 4 | **Net yield as the headline; gross yield shown struck-through** | Reframes the number the whole industry leads with as the one *not* to decide on. |
| 5 | **Cash-before-first-rent + payment-plan timeline + delay cost** | Off-plan's real risk isn't price, it's *time and cash exposure before any income*. |
| 6 | **Stress test as plain-English break-evens** | "Rent can fall 8% below our estimate before this stops working" beats a sensitivity table for a non-expert. |
| 7 | **Decision panel: decomposed confidence bands + generated agent questions** | Turns judgement into a checklist and a script. The output is *action*, not a verdict. |
| 8 | **Mock data, 3 units, no accounts, no network** | Enough to prove the thesis; nothing that delays it. |

## 2. What I deliberately cut — and why

Ordered by how tempting they were to include.

### 2.1 Capital appreciation / resale-price forecasts — **cut on principle**
The most important cut. Every instinct (and every agent) says "show them the upside."
**I refuse to**, for three reasons:
- It's **unknowable**. Any number would be false precision dressed as insight.
- It's **the exact thing that erodes trust** — it's what the glossy decks oversell.
- It would **contradict the product's promise**. Confidence here means understanding
  the deal, not predicting the market. A forecast would make Reality Check just
  another optimistic calculator.

This is enforced, not just intended: the build has a test that greps the shipped
bundle for "appreciation" / "guaranteed" / "ROI projection" and **fails on any hit**.

### 2.2 Mortgage / LTV / financing math — **cut for focus**
Doubles the input surface (rates, LTV caps, non-resident terms, stage-based drawdown)
for a persona who is a payment-plan cash buyer. Adding it in v1 would blur the one
idea we're testing. Revisit once the core mechanic is validated.

### 2.3 FX / currency exposure — **cut, flagged as assumption**
Ana earns abroad, so FX genuinely matters to her real return. But modelling it adds a
second axis of speculation (rate paths) to a tool whose whole stance is *not to
speculate*. Cut for v1; noted as a known limitation, not pretended away.

### 2.4 Listings / search / discovery — **out of scope by design**
She arrives *with* a shortlist. Building search would make this a portal (a crowded,
different product) and dilute the "judge what you already have" job.

### 2.5 A single blended confidence score — **cut deliberately**
Tempting to output one 0–100 "deal score." I refused: a single number invites false
precision and gaming, and hides *why*. Instead, four bands are **always shown
decomposed**, each with the sentence that produced it, and the blended total is
**never displayed as a number** — it only maps to a plain label (Workable / Marginal /
Fragile).

### 2.6 Also cut: service-charge escalation curve (modelled as one flat shock), CRM /
agent management, accounts & persistence, live RERA/DLD integration (mock data in v1),
and a size/recency-weighted developer score (simple delivered/total ratio for now).

## 3. The tension I'm most aware of

**Honesty is a harder sell than optimism.** Reality Check consistently tells the user
the deal is *worse* than the brochure said. That's the point — but it means the tool
has to feel like a trusted advisor, not a downer. My bet: for a **high-stakes,
first-time, cross-border purchase**, trust beats dopamine. The mitigation is tone —
it never says "don't buy"; it says "here's the real shape of this, and here's what to
ask." The product's job is a *confident decision*, which is sometimes a confident *no*.

## 4. How the mock data encodes the thesis

The three units aren't random — the spread is the teaching mechanism:

- **Aurea** — the balanced unit. Moderate everything, decent developer. The quiet
  sensible pick.
- **Marasi** — expensive, but the **best rent cushion**; undercut by a **thin (3/3)
  developer record** and a large post-handover cash tail.
- **The Ridge** — looks like the **value play on price-per-sqft** and finishes **last
  on everything that matters**: worst developer (11 months' average lateness, a
  cancelled project), and a rent cushion of ~0.15%.

The killer demonstration: **on brochure gross yield, The Ridge outranks Aurea. On
recomputed net yield, that flips.** The build asserts this ranking flip *as a test* —
if a data change ever breaks it, the data is wrong, not the test.

## 5. How we'd know it's working (metrics)

Tie success to behaviour, not vanity:

| Metric | What it tells us |
|---|---|
| **Activation** — % of sessions that toggle Brochure→Checked ≥ once | Did they engage the core mechanic at all? |
| **The "aha"** — % of sessions that *reorder or drop* a shortlisted unit after seeing Checked | Did the tool actually change a decision? This is the north-star proxy. |
| **Intent to act** — % that copy/export the agent-questions list | Did we convert insight into a next step? |
| **Resolution** — % of shortlists that reach a clear decision (buy one / walk) in-session | Are we curing the "freeze," not just adding analysis? |
| **Guardrail (counter-metric)** — distribution of verdicts over time | We are *not* a lead-gen funnel and *not* trying to talk everyone out of buying. If everything trends "Fragile," the model is miscalibrated-pessimistic, not honest. |

Explicitly **not** a metric: units favourably rated, agent leads generated. Optimising
those would corrupt the product's only asset — its honesty.

## 6. Definition of done (met)

71 automated tests pass (engine values, the ranking-flip thesis, provenance coverage,
the band-ranking stability, the content grep); `npm run build` is clean; bundle is
67 kB gzipped. Details in [doc 03](./03-walkthrough.md).
