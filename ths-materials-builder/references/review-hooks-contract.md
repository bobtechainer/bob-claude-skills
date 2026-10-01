# Review-hooks contract

Every build MUST expose these window hooks before the loop starts
(gate 2). They make the page machine-reviewable: deterministic stepping,
state injection, state readout, screen-space projection. Without them
the logic and UI lenses are blind.

```js
// Advance the simulation by exact fixed substeps, then render once.
// Must bypass camera tweens and loaders. No wall-clock dependence.
window.__step = secs => { /* n = round(secs/SUB) substeps; render */ };

// Set primary interactive state directly (position, velocity, ...),
// recompute deriveds, then __step(0). One setter per draggable/control.
window.__setMagnet = (x, v = 0) => { ... };   // name per experiment

// Full numeric state snapshot — every telemetry value must be here.
window.__state = () => ({ x, v, phi, emf, I, th, t, step, done, mode });

// Jump guided mode to step i deterministically.
window.__goStep = i => { ... };

// World → screen pixels, for screenshot annotation and click targeting.
window.__screenPos = (x, y, z) => ({ x: px, y: px });
```

Rules:
- Fixed-timestep core (e.g. 1/240 s) is a prerequisite — __step is only
  deterministic if the physics is.
- __state() values and on-screen telemetry must come from the SAME
  variables. If they can disagree, the calibration probe is meaningless.
- Add one hook per interactive control (sliders, toggles) if challenges
  depend on them: window.__setParam(name, value).
- Hooks are not dev-only cruft; they stay in the shipped page (they cost
  nothing and enable future regression loops).
