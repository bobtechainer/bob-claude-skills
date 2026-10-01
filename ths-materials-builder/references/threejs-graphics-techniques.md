# Three.js graphics techniques — look-dev + vivid layer

Distilled from vendor/graphics-skills (scottstts/Threejs-Awesome-Graphics-Agent-Skills).
Repo philosophy worth keeping: graphics quality comes from *seeing exact implementations*,
not prompting "make it pretty" — load the deep skill file before building the visual.
Every visual system should expose: named controlling parameters, diagnostic outputs,
temporal stability rules, and a no-post baseline that still reads.

## Distilled techniques (learning-lab relevant)

### Skill router discipline
- summary: Decompose a visual target into the SMALLEST set of expert techniques before
  coding. Prevents kitchen-sink shaders and keeps each system diagnosable.
- reach for it: start of phase 1 look-dev — list the 3-5 visual systems the topic
  actually needs, load only those deep refs.
- deep ref: vendor/graphics-skills/skills/threejs-skill-router/SKILL.md

### Production bloom + emissive hierarchy
- summary: HDR signal ordering, scene-relative emissive hierarchy (decide which object
  is the brightest storyteller and scale others under it), selective bloom with
  guaranteed material restoration, effect-isolation diagnostics.
- reach for it: vivid layer — when sim state drives glow (coil |I|, heated element,
  energized field). Faraday used flat emissiveIntensity; this upgrades it.
- deep ref: vendor/graphics-skills/skills/threejs-bloom/SKILL.md

### Camera direction systems
- summary: Authored cinematic framing, quaternion handoffs between camera rigs,
  pointer-look constraints, camera collision, projection ownership, lifecycle
  restoration (always restore the interactive rig after an authored move).
- reach for it: phase 4 pedagogy — guided-step camera tweens, attention direction
  (e.g. galvo dolly). Handoff pattern prevents the "camera fights OrbitControls" bug.
- deep ref: vendor/graphics-skills/skills/threejs-camera-direction/SKILL.md

### Final image pipeline (one tone-map owner)
- summary: Deliberate ordering of depth/normal/albedo passes, bloom, eye adaptation,
  tone mapping, LUT grading. Iron rule: exactly ONE pass owns tone mapping; everything
  upstream stays linear HDR. Effect-local render targets for diagnostics.
- reach for it: end of phase 1 look-dev — when adding any post effect beyond
  renderer.toneMapping, or when colors shift unexpectedly after adding bloom.
- deep ref: vendor/graphics-skills/skills/threejs-image-pipeline/SKILL.md
  (+ threejs-exposure-color-grading for measured exposure)

### Procedural scalar/vector fields
- summary: Build several visual channels (displacement, color, roughness, arrows)
  from ONE shared cause-field so they stay physically coherent. Domain warping,
  masks, derivatives-for-normals.
- reach for it: vivid layer — field visualization (B/E fields, temperature, stress,
  wave amplitude). Whenever ≥2 visuals must agree because they share a physical cause.
- deep ref: vendor/graphics-skills/skills/threejs-procedural-fields/SKILL.md

### Procedural geometry (apparatus modeling)
- summary: Sculpted rail/frame profiles, oriented rings along curves, semantic mesh
  writers, deliberate caps/skins, UV density rules, material slots, instancing
  decisions, close-inspection geometry budgets.
- reach for it: phase 1 — lab apparatus: springs (helix tubes), coils, stands, rails,
  clamps. The "close-inspection budget" matters because students orbit right up to it.
- deep ref: vendor/graphics-skills/skills/threejs-procedural-geometry/SKILL.md

### Procedural materials (authored PBR identities)
- summary: Authored PBR identities per material (not random tweaks), hybrid
  texture-backed + procedural masks, derivative normals, emissive surfaces,
  specular AA, per-instance variation.
- reach for it: phase 1 — bench wood, brass instruments, enameled copper, rubber,
  steel. Give each material a named identity with 3-4 controlling params.
- deep ref: vendor/graphics-skills/skills/threejs-procedural-materials/SKILL.md

### Procedural animation (analytic motion)
- summary: Analytic transform timelines, spring-follow motion, frame-rate-independent
  response (exp smoothing by dt, never per-frame lerp constants), target-frame
  decomposition, quaternion control.
- reach for it: phase 2/vivid — anything that follows sim state smoothly (hand rig,
  indicator needles, camera leans). The frame-rate-independence rule is mandatory.
- deep ref: vendor/graphics-skills/skills/threejs-procedural-animation/SKILL.md

### Visual validation as authored contracts
- summary: Validate graphics as systems, not vibes: fixed-view visual contracts
  (camera pose + expected feature list), no-post baselines, seed sweeps, temporal
  stability checks, GPU budgets, regression evidence.
- reach for it: QC phase — turns "screenshot looks fine" into checkable rows for the
  spec matrix. Pairs directly with our review-iteration workflow.
- deep ref: vendor/graphics-skills/skills/threejs-visual-validation/SKILL.md

Skipped: atmosphere/planets/clouds/ocean/water-optics/precipitation/vegetation/
architecture/raymarched-space/POM/SSAO/shadow-systems/temporal-surfaces — planetary,
weather, or open-world scale; no teaching use on bench-scale lab pages. Revisit
water-optics + spectral-ocean only if a topic is literally about waves/fluids.

## Proven in-house techniques (from the Faraday build — keep regardless)
- Canvas-texture materials: procedural wood bench, instrument dial faces
  (ticks + numerals drawn to canvas → CanvasTexture) — zero asset files.
- Contact shadows: radial-gradient canvas on a ground plane per object;
  cheaper and softer than shadow maps for anchoring.
- PMREM + RoomEnvironment for instant studio reflections on metals.
- MeshPhysicalMaterial clearcoat for enameled copper; emissiveIntensity
  driven by sim state (|I|) = the page "breathes" with the physics.
- InstancedMesh for field-responsive scatter (320 iron filings aligned
  to B-field, updated every other frame).
- Analytic dipole field-line loops (r = L·sin²θ) as Line objects
  transformed each frame — no particle sim needed.
- ACESFilmic + soft PCF shadows + letter sprites for pole labels.
- Direction arrowheads on field lines: one instanced cone at each line's apex,
  oriented by local tangent, color inherited from the line — field DIRECTION is
  pedagogy, shape alone is not enough (user caught this on Faraday).
- Sign-consistency audit: every visual that encodes a sign (arrows, pole faces,
  flow dots) must be derivable from the same convention; check with right-hand
  rule before shipping (Faraday coil arrows were 180° off until N/S faces
  made it falsifiable).
