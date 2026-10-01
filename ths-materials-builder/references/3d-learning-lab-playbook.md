# 3D Learning-Material Playbook

Hard-won rules from the Faraday build (2026-07-13). Follow in order.

## Phase 0 — Scope → Research → Brainstorm → Design gate (MANDATORY)
1. Scope check (1-2 questions max): which experiment/topic, target
   audience/grade, language. Just enough to know what to research.
2. Research the REAL apparatus before talking options: actual lab setup,
   textbook photos, instrument positions, wiring, canonical demo variants.
   Also existing sims (PhET etc.) — what they show and skip. Never invent
   a layout — users instantly spot "not how the real one looks."
3. Brainstorm WITH the user, questions grounded in the research: present
   found variants as concrete options ("real benches put the galvanometer
   beside the coil, wired behind — classic or stylized?"), never generic
   "what do you want?".
4. Design doc citing the real setup (layout sketch, physics model,
   pedagogy flow) → explicit user approval BEFORE any code.

## Phase 1 — Scene legibility (the #1 rework source)
A physically-correct layout that READS wrong will be reported as a bug,
repeatedly. Correctness does not defend itself — legibility does.
- Every "object passes through object" relationship needs visual proof:
  bore/tunnel geometry (dark throat, washer cheeks, bobbin tube), not
  bare intersecting meshes.
- If the user says placement is wrong but physics says it's right:
  do NOT move it. Render a screenshot, explain the real-world analog,
  and improve the model until the correct placement looks correct.
- Anchor every floating object: sleds, stands, posts, contact shadows.
  Unanchored = "why are there 2 bonus strings on screen."

## Phase 2 — Interaction constraints
- Draggables move on ONE constrained axis/plane; clamp to travel limits.
- Carriers (sled/stand) must follow the dragged object every frame —
  object must never separate from its mount.
- Solids the object passes near: verify clearance (bore radius >
  object half-diagonal) at design time, not after bug reports.
- Drag inertia: track smoothed pointer velocity, release carries through;
  zero it if pointer was still >80ms.
- Pointer capture + pointercancel handling; disable orbit controls
  during drag; hover affordance (hand/cursor) that self-heals to hidden.

## Phase 3 — Physics honesty audit (run BEFORE calling it done)
Every quantity the sim computes must be visible or feelable. Checklist:
- [ ] Reaction forces act on the thing the user drags (e.g. Lenz braking
      F = I·dΦ/dx applied to the magnet's motion) — the user must FEEL
      the physics, not just read it.
- [ ] Source model is finite/real (two-pole bar magnet, not point dipole)
      so waveform shapes match textbook traces.
- [ ] Instrument dials are CALIBRATED: the number printed on the dial
      face must agree with telemetry. A dial that lies breaks trust.
- [ ] Induced/secondary effects rendered, not only the primary field
      (e.g. coil's opposing field loops = the visual reason for Lenz).
- [ ] Energy/power readout (P = I²R etc.) — an energy number is the
      proof the sim is honest.
- [ ] Every on-screen number traces back to the sim state; nothing faked.
- [ ] After ANY physics change, recalibrate all detection thresholds
      (guided steps + challenges) — they encode old magnitudes.

## Phase 4 — Pedagogy skeleton (reuse)
- Two modes: guided (step rail + task card + camera tweens per step +
  detect() functions) and free (control panel, telemetry,
  oscilloscope/graph, POE challenges: predict → try → verdict).
- Detection functions accumulate state (peaks, holds, sign flips) in a
  per-step state object; require sustained conditions (hold timers), not
  single-frame spikes.

## Phase 5 — Review & survival infrastructure
- Deterministic hooks from day one — see review-hooks-contract.md.
- Fixed-timestep physics (1/240 s substeps, clamped accumulator).
- git init BEFORE the build; commit after each approved phase. A spend
  limit or crash mid-implementation must never lose an approved design
  or an audit again.
- Implement audits in small increments: one gap → verify → commit.
