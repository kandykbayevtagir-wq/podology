# Motion performance and mobile interaction

Update: 15 October 2026. Existing routes, generated photography, business logic and WhatsApp booking are retained.

## Rendering changes

- The same refractive shader, texture, dispersion, highlights and drawing-buffer resolution are retained. Cover coordinates are precomputed on resize; equivalent powers use multiplication, and a single fullscreen triangle replaces the two triangles.
- Texture upload/compilation starts after the full-quality image can paint, when the hero is visible. Duplicate resize notifications do not reallocate/clear the drawing buffer.
- Deadline-based scheduling requests one animation frame per rendered frame, preserving the desktop 30 fps/mobile 24 fps limits without the previous cadence drift. No per-frame HTML attribute writes remain.
- Rendering stops when the hero leaves the viewport, the document is hidden, the mobile menu covers the page, reduced motion is selected or the page is suspended. Context restoration rebuilds the effect. Timers, GPU resources, listeners, observers and temporary layers are cleaned up, including browser back/forward cache navigation.
- Entry animations use opacity/translation instead of animating blur over readable text. Frosted glass surfaces remain. The hero's diffuse glow is static and the floating sphere no longer recomputes backdrop blur while moving.
- Service, course, location, team, social and payment cards share lightweight shine layers. Their sheen runs on entry, pointer interaction, keyboard focus or passive touch, and stops offscreen/when hidden. No extra WebGL contexts are created for cards. Pointer geometry is cached rather than measured every frame; phone gestures are not captured or cancelled.
- Browsers supporting CSS view timelines get a gentle compositor-driven image depth effect as course images scroll. Other browsers retain the static image and entry shine.

## Image interaction

All rendered images have `draggable="false"`, including without JavaScript. CSS disables image selection/dragging and iOS callouts. Scoped context-menu and drag handlers discourage ordinary saving on images, illustrations and their wrappers. Text selection, text context menus, links, form fields, keyboard shortcuts and native scrolling remain available.

This is an interaction deterrent, not access control. Public images can still be obtained from network tools, cache, screenshots or direct URLs. No protection claim, obfuscation or browser-shortcut blocking is used.

## Measurements

Raw samples are in `docs/measurements/`. Chrome/Playwright used software WebGL (SwiftShader), not a physical phone. Each sample measures approximately 2.5 seconds after warm-up. The mobile context has a 390 × 844 viewport, touch enabled and DPR 3; the desktop viewport is 1440 × 1000. These samples demonstrate the local improvement, not guaranteed FPS on every device.

| Context | Before: draws / rAF callbacks / attribute writes | After: draws / rAF callbacks / attribute writes | Drawing buffer, unchanged |
| --- | --- | --- | --- |
| Desktop | 22 / 22 / 44 | 25 / 25 / 0 | 516 × 552 |
| Mobile emulation | 31 / 55 / 62 | 55 / 55 / 0 | 312 × 340 |

A separate GPU readback comparison freezes the old/new shaders at the same time, pointer, texture and resolution. Across all RGB channels, the maximum difference is **1 out of 255**, the mean difference is 0.000139 levels, and normalized RMSE is 0.0000463. The optimized shader therefore preserves the previous appearance within quantization noise; it does not trade away image resolution.

Validation includes the existing Node tests, production build, seven responsive widths, real browser interactions on desktop/touch emulation, normal links and WhatsApp, media-only context/drag blocking, selectable text, card shines, native touch scrolling, offscreen/menu/hidden-tab suspension, context loss/recovery, reduced-motion toggling and back/forward-cache cleanup. Desktop/mobile screenshots are captured separately; physical-device validation remains useful for device-specific driver behavior.
