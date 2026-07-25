# Reality Check

**A comparison tool for a first-time off-plan Dubai investor holding two or three
shortlisted units.** It recomputes every unit on one engine and labels where each
number came from.

🔗 **Live demo: [samhaj93.github.io/reality-check](https://samhaj93.github.io/reality-check/)**

---

## The problem

Ana has narrowed a longlist to three units. She has three glossy brochures, two
WhatsApp threads with agents, and a half-started spreadsheet. Every brochure quotes
a rental yield that looks great. One agent has just told her a unit is "selling
fast." She has to commit or walk away — and she doesn't trust the numbers enough to
do either.

She is past discovery. She doesn't need another listings portal; she needs to judge
the shortlist she already has.

## The insight it's built on

> **The gap between the brochure number and the real number is the product.**

A brochure sells a **gross yield** ("7%!") that ignores every cost of owning and
letting. Recompute it as a **net yield** on true acquisition cost and it's often
~3.5–4%. The tool's job is to make that gap — and the trustworthiness of the inputs
behind it — impossible to miss.

## What it deliberately refuses to do

It will not forecast capital appreciation or resale price. Anywhere. That's the
question agents answer too confidently, and answering it would undermine the one
thing the tool is for. Confidence here means *understanding the deal*, not
*predicting the market*.

## The four views

| View | The question it answers |
| --- | --- |
| **Compare** | What do these units look like on one honest basis? Toggle to *Brochure* to see the seller's figures, clearly discredited. |
| **Cash timeline** | What do I pay, and when, before the first dirham of rent arrives? |
| **Stress test** | How far can the rent miss its estimate before the deal stops working? |
| **Decide** | Where does each deal stand against *my* target yield — and what exactly do I ask the agent before signing? Ends by asking you to take a position and emitting a **decision record** you can keep. |

Decide is deliberately not a peer of the other three. They inform; it asks you to
commit. It is separated in the navigation, rendered as a document rather than a
tab panel, and it opens by saying it adds no new information.

## Provenance — the core mechanic

Every figure rendered carries one of three tags. A number without a tag is a bug.

- **registry** — a verifiable record
- **estimate** — modelled by this tool, from stated assumptions
- **claim** — the seller's word, unverified

Every `claim` figure generates a specific question for the agent, on the Decide tab.

## Reading the thinking

The documents are the substance of this submission; the app demonstrates it.

1. [Problem brief](docs/01-problem-brief.md) — the persona, the job to be done, and what "confidence" is defined to mean
2. [Scope decisions](docs/02-scope-decisions.md) — what was cut, why, and how we'd know it's working
3. [Walkthrough](docs/03-walkthrough.md) — the session, end to end
4. [If I had another week](docs/04-if-i-had-another-week.md) — the real risks, honestly ranked
5. [v2 scope note](docs/05-v2-scope-note.md) — a later proposal, what I took from it and what I turned down

[`CLAUDE.md`](CLAUDE.md) holds the engineering constraints the build was held to.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 109 tests
npm run build    # type-check + production build
```

## How it's built

React 19 + TypeScript + Vite, Tailwind for styling, Vitest for tests.

The structural rule: **all financial logic lives in `src/engine/`, which imports
nothing outside itself.** Pure functions — no React, no formatting, no side effects.
The UI never does arithmetic; it renders what the engine returns. Every regulatory
and market constant sits in one file, `src/engine/assumptions.ts`, and is shown to
the user in the footer with its provenance. That's what makes the numbers auditable
rather than merely displayed.

Every push to `main` runs lint, tests, and a type-checked build before it is allowed
to deploy.

## Scope and honesty

Mock data throughout — three invented but realistic units, no network calls. The
real data pipeline is the primary v2 risk and is discussed in
[doc 04](docs/04-if-i-had-another-week.md). The assumed buyer is a cash /
payment-plan buyer, not mortgaged; rates and fees are listed in the app's footer.

Built as a product exercise. Not financial advice.
