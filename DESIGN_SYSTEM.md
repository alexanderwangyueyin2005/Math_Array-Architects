# Logifera Intervention UI System

A calm, focused learning surface: a stable shell, one task, direct mathematical feedback.

## Source of truth

Brand source: `/Users/alexanderwang/Desktop/Design_Reference/Brand`. The supplied white circle PNG is used unchanged for the header and favicon. The supplied horizontal wordmarks are not appropriate for this compact activity header. The local `Current Project` folder was empty; implementation continues in this existing standalone app.

References inform the interface; their sample logos, navigation, claims, learners and scores are not copied:

- **7 — dual scenarios / design system:** common brand, white surfaces, blue/teal hierarchy and modular activity family.
- **6 — split array:** object field alongside the corresponding partial facts on desktop. A compact informational session rail, larger task heading and a dedicated reasoning surface establish the product hierarchy. The rail does not introduce navigation or alter progression.
- **2 — UI system:** consistent typography, segmented progress, primary/secondary/choice controls and inline state feedback.
- **8 — icon sheet:** restrained outline hint/math icons and soft manipulatives. No reward currency.
- **1 — equal groups:** task → objects → feedback → fixed action order.
- **3 — light helper:** existing tiny helper remains occasional and subordinate.
- **4 — entry page:** no new platform home invented for this standalone activity.
- **5 — multiple activities:** shared shell/controls; activity-specific representations remain inside the stage.

## Shared presentation

`intervention-core.js` exports scoped `styles`, `productStyles`, `header`, `sessionProgress`, `journey`, `progressRail`, `feedback`, `glyph` and `icon` helpers. Styles are injected into the custom element's shadow root. Existing motion and accessibility behavior remain in the core. This is a lightweight reference vocabulary, not a framework or a claim that other modules are implemented.

| Token | Value | Role |
|---|---|---|
| `--li-page` | #F7FAFA | Preview backdrop |
| `--li-surface` | #FFFFFF | Shell and controls |
| `--li-blue` | #356C92 | Primary action, hierarchy, focus |
| `--li-teal` | #4D9692 | Completed progress, first-part accents |
| `--li-mint` | #E5F3EF | Selected/success surfaces |
| `--li-soft` | #F0F6F8 | Neutral supporting surfaces |
| `--li-text` | #243746 | Main text |
| `--li-muted` | #5F7480 | Supporting text |
| `--li-border` | #DDE8ED | Quiet structure |

Warm neutral #FFF6ED / #805C34 is reserved for retry/correction. Second mathematical parts use a restrained blue tint plus explicit labels; color is never the only indication of a part.

- Spacing: 8 / 12 / 16 / 20 / 24 / 28 px, with compact height overrides.
- Corners: 10 px controls, 12–14 px mathematical cards/arena, 20 px shell.
- Type: inherited system font; 28–36 px task title, 14 px supporting text/actions, 11 px category. Equations have their own 25–28 px rhythm.
- Actions: minimum 44 px primary/secondary targets, predictable bottom placement, visible keyboard focus and readable disabled labels.
- Feedback: inline and local to the mathematical source; soft mint for success and warm neutral for retry. Existing stale-feedback clearing is unchanged.
- Objects: restrained satin shading with consistent top-left light. Existing IDs, coordinates, conservation and movement remain authoritative.

## Activity layout

The fixed viewport now contains a brand header, informational session rail, module progress, a bordered task workspace and an independent action dock. Desktop activities place the object field beside a dedicated reasoning panel. Both retain their position through solve/join/feedback. The reasoning region temporarily permits visible overflow during join so moving mathematical numbers are not clipped between the two regions. At widths below 650 px the activity stacks vertically, with bounded local overflow and fixed bottom actions. Guide uses the same workspace/reasoning structure as practice.

`array-architects.js` owns the mathematical model, content, allocation, split, support and inverse interactions. Its presentation adds only a reasoning wrapper, split-layout marker, clearer task heading and shared hint icon. Selection, mastery, telemetry, storage and session length were not changed.

## Extending to another activity

Reuse the shell, progress, action/feedback conventions and `--li-*` tokens. Supply an activity-specific stage and mathematical interactions; do not copy the entire Array Architects implementation. Keep feedback near its source and preserve readable labels alongside color. Do not add dashboard navigation, diagnoses, evidence claims, points or character scenes as part of this visual system.

## Visible redesign implementation

The action dock is outside the content area. Existing submit buttons retain their form association through the `form` attribute; no answer-validation rules changed. Compact-height layouts remove the repeated support sentence beside subfact cards, while local error feedback remains visible. Safe centering prevents overflowing reasoning content from clipping above its scroll origin.

Primary task objects use soft blue; the second split part uses teal, with matching labels and partial-product surfaces. The supplied logo remains unmodified. The left rail is informational, not clickable platform navigation.

## Tactile visual system integration

`materialStyles` is the final scoped material layer. It leaves the product information architecture intact and unifies `--forest`, `--sage`, `--ivory`, `--slate`, `--brass`, `--neutral`, object radius, contact/lift shadows and motion timing. The existing official header logo is unchanged. Reference imagery is translated into SVG/CSS; no raster mockup, scenery, serif branding or new dependency is used.

- `glyph(state)` produces a folded-ribbon SVG with unique gradient references. Public states: neutral, notice, hint, complete. The old attention name remains compatible. Neutral breathing is bounded; notice leans toward its target; hint belongs to inline guidance/row counting; complete uses relaxed eyes and a brief brass mark. Context helpers ignore pointer events and fade away.
- Manipulatives use rounded block/pebble geometry, upper-left satin light, shaded lower edges and a separate contact shadow. In-flight and landing states reuse the conserved DOM objects. Split keeps the existing separation; Join uses a slower magnetic easing within the existing mathematical reveal schedule. Group lanes and token trays use quiet recessed surfaces.
- `progressRail(count,total)` now emits a compact geometric journey with rounded square, round, soft triangle, split block and hex-like nodes. Completion settles the current node, flows only the adjacent connector segment, and lifts the next node. Existing progress text and six-slot session policy remain authoritative.
- Reduced-motion disables decorative glyph/path animations and keeps existing state changes and mathematical outcomes. No helper or journey node becomes an extra keyboard stop.

Browser refinement: fixed SVG lighting selector after adding gradient definitions; made Show how keep one glyph while its number sequence updates; changed narrow desktop tray layout to avoid excessive shrinking; matched counting focus outline to the new rounded geometry; retained a continuous base path during connector motion.
