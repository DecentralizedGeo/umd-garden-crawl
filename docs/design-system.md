# Design system — UMD Garden Crawl campaign website

Status: **design locked, implementation not started.** This document is the written form of
the design prototype. It exists to be grilled (`/grill-with-docs`) and then turned into an
implementation spec that subagents work from.

Vocabulary is the repo glossary (`CONTEXT.md`): Capture, Submission, Observation, Garden,
Submission area, Provisional, Attestation, Proofset, Wallet address, Garden reference map,
Public submission map. Any copy or component name that invents a synonym is a defect.

## 0. Source of truth and what this replaces

**Visual source of truth:** the design canvas, artifact
`0720ac17-62d0-4d61-b5c9-3224579de5dc`, page 1 ("Converged design"). Seven artboards:
`Main` (Home, desktop, dark), `HomeLight` (Home, desktop, light), `HomeMobile`,
`Participate` (desktop), `ParticipateMobile`, `Help` (desktop), `HelpMobile`. Every number in this document was lifted from
those files rather than rounded to a grid — where they disagree with this text, the artboards win
and this text is the bug.

**What already exists in this repo.** `src/` holds a working Astro build of all eleven routes
with a different, earlier visual system: `Archivo Black` display + `Source Serif 4` headings +
`IBM Plex Sans` body, a light-only palette on `#f5f8f9`, and `--color-*` / `--step-*` /
`--space-*` tokens defined in `src/components/BaseHead.astro`. Components `Card`, `Callout`,
`Provisional`, `PartnersBanner`, `ExternalLink` and `BaseLayout` exist and are wired.

**So this is a re-skin, not a greenfield build.** The routes, content collections, the
`Provisional` mechanism and the copy stay. The token block, the type system, the layout frame
and the component visual anatomy are replaced. Section 10 lists the delta explicitly.

## 1. What the design is arguing

The page's whole claim is *checkable by anyone, not just by us*. Every design decision is
downstream of that:

- Real Attestations appear above the fold, with their uid, proofset CID and coordinates shown
  in full-fidelity monospace and hyperlinked to the third-party services that verify them
  (Filebase, EAS, ProofCheck). The evidence is the hero image, not a stock photo of a garden.
- The verification chain is explained in four stages, and each stage shows the actual payload
  it produces — a signed bundle, a CID string, a transaction, a passing check — rather than an
  icon and a sentence.
- Typography is technical without being cold: one grotesque for prose and headings, one
  monospace reserved strictly for machine-generated values and small labels. Monospace is a
  semantic signal here, not decoration (§3.3).
- Restraint everywhere else. One accent. Hairline rules instead of shadows. No gradients, no
  rounded cards, no illustration.

## 2. Layout frame

### 2.1 Page container

| Context | Value |
| --- | --- |
| Desktop page frame | `max-width: 1760px`, `margin-inline: auto`, `border-inline: 1px solid var(--border)`, `box-sizing: border-box` |
| Mobile page frame | `max-width: 560px`, `width: 100%`, same centring and hairline edges |
| Desktop section gutter | `48px` |
| Mobile section gutter | `18px` |

The frame is applied once, on the outermost element inside `<body>`, and every section lives
inside it. This is load-bearing: without it the hero's text column and the Submission card are
each pinned to a viewport edge, and on a 2560px display roughly 900px of nothing opens between
them. The hairline edge is what makes the cap read as deliberate rather than as an accident of
window size.

Two secondary caps exist inside the frame:

- `.wrap { max-width: 1600px; margin-inline: auto }` — prose sections, so body copy stops
  widening before it becomes a ribbon.
- Reading measures: body prose `74ch`, hero paragraph `54ch`, the four-point checklist `68ch`,
  hero `h1` `20ch`.

### 2.2 Breakpoint

