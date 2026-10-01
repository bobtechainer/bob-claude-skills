# Recipe: Interactive Physics Lab Screen

Reference build: `double-pendulum/` ("CHAOS 01"). Single self-contained `index.html`, zero dependencies — the right default for one-screen experiments. Users can double-click the file and it works.

## The lab aesthetic

Dark bench (#060608), one glowing subject, instrument-panel chrome around it:
- Title block top-left: numbered series name ("CHAOS 01"), one-line scientific subtitle in tracked-out uppercase
- Telemetry top-right: monospace (JetBrains Mono class), values in bright, labels dimmed — time, energy, fps, plus one metric that PROVES the phenomenon (e.g. divergence px for chaos)
- Control panel bottom-left: frosted glass card (blur backdrop, hairline border), label + range + mono value rows, 2–3 buttons; accent color only on interactive hotspots
- Secondary visualization bottom-right (phase portrait, spectrum, histogram) — the "second instrument" that makes it feel like science, not a toy
- Centered hint line at bottom: drag/pause/reset affordances

## Physics rules

- Real equations of motion, RK4 integration, fixed substeps (1/240s), accumulator loop over real dt clamped to 50ms. Damping as explicit term.
- Energy readout visible. If energy drifts when it shouldn't, the sim is lying — fix the integrator, not the label.
- Sliders mutate parameters live; changing initial conditions (drag, randomize) re-seeds and clears trails.
- `window.__step(secs)` synchronous hook: integrate + draw without RAF. For review AND for reproducibility.

## Vividness toolkit (canvas 2D is enough)

- **Motion-blur veil:** don't clear — fill with `rgba(bg, ~0.3)` each frame.
- **Additive glow:** `globalCompositeOperation = 'lighter'` for trails/ghosts, back to `source-over` for the crisp subject on top.
- **Speed-mapped hue:** map |velocity| → HSL hue (e.g. 195→325); trail stores [x, y, hue] per point, drawn as fading polyline with width ramp.
- **Glowing bobs/bodies:** radial gradient halo (3.4× radius, transparent edge) under a hard sphere with offset white highlight.
- **Ghost ensemble for sensitivity:** N copies with epsilon-offset initial conditions, thin hue-spread arms — chaos becomes *visible*. Show a divergence number so it's quantified, not just pretty.
- Vignette radial gradient to pull the eye center.

## Interaction minimum bar

Drag to set state (pause integration while dragging, zero velocities, re-seed ghosts), Space pause, R reset, randomize button, speed slider. If the user can't poke it, it's a video, not an experiment.
