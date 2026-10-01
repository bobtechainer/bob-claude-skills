# Recipe: Scroll-Driven 3D Product Film

Reference build: `the-toy/` (RX-60 wind-up robot, clone of thewatch.60fps.fr patterns). Read its `PLAN.md` for a complete worked example of the storyboard format.

## Stack

Vite + Three.js + a timeline lib (anime.js v4 or GSAP — both fine; the scrub is custom either way). Vanilla JS; a framework earns nothing here. No build-time 3D assets if the subject can be procedural — primitives + PMREM RoomEnvironment reflections look expensive and cost zero payload.

## Architecture that works

```
index.html      loader, fixed transparent canvas, type-layer BEHIND canvas,
                UI overlay panels ABOVE canvas, tall scroll-space div (~1400vh)
src/main.js     renderer, camera, env, scroll-scrub driver, RAF, resize, __seek hook
src/<subject>.js  buildSubject(palette) -> { group, parts } with userData.explodeOffset + .home
src/scenes.js   ALL choreography: keyframe tables sampled by progress
src/particles.js  points cloud for the dark section
```

- **One progress value rules everything.** `scroll listener → target; RAF → progress lerps to target; applyProgress(p, t)` sets camera, subject rotation, explode factor, theme, DOM timeline seek, counters. DOM fades via timeline lib seeked to `p * DURATION`; 3D via plain keyframe tables `[{p, v:[..]}]` with smoothstep sampling — simpler and more debuggable than forcing 3D values through a tween lib.
- **Layering for occlusion:** `#type-back` z1 → canvas (alpha:true, scene.background=null) z2 → `#ui` z3. Page bg is a CSS radial gradient on body; dark-section flip = separate fixed overlay div whose opacity is timeline-driven + a `body.dark` class flip at 0.5 crossing (CSS vars for text colors, `transition: color .5s` on text elements).

## The scene vocabulary (steal freely)

Hero split-type → statement tumble through layered giant type → feature close-ups with side text columns → **axis explode with projected labels** → dark "heart" section (particles, spinning internals, ticking counter) → reassembly with ghost type → macro close-ups → colorway lineup finale. That's the whole genre in one sentence.

## Details that separate amateur from luxury

- Exploded-view labels must **track their parts**: project each part's world position to screen X every frame (`getWorldPosition → project(camera)`), then run a min-gap pass (sort by x, push apart ~70px) so labels never collide.
- Explode along ONE axis, camera at 3/4 (not perpendicular — you want to see faces, not profiles). Fan overlapping parts diagonally (±Y and ±Z offsets) so nothing shares a screen column.
- Loader: SVG circle with dashoffset animation, hide after first rendered frame + delay, AND a `setTimeout` fallback (~2.5s) so throttled tabs never strand it.
- Macro close-ups: keep centered copy above the subject's "face line" — reframe the camera lookAt rather than moving the DOM.
- Colorway finale: build palette-swapped clones up front (scale 0, invisible), pop them in with smoothstep scale over ~0.06 progress; slide the hero into the lineup with its own X keyframe.