**One breakpoint, and its value is not yet decided** (§11). The prototype was authored as two
separate artboard families (desktop and 390-wide mobile) rather than one fluid page, so the
switch point was never exercised. `900px` is the working assumption because that is where the
hero's `1fr + 560px` two-column grid stops having room for a `54ch` paragraph.

### 2.3 Vertical rhythm

Section padding is deliberately uneven — the design uses asymmetric top/bottom padding to make
sections read as stacked plates rather than evenly spaced blocks. Desktop values as built:

| Section | Padding |
| --- | --- |
| Hero | `84px 48px 78px`, grid row `align-items: center` |
| How it works | `64px 48px 68px` |
| Categories | `76px 0 0` (rows carry their own `30px 48px`) |
| Collaborators | `30px 0 34px` |
| Privacy / caveats | `76px 48px 84px` |
| Footer | `24px 48px 30px` |

Mobile: `34px 18px 32px` (hero), `30px 18px 32px`, `34px 18px 34px`, `32px 18px 30px`,
`24px 0 26px`, `34px 18px 40px`.

Every section except the last carries `border-bottom: 1px solid var(--border)`. There are no
shadows anywhere in the system.

## 3. Foundations

### 3.1 Color

Dark is the default theme. Light is a complete alternate token block over identical markup —
no component has a theme-specific rule.

**Dark**

```css
--bg: #0b1015;          --surface: #0e151b;
--border: #1c2a33;      --border-2: #24333d;      --rule: #1a262e;
--text: #e4ecf0;        --text-2: #a8bcc6;        --text-3: #93a7b1;   --text-4: #5f7b88;
--accent: #7ed4e2;      --accent-solid: #1f7a8c;  --accent-on: #ffffff;
--accent-soft: rgba(31, 122, 140, 0.16);
--ok: #6fc79b;          --ok-soft: rgba(79, 158, 119, 0.14);
--warn: #d9b070;        --warn-strong: #f0d9a8;   --warn-soft: rgba(184, 138, 46, 0.09);
--grid: rgba(126, 212, 226, 0.07);
```

**Light**

```css
--bg: #f6f3ec;          --surface: #ece7db;
--border: #ccc3ae;      --border-2: #cfc5ae;      --rule: #e0d9c8;
--text: #14100b;        --text-2: #3c362b;        --text-3: #5c5445;   --text-4: #8a8272;
--accent: #1a6a79;      --accent-solid: #1f7a8c;  --accent-on: #ffffff;
--accent-soft: rgba(31, 122, 140, 0.10);
--ok: #2f6b4d;          --ok-soft: rgba(63, 122, 92, 0.12);
--warn: #8a4b2a;        --warn-strong: #6d3a1e;   --warn-soft: #f8f2e6;
--grid: rgba(20, 16, 11, 0.05);
```

Token roles, so nobody has to guess: `--bg` page ground; `--surface` raised plates (header,
footer, cards, collaborator band); `--border` structural section rules; `--border-2` component
outlines; `--rule` hairlines inside a component; `--text` → `--text-4` a four-step de-emphasis
ramp; `--accent` links and interactive text; `--accent-solid` filled buttons and the brand
mark; `--ok` the Attested state; `--warn` the Provisional / notice state.

Two deliberate choices worth defending under grilling:

- `--accent-solid: #1f7a8c` is the brand teal and is carried unchanged into both themes, but on
  warm paper it lands at about 4.4:1 — under AA for body text. So light theme sets
  `--accent: #1a6a79` for *text* links while filled buttons keep the true `#1f7a8c` with white
  text, which does pass. Dark theme uses `#7ed4e2` for text and `#1f7a8c` for fills.
- `.grid-bg` paints a 48px graph-paper grid from `--grid` behind the hero only. It is the one
  decorative surface in the system.

### 3.2 Type

Two families, both from Google Fonts as currently authored:

- **Archivo** (400, 500, 600, 700) — headings and prose. Fallback
  `'IBM Plex Sans', system-ui, sans-serif`.
