# UMD Garden Crawl Campaign Website

Domain glossary for the public campaign website for the UMD Garden Crawl event (Oct. 9th - Nov. 8th, 2026). The site explains the event and links out to Proofmode (Capture) and a separate Public submission map (display of Observations). An embedded Garden reference map on `/explore/` is a visual of official Gardens, not a submissions viewer. This website does not process Submissions, media, or blockchain transactions.

## Language

**Capture**:
The photo and its associated evidence bundle that Proofmode creates at the moment of shutter-press, before any attestation or upload has completed.
_Avoid_: Photo (when precision matters), observation (too early a stage for this word)

**Submission**:
A Capture once it has an on-chain Attestation and has entered the review lifecycle (Needs review → Approved/Rejected). This is the unit the event's submission rules and categories are defined against.
_Avoid_: Capture (once attested), entry

**Observation**:
Not a separate lifecycle stage — the public-facing word for an Approved Submission as displayed on the map.
_Avoid_: Submission (when specifically talking about public display)

**Garden**:
A named location entity sourced from the ArcGIS `CampusGardensCentroids` / `CampusGardens` feature layers. Both the `Garden` and `Courtyard` facility types in that data count as Gardens for this event — the facility-type distinction is a UMD data-stewardship artifact and is never surfaced to participants.
_Avoid_: Garden area (ambiguous with Submission area), location

**Submission area**:
The eligibility boundary polygon associated with a Garden, used by the Public submission map application's backend to determine whether a Capture's location qualifies. This website may explain that it exists and why it matters; it does not render, store, or evaluate Submission areas.
_Avoid_: Garden area, garden boundary

**Provisional (rule or fact)**:
Any published rule, threshold, or fact whose final value is still pending organizer/event-governance approval (e.g. eligibility wording, prize amounts, the Daily Visitor threshold). Provisional facts still ship in the initial build, visibly marked, and are swapped for final values later without restructuring the page.
_Avoid_: Draft, TBD

**Attestation**:
A structured on-chain claim connecting a Capture with its verification metadata (location, cryptographic signature, Proofset).
_Avoid_: Record (too generic), transaction (that's the technical mechanism, not the concept)

**Proofset**:
The bundle of cryptographic evidence and metadata Proofmode generates alongside a Capture. Borrowed directly from Proofmode's own vocabulary; not redefined here.

**Wallet address**:
The persistent, pseudonymous public identifier associated with a participant's Attestations. Displayed in full on the public map; never linked to a participant's name, email, or phone number.
_Avoid_: Wallet identity, account, user ID

**Location Protocol**:
The specification for portable, signed location records that Proofmode uses so an Attestation can carry a checkable place-and-time claim bound to Capture media. This website does not implement the protocol.
_Avoid_: location proof (when you mean the spec), Location Attestation (as a second event term)

**CID**:
A content identifier: an address derived from the bytes of Capture media or related Proofset files on IPFS.
_Avoid_: hash (when you mean the public address a checker uses), filename, URL (when you mean the CID)

**Garden reference map**:
A separately built ArcGIS Instant App of official Gardens and the event's geographic extent, embedded on `/explore/` in place of a per-garden table. It does not display Submissions, Observations, or Submission areas.
_Avoid_: "The map" (ambiguous — say which one), submission map, garden table

**Public submission map**:
The separate application (explicitly out of scope for this website to build) that displays participant Submissions/Observations, applying geographic, review, and blacklist filters, and that owns the public explanation of Submission lifecycle, those filters, and that map visibility is not blockchain deletion. Linked from `/explore/` and the homepage View submissions CTA when its URL is configured.
_Avoid_: The map (ambiguous), map application
