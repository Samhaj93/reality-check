# 05 · v2 scope note — what I took, and what I turned down

*A v2 proposal arrived after v1 shipped. This is the decision record for the
proposal itself, which felt like the right way to treat it.*

---

## The three asks

| Ask | Decision |
|---|---|
| A home page listing 20 properties | **Declined** |
| A mock sign-up with hardcoded credentials | **Declined** |
| Make Decide more visible and distinct | **Built** |

## Why I built the third

Because it was never a feature request — it was a defect report, and a fair one.

v1 rendered four equal tabs, which implied four equal purposes. Three of them
inform: Compare, Cash timeline, Stress test. The fourth asks you to commit. Giving
them identical weight was a design error, and it flattened the one moment the whole
product exists to serve.

So Decide is no longer a peer:

- **Separated in the navigation**, behind a divider, styled as a destination rather
  than another tab.
- **Rendered as a document**, not a panel — a sheet with a deep header, so moving
  there feels like moving from a screen you read to one you sign.
- **It says so out loud.** Its opening line is *"This page adds no new information.
  Everything above informs; this one asks you for a position."*
- **It ends by asking for a position** — Proceed, Hold, or Walk away, as three peers.
  Walking away is a decision, so it is a radio button, not a hidden exit.

Two inputs are required alongside the position. **The one number that decided it**
is picked from figures already on screen, never free text — if the reason can't be
named as a number you were shown, it wasn't a reason. **What would change my mind**
is free text, prompted with: *if you can't finish this sentence, you haven't decided
yet, you've guessed.*

The output is a timestamped **decision record**: the position, the cited figure with
its provenance, the shortlist ranked as checked, the assumptions in force, and — only
if you chose Hold — the questions to put to the agent. Proceeding on a unit below
your own stated target puts a note in the record saying so.

## Why I declined the other two

The brief asks for a tool to *"shortlist and compare 2–3 off-plan properties"* and
says plainly: *"We'd genuinely rather see crisp thinking on a small scope than a
weekend lost to a big one. Knowing where to stop is part of what we're hiring for."*

A 20-listing browse page and a login screen are the two things in the proposal that
reverse documented cuts — Cut 3 (search, browse, listings inventory) and Cut 5
(accounts, saving, login) in [doc 02](./02-scope-decisions.md). The arguments for
reversing them were good ones. The browse page was designed as an argument rather
than a directory: sorted by checked net yield by default, with twin yield badges
making the brochure gap visible twenty times instead of once. That is a genuinely
better listings page than a portal would build.

It is still a listings page. It pulls the user back into discovery, which is a
different job from the one this product does well, and it is most of a day's work.
The cuts were made for reasons that haven't changed. I'd rather ship a smaller thing
that holds its argument than a bigger one that dilutes it.

If the shortlist ever needs to come from inside the product rather than from three
brochures on a kitchen table, this is the first thing I'd build — and I'd build it
as specified.

## One thing I found while reviewing the proposal

The v2 prototype quietly changed the confidence bands: it dropped **Return** — net
yield, the headline number — and replaced it with an evidence-quality band. The
proposal stated that pinning the original three units kept the existing walkthrough
true. It didn't. Two of the three verdicts flip under the new bands:

| Unit | v1 | v2 prototype |
|---|---|---|
| Aurea Residences | Marginal | Workable |
| Marasi Point | Workable | Marginal |
| The Ridge | Fragile | Fragile |

I kept v1's four bands. Scoring evidence quality is a good idea and I'd add it as a
*fifth* band rather than at the cost of the headline number — but not in the same
change as everything above, and not without re-tuning the thresholds and re-checking
every verdict the docs depend on.

## What this cost

Three new engine functions with tests, one new screen treatment, and a palette
aligned to Xeleration's own. Test count went from 73 to 98 for this change, and
stands at 109 after the inline term definitions that followed. No cut was reversed.