- **IBM Plex Mono** (400, 500, 600) — labels and machine values. Fallback
  `ui-monospace, monospace`.

This replaces the three-family stack currently in `BaseHead.astro`. Archivo Black and Source
Serif 4 are dropped.

Ramp as built (fluid values are `clamp(min, preferred, max)`):

| Role | Value | Notes |
| --- | --- | --- |
| Body | `clamp(1rem, 0.9565rem + 0.2174vw, 1.125rem)` / `1.6` | identical to the existing `--step-base`; keep the token |
| Hero `h1` | `clamp(2.75rem, 1.8rem + 4.6vw, 4.5rem)` / `1.0` / `-0.03em` | mobile `clamp(2.375rem, 2rem + 2vw, 3rem)` |
| Page `h1` (Participate) | `clamp(2.5rem, 1.9rem + 3vw, 3.75rem)` / `1.02` / `-0.03em` | mobile `clamp(2.25rem, 1.95rem + 1.6vw, 2.875rem)` |
| Section `h2` | `clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)` | mobile `1.75rem` |
| Sub `h2` | `clamp(1.625rem, 1.35rem + 1.3vw, 2.25rem)`, step `h2` `1.875rem` | |
| Card `h3` | `1.1875rem` / 600 / `-0.015em` | |
| Lead paragraph | `clamp(1.125rem, 1.038rem + 0.4348vw, 1.375rem)` / `1.55` | `--step-md` today |
| Secondary prose | `1.0625rem` | the workhorse size |
| Small prose / captions | `0.9375rem` | dominant on mobile |
| `.mono` label | `0.6875rem`, `0.11em`, uppercase, 500 | eyebrows, chips, nav, footer |
| `.data` value | `0.875rem`, `0.01em`, 500 | uid, CID, coordinates, timestamps |
| Button label | `0.8125rem`, `0.08em`, uppercase, 500, mono | |

Headline tracking tightens as size grows (`-0.015em` → `-0.03em`); mono tracking opens
(`0.01em` for values, `0.11em` for labels). That inversion is the system's signature and should
survive any retuning.

### 3.3 The monospace rule

`.data` is reserved for values a machine produced and a human may need to copy or verify: uids,
CIDs, wallet addresses, coordinates, timestamps, status strings. `.mono` is reserved for
labels, eyebrows and navigation. Prose is never monospace. A subagent that reaches for mono to
make something "look technical" is violating the system.

Truncation of long values is by explicit head/tail slice with an ellipsis — `0x9ff0ae…e77ab9`
(8 head / 6 tail for uids, 10 / 6 for CIDs, 6 / 4 for wallet addresses) — never CSS
`text-overflow`, because the head and tail are the parts a person checks against another screen.

### 3.4 Motion

Almost none, and all of it opt-out:

- Collaborator marquee: one continuous `translateX(0 → -50%)` over `38s linear infinite` on a
  duplicated track, disabled under `prefers-reduced-motion: reduce`.
- Submission carousel: auto-advances every `7000ms`, disabled under
  `prefers-reduced-motion: reduce`, and permanently held the moment a viewer touches an arrow or
  a dot.
- Hover/focus transitions: `border-color`, `background`, `0.15s ease`. Nothing else animates.

## 4. Components

Each entry gives anatomy, states and the values as built. All are plain markup plus CSS unless
the entry says otherwise.

### 4.1 Announcement strip

Full-bleed `--accent-solid` band above the header, `--accent-on` text, mono. Carries a live dot,
the submission window (`01 Oct → 31 Oct 2026`), and one underlined link to the walkthrough.
Scrolls away — it is not sticky. Mobile drops the link and the divider, keeping the dot, the
label and a compressed date range.

### 4.2 Header

