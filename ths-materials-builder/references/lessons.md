# Lessons Log (append-only)

Living memory of every build done with this skill. APPEND a dated entry after each build; never rewrite history. If a lesson class shows up a third time, promote it into SKILL.md or a recipe file and leave the entries here as record.

Entry format:

```
## YYYY-MM-DD — <project> (<one-line description>)
- BUG: <what broke> → FIX: <what fixed it>
- TRICK: <technique worth reusing>
- TASTE: <user preference / design correction worth remembering>
```

---

## 2026-07-13 — the-toy (RX-60 scroll-driven 3D product film)

- BUG: review screenshots showed scenes one scroll-position behind → cause: background tab throttles RAF, lerp scrub never settles → FIX: `window.__seek(p)` hook that snaps progress + renders one frame synchronously. Promoted to SKILL.md as standing requirement.
- BUG: loader never hid in throttled tabs (hide was gated on first RAF frame) → FIX: `setTimeout` fallback ~2.5s + `__seek` force-hides.
- BUG: programmatic scrolls (anchors, tests) crawled for seconds → FIX: snap when `|target - progress| > 0.25`, lerp otherwise.
- BUG: exploded-view part labels evenly spaced, ignored where parts actually were → FIX: project part world positions to screen X per frame + min-gap collision pass (sort, push apart 70px).
- BUG: perpendicular explode camera showed featureless profiles → FIX: 3/4 camera angle; fan colliding parts diagonally (±Y/±Z).
- BUG: macro close-up copy sat on the robot's face → FIX: move camera lookAt up, not the DOM.
- TRICK: keyframe tables `[{p, v:[..]}]` + smoothstep sampler for all 3D values; timeline lib only for DOM opacity. Easier to debug than tweening 3D through the lib.
- TRICK: dark-theme flip = fixed black overlay div (opacity timeline-driven) + `body.dark` class at 0.5 crossing + `transition: color .5s` on text. Gradients can't transition; overlays can.
- TRICK: procedural subject from primitives + PMREM RoomEnvironment = luxury look, zero assets. Chest-dial homage detail sold the whole robot.
- TASTE: user approves plan-first working style; wanted multi-agent build loop — infra was broken (bogus "medium" model), inline loop worked fine as fallback.

## 2026-07-13 — the-toy round 2 (gap-closing pass vs original)

- TASTE: "clean" ≠ "engineered". Original wins via: subject overlapping giant letters (poster interlock, not layout), instrument-ring backdrop whose arc doubles as scroll progress, drifting light/shadow gradient blobs, blueprint hairlines + "+" markers, two-tone type lockups, scroll-driven paragraph focus states, framings that crop the subject.
- BUG: custom black-void studio env rendered subject near-black from front views → FIX: always add a dim frontal fill plane behind the camera side + lift env background to ~0x16 gray. Check EVERY camera angle after env changes, not just one.
- TRICK: luxury metal without HDR files = black-ish env + few overbright strips (THREE.Color values > 1) via PMREM + MeshPhysicalMaterial clearcoat + per-material envMapIntensity. RoomEnvironment reads soapy by comparison.
- TRICK: "fiber ribbon" particles (THREE.Line strands, long smooth arcs, additive, radius band that keeps center clear) beat dot clouds for dark sections. Tangles come from too many turns — keep turns < ~1.3.
- BUG (external): original site itself freezes on loader in background tab — RAF-throttle lesson is universal, not ours.

## 2026-07-13 — the-toy round 3 (explode alignment, user-reported)

- TASTE: hybrid explode (some parts up/down, some along axis) reads as clutter. The watch-site move is strict: ONE axis, every part in its own slot with generous gaps, near-side-on camera so axis ≈ screen X, labels projecting straight down to a bottom rail. Small Y offsets only for personality.
- BUG: `translateY(50%)` used to center rotated vertical labels pushed half the text below the viewport → FIX: no translate; position purely via projected `left` + fixed `bottom`.
- BUG: narrow viewports cram the teardown line → FIX: aspect-aware camera pullback only inside the explode progress window (`scale = clamp(1.55/aspect, 1, 1.9)` on x/z).
- TRICK: when a screenshot "loses" small dim text, don't guess from pixels — query `getBoundingClientRect` + computed style via javascript_tool to confirm presence/position before "fixing" phantom bugs.

## 2026-07-13 — the-toy round 4 (label tracking + slot spacing, user-reported)

