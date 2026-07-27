# CLAUDE.md — kelvinfranciswebsite

Read this fully at the start of every session. It is the project's persistent
memory. If anything here conflicts with a chat instruction, ask before proceeding.

---

## WHAT THIS IS

The personal dossier of **Kelvin-Francis Peprah**, a cybersecurity and
intelligent-systems founder. Working title: **The Human Attestation**.

**It is not a portfolio, blog, or brochure.** It is a verified, dated, graded
record — an official file about a person, built to still be right in 2036 and
able to prove it without asking to be believed.

**North star:** *A dossier of a human that behaves like proof rather than
describing it.*

**Four tests for every decision:**
1. Is it checkable?
2. Will it outlive its own design?
3. Is it congruent — does it *behave* like what it claims?
4. Is it enforced by the pipeline, not just intended?

**Full specification:** `_local/BUILD-PROMPT.md` (gitignored — read it, never commit it).

**ELEVATION DIRECTIVE (2026-07-27, Kelvin-approved):** read
`docs/ELEVATION_PLAN.md` immediately after this file. It amends the palette
(primary gold → `#F2B705`, aged `#B0902E` demoted to a tier) and sanctions the
story layer (HoloArt scenes + motion contract) within this project's doctrine.
Load skills `premium-web-craft`, `holoart`, `aurum-brand-system`,
`kf-sigil-system` before any visual work.

---

## HARD RULES — never violate

1. **No CMS. No database. No admin panel. No login. No auth. No cookies.**
   Files + Git only. "No door to hack" is the point.
2. **contentlayer is FORBIDDEN** (unmaintained). Use `lib/content.ts` + **zod**.
3. **Static export** (`output: 'export'`). No runtime, no serverless functions.
4. **Zero secrets.** No environment variables, API keys, or tokens. If a feature
   needs one, it is the wrong feature.
5. **Type law:** serif speaks (headlines, prose) · mono verifies (record IDs,
   dates, grades, metadata). Never mix the roles.
6. **Every commit signed.** The commit is the publish act. Drafts never commit.
7. **Content restrictions:** see `_local/EXCLUSIONS.md` before writing any copy.
   Never invent biographical content — if a fact isn't supplied, leave a clearly
   marked placeholder and flag it in the report.

---

## STACK

```
Next.js (App Router, TypeScript) · output: 'export'
Tailwind CSS · gray-matter + next-mdx-remote · zod
@fontsource/spectral · @fontsource/ibm-plex-mono   (self-hosted, OFL)
```

Zero runtime dependencies for the signature moments — Web Crypto, Web Audio, and
CSS transforms are all native. **Never install** animation, 3D, or audio libraries.

---

## DESIGN TOKENS — `styles/tokens.css`

Audit-verified against WCAG AA. **Do not substitute values.**

```css
:root{
  --ink:#0E0C09; --ink-raised:#17130D; --ink-line:#241E15;

  /* METAL — hue-locked 45.1°. Amended by ELEVATION_PLAN E1 (2026-07-27). */
  --gold:#F2B705;        /* 10.17 ✓ accent, links — AURUM-H primary */
  --gold-bright:#FFCC33; /* 12.28 ✓ hover, active — the step above primary */
  --gold-aged:#B0902E;   /*  6.05 ✓ restrained moments (the former primary) */
  --gold-dim:#947A2F;    /*  4.48 ✓ small label text */
  --gold-rule:#6E5C23;   /*  2.83 — BORDERS ONLY, never text */

  --bone:#EDE6D6;        /* 14.88 ✓ body */
  --bone-dim:#A79E8C;    /*  6.97 ✓ secondary */
  --bone-faint:#867C6A;  /*  4.50 ✓ meta */

  --grade-fact:#7DA582; --grade-conv:#B0902E; --grade-scen:#C7A45C;

  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem; --space-5:1.5rem;
  --space-6:2rem; --space-7:3rem; --space-8:4rem; --space-9:6rem; --space-10:8rem;

  --text-2xs:.6875rem;  /* 11px — mono floor, never smaller */
  --text-xs:.75rem; --text-sm:.85rem; --text-base:1.0625rem;
  --text-lg:1.1875rem; --text-xl:1.3125rem;
  --text-2xl:clamp(1.35rem,2.4vw,1.75rem);
  --text-3xl:clamp(1.85rem,4.2vw,2.85rem);
  --text-4xl:clamp(2.4rem,6.4vw,4.4rem);

  --leading-tight:1.1; --leading-body:1.6; --leading-essay:1.7;
  --measure:68ch; --measure-tight:46ch; --tap:44px;
  --ease:cubic-bezier(.2,.8,.3,1);

  /* EASING TIERS — arrivals spring, exits/utility take the machine curve. */
  --ease-spring:cubic-bezier(.34,1.3,.4,1); --ease-exit:cubic-bezier(.4,0,.2,1);
  --dur-arrive:.62s; --dur-fade:.5s;
}

/* MODE ENGINE — one attribute, whole page shifts */
[data-mode="hunter"]{
  --gold:#917B39; --gold-bright:#B0902E; --gold-aged:#917B39;
  --bone:#E2DCCB; --leading-essay:1.55;
}
```