`position: sticky; top: 0; z-index: 20`, `--surface` background, `border-bottom` on `--border`,
padding `16px 48px`. Left: brand mark (a 22px check-in-square SVG in `--accent`) plus wordmark
at `0.9375rem`/700. Centre: six mono nav links. Right: a theme toggle and a filled Participate
button.

Mobile: `12px 18px`, brand mark at 19px, and a single 44×44 hamburger. **The mobile menu's open
state was never designed** (§11).

### 4.3 Buttons and the CTA pair

- **Primary** — `--accent-solid` fill, `--accent-on` text, mono `0.8125rem`/`0.08em`/uppercase,
  padding `15px 24px`, a 14px arrow glyph, square corners.
- **Secondary / disabled-state chip** — `1px solid var(--border-2)`, `--text-3` text, same
  metrics, used for "Public submission map — coming soon" with a clock glyph. It is not a link
  and must not be marked up as one.

The hero pairs them on one row (`gap: 16px`, wrapping) on desktop and stacks them full width on
mobile with `min-height: 52px` / `48px`.

### 4.4 Stage tab (`.box`) and payload panel

The glass-to-glass explainer. Four `.box` buttons in a row with 44px arrow gutters between
them (`grid-template-columns: 1fr 44px 1fr 44px 1fr 44px 1fr`), and one payload panel beneath.

`.box`: `min-height: 122px`, `padding: 20px 22px 22px`, `1px solid var(--border-2)`,
`--surface` fill, `gap: 16px`, `transition: border-color 0.15s, background 0.15s`.
Hover raises the border to `--accent-solid`; `:focus-visible` gets
`outline: 2px solid var(--accent); outline-offset: 2px`.

**The selected box is a tab, not a highlighted box.** It takes the panel's fill, drops its
bottom border, and the panel's top edge — drawn as `.tab-rule`, a 2px grid on the same column
template — omits the segment underneath it, so the two shapes become one continuous form. This
is the single most fragile piece of the design and the easiest to get subtly wrong.

Panel: `.panel-grid` is `minmax(0, 1fr) 520px` with `48px` gap, prose left and payload right.
Prose carries a two-column `.points` checklist capped at `68ch`. Payload is `.spec` — a bordered
block on `--bg` with a `.spec-head`, `.spec-row` lines (`11px 16px`, `--rule` separators,
label left / value right in `.data`), and a `.spec-foot` on `rgba(31,122,140,0.07)`. Every
stage has a payload, so the panel height barely moves between stages.

Default open stage is **04 · Verify**.

Mobile: the same four stages become a vertical accordion. The open row loses its bottom border
and shares the panel's fill — same tab logic, rotated.

### 4.5 Submission carousel

The component the page is built around.

Anatomy, top to bottom: head (`Verified submissions` label, `n / 5` counter, prev/next 30×30
buttons) → photo stage → dot rail → six data rows → foot.

- `.carousel`: `max-width: 400px` desktop, `420px` and centred on mobile; `1px solid
  var(--border-2)` on `--surface`. The cap is deliberate — it does not grow with the viewport.
- `.car-stage`: `aspect-ratio: 4 / 3` **and** `max-height: 300px`, `overflow: hidden`, images
  absolutely positioned with `object-fit: cover`. Both constraints are needed; ratio alone let
  the card grow quadratically with width.
- All five frames are inlined and swapped by `display`, so advancing never fetches and never
  flashes.
- Dots are 26×20 hit areas containing a 3px bar; active `--accent`, inactive `--border-2`.
- Rows, in fixed order: `garden`, `time`, `coordinates`, `wallet`, `proofset_cid`, `uid`.
  `time` is the **capture moment** (`event_timestamp`), not the attestation block time, and is
  rendered in `America/New_York`. Coordinates to five decimals. `proofset_cid` links to
  `https://ipfs.filebase.io/ipfs/<cid>`; `uid` links to
  `https://sepolia.easscan.org/attestation/view/<uid>`.
