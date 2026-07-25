# 01 · Problem brief

*Reality Check — a comparison tool for first-time off-plan Dubai investors*

---

## Who I'm solving for

**Ana, 41 — a first-time off-plan buyer, based abroad.**
Dual income, roughly **AED 1.5m** to deploy. She's chosen Dubai for the yield and
a possible future base, not as a speculator. She is financially literate but is
**not a UAE property expert** and has never bought off-plan anywhere.

Her decision moment, precisely:

> It's the weekend. Ana has narrowed a longlist down to **three units** she likes.
> She has three glossy brochures, WhatsApp threads with two agents, and a
> half-started spreadsheet. Every brochure quotes a rental yield that looks great.
> One agent has just told her a unit is "selling fast." She has to either commit,
> or let it go — and she doesn't trust the numbers enough to do either with
> confidence.

She is **past discovery**. She doesn't need another listings portal; she needs to
*judge the shortlist she already has*.

## The core job to be done

> *"When I've narrowed to two or three off-plan units and every agent's numbers look
> great, help me see which figures I can actually trust and what each deal really
> costs and risks — so I can decide, or walk away, without becoming a Dubai property
> expert first."*

## What "confidence" means here (my definition)

This is the pivotal framing decision, so I'm making it explicit.

Confidence is **not** "will this go up in value?" — that's speculation, and it's
exactly the question agents answer too confidently. **Reality Check refuses to
answer it.**

Confidence *is*:

1. **Provenance** — for every number, knowing whether it's a *verifiable record*, a
   *modelled estimate*, or an *unverified seller claim*.
2. **One honest basis** — every unit recomputed on the same engine, so a genuine
   comparison replaces three inconsistent brochures.
3. **Downside legibility** — seeing what you pay before the first dirham of rent,
   what happens if the developer runs late, and how much the rent can miss its
   estimate before the deal stops working.

Confidence is *understanding the deal*, not *predicting the market*.

## The insight the product is built on

> **The gap between the brochure number and the real number is the product.**

A brochure sells a **gross yield** ("7%!") that ignores every cost of owning and
letting. Recompute it as a **net yield** on true acquisition cost and it's often
~3.5–4%. The tool's whole job is to make that gap — and the trustworthiness of the
inputs behind it — impossible to miss.

## Key assumptions (stated, per the brief's guidance)

- **Cash / payment-plan buyer, not mortgaged.** Most off-plan sales run on developer
  payment plans; the persona isn't financing. (Cut rationale in [doc 02](./02-scope-decisions.md).)
- **Rates & fees** — DLD transfer fee 4%, oqood + trustee ~AED 1,630, letting
  management 5%, vacancy ~8% (≈1 month/yr), maintenance + insurance AED 3,000/yr,
  direct-from-developer (0% agent commission). All held in one file and shown to the
  user in the footer, each tagged by provenance.
- **Mock data throughout** — three invented but realistic units. We are not testing
  data sourcing (yet); the real data pipeline is the primary v2 risk, see
  [doc 04](./04-if-i-had-another-week.md).
- **Single market, small n** — 2–3 units, Dubai only. The engine is shape-agnostic;
  the UI deliberately assumes a small shortlist.

## What success looks like

Ana finishes a session able to say, for each unit, *"here's what I actually earn,
here's what I actually pay, here's what could go wrong, and here's exactly what to ask
the agent before I sign"* — and she can act on that, including walking away. Metrics
that would tell us it's working are in [doc 02 §5](./02-scope-decisions.md#5-how-wed-know-its-working-metrics).