### Token laws
- **No raw hex or raw px in component files.** Tokens only.
- `--gold-rule` is borders-only. Any text colour must clear 4.5:1.
- **Breakpoints: `768px` and `1024px` only.** Mobile-first `min-width`. If a
  layout breaks between them, fix the layout — never add a third.
- Touch targets: minimum 44×44px on anything tappable.
- Paper grain overlay on `body::before` (see spec) — subtle, felt not seen.

---

## THE SIGIL — `components/ui/Sigil.tsx`

Source SVGs are in `/logos`. Build the component with `currentColor` on every
stroke and fill so the mode engine recolours it. Props: `cut?: "master"|"small"`,
`wings?: boolean` (default true).

Master: `viewBox="0 0 100 100"`, `strokeWidth={2}`, `strokeLinecap="round"`.
Small cut (≤32px): `strokeWidth={3.5}`, junction dot `r=2.6`.

```
STROKES
  circle cx=50 cy=16 r=10                       ← nimbus
  line 50,21 → 50,50                            ← spine upper
  line 50,50 → 40,50   ·  line 50,50 → 60,50    ← arms (stop at ring edges)
  circle cx=34 cy=50 r=5  ·  circle cx=66 cy=50 r=5
  line 50,50 → 50,58
  circle cx=50 cy=64 r=5
  line 50,70 → 50,88                            ← tail
  WINGS (omit if wings=false)
  line 44.5,37 → 32,19   ·  line 44,45 → 34.5,31.3
  line 55.5,37 → 68,19   ·  line 56,45 → 65.5,31.3
FILLS
  circle cx=50 cy=16 r=5                        ← the origin (head)
  circle cx=50 cy=50 r=1.8                      ← junction dot
  polygon 50,96.5  47.2,87.5  52.8,87.5         ← the strike
```

**Grammar law:** connectors touch node edges, never pass through them.
**Never rotate the sigil.** It is a figure, not a seal.
**Never redesign it.** The geometry is canon — reproduce exactly.

---

## THE EIGHT RECORDS

One scrolling dossier at `app/page.tsx`. Section pattern: mono label
`§ 0N — NAME` with hairline rule → serif heading → content.

| # | Record | Contains |
|---|---|---|
| R-01 | **Attestation** | Sigil, name, headline, thesis, attestation panel (mono key/value rows) |
| R-02 | **The Record** | Builds ledger + **Service ledger** + dormant Collaborations block |
| R-03 | **Doctrine** | Essay index, grade tags, filters, scoreboard strip |
| R-04 | **Now** | Current season, dated, present tense |
| R-05 | **Credentials** | CSA licence card + exact-wording fine print |
| R-06 | **Signal** | Contact links + dormant Press block |
| R-07 | **The System** | Versioned operating architecture + changelog |
| R-08 | **The Archive** | Media as numbered dated plates, tied to records |

Full copy for each is in `_local/BUILD-PROMPT.md` §7.

---

## GATE DISCIPLINE

```
G1 Foundation → G2 Substance → G3 The Moments → G4 Polish → G5 Launch
```

1. **A gate closes only when every exit criterion is objectively met.** No partial passes.
2. **One gate in flight at a time.** Never start the next with open criteria.
3. **Stop and report at each gate boundary.** Wait for Kelvin before continuing.

Exit criteria are in `_local/BUILD-PROMPT.md`. Several require *proving* the
result (grep to show zero raw px, deliberately break a record to confirm CI
catches it, report the Lighthouse delta as a number).

---

## VERIFICATION MECHANISM

Build: `hash = sha256(raw source bytes)`, embed `{ hash, commit, path }`.
Runtime, on demand: fetch the source from `raw.githubusercontent.com` pinned to
that commit, hash with `crypto.subtle.digest('SHA-256')`, compare.

**Never a false green.** Network failure shows `UNVERIFIED — check manually` plus
a direct link. Success is only ever shown when the check actually passed.

State the boundary on the page: this proves the page matches its public source at
that commit — **not** that the content is true.

---

## DO NOT

- Add pages, sections, or features beyond the spec
- Install animation, 3D, or audio libraries
- Use contentlayer
- Add analytics, trackers, or cookies
- Add a CMS, database, or auth
- Introduce environment variables
- Rotate or redesign the sigil
- Add a third breakpoint
- Exceed the 30KB JS budget without flagging it
- Invent biographical facts, credentials, or client names
- Commit anything from `_local/`

---

## QUALITY BAR

Lighthouse **100** across all four. LCP < 1.0s. **CLS = 0.** JS under 30KB.
Site fully readable with JavaScript disabled. Works on a cheap phone on 3G.

Performance is doctrine here, not preference — a slow artifact from someone
selling trust is a broken promise.

---

*"Everything on this page is checkable. That's the point."*