- Foot: an `--ok` "Attested" chip on `--ok-soft`, and a "Verify on ProofCheck →" link to
  `https://check.proofmode.org/#<cid>`.

**Mobile placement differs by design:** on desktop the carousel lives in the hero's right
column; on mobile it is its own section directly after the hero, under a
"From the collection / Verified submissions" heading.

### 4.6 Index rows (categories)

Categories are full-bleed numbered index rows, not cards.
`grid-template-columns: 96px 340px 1fr`, `gap: 32px`, `align-items: baseline`,
`padding: 30px 48px`, `--rule` separators, no border on the last. The 96px column holds a mono
ordinal. Mobile collapses to a `34px 1fr` grid at `18px 0`.

This supersedes the current `Card` component for this use. Whether `Card` survives anywhere
else is open (§11).

### 4.7 Provisional

Unchanged mechanism, new treatment: `text-decoration: underline dotted var(--accent) 1.5px`
with `text-underline-offset: 3px`, plus a `†` in `--accent`/600 appended via `::after`. It
wraps inline or block content at the field level, as already decided in the prior ADR — the
whole paragraph is never wrapped, only the unresolved value.

**Open:** the `†` has no dagger footnote anywhere on the page (§11).

### 4.8 Notice

Warm-tinted full-bleed band: `rgba(184, 138, 46, 0.1)`, `border-left: 3px solid #b88a2e`,
`border-bottom` on `--border`, and the same `208px 1fr` grid as the step rows so it aligns with
them. Used for the two warnings in the Participate walkthrough.

### 4.9 Collaborator marquee

`--surface` band, mono label above, one continuously rotating track of collaborator wordmarks,
duplicated for a seamless loop. See §3.4 for motion and the reduced-motion behaviour.

### 4.10 Step row and progress rail (Participate)

`.row` is a full-bleed `208px 1fr` grid, `gap: 40px`, `padding: 44px 48px 46px`, separated by
`--border`. The 208px column holds a mono step ordinal and label; the content column holds an
`h2` at `1.875rem` and prose capped at `74ch`.

Above them, a seven-segment progress rail sticks under the header (`top: 73px`) and highlights
the step currently being read. It is driven by an `IntersectionObserver` with
`rootMargin: '-150px 0px -55% 0px'`, and degrades to "stays on step 01" if the API is missing.

Mobile drops the rail and the label column; steps become stacked `.step` sections.

### 4.11 Footer

`--surface`, `border-top` on `--border`, `padding: 24px 48px 30px`, mono throughout: event name
and dates left, three links right (About / How it works / Privacy).

### 4.12 FAQ accordion

Native `<details>` / `<summary>`, no script — this is the component the earlier ADR asked for,
and the only interactive thing on the site that keeps that promise.

`.faq` wraps a group with `border-top: 1px solid var(--rule)`; each `.q` carries a matching
`border-bottom`. `summary` is a flex row, `padding: 16px 0` (58px tall — over the 44px target),
`1.0625rem`/600, with `list-style: none` and `::-webkit-details-marker { display: none }`.
Hover and `[open]` turn the question `--accent`; `:focus-visible` gets the standard
`2px solid var(--accent)` outline.

The marker `.mk` is a 22×22 bordered square in mono carrying `+`, swapping to `−` (`\2212`) and
`--accent-solid` / `--accent` when open. Answer: `.a`, `--text-2`, `1.0625rem`/`1.6`, capped at
`74ch`, `margin-bottom: 20px`.

Deliberately quiet. The stage tab (§4.4) makes the selected item structurally continuous with its
panel because there are four of them; with twenty-six rows on one page, only the marker changes.
Mobile drops the summary to `1rem` and `15px 0`.

### 4.13 Jump chip

`.chip` — mono, `padding: 9px 13px`, `1px solid var(--border-2)`, `--text-3`, optional count in
`--text-4`. Hover and focus raise the border to `--accent-solid` and the text to `--accent`.
Used as an in-page category index above a long accordion. Mobile sets `min-height: 44px`.

