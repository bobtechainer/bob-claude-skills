---
name: ths-materials-builder
description: Build interactive 3D learning materials (physics/chemistry/bio
  experiments as vivid web pages) through a gated build-review-QC loop.
  Use when the user asks to create, continue, or fix a 3D learning page,
  simulation lesson, or vivid experiment. Covers scoping, real-apparatus
  research, design approval, Three.js build, 4-lens review, and QC scoring.
---

# Vivid Page Builder — gated loop

## Process (never skip a gate)
0. SCOPE → RESEARCH → BRAINSTORM → DESIGN APPROVAL
   → read references/3d-learning-lab-playbook.md Phase 0
   → DIVERGENCE GATE at brainstorm: read references/creative-axes.md +
     references/build-registry.md; pitch 3 concepts, each ≥2 axes away
     from every registry row; append the approved combo to the registry.
     Rigor never varies — only the creative surface does.
1. SPEC: decompose approved design into <project>/qc/spec-matrix.md
   → references/spec-matrix-template.md (Phase-3 audit rows are mandatory)
2. SCAFFOLD: git init if needed; implement review hooks FIRST
   → references/review-hooks-contract.md
3. LOOP until gate passes:
   a. BUILD smallest open increment → commit
   b. REVIEW: run workflows/review-iteration.js (4 lenses parallel)
      → references/review-lenses.md
   c. QC: write findings to qc/defects.md, update spec-matrix statuses,
      run scripts/qc_score.py → completeness %, bug score, verdict
   d. GATE: 100% complete AND zero open P0/P1 → final sweep by a fresh
      reviewer agent (no iteration context) → pass = done
4. Technique lookups during BUILD:
   graphics/look-dev → references/threejs-graphics-techniques.md
   interaction/drag/game-loop → references/threejs-interaction-patterns.md
   guided-steps schema, POE challenges, light-studio art direction,
   hand rig, dial calibration → references/guided-lesson.md
   older recipes (scroll films, dark sim labs) → references/scroll-story.md,
   references/sim-lab.md · debugging history → references/lessons.md
   NOTE: product/marketing landing pages and site clones are now the
   dedicated `landing-page-builder` skill — route there, not here.

## Guards
- Stall: same defect open 3 iterations → STOP, escalate to user with
  screenshots + real-world-apparatus evidence (never argue in circles).
- Scope: reviewer-proposed features → new spec rows need user approval.
- Perception vs physics: if placement is physically correct but the user
  reports it wrong → improve model legibility, do not move it
  (playbook Phase 1).

## State contract
<project>/qc/spec-matrix.md and <project>/qc/defects.md are the single
source of truth. Resume any interrupted session from these files +
git log. Commit at every gate and every loop iteration.
