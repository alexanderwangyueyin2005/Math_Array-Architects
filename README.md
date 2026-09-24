# Array Architects — v1 reference candidate

A dependency-free, embeddable mathematical playground. Evidence status: pending.

## Run / embed

With Node 18+: `npm start` (http://127.0.0.1:4173). Optional `PORT=4175 npm start`.
Run `npm run check` and `npm test`. No installation or runtime dependencies required.

Load scripts once, in this order:

```html
<script defer src="intervention-core.js"></script>
<script defer src="adaptive-engine.js"></script>
<script defer src="telemetry.js"></script>
<script defer src="array-architects.js"></script>
<array-architects></array-architects>
```

Shadow DOM isolates styles. The host owns width/navigation; the component owns its stage.
This is still the standalone implementation: it has **not** been mounted in the actual Logifera repository or Dyslexia Screener container.

## Shared boundary

`intervention-core.js` provides shared motion tokens, header, progress rail, local feedback markup, four-state guide glyph (neutral/attention/hint/complete), reduced-motion styles and a base learner shape. The game consumes the header, rail, feedback, glyph and motion helpers. It is a small utility core, not a general game framework.

The storage adapter remains injected into `Telemetry`: `getItem`, `setItem`, `length`, `key`. A future API adapter needs an explicit asynchronous persistence boundary. Adaptive policy stays behind `selectNextChallenge(learnerState, history)`.

Array-specific state, guide, conserving-token allocation, splitting, partial validation, recombination, inverse reveal and challenge definitions remain in their existing files. Stage/guide orchestration has intentionally not been extracted into a generic framework.

## Training and transfer

Six training items remain available, without repeats in a session. Six completed training challenges lead to a separate Transfer Check, then Summary. The check uses a new factor pair (normally 8×7), initially without an array. Either 5×7 + 3×7 or 8×5 + 8×2 is accepted. A proportional area model appears after selection; row splits stack, column splits sit side by side. A small optional hint, retries and finishing without success are recorded separately. This is one near-transfer probe, not proof of durable mastery.

The engine declares five families and eight fixed safe training items, including 7×8 and 12×4 variants. Subsequent sessions can select the new strategy item after unsuccessful transfer or explore a ten-anchor after independent five-anchor evidence. Existing rules retain support-sensitive practice, independent progression and inverse priority; product recall with weak decomposition prioritizes strategy practice. Learner state persists when starting another session on this device.

Mastery: independent = 1, light support = 0.5, strong scaffold = 0.2. Automatic totals do not increase product recall. Submitted partial products are the only recall evidence. Transfer independence is separate from training gains. Time is recorded but never used for difficulty or mastery.

New metrics: decompositionUsing5, decompositionUsing10, supportDependence (fraction of completed training items with support), selfCorrection, nearTransfer, transferObserved and completedChallenges.

## Telemetry v3

The existing v2 storage-key namespace is retained so v2 sessions can be read without data loss; saved sessions use schema version 3. Existing CSV columns remain; additions include family, representation, anchor, policy, mastery before/after, structured decision reasons and transfer outcome/strategy/independence/hint/attempts. Transfer has its own summary and does not enter the six-item training history. CSV cells are quoted and formula prefixes, including whitespace/control-character variants, neutralized.

`challenge-complete` and `session-complete` are bubbling/composed DOM events. `element.getSession()` exposes the current session for host integration. Session tools exports local sessions. No backend requests occur.

## Validation for this finalization round

- `npm run check`: passed.
- `npm test`: **29 passed**, preserving all previous 19 tests.
- Browser: Intro, Guided Build, Guided Split, both equal-group builds, sharing/inverse, all three formal splits, Transfer and Summary completed across the resumed QA session.
- Wrong partial feedback cleared when edited; correct partials were required before Join.
- Reload restored formal challenge progress and the selected Transfer strategy/model.
- The second valid transfer strategy was accepted; Summary displayed independent transfer text.
- Session export button exercised; v3 contents and escaping covered automatically.
- Browser error log empty; laptop visuals and tablet Summary checked.
- Reduced-motion distribution progression is covered automatically. A full browser session with the OS reduced-motion setting was not run this round.

## Remaining acceptance gaps

This is a **reference candidate**, not full compliance with every requested finalization criterion:

1. Supported repeat training still uses the split-array representation. A genuinely different *training* representation after scaffold use remains to implement; the changed representation currently exists in Transfer.
2. The two additional safe family items have mathematical/selector tests but have not both received end-to-end browser QA. Ten-anchor is implemented; compensation is not.
3. Shared shell helpers are extracted, but a fully reusable guide/stage lifecycle and asynchronous storage interface remain game-specific/future work.

No blocking gameplay error was observed. Exact app integration, broader assistive-technology QA, and learner testing remain separate from this standalone delivery. Do not present the learner counters as clinical or validated mastery measures.

## Product UI pass — fixed viewport

The preview now uses a viewport-sized white shell (maximum width 1344px), a compact branded header, separate progress rail, flexible arena and a fixed 66px bottom action bar. Document scrolling is disabled in the standalone preview. Embedded hosts should provide an explicit available height, e.g. `<array-architects style="height:calc(100dvh - 32px)"></array-architects>`, and serve `logifera-icon.png` alongside the scripts.

Object identity, allocation and mathematical coordinates are preserved. Arrays with seven or more rows use a tighter 36px pitch; an arena ResizeObserver then fits the visual field into the remaining space using normal/dense/compact scale, capped at 65% minimum. Extreme layouts may scroll locally rather than making the document taller. The action bar stays outside this scrolling region. Long support content can also scroll locally on constrained screens.

Palette: white, #F7FAFA page, #2F5D7C primary blue, #6FA8A3 teal, #DCEEE8 mint and #E3ECEC borders. Existing tactile highlights and motion remain. The supplied circular logo is copied unchanged; no wordmark or medical efficacy claim was added.

This pass modified `index.html`, `array-architects.js`, `intervention-core.js` (presentation only), `server.cjs` (JPEG allowlist/MIME only) and this README; added `logo-circle.jpg`. Adaptive engine, telemetry, package scripts and tests were not changed.

Quick browser QA: guided build/split, 12- and 15-object allocation, 24-object sharing/inverse, 42-object formal split with wrong/correct feedback and Join, 48-object/eight-row layout. At 1366×768, body/document height = 768 and bottom actions end at y=751; the eight-row arena has clientHeight = scrollHeight = 257. At 1440×900, document height = 900. At 768×1024, document height = 1024 and actions end at y=1007. Logo loaded at its original 512px resolution. Console error log empty. `npm run check` passed and all 29 tests passed.

Deferred in this short pass: full small-phone/virtual-keyboard QA, 200% browser zoom, and replaying every Transfer/Summary branch under the new shell. Previous reference-candidate limitations above remain unchanged. The arena-only scrolling fallback is intentional for extreme density or very short windows.

## Release branding polish (2026-09-23)

Header and favicon now use the supplied, unmodified white-background `logifera-icon.png`. The image is proportionally contained without cropping and is decorative beside the visible brand name. Normal learner URLs hide Session Tools; use `?debug=1` to access the existing export tools. This is presentation hiding, not an access-control boundary.

Progress labels are Introduction, Guided practice, Practice n / 6, Transfer and Complete. `SESSION_LENGTH` centralizes the six core slots; no new variants or session-length changes were introduced. Sparse arrays receive bounded enlargement; dense arrays retain the existing viewport fit and local overflow fallback. Active surface, support, transfer and selected-state colors use the white/blue/teal/mint palette. Token highlights and contact shadows are softened.

Release QA: `npm run check` passed; `npm test` passed 29/29 without removing tests. Browser walkthrough completed Intro, Guided Build, Guided Split, all six training slots, inverse reveal, Transfer and Summary. Tested 1366×768, 1280×720 and 1440×900 across representative scenes: document height matched viewport height and bottom actions remained visible. The 48-object split field fit without local scrolling at 1280×720. Normal/debug visibility and export action were checked; browser error log was empty. Full cross-browser/mobile QA remains outside this polish pass.

## Product styling pass — Logifera Intervention UI

The current active UI follows the shared presentation rules in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). Brand/References were inspected; the supplied `Current Project` folder was empty, so this existing standalone implementation remains the edited source. The circle logo was verified byte-for-byte against the Brand source and remains unchanged.