### 4.14 State chip

Small mono pill, `padding: 4px 9px`, a 5px dot plus a word. Two instances exist: **Attested**
(`--ok` on `--ok-soft`) in the carousel foot, and **Provisional** (`--warn` on `--warn-soft`) in
the Help page's contact card. Same shape, different token pair — treat it as one component with a
`tone` prop rather than two.

## 5. Page composition — Home (`/`)

Desktop order:

1. Announcement strip
2. Sticky header
3. **Hero** — `grid-bg`, `minmax(0, 1fr) 560px`, `align-items: center`. Left: mono eyebrow
   (`Campus exploration event · College Park, MD`), `h1` "Every garden on campus, / *on the
   record.*" with the second line in `--accent`, a `54ch` lead paragraph, the CTA pair. Right: a
   `--surface` panel with `border-left`, `align-self: stretch`, holding the carousel.
4. **How it works** — eyebrow, `h2` "Glass-to-glass verification", a lead sentence, a
   "Full walkthrough →" link on the right, then the four stage tabs and the payload panel.
5. **Categories** — eyebrow "Compete", `h2` "Participate your way", four index rows
   (Garden Crawl Challenge, Daily Visitor, Explorer, Nature in Focus).
6. **Collaborators** — marquee band.
7. **Privacy and caveats** — a two-column `1fr 1fr` section with `60px` gap. This is the only
   place the home page discusses privacy; it must stay the only place.
8. Footer

Mobile order is the same with one change: the carousel is promoted out of the hero into its own
section between hero and how-it-works, and the four stages become a vertical accordion.

**Hero copy differs between desktop and mobile** — desktop runs the full three-sentence
paragraph, mobile runs a two-sentence compression, and the eyebrow shortens to
"College Park, MD". That is a content fork, not a CSS one, and needs a decision (§11).

## 6. Page composition — Participate (`/participate/`)

1. Sticky header
2. **Title block** — eyebrow "Walkthrough · 7 steps", `h1` "How to participate", a `56ch` lead.
3. **Progress rail** — sticky, seven segments.
4. **Seven step rows** — Install Proofmode / Sign in / Grant permissions / Find a Garden /
   Capture / Confirm the Submission / View on the Public submission map. Step 3 carries three
   sub-blocks (Camera / Location / Network access); step 7 carries two (Status / What the map
   shows). Two `Notice` bands sit between rows.
5. Footer

Mobile: no rail, no label column, `.step` sections stacked, notices full width.

**Note the step-count conflict.** The current `src/pages/index.astro` lists a six-step sequence
(Install / Find a garden / Visit during the event / Capture / Wait for verification / View on
the map). The design's Participate page has seven, differently named. One of them is wrong and
the grilling pass should settle which.

## 7. Page composition — Help (`/help/`)

The page's argument is *self-service first, contact second* — it is a support page whose job is
to stop most people needing support.

Desktop order:

1. Announcement strip, sticky header (Help marked current with an `--accent` underline)
2. **Title block** — reuses the home hero's grammar exactly: `grid-bg`, `minmax(0, 1fr) 560px`,
   `align-items: center`. Left: eyebrow "Help · 26 questions answered", `h1`
   "Most problems are *a setting away.*" with the second clause in `--accent`, a `54ch` lead, and
   two in-page CTAs ("Run the checks" / "Skip to the FAQ"). Right, in the `--surface` panel: the
   **official contact card** — a `.spec` block with a Provisional state chip, the contact value
   rendered with the `.prov` treatment because `siteConfig.supportEmail` is still `null`, a line
   of explanation, and a foot linking to Privacy.
3. **Six checks in Proofmode** — index rows (§4.6), `96px 340px 1fr`, ordinals 01–06, with a
   "Full Proofmode setup →" link in the section head.
