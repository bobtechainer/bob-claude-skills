# Three.js interaction & sim-loop patterns

Distilled from vendor/game-skills (majidmanzarpour/threejs-game-skills).
Repo philosophy worth keeping: a static scene is not done — build the interactive
loop first; verify with measured evidence (canvas-pixel inspection, console checks,
bot playtests), never subjective "it works".

## Distilled patterns (learning-lab relevant)

### Gameplay systems architecture
- summary: Entity/state architecture, input systems, custom collision for trigger
  volumes, camera/controls, and game-feel tuning: hitstop, easing curves, impact
  feedback. "Juice" maps directly to pedagogy feedback (needle kick, success pulse).
- reach for it: phase 2 interaction + physics core — structuring input→sim→render;
  phase 4 — success feedback that lands (a detection firing should FEEL like a hit).
- deep ref: vendor/game-skills/skills/threejs-gameplay-systems/SKILL.md
  (physics engine selection: references/physics-engine-selection.md — hand-rolled
  ODEs for honest single-topic physics; Rapier only for contact-heavy scenes)

### Debug & profiling discipline
- summary: Systematic debugging of render/runtime/loading/resize/mobile-input issues;
  profiling draw calls, triangles, texture memory, shader cost, bundle size, DPR.
- reach for it: any phase when frame time jumps or mobile feels wrong — profile
  before optimizing; budget instanced meshes and per-frame buffer updates.
- deep ref: vendor/game-skills/skills/threejs-debug-profiler/SKILL.md

### Game UI design (HUD/overlay craft)
- summary: Premium HUD/menu/overlay patterns: typography scale, responsive layout,
  safe areas, text fit, icon controls, touch targets, UI/world cohesion (UI colors
  echo scene materials).
- reach for it: phase 4 — control panels, task cards, telemetry, theory drawers.
  Treat "generic stat-card HUD" as a placeholder smell — style must belong to the
  scene's world.
- deep ref: vendor/game-skills/skills/threejs-game-ui-designer/SKILL.md

### QA / release verification
- summary: Automated playtest bots, canvas-pixel inspection with measured metrics,
  console checks, mobile/responsive passes, production build verification, release
  risk report. Never claim done without measured evidence.
- reach for it: QC phase / final sweep — the canvas-inspection script pattern
  (inspect-threejs-canvas.mjs) complements our __step/__state review hooks with
  pixel-level assertions.
- deep ref: vendor/game-skills/skills/threejs-qa-release/SKILL.md

### Director/ledger orchestration (meta)
- summary: One entrypoint skill orchestrates specialists via explicit ledgers
  (skill-loading ledger, asset ledger, phase gates with exit evidence). Never claim
  a skill was invoked when it was only loaded; never stop at first playable when
  the ask was premium.
- reach for it: process meta — mirrors our gated build loop; steal the ledger idea
  when a build spans many phases (log which reference was actually read per phase).
- deep ref: vendor/game-skills/skills/threejs-game-director/SKILL.md
  (+ references/phase-playbook.md for phase exit evidence templates)

Skipped: threejs-3d-generator / threejs-image-generator / threejs-audio-generator —
external asset APIs (Tripo/Gemini/ElevenLabs); our pages are procedural-only, zero
asset files. threejs-aaa-graphics-builder — game-asset oriented; the graphics repo
covers visual craft for lab scenes better.

## Proven in-house patterns (from the Faraday build — keep regardless)
- Fixed-timestep core: 1/240 s substeps, accumulator clamped at 50 ms;
  render loop interpolation-free but stable. Prerequisite for __step().
- Axis-constrained drag: raycast onto a camera-facing plane through the
  travel axis, take only the axis component, clamp to limits; offset
  captured at pointerdown so the object doesn't jump.
- Smoothed release velocity: vel = vel*.6 + sample*.4 each move; on
  release, carry velocity only if last move <80 ms ago, clamp magnitude.
- Pointer capture + pointercancel + orbit-controls disable during drag.
- Hover affordance rig (glove hand) with self-heal: opacity target forced
  to 0 unless hovering or dragging — cannot get stuck visible.
- Guided-step state machine: STEPS[] with detect(stateBag) predicates
  accumulating peaks/holds/sign-flips; camera tween per step; done-gating
  on sustained conditions, not single frames.
- Driven-oscillator instrument response (torsion needle): θ̈ = (kI − cθ̇
  − sθ)/J — instruments lag and overshoot like real hardware.
- Physics-feedback forces need a felt-strength pass: derive the honest force,
  then tune its gain against real interaction speeds (Faraday Lenz braking:
  2e5 trapped the magnet, 6e4 braked-but-passed — tune with __setMagnet throws).
- Energy ledger from the ODE itself: accumulate ∫εI dt and ∫I²R dt per substep;
  their near-equality is both a teaching visual and a free integration test.
- Lazy AudioContext on first pointerdown; state-driven hum gain (∝ signal²),
  event clicks with cooldown; 'm' mute key. Keep volumes low, no UI clutter.
