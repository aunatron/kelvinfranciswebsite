# The Human Attestation

The public dossier of **Kelvin-Francis Peprah**: cybersecurity and
intelligent-systems founder. Not a portfolio: a verified, dated, graded
record, built to still be right in 2036 and able to prove it without asking
to be believed.

## How it proves things

- **Files + Git only.** No CMS, no database, no admin panel, no login, no
  cookies. There is no door to hack.
- **Every content file is hashed.** The build embeds
  `sha256(raw source bytes)` plus the commit id. The on-page VERIFY control
  re-fetches the source from this repository, pinned to that commit, and
  re-hashes it in the reader's own browser with `crypto.subtle`. Success is
  only shown when the check actually passed; any failure reads
  `UNVERIFIED · check manually`, never a false green.
- **The boundary is stated on the page:** a matching hash proves the page
  matches its public source at that commit. It does not prove the content is
  true. That is what the grades and the track record are for.
- **Signed commits.** The commit is the publish act. GitHub shows every one
  as Verified.
- **Machine-legible:** `/records.json` (canonical dossier with hashes),
  `/feed.json` (JSON Feed 1.1), `/llms.txt`, `/sitemap.xml`.

## Pipeline enforcement

`npm run build` will refuse to ship:

- a malformed content record · zod validation runs as `prebuild` and fails
  loudly (also enforced in CI by `validate.yml`);
- an image with location metadata · JPEG, PNG, and WebP metadata containers
  are removed; AVIF files carrying EXIF or XMP are rejected;
- more than 30KB of JavaScript on any single page · the Next.js client
  runtime is removed at postbuild; the site ships server-rendered HTML plus
  a few small inline native scripts, and the budget is a hard build failure.

CI adds three more gates on every push (`quality.yml`):

- **contrast** · every text colour is checked against the ground it actually
  renders on, in both modes; under 4.5:1 fails, and `--gold-rule` may never
  colour text;
- **axe** · every route, both modes, zero violations;
- **Lighthouse** · 100 for performance, accessibility, best practices, and
  SEO; observed LCP below one second; CLS exactly 0;
- **moments and media** · hit-tests, explicit audio, reduced-motion and
  no-JavaScript parity, alpha assets, dimensions, and image budgets;
- **machine and print** · eight records, JSON Feed, sitemap, robots,
  canonical metadata, and a clean paper rendering.

## Archive consent rule

The Archive (R-08) publishes work as numbered, dated plates. Two rules are
absolute:

1. **No identifiable faces of other people without written permission.**
2. **Never faces of anyone receiving service work.**

If either is in doubt, the plate does not ship.

## Publishing

1. Edit or add content under `content/**` (zod-validated on build).
2. Commit with signing enabled and push to `main`.
3. Run `npm run build`, then deploy through the linked Vercel project with
   `vercel --prod`.

Drafts never commit. The page says only what is true today.

## Stack

Next.js (App Router, static export) · Tailwind CSS · gray-matter + zod ·
next-mdx-remote · self-hosted Spectral & IBM Plex Mono (OFL). Zero runtime
framework JS in the browser.