4. **"Never send" notice** — full-bleed warn band on the Participate notice pattern (§4.8), so it
   cannot be skimmed past. Passwords, private keys, seed phrases, tokens.
5. **Two-column block** (`1fr 1fr`, `60px`) — "What to include in a support request" as a
   five-item `.point` checklist, beside "Media or privacy concern" prose ending in a link to
   Privacy.
6. **FAQ** — eyebrow, `h2` "Questions and answers", a "26 across 8 topics" count, a row of jump
   chips (§4.13), then eight category groups. Each group is a `208px 1fr` grid on the Participate
   step-row grammar: category name and question count in the label column, the accordion in the
   content column.
7. Footer

Mobile: same order, single column. The contact card is promoted out of the hero into its own
section directly after it — the same move the carousel makes on the home page. Category labels
become eyebrows above each group; chips wrap and grow to 44px.

**All twenty-six questions and answers are generated from `src/content/faq/faq.json`, not
retyped**, including the `{{...}}` span in "Who can participate?" which renders through `.prov`.
Any implementation should do the same.

## 8. Accessibility contract

- Focus is always visible: `outline: 2px solid var(--accent); outline-offset: 2px` on every
  interactive element. Nothing removes an outline.
- Mobile hit targets never below 44px. The hamburger is 44×44; primary CTAs are `min-height:
  52px`; carousel dots are 26×20 **and are therefore under target — a known defect** (§11).
- Contrast: light-theme text links use the darkened `#1a6a79` because the brand teal fails AA on
  warm paper. Filled buttons keep the true teal with white text. `--text-4` on `--bg` is the
  lowest-contrast pair in the system and is only ever used for non-essential labels.
- `prefers-reduced-motion: reduce` stops the marquee and the carousel auto-advance.
- The "coming soon" chip is not a link and carries no `href`.
- A skip link already exists in `BaseLayout` and stays.

Not yet specified: the carousel's live-region behaviour, the stage tabs' ARIA pattern, and the
mobile menu's focus trap (§11).

## 9. Data

The carousel renders five Attestations drawn from `attestations.json` (179 records; the five are
a hand-picked set). Fields consumed per record: `uid`, `attester`, `recipe_payload[0]`
(the proofset CID), `latitude`, `longitude`, `event_timestamp`, plus a garden name that **is not
in the source data** and is currently supplied by hand from the collection map.

Two consequences worth deciding on:

- Garden names have no machine source. Either the site ships a coordinate→Garden lookup against
  the ArcGIS `CampusGardensCentroids` layer, or the five records are hand-curated content.
- Thumbnails are currently cropped screenshots, not the media the CIDs point at. The real images
  are at `https://ipfs.filebase.io/ipfs/<media_data[0]>`, which is unreachable from the current
  build environment. Whether the build fetches and caches them, or they are committed as static
  assets, is unresolved — and the prior ADR says this site has no image ingestion pipeline.

Transcription risk is real and has already bitten: of five records eye-copied from screenshots,
one uid was wrong by a single character and all five timestamps were rendered in UTC while
labelled EDT. Any record shown on this page should be generated from the source file, never
retyped.

## 10. Delta against the current implementation

Replaced:

- `BaseHead.astro` token block — fonts, all `--color-*` values, and the introduction of a dark
  default plus a light alternate.
- `BaseLayout.astro` — gains the announcement strip, the page frame container, a sticky header
  with a centred nav and two right-hand controls, and the new footer.
- `Card.astro` — categories become index rows (§4.6).
- All eleven route templates — new section rhythm, gutters and type ramp.

Kept:

- Route structure, content collections, `Provisional`'s mechanism and `splitProvisional`,
  `ExternalLink`, `siteConfig`, the skip link, native `<details>` wherever the page is a plain
  FAQ.

New:

- Stage tab + payload panel, Submission carousel, index rows, notice band, marquee, progress
  rail, theme toggle.

## 11. Open questions — the grilling list