- BUG: explode slots set as OFFSETS ignored each group's home Z (gear train +0.35, key −0.85) → true world gaps uneven, two parts collided → RULE: design slots in WORLD coordinates, derive offsets by subtracting home.
- BUG: 3D→screen label projection lagged one frame TWICE: (a) `v.project(camera)` uses matrices refreshed only at render — call `camera.updateMatrixWorld()` + `root.updateMatrixWorld(true)` first; (b) projecting inside the choreography pass ran before explode positions were applied — projection must be a separate step AFTER all positions are set, immediately before render. Invisible during smooth scroll, glaring on jumps.
- BUG: paired parts (two arms) exploded OUTWARD doubled their home spread and collided with neighbors → pull symmetric pairs TOWARD the axis so the pair occupies one column slot.
- MISS: forgot a label for the arms entirely — enumerate EVERY part group when building the label rail; users notice the missing one.
- TRICK: when screenshots go blind (capture returns blank), verify layout numerically: seek + measure `getBoundingClientRect` order and gaps in one synchronous eval. Geometry doesn't lie.

## 2026-07-13 — the-toy round 5 (missing sections: selector, spec sheet, hover/click)

- MISS: pattern-cloned the film but skipped the reference's INTERACTIVE layers (colorway selector page, spec accordion, hover states). A scroll film with no pointer feedback reads as a video. Budget for interactivity from the plan stage.
- TRICK: scroll-driven selector — carousel occupies a film progress window (each quarter = one variant); arrows/dots don't mutate state, they scrollTo the target progress. Scroll stays the single source of truth, and manual scrolling through the section pages variants for free.
- TRICK: post-film DOM handoff — map film progress to the scroll-space div's height only (not document height), clamp at 1, toggle `body.film-done` to fade canvas + fixed overlays; normal-flow sections (spec sheet) scroll in after. Real DOM = real hover/click/accessibility for free.
- TRICK: full-viewport tint per variant = fixed overlay div, backgroundColor swapped + opacity ramped by progress; combine with the body.dark toggle when a variant's tint is dark.

## 2026-07-13 — the-toy round 6 (section order + photo cards, user-reported)

- MISS: placed the spec accordion AFTER the finale (post-film DOM). Re-watching the original showed the true end-order: statement type + photo cards → selector → spec accordion → finale LINEUP LAST. The lineup is the closing poster; nothing comes after it. RULE: when cloning, map the reference's full section ORDER explicitly in the plan — not just the section list.
- TRICK: no photography for a procedural subject? Synthesize it: swap scene.background to near-black, hide particles, frame a beauty angle, render once, `canvas.toDataURL('image/jpeg')` (works same-task without preserveDrawingBuffer), restore state. Data-URL "photos" feed DOM cards; robot-in-a-dark-studio reads like real product photography.
- TRICK: interactive section inside a scroll film = opaque fixed .panel with pointer-events toggled by progress window; accordion clicks work mid-film. Progressive row focus (dataset.focus driven by local progress) mimics rows lighting up as you scroll.
- TRICK: selector → spec continuity: persist last selected colorway index; spec panel's model number suffix + color chip read it (146TR/146CB/146GD/146CR).
- BUG (review harness): even with scrollTo-based __seek, a VISIBLE tab the user can touch gets scrolled externally — screenshots then show mid-lerp frames. Sync DOM probes inside the same __seek eval stay authoritative.

## 2026-07-14 — the-toy round 7 (gear teeth through the shell, user-reported)

- BUG: procedural gear built its disc in one plane (cylinder rotated to XY) but its tooth ring in another (positions computed in XZ) — teeth stuck out perpendicular to the disc and pierced the torso wall, visible as stray brass flecks in EVERY assembled frame for six review rounds → FIX: build ring features in the same plane as the disc they belong to; verify with a bounding-box vs container check.
- RULE: unexplained pixels in a render are a geometry bug until proven otherwise. I saw the flecks repeatedly and read them as "detail"; the user read them correctly as a part outside the body. When any part is procedurally placed inside a container, assert containment numerically (Box3 vs container bounds) once at build time — screenshots at product distance hide 0.1-unit protrusions.

## 2026-07-13 — double-pendulum (CHAOS 01 physics lab)

- TRICK: ghost ensemble (12 pendulums, ε=1e-4 rad offset) + hue spread makes chaos *visible*; divergence-px readout quantifies it. Best vividness-per-line in the build.
- TRICK: motion-blur veil (translucent fill instead of clear) + `lighter` compositing + speed-mapped hue trail = the entire "wow" layer, canvas 2D only.
- TRICK: `window.__step(secs)` synchronous integrate+draw hook — sim twin of `__seek`. Also gives reproducible states for review.
- TRICK: preallocated RK4 scratch objects (k1..k4, tmp) — zero GC churn at 240Hz substeps.
- TASTE: user wanted "as vivid as possible" — answer was layered rendering tricks on honest physics, not fake dynamics. Energy readout builds trust.

