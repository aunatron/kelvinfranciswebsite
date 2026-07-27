# HoloArt scene prompts — E2.1 and E2.2

Step 0 of the `holoart` pipeline. Code cannot paint this art (a parametric SVG
attempt scored ~15% of the reference), so these two prompts are the deliverable
and Kelvin generates the images.

**Rules that make these usable when they come back:**

- Generate at the stated resolution or larger. Below 2× display width the art
  softens on retina and phone screens, and the only fix is regeneration —
  upscaling in code is forbidden.
- No text anywhere in the image. Every label, panel and record ID on the
  finished scene is crisp HTML we overlay; baked-in model text is blurry pixels
  and would also breach the real-ledger law.
- Keep the outer edges and all four corners empty black. That is where the HUD
  panels sit, and it is what lets the alpha key drop the background so the art
  floats on the ink canvas instead of reading as a placed rectangle.
- Re-roll rather than patch. If a machine reads ambiguously or a corner is
  busy, regenerate — new art invalidates all hotspot measurements anyway.

Hand back the raw files; I measure hotspots against the pixels, alpha-key,
encode AVIF, and build the overlay.

---

## Scene 1 — R-01 hero: "the operator's desk"

Target: **3344 × 1882** (2× of the 1672×941 reference; the hero displays up to
~992px wide, so this clears the 2× floor with margin). 4K is welcome.

> Isometric technical wireframe illustration on a pure black background
> (#0A0A0A). A lone futuristic security operations desk mid-intercept: a curved
> multi-panel console with a seated operator's empty chair, a tall projected
> barrier arcing up in front of the desk, hostile incoming traces shattering
> into fragments against that barrier, a slim vertical comms mast beside the
> desk, a low equipment stack under the console, and a floating emblem above
> the desk built from a ringed circle over a vertical spine with two small
> rings branching left and right and a long tapering arrow tip below. Drawn
> entirely in fine glowing golden lines (#F2B705) like a holographic
> engineering blueprint — dense wireframe mesh on every object, small glowing
> node lights, thin connector lines and faint grid on the ground. Warm gold
> bloom on light sources. No text, no labels, no UI, no watermarks anywhere in
> the image. Keep all four corners and the outer edges empty black so interface
> panels can be overlaid later. Cinematic, precise, high detail.

Interactive objects I will map (6): console, barrier, shatter point, comms
mast, equipment stack, emblem. The emblem description is deliberately
geometric rather than named — the real sigil is drawn by our own component in
`currentColor`, never by the image model, so its canon geometry stays exact.

## Scene 2 — R-02: the proof constellation

Target: **3072 × 1728** minimum (skill's showpiece width).

> Isometric technical wireframe illustration on a pure black background
> (#0A0A0A). A constellation of five distinct linked stations floating in
> formation, joined by thin glowing connector lines: a broad flat delivery
> platform, a tall lattice signal tower, a dense clustered detection array with
> concentric rings, a rigid gridded archive vault, and — larger and central,
> the anchor of the group — a multi-tier institutional spire. Each station sits
> on its own small hex platform with glowing node points where the connectors
> meet its edge. Drawn entirely in fine glowing golden lines (#F2B705) like a
> holographic engineering blueprint — dense wireframe mesh on every object,
> small glowing node lights, thin connector lines and faint grid on the ground.
> Warm gold bloom on light sources. No text, no labels, no UI, no watermarks
> anywhere in the image. Keep all four corners and the outer edges empty black
> so interface panels can be overlaid later. Cinematic, precise, high detail.

Five stations, one per ledger entry, central spire = Aunatron Systems. Hotspot
labels will be the actual ledger lines and years — not invented telemetry.

---

## What the overlay will say

The real-ledger law forbids decorative gibberish, so both scenes draw their
HUD rows from live dossier vocabulary only: record IDs (`R-01`…`R-08`,
`DOCTRINE-001`), grades (`FACT`, `HIGH-CONVICTION`, `SCENARIO`), ledger years
and statuses (`ACTIVE`, `BUILT`, `PARKED`), and the built commit. Nothing on
these panels will be invented.

**Open question for Kelvin:** the Aunatron ledger line currently reads "The
capability, scaled into an institution." `_local/EXCLUSIONS.md` §6 requires
Aunatron Systems be described as "in development" only until the certificate
lands. If it has not landed, that line and the central spire's hotspot label
both need the hedge restored before this scene ships.