Changed code: `intervention-core.js` (shared scoped palette, typography, controls, feedback, icons and responsive presentation), `array-architects.js` (presentation wrapper, layout marker, task wording and hint icon). The fixed viewport, token coordinates/identity, adaptive engine, learner model, telemetry, storage and mathematical rules remain intact. No dependencies, routes, new activities or platform navigation were added.

Desktop Split now places its existing array beside its existing reasoning controls. Smaller screens retain stacked presentation. Shared blue/teal state conventions extend to Guide, Build/Share, Transfer and Summary.

Styling QA: `npm run check` and all 29 existing tests pass. Browser checks covered Intro, both guided interactions, equal-group allocation, partial-product retry/clear/correct, split/join, Transfer and Summary; a separate fresh local session was used to exercise Share/inverse. Checked representative views at 1440×900, 1366×768, 1280×720 and 900×768. Document dimensions matched the viewport, bottom actions stayed visible, and no browser errors were captured.

Existing behavior observed (not changed in this presentation-only pass): a replay session starting with a 10-anchor item can use all six slots without selecting inverse, while the summary's generic practice list still mentions multiplication/division connections. Review replay coverage and derive summary items from actual completed skills in a separate logic change. Full Safari/Firefox and small-phone QA are still outstanding.

## Visible presentation redesign

