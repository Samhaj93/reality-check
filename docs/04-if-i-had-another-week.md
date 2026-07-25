# 04 · If I had another week

*The next 2–3 priorities, and how I'd know each one worked.*

---

The v1 thesis — *provenance + one honest engine builds confidence* — is proven with
mock data. The next week is about **making the trustworthy figures actually
trustworthy**, in priority order.

## Priority 1 — Build the real rent estimator *(this is the central product risk)*

**Why first.** The whole "Checked" story rests on one number, `estRent`, and today it's
invented. Every net yield, every rent cushion, every verdict inherits its credibility.
Right now that figure is honestly tagged *estimate* — but an *estimate* the user can't
interrogate is a soft spot in the middle of a product whose entire promise is
trustworthy numbers.

**What I'd build.** A comparables-based estimator: recent **signed tenancy contracts**
(not asking prices) for the same building / area / bed-count, producing a rent **range
with a confidence level**, not a false point value. The UI already has the socket for
this — the rent-gap agent question and the *estimate* dot — so the surface barely
changes; the number behind it gets real.

**How I'd know it worked.** Back-test estimated rent against held-out actual contracts;
target a median error band we can state honestly (e.g. ±X%). Track how often users still
feel they must override it — declining overrides means growing trust.

## Priority 2 — Make the "registry" dots genuinely registry

**Why.** Provenance is only worth as much as its sourcing. Today the teal dots are
labelled *registry* but fed by constants.

**What I'd build.** Wire the actual public sources behind the registry-tagged figures —
DLD fee schedule and oqood, RERA registered area — and ingest the **developer track
record** (handover history, cancellations) from public data rather than hand-entered
fields. Replace the flat delivered/total ratio with a **size- and recency-weighted**
delivery score, since a developer's last three towers matter more than a decade-old one.

**How I'd know it worked.** Every teal dot traces to a fetchable source in an audit
view; developer scores move sensibly when we replay historical delivery data.

## Priority 3 — Service charge as a distribution, not a guess

**Why.** Service charge is the silent killer of net yield, and in v1 it's a single
estimated rate stressed by one flat shock.

**What I'd build.** Seed the rate from **actual service-charge history** of comparable
towers, and model the stress as a small real distribution (P50/P90) rather than a flat
±30%. This sharpens the rent-cushion and stress-test outputs where it matters most.

**How I'd know it worked.** Predicted service charge lands within a stated band of
observed charges for delivered comparables.

## Running alongside — instrument the metrics from [doc 02 §5](./02-scope-decisions.md#5-how-wed-know-its-working-metrics)

None of the above is worth shipping unmeasured. I'd add lightweight analytics for the
core loop — **Brochure→Checked activation**, the **"aha" reorder/drop rate**, and
**agent-question exports** — plus the guardrail on verdict distribution so we can see
early if the model drifts pessimistic. Priorities 1–3 are hypotheses about what builds
confidence; these metrics are how we'd learn whether they actually do.

## Deliberately still *not* on the list

No appreciation forecasts, no mortgage engine, no listings search. Those aren't
backlog — they're **boundaries**. The product's value is that it refuses to do them.
See [doc 02](./02-scope-decisions.md).
