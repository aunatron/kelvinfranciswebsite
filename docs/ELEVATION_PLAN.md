# ELEVATION PLAN — bring The Human Attestation to the aunatron.com bar

Owner directive (Kelvin, 2026-07-27, from the aunatron build session): "the
colours and contents are off by miles… it lacks the quality and story the main
site has." This plan is the approved correction. It AMENDS the spec where noted;
everything else in CLAUDE.md (hard rules, gates, verification doctrine, sigil
canon, DO-NOT list) stands untouched.

Read at session start, after CLAUDE.md. Load these skills before any work:
`premium-web-craft` (the 14 laws proven on aunatron.com), `holoart` (generated
art → interactive scene pipeline), `aurum-brand-system`, `kf-sigil-system`.

---

## E1 — Palette elevation (fixes "the yellow looks off")

The dossier shipped with aged gold `#B0902E` as the PRIMARY accent. Kelvin's
locked AURUM-H preference is **bright gold `#F2B705`** — the same primary the
aunatron site runs. Amendment to `styles/tokens.css`:

- `--gold: #F2B705` (primary accent, links — the AURUM "current preferred gold")
- `--gold-aged: #B0902E` (NEW tier — restrained moments, the old primary demoted)
- `--gold-bright`: re-derive as the hover/active step ABOVE `#F2B705`
  (candidate `#FFC933`; must pass the audit)
- `--gold-dim` / `--gold-rule` / bone tiers / `[data-mode="hunter"]`: unchanged
  in role; re-audit every text pairing with `npm run audit:contrast` after the
  swap — the token law ("audit-verified, do not substitute") is satisfied by
  RE-RUNNING the audit, not by keeping stale values. `#F2B705` on `--ink`
  clears AA with margin; verify and record the numbers in the report.

Exit: audit green, zero raw hex in components (grep), sigil master cut renders
in `#F2B705`.

## E2 — The story layer (fixes "lacks story"; spec amendment, Kelvin-approved)

Adopt the aunatron visual system, palette-swapped, WITHIN this project's
doctrine (no libraries, 30KB JS, readable with JS off):

1. **One HoloArt hero scene in R-01** — "the operator's desk": a lone
   futuristic security operations console mid-intercept, hostile traces
   shattering against a projected barrier, the KF sigil geometry appearing as
   the console's emblem. Generated 4K per the `holoart` skill prompt skeleton
   (backgrounds get alpha-keyed, so the ink canvas shows through — no box).
   Overlay: measured hotspots + 1–2 HUD panels whose rows are REAL dossier
   vocabulary (record IDs, grades) — the "real ledger" law makes fake telemetry
   forbidden here; use actual R-numbers.
2. **A proof constellation in R-02** — small scene: real builds (Aunatron
   flagship among them) as linked stations. Hotspot labels = the actual ledger
   entries.
3. **Motion**: port the data-attribute contract from `premium-web-craft` law 7
   (single tiny island, viewport-gated, reduced-motion parity, spring arrivals,
   scroll-progress hairline). Budget: the island stays ≤3KB gz; with JS
   disabled the scenes render complete and static — which satisfies "fully
   readable with JavaScript disabled."
4. **The raster never moves; art serves as alpha-keyed AVIF ≥2× display,
   unoptimized** (laws 10–11). Edge-dissolve mask so nothing reads as a
   placed picture.

Exit: scenes live, hit-tests pass on every hotspot, JS budget held, JS-off
render verified, Lighthouse still 100 / CLS 0.

## E3 — Content with receipts (fixes "contents off")

The eight-record structure STANDS — it is stronger than a generic portfolio.
The correction is filling it with verified substance, Kelvin-supplied (the
no-invention law holds): the builds ledger with Aunatron as Exhibit A (dated,
linked, checkable), the CSA credential exact wording, 2–3 doctrine essays,
the Now season. Voice: serif speaks, mono verifies; aunatron copy law on top —
present tense, no hype words, no exclamation marks.

Exit: zero placeholder blocks on the page; every claim carries a date, link,
or grade.

## Sequencing into the existing gates

E1 lands as a G1-reopening fix (tokens are foundation). E3 is G2 substance.
E2 is G3 "The Moments" — it IS the moments. G4/G5 close as specced. One gate
in flight at a time; stop and report at each boundary per house rules.

## Session-start line for Kelvin

> Read CLAUDE.md and docs/ELEVATION_PLAN.md, load premium-web-craft + holoart
> + aurum-brand-system + kf-sigil-system, then execute E1 and stop at the gate.
