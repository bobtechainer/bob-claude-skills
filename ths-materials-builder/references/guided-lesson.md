# Recipe: Guided Lesson Lab (education-first experiment pages)

Distilled from the faraday build (CẢM ỨNG 01 v2). Use when the page must TEACH a real
curriculum topic to real students — not just demo it. Extends `sim-lab.md`; read that first.

## 0. Research the real apparatus BEFORE modeling

Search the actual textbook setup (SGK figure) + PhET's version of the same topic. Get:
which instruments exist, where each sits, what connects to what, what moves and what
doesn't. Users instantly feel a wrong bench even if they can't name the error.

Apparatus realism rules (each one was a user complaint once):
- Every penetration needs a hole (bobbin bores, washer cheeks — nothing clips through solid metal).
- Every resting object needs support (cradle under the magnet, shelf under the meter, contact shadows).
- Cables route like real cables: short, sagging or floor-pinned, never crossing the interaction lane, attached to visible terminals.
- Instruments in a back row, interaction lane in the front row, camera reads the whole circuit in one glance.
- When a user says the layout "isn't right", check model affordances FIRST (holes/supports/contacts), then positions.

## 1. Structure: HỌC (guided) + TỰ DO (free lab)

Default = guided. One live 3D scene, two modes, toggle top-right.

Guided = STEPS[] state machine, one entry per concept:

```js
{kicker, task,                        // task line with <b>goal number</b> + pulsing "làm thử" cue
 cam:{pos,tgt},                       // camera preset per step, one-ease tween ~1.2s
 show:['galvo','scope','arrows'],     // instrument mask — scene declutters itself
 detect(st){...},                     // returns true when the student DID the thing
 explain: '...{live} values...'}      // revealed on success, numbers substituted from sim
```

- **Do-to-advance (POE)**: student predicts/acts → sim detects → explanation with THEIR
  numbers ("Kỷ lục của em: 31 mV"). Brilliant/PhET pattern; no skippable lecture text.
- Detection runs INSIDE the physics substep (physics-time). RAF-time detection misses
  fast events and breaks `__step` review. This bug shipped twice — never again.
- Step rail (01..05) left edge; task card bottom-center with a live formula strip.
- Final step unlocks TỰ DO: full control panel + challenge deck (6+; reuse detection system).
- Keep scene furniture visible across steps (wires imply the meter — don't hide what's wired).

## 2. Physics honesty checklist (the UI must EARN its numbers)

- [ ] State variables integrated at fixed substeps (≥240 Hz), never per-frame.
- [ ] Finite-size sources, not point idealizations, when the waveform shape is the lesson
      (two-pole magnet → the true double-spike ε trace).
- [ ] Back-reaction implemented, not just narrated: if the lesson says "lực cản", the force
      term `F = I·dΛ/dx` must act on the thing you drag. Honest sign, tuned gain constant.
- [ ] Instruments calibrated: needle gain must match the printed dial scale
      (gain = full-scale-angle / full-scale-quantity). An uncalibrated dial is a lie.
- [ ] Energy/power readout visible (P = I²R etc.) — the trust anchor.
- [ ] Both cause and effect fields visualized (source field AND induced/opposing field,
      distinct colors, arrowheads for direction).
- [ ] Every on-screen number computed from sim state. Zero hardcoded values in explanations.

## 3. Bright-studio art direction (for student-facing pages)

Dark-lab recipes don't transfer. On ivory/light backgrounds:
- No bloom, no additive blending (invisible on white). Glow = emissive + saturated accents.
- Ivory radial gradient bg, pale wood bench (procedural canvas grain), PCFSoft shadows,
  3-point light, contact-shadow sprites under every object.
- Color budget: neutrals + copper/brass for hardware; 2 semantic colors max for physics
  (e.g. blue = source field, hot orange = current/induced), red only for danger/force.
- Light glass UI panels (white 72%, blur), dark ink text, mono numerals.

## 4. Embodiment

Hand-as-cursor sells "you are doing the experiment": procedural 3D glove (rounded palm +
capsule fingers, curl rig), fades in on hover, grips on drag, leans with velocity.
- LOOK-GATE the grip pose via forced-state screenshot before wiring behavior (curl sign
  errors produce sea-urchins). Fallback: 2D cartoon hand cursor.
- Lifecycle self-heal: `if (!dragging && !hover) opacityTgt = 0` every frame, clear hover
  flag on drag end (it goes stale during drag).

## 5. Review hooks (mandatory set)

`__step(secs)` sync integrate+render · `__setX(...)` state setters · `__goStep(i)` ·
`__state()` full dump · `__screenPos(x,y,z)` world→screen for layout probes.
Layout verdicts via getBoundingClientRect, never via screenshot pixels (dpr crop trap).