Ordered by how much downstream work they block.

1. **JavaScript budget.** The prior ADR settled "native `<details>/<summary>`, no UI framework". The converged design ships four JS-driven behaviours: the stage tabs, the auto-advancing carousel, the `IntersectionObserver` progress rail, and the theme toggle. Either the ADR is superseded or three of those need non-JS designs. This is the biggest unresolved decision in the document. I'm fine with using JS for the features that can't be implemented with css/html alone.  If any of the features can be implemented with css/html alone, we should do that. That's an exploration that we can do during implementation.  If it's identified that it's a hard design problem to implement, we need to discuss.
2. **Theme toggle.** The header shows a `LIGHT` control, but nothing decides whether the site is
   dark-by-default with a manual override, `prefers-color-scheme`-driven, or persisted — and if
   persisted, in what, given no analytics or storage decision exists. No need to worry about analytics. We can either default to dark mode and allow the user to toggle to light mode.  We can also use `prefers-color-scheme` to determine the default theme based on the user's system preference.
3. **The breakpoint.** One switch point, value unproven (§2.2). Also unresolved: whether the
   two hero copy variants and the carousel's two placements are one responsive template or two. Let's discuss the in clearer terms.
4. **Mobile menu.** Designed as a closed hamburger only. Open state, animation, focus trap and
   dismissal are all undesigned. That is something that we'll be able to build during implementation.  If it's identified that it's a hard design problem to implement, we need to discuss.
5. **Eight undesigned routes.** Home, Participate and Help exist as artboards. Gardens, privacy,
   submissions, about, ecosystem, compete and explore still need one — probably two archetypes
   (document page, index page) rather than seven designs. Help is arguably the third archetype
   already: hero-with-card, index rows, and a long accordion.
6. **The step-count conflict** between the design's seven steps and the implementation's six
   (§6). I would like to explore decreasing the number of steps to a smaller number.  We'll need to discuss that in more detail to identify what will work best.  For example, we redesign the "how it works" section on the updated home page to 4 "stages" that describes the glass-to-glass verfication process. So we can really refine that 6/7 step process to something that is more clear.
7. **Garden names and thumbnails** have no machine source (§9). No need to worry about if the actual garden names follow any of the downstream data sources.  No thumnails are necessary.
8. **The `†` has no footnote.** `Provisional` marks content with a dagger that leads nowhere.
   Either a per-page footnote or a tooltip is needed. We didn't have a footnote in the in the current build so we don't need to worry about adding a footnote.  We have are purely using that as a marker to indicate that the content is provisional and that it will be replaced with the actual content once it is available.  We don't need to worry about adding a tooltip either.
9. **Carousel dots are under the 44px target** (§8), as are the 30×30 prev/next buttons.
10. **Font delivery.** Both families load from Google Fonts today. Self-hosting is the usual
    call for a `.edu` campaign site with a privacy page; nobody has made it. I'm not sure if we need to worry about self-hosting the fonts and not sure why would need to do that.  We can use Google Fonts for now and if we need to self-host the fonts, we can discuss that later.
11. **Print.** No print stylesheet exists and nothing says whether one is wanted. No need to worry about print stylesheets.  That is not necessary.
12. **Two `h1` voices.** Home and Help make a claim ("Every garden on campus, on the record.",
    "Most problems are a setting away."); Participate is functional ("How to participate"). Both
    are defensible, but the rule for which pages get which is unwritten. The help page does not need a statement like the home page.  The help page is more functional and is designed to help the user find answers to their questions.  The home page is more of a marketing page that is designed to make a statement about the product and the company.
13. **The Help page's FAQ duplicates `/faq/`-shaped content** that the route list does not
    separately contain — `faq.json` is rendered only here. Confirm that is intended and that no
    standalone FAQ route is coming. I'm not sure I follow this question.  We merged the faq and support pages into one page on the `/help/` route.  So we don't need a separate faq page.
