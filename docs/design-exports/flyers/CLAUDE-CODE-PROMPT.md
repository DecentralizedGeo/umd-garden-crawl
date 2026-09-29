# Claude Code prompt — Garden Crawl ledger letter

Copy everything below the line into Claude Code (or a Claude Code `/frontend-design` session) with `docs/design-exports/flyers/` as the working folder.

---

You are refining a **print flyer**, not a website and not a new brand.

Work only in:

- `docs/design-exports/flyers/garden-crawl-ledger.html`
- `docs/design-exports/flyers/weber-memorial.jpg`
- `docs/design-exports/flyers/proofmode-mark.svg`

Open the HTML in a browser. There are two 8.5×11 letter artboards in one file: **dark** (site default) and **light** (copier-friendly). They must stay the same layout. Theme is a token swap (`data-theme="dark" | "light"`), not two different designs.

This HTML was exported from an approved Cursor canvas schematic (400px wide = 8.5in). CSS uses `--u: calc(8.5in / 400)` so `calc(N * var(--u))` is one schematic pixel. Prefer keeping that scale unless a size is clearly unreadable on paper.

## Job of the sheet

Hallway / lab conversion. Someone should read: claim → specimen (this is a real verified capture) → how to capture (ProofMode) → where to learn more (event URL). The website already carries rules, prizes, and setup. Paper does not replace the site.

## Locked copy (verbatim)

Do not rewrite, shorten, or add marketing language.

- Kicker left: `CAMPUS WIDE EVENT`
- Kicker right: `Open to the UMD Community`
- Claim: `Real Places.` / `Real Moments.` / `Verified.` (`Verified.` is the accent line)
- Invite: `Join the UMD Garden Crawl`
- Dates: `01–31 Oct 2026`
- Dek: `Take part for a chance to win gift-card prizes while helping build a trusted record of UMD’s living landscape.`
- Card rows:
  - garden: `Weber Memorial Garden`
  - time: `18 Aug 2026  ·  12:16 EDT`
  - coordinates: `38.99070,  −76.94155`
  - wallet: `0xbEd1…d5cE`
  - proofset_cid: `bafybeigy6…u3xpla`
  - uid: `0x44225f…3591e5`
- Chip: `VERIFIED` (uppercase) with green dot
- Link: `Verify on ProofCheck` → `https://check.proofmode.org/#bafybeigy6ysecknnlqk5qkfxsv2z7mxahjqyvp3xbvinlaqosrcou3xpla`
- Capture lockup: `Capture with` / `ProofMode` / `proofmode.org`
- Participate: `Details on how to participate` / `gardencrawl.easierdata.org`

## Locked layout

Top to bottom, one column:

1. Kicker (campus-wide + audience on one line, nowrap)
2. Claim left, invite + dates right
3. Dek
4. Specimen card fills leftover height
5. Two-pane footer: ProofMode lockup | participate URL

Specimen card:

- Spec rows **left**, photograph **right** (~38% width)
- Photo may hang off the right edge of the card (`width: calc(100% + 22 * var(--u))`). Do not clip the spec rows; clipping the photo at the sheet trim is OK
- Spec rows + VERIFIED / ProofCheck footer share leftover card height (`flex: 1 1 0`)
- Accent color on coordinates, wallet, proofset_cid, uid, and the two URLs

Ledger sprockets on the left edge + hairline inset. Keep them; they are the paper’s only ornament.

## Locked constraints (defects if you break them)

- Format: US Letter, 8.5×11, portrait, `@page { size: letter; margin: 0 }`
- No QR code
- No site graph-paper grid
- No word “Free”
- No prize dollar amounts
- ProofMode is a **capture lockup** (official mark + name + proofmode.org). Never “required”, never a warning
- Do not look like a screenshot of the website. Same type and tokens, different object (a letter)
- No gradients, no box-shadows on the sheet, no rounded cards, no emojis, no extra illustration
- Type: **Archivo** for prose/headings, **IBM Plex Mono** for labels and machine values. Monospace is semantic (spec keys, CIDs, URLs, chip), not decoration
- Color: only the campaign tokens already in the file (from `docs/design-system.md` / `src/components/BaseHead.astro`). Dark `--ok` is `#6fc79b`; light `--ok` is `#2f6b4d`. Do not invent a third palette
- Dark and light markup must stay identical. Change tokens, not structure
- Do not add a third artboard, a mobile layout, or website chrome (nav, theme toggle, etc.) except the existing screen-only print toolbar

## Free to refine

This is the actual design work:

- Optical spacing, type size, and tracking so the letter reads at arm’s length and the spec rows stay fully visible
- Hairline weight, inset vs. trim, sprocket size
- VERIFIED chip (must stay a mint/ok outlined pill with a filled 5px-class dot, uppercase)
- Photo crop / hang amount so the swallowtail still reads
- How the card fills leftover height without looking sparse or cramped
- Light theme on a cheap copier: toner, contrast, whether dark fills survive. Do not invert the layout to solve this
- Print CSS (background graphics, breaks). Keep one sheet = one page

## How to work

1. Edit the HTML/CSS in place. Do not rebuild in React, Tailwind, or a new file unless asked
2. Preview at actual letter size, then print to PDF
3. Check **both** themes after every visual change
4. If a change needs more than tokens, duplicate it in both `.sheet` trees
5. If you replace `weber-memorial.jpg`, keep the swallowtail at Weber Memorial Garden. The current file is 720×540 and is **placeholder resolution** — swapping a higher-res original of the same frame is encouraged
6. Do not change ProofMode mark colors; it is the official SVG

## Done when

A printed PDF of each theme is one letter page, all locked copy is present, the photo and spec rows share one card, the footer is two panes, and nothing from the “locked constraints” list has crept back in.