## 2026-07-13 — faraday (CẢM ỨNG 01, guided induction lab v2)

- BUG: Chrome MCP screenshots at devicePixelRatio 1.25 CROP the right/bottom ~20% of the viewport — right/bottom-anchored UI looks cut when it isn't → FIX: trust `getBoundingClientRect()` probes for layout verdicts; screenshots only for look/composition. (Second sighting of "geometry over pixels" — see the-toy rounds 3–4; promote on next occurrence.)
- BUG: task/challenge detection ran in the RAF loop with wall-clock dt → never fired under `__step`, missed fast events → FIX: run detection inside the physics substep. Detection is simulation state, not rendering.
- BUG: `Object.assign(mesh, {position: v})` throws — THREE transform props are read-only getters → FIX: `mesh.position.set(...)`.
- BUG: hover flag went stale during drag (pointermove early-returns while dragging) → ghost 3D hand stayed after release → FIX: clear flag in endDrag + per-frame self-heal (`if (!dragging && !hover) opacityTgt = 0`).
- BUG: per-frame RK2 field-line integration physically true but visually chaotic (sky-arcs, aborted-seed whiskers) → FIX: analytic dipole loops (r = L·sin²θ) transformed to the magnet each frame + numeric bore-intersection test for the cyan "flux thread" highlight. Pretty AND honest enough.
- LESSON: light/ivory background flips the vividness toolkit — no bloom, no additive blending (invisible on white), glow via emissive only, accents darker/saturated. Dark-scene recipes don't transfer.
- TRICK: guided mode = STEPS[] state machine {cam preset, show[] instrument mask, detect(st), explain with {live} value substitution} + do-to-advance detection reusing the challenge pattern. Scene declutters itself by masking instruments per step.
- TRICK: procedural 3D glove (rounded-box palm + capsule fingers, curl rig) reads charming not creepy — but LOOK-GATE with a forced-pose screenshot before wiring behavior; a curl sign error produces a sea-urchin.
- TASTE: user wants POE pedagogy (predict → observe → explain) for real VN students, bright "wow" background over dark lab, hand-as-cursor embodiment. Session infra: Agent tool broken again (bogus "medium" model) — inline build loop remains the fallback.
- LESSON (apparatus logic): user reported "layout wrong" three times; real bug was MODEL AFFORDANCE — coil end plates were solid discs, so the magnet visually clipped through metal and the whole pass-through layout read as illogical. Bored washer cheeks + bobbin tube fixed the *same layout* instantly (user then reverted their own layout complaints). When a user says a physical arrangement "isn't right", first check whether every penetration/contact in the scene is physically plausible (holes where things enter, supports under things that rest) before moving furniture.

## 2026-07-16 — eruption (PHUN TRÀO 01, god-hand volcano sandbox)

- BUG (look, user: "3D models look like they're on crack"): permanent cutaway built as a PILE of mismatched primitives (half-shell + flat cap + 3D half-tube + flat strip + half-dome + flat ellipse) z-fought and stuck out like debris → FIX: solid hero model + cutaway as a CLEAN TOGGLE — one canvas-textured cross-section cap (strata/chamber/conduit painted, labeled) + clippingPlanes on all world materials. One cap, zero overlapping geometry.
- LESSON (vividness): a floating cutaway with no environment reads as a diagram, not a scene — even when correct. The rejected "old gen page" beat v1 purely on WORLD: sky, sun, sea, forest, cohesive palette. Vivid = saturated complementary palette (green island, teal sea, golden-hour sky, dark rock, orange magma) + a world around the subject. Muddy monochrome dusk ≠ moody, just dead.
- LESSON (backlit hero): sun behind the mountain killed the rock colors → hemisphere light up + warm frontal fill. Same class as the-toy round 2 "check every camera angle" — THIRD sighting of lighting-kills-subject: promote to playbook next touch.
- BUG: quest detection only ran in the RAF loop → never fired under `__charge` hooks → FIX: run checkQuests inside the hook stepping loop too (same physics-time-detection lesson as faraday — SECOND sighting).
- BUG: reset wiped quest achievements → quests are session achievements; persist across reset.
- TRICK: eruption spectrum from two valves, honest chain: dP/dt = supply·gas − leak·(1−viscosity)·P → E = .45g+.35η+.2P → VEI/style/FX. Probes: low-η leaks (P≈.35), high-η traps (P→1, auto-blow). Landform = consequence (Plinian → caldera profile edit, effusive ×3 → shield accretion) via LatheGeometry profile rebuild.
- TRICK: vertex-color height gradient on a lathe cone (dark base → pale rim) + flatShading = instant low-poly-luxury mountain, no textures.
