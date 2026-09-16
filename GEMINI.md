# F4C Design System — Master Reference

Paste this whole file at the top of any prompt building a new F4C page.
Every page must follow it exactly. Do not introduce new colors, fonts,
radii, or component patterns without checking here first.

## Identity in one line
A vault/archive for uncompressed creator files — feels like a light table
or a well-run technical tool, never a photo-sharing blog, never a raw
terminal/server dashboard. System chrome can speak in monospace brackets.
Anything a human has to read or decide on speaks in plain, warm language.

---

## 1. Tokens

```css
--ink: #0a0a0a;
--paper: #ffffff;
--border: #dcdcd7;
--hover-fill: #f6f6f4;
--muted: #71716b;
--placeholder: #a8a8a1;
--grid-line: rgba(10,10,10,0.045);
--radius: 2px;
```

No other colors. No shadows. No gradients except the background grid below.
If a state needs emphasis, use border weight/color or fill — never a new hue.

## 2. Background (every full page)

```css
html, body {
  min-height: 100vh;
  margin: 0;
  background:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px),
    var(--paper);
  background-size: 28px 28px;
}
```
This is site-wide, not scoped to a card. Every page gets it — homepage,
login, submit, settings, 404, all of it.

## 3. Fonts — the rule that matters most

Two families. Each has ONE job. Never swap them.

- **Space Grotesk** (500/600/700) — headings, body copy, anything a person
  reads to understand or decide something. This is the "human voice."
- **IBM Plex Mono** (400/500/600) — labels, tags, counts, buttons, form
  field labels, small system metadata. This is the "system voice."

**The test before writing any text on a page:** is this something a
creator or fan needs to *read and understand* (a heading, a sentence, an
explanation)? → Space Grotesk, plain words, no underscores, no ALL_CAPS.
Is this *chrome* (a button, a tag, a byte count, a resolution)? → Plex
Mono, can use brackets and lowercase_underscores.

**Never put a whole page's primary heading in bracket-monospace.**
`[ CREATOR_AUTHENTICATION ]` as an h1 is a system-voice heading doing a
human-voice job — this was the direct cause of the overflow bug on the
login page, and it also reads cold/intimidating. Headings say "Publish a
master file," not `VAULT_INGESTION_ENGINE`. Save the bracket motif for a
small tag near the heading, not the heading itself.

## 4. Signature devices (use these, don't invent new ones)

- **Filled black square (7×7px, `.sq`)** — the one recurring mark. Used as:
  the dot before "F4C" in the logo, a bullet before an eyebrow line, and a
  "verified creator" marker next to handles. Never used decoratively
  beyond these three roles.
- **Bracket-monospace buttons and tags** — `[ continue_with_google ]`,
  `[ publish to vault ]`, `[ phase 2 · submit ]`. This is the one place
  system-voice styling is *earned* — primary actions and small corner
  tags. Don't apply it to more than one or two elements per screen or it
  stops feeling deliberate and starts feeling like a config file.
- **Hairline borders everywhere, radius 2px.** No pills, no rounded
  cards, no drop shadows for elevation — use a 1px border instead.

## 5. Core components

**Buttons**
```css
.btn-solid   { background: var(--ink); color: #fff; border: none; }
.btn-outline { background: #fff; border: 1px solid var(--border); color: var(--ink); }
/* both: padding 11px 18px, radius 2px, font-size 13.5px, font-weight 500 */
```
Primary submit actions may use the bracket-mono treatment
(`[ send_magic_link ]`) — reserve this for the ONE main action per screen.

**Cards**
```css
.card { background: #fff; border: 1px solid var(--border); border-radius: 2px;
        padding: 32px; display: flex; flex-direction: column; gap: 18px; }
```
Any standalone form/modal card is centered on the full viewport:
```css
.page-wrapper { min-height: 100vh; display: flex; align-items: center;
                justify-content: center; padding: 24px; }
```
Card max-width 440–560px depending on content. Never let a card float
off-center or sit small in a huge void — always centered with real
padding, never touching the viewport edge.

**Inputs**
- Underlined field style for search/inline inputs (thin bottom border only).
- Boxed field style (1px border all sides, radius 2px) for form inputs
  inside cards. Label above in Plex Mono, small, muted color.
- Never fill an input or its container solid black — a black fill reads
  as an error or a disabled/loading state, not a normal field.

**Selection states (tabs, tier choices, filters)**
- Selected = ink-colored border + `--hover-fill` background tint.
- Never selected = solid black fill on something the user picks between
  multiple times (that's what "loading/disabled" should look like, not
  "chosen"). Reserve solid black fill for single committed actions
  (primary submit button) only.

**Category/filter lists**
- Use the ledger-tab pattern: horizontal text items with a live count in
  Plex Mono, underline for the active item. Never rounded pill chips —
  that's the one thing explicitly banned, it's the generic SaaS/Unsplash
  default this whole system exists to avoid.

**Asset grid**
- Fixed-ratio contact-sheet grid, not variable-height masonry.
- Metadata (handle, resolution, tier) is permanently visible in a caption
  bar under each tile — never hidden behind hover-only reveal.
- Each tile gets a small frame index tag, e.g. `[F014]`.

## 6. Copy voice rules

- Headings and body text: plain sentence case, real words. "Publish a
  master file," not "VAULT_INGESTION_ENGINE." "Access your vault," not
  "CREATOR_AUTHENTICATION."
- System tags/labels only: lowercase_with_underscores or brackets, small
  and secondary — never the biggest text on the screen.
- Every form or flow should have one plain-language reassurance line
  near the primary action (e.g. "You can edit this anytime after
  publishing") — friendliness lives in these small human touches, not in
  softening the whole visual system.

## 7. Anti-patterns — never do these

- Rounded pill filters/buttons (the Unsplash/generic SaaS default this
  whole identity was built to avoid).
- Masonry grid with hover-only metadata reveal.
- A page's main heading set entirely in bracket-monospace — causes both
  overflow bugs and a cold, unfriendly first impression.
- A form card floating small and off-center in a large empty page.
- Solid black fill as a "selected" state for anything pickable more than
  once (tiers, tabs, filters) — black fill = committed action only.
- Any new color, shadow, or font beyond what's listed above.
- Missing the site-wide graph-paper background on any full page.

## 9. Errors & validation

1. Never use red, pink, or any color outside the existing token list for
   error states. Urgency is communicated through the border weight and
   the square marker, not color.
2. Never write error text in ALL_CAPS or bracket-monospace — it's a
   message a human needs to read and act on, so it's plain Space Grotesk
   sentence case, same as any other heading/body text on the site.
3. When multiple things are wrong (e.g. missing file AND missing title),
   list them separately in a `ValidationBanner` instead of concatenating
   them into one line.
4. For a single field-specific problem, use `FieldError` directly under
   that field instead of a banner.
5. An invalid input gets a 1.5px `--ink` border, not a red outline or red
   background tint.

## 8. Before shipping any new page, check

- [ ] Background grid applied to `html, body`, not just the card
- [ ] Card centered vertically + horizontally with real padding
- [ ] Heading is Space Grotesk plain language, not monospace/underscored
- [ ] Only one bracket-mono primary action on the screen
- [ ] No pill-shaped filters or buttons anywhere
- [ ] No solid-black "selected" state on multi-choice elements
- [ ] Test at 320px width — nothing overflows its container
