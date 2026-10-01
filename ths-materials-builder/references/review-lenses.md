# Review lenses — 4 parallel reviewer agent prompts

Each lens is one subagent per loop iteration. All four run in parallel
(workflows/review-iteration.js). Findings go to qc/defects.md with
severity P0 (breaks core teaching/physics), P1 (wrong but usable),
P2 (polish). Reviewers report findings only — no fixes, no scope creep.

## Lens 1 — Code review
Prompt: "Review the diff since the last commit of <file(s)>. Three.js
misuse (leaked geometries/materials, per-frame allocations, missing
dispose), dead code, broken event handling, race conditions in the
frame loop. Report file:line, severity, one-line defect, one-line fix
suggestion. Ignore style."

## Lens 2 — Logic / physics review
Prompt: "Load <page> and run numeric probes via the review hooks
(review-hooks-contract.md). For each probe in qc/spec-matrix.md marked
'probe': set state (__setMagnet / __setState), advance (__step), assert
on __state(). Also walk the playbook Phase-3 honesty checklist. Report
each failed assertion with expected vs actual numbers."
Canonical probes (adapt per experiment):
- sign correctness: push source toward sensor → response sign matches theory
- derivative link: response magnitude scales with speed of change
- lag: current/needle lags EMF (RL / torsion dynamics visible)
- decay: reaction force damps free motion through the active region
- calibration: dial/gauge reading == telemetry value within 3%
- energy: P = I²R (or analog) consistent with motion input

## Lens 3 — UI / visual review
Prompt: "Take screenshots at the canonical states listed in
qc/spec-matrix.md (e.g. far / approaching / inside / leaving / flipped /
running). Judge each against the approved design doc and playbook
Phase 1 legibility rules: does every spatial relationship READ correctly
(tunnels look like tunnels, anchored objects, no floating geometry, no
UI overlap at 1280×720)? Report per-screenshot findings."

## Lens 4 — Interaction review
Prompt: "Script the pointer interactions (browser automation): drag the
draggable through its full travel fast and slow, release with velocity,
drag while camera rotated, spam clicks, resize. Assert: object never
leaves its constraint axis, never separates from its carrier, never
clips through solids, controls re-enable after release, no console
errors. Report each violation with repro steps."

## Verdict rules
- A finding is only P0/P1 if reproducible (probe number or screenshot).
- Duplicate of an open defect → increment its `seen` count instead of
  a new row (stall guard counts on `seen`).
