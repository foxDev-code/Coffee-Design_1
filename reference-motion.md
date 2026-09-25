# Reference review — September 15

The second recording was sampled every 0.2 seconds, including the replay at 7 seconds. The first recording is no longer at its supplied path; previously extracted frames were used to cross-check its menu, loader, hero, locations, story, and receipt scenes.

| Recording time | Visible behavior | Implementation |
| --- | --- | --- |
| 0.0–1.2 / 7.0–8.4 | Hero lines uncover; handwritten word reveals later; navigation reveals horizontally | Masked staggered lines and delayed word/nav reveals |
| 0.0–1.4 | Bag/cup information changes on pointer movement; cup orientation changes independently | Separate cup and bag meshes; separate information states |
| 1.6–2.2 | Menu eyebrow precedes line-by-line title | Intersection-triggered line masks |
| 2.4–3.2 | Names type in; prices start at zero and finish at their displayed amounts | Deterministic increasing prices and sequential labels; no hover restart |
| 2.8–4.4 | Clock drink remains near upright, then tilts clockwise as the section leaves | Scroll-linked clockwise rotation; no perpetual bobbing |
| 4.2–4.8 | Story title uncovers while beans appear at different depths | Line masks and shaded rotating bean particles |
| 4.8–5.6 | Cup moves upward with the page while rotating; its top stays approximately 528 px below the story start | Removed extra vertical parallax; independent cup rotation follows scroll |
| 5.4–5.8 | Philosophy row reveals along the story bottom | Restored three-column philosophy row |
| 5.4–6.0 | Receipt tail emerges first from the slot, followed by image and header | Translate the entire paper downward inside the slot clipping window |
| 6.2–6.8 | Schedule paragraph, closing copy, order link, then footer | Restored order copy and footer |

The recording's scroll speed depends on the recorded user input. Scroll-triggered effects therefore follow page position, rather than an automatic nine-second playback. The cut back to the hero is not treated as an automatic page loop.

The source models, photographs, font files, original animation curves, and unseen destination pages are not present in the recordings. Product/background images remain generated replacements. The cup is now a locally rendered 3D mesh; the bag uses custom textured geometry and the clock drink remains an image. Beans use shaded canvas particles. Footer details that are cut off cannot be transcribed reliably. This is not a verified pixel-identical copy.

## Follow-up review

The duplicate-cup defect was caused by cropping the combined hero image while displaying a new cup on top. Both hero objects now render independently, and the combined image is hidden completely. Price columns now roll vertically. Multi-line paragraphs reveal by word. The Locations heading has clearance beneath the fixed navigation on desktop and mobile. All sections were reviewed at desktop and phone widths, including both partial and complete receipt states.

## Opening correction — September 16

Removed the unsupported sideways loader spin and separate delayed hero fade. The upright fill now holds briefly at 100% before the hero line masks begin. The handwritten word uses a 1-second horizontal reveal after a 0.3-second delay. These exit timings are reconstruction choices: a hand obscures the earlier recording's loader exit, and the complete original recording is unavailable at its supplied path.

The latest recording shows approximately 230 px between the menu heading and cards. The desktop gap now scales with viewport height; browser inspection at 1262 × 824 measured 230.934 px. Card label starts are staggered by 120 ms from left to right. Browser review confirmed the upright loader, completed hero, zero-price card entrance, final prices, and clock arrival; no browser warnings or errors were reported.


## Story cup follow-up
The drawing surface now spans the story width and keeps a minimum horizontal center clearance on narrow desktop windows. The story cup camera tilt is 0.48 radians, with reduced scroll-linked yaw and roll; it retains page-relative vertical movement. Visually reviewed in the live browser at 750 × 780 at two scroll positions: no vertical clipping edge, no console warnings/errors. Its bottom remains masked by the next section, as in the supplied reference. Custom geometry still differs from the original model.


## Faster pacing requested by user
CSS animation durations and delays are now 70% of their prior values. Scripted loader, text and price sequences share the same speed ratio; scroll, pointer and receipt interpolation use the corresponding frame-rate-independent speed multiplier. Cup poses, section geometry and scroll travel remain unchanged. Reduced-motion overrides remain in place.

## September 17 framework migration
React now owns the UI; GSAP owns animation sequencing; Three.js owns cup and bag rendering. See README.md for current verification and remaining differences. Earlier native implementation descriptions above are historical observations.


## Story framing correction
Compared extracted frames at 5.0 and 5.4 seconds with the reported screenshot. Reduced story tilt from 0.48 radians to a scroll-linked 0.22–0.26 range. Narrow-screen cup width now follows section width instead of the minimum section height, while retaining a taller silhouette and stable entrance height. Restored the philosophy column to 40% clearance on screens above 520 px. Browser review checked the philosophy pose and next-section transition; no runtime errors were reported. These remain reconstruction choices rather than original model parameters.