This version replaces the previous card composition with a product header, informational session rail, module progress, large task heading, two-region activity workspace and independent bottom action dock. The array is paired with a dedicated reasoning panel; equations, partial products and local feedback are grouped together. Intro, Guide, Transfer and Summary share the same product shell.

Presentation code changed in `index.html`, `intervention-core.js` and `array-architects.js`. Adaptive, telemetry, learner state, challenge rules and the existing tests were not modified. Existing form submission remains associated with the original answer form after its action buttons move to the dock.

Screenshot QA is saved in `qa/split-desktop.png`, `qa/split-1280.png` and `qa/transfer-desktop.png`. Browser checks covered both guided interactions, formal split, wrong-answer feedback clearing, correct partial products, Join, progression, Transfer and Summary. At 1280×720 the document is exactly 720px tall, the 48-object arena has equal client/scroll height (345px), and the action dock ends at y=703. The compact-height reasoning layout was adjusted after screenshot review to remove top clipping. Browser error log was empty. `npm run check` passed and all 29 existing tests passed.

This is a desktop-focused presentation delivery. Full mobile/virtual-keyboard and Safari/Firefox testing remain outstanding. The previously documented replay/summary content limitation remains unchanged.

## Tactile visual system (2026-09-24)

Guide Glyph, mathematical objects and Progress Journey now share one code-rendered material language. Source changes are confined to `intervention-core.js` and the presentation hooks in `array-architects.js`; added `tests/material-system.test.cjs`. Adaptive, telemetry, verified tasks and the six-slot flow are unchanged.

Two browser review rounds exercised Guide, equal-group allocation, Share, Hint/Show how, Split, Join and completion. A second clean local origin was used without clearing earlier learner data. Error feedback clearing and keyboard Enter submission were checked. At 1280×720 the document remains exactly viewport-sized and the action dock ends at y=703. Screenshots are in `qa/material-guide.png`, `qa/material-split.png`, `qa/material-complete.png` and `qa/material-share.png`.

Remaining QA scope: full Safari/Firefox/mobile and a full manual session with OS reduced-motion enabled. Automated reduced-motion progression tests remain passing. Existing replay/summary content limitations documented above remain outside this presentation-only change.

Final validation: `npm run check` passed; `npm test` passed 31/31 (all 29 original tests plus two visual-component compatibility tests). Both browser review origins reported no console errors. The saved screenshots show the actual running UI, not reference artwork.
