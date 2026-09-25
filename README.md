# Brewns — React, GSAP and Three.js recreation

A recording-based coffee website with local assets. This is a recreation, not the original source or a verified pixel-identical copy.

## Run

The production build is included. Run `node server.cjs` in this folder and open http://127.0.0.1:4173. Use the local server rather than opening index.html directly.

To change the source, run `npm ci`, `npm run build`, then `npm test`. Dependencies are pinned in package-lock.json. Node.js is required.

## What changed

- React owns the page components, navigation, basket and local order preview.
- GSAP coordinates the cup-filling loader, masked headings, rolling price digits, sequential labels and scroll-linked clock, story cup, beans and receipt. Intro durations are shortened from the previous version; scroll sequences follow the visitor's scrolling.
- Three.js renders the separate hero cup, coffee bag and story cup using custom geometry, packaging textures, lighting and materials. Static images remain as a fallback.
- Ponytail informed the implementation approach: keep responsibilities clear and avoid unnecessary additions. It is a development workflow, not a browser dependency.
- Graphify is an architecture-analysis tool, not an animation library. Its extraction status and outputs are reported separately.

The original layout styles and local replacement assets are retained. Each animated property has one controller. React does not rerender the static sections when the basket changes. Three.js resources and animation listeners are cleaned up on teardown.

## Source map

| File | Responsibility |
| --- | --- |
| src/App.jsx | React root, navigation, basket and accessible dialog |
| src/Sections.jsx | Page sections, loader and clock markup |
| src/motion.js | GSAP timelines, scroll triggers and pointer interaction |
| src/scenes.js | Three.js renderers, lighting, materials and lifecycle |
| src/labels.js, src/bag-geometry.js | Custom packaging artwork and pouch geometry |
| src/beans.js | Shaded canvas coffee beans |
| src/basket.js, src/basket.test.js | Basket calculations and focused checks |
| src/framework.css | Overrides for the migrated animation controllers |
| style.css, motion.css, reference.css | Existing layout and visual styling |
| build.mjs | Production bundling with project-scoped dependency resolution |
| reference-motion.md | Recording observations and fidelity limits |
| assets/, asset-prompts.md | Replacement assets and provenance |
| server.cjs | Local preview server |

## Verification and limits

The production build and basket checks passed. Browser review covered desktop and 390 × 844 phone layouts: loader completion, independent cup/bag rendering, menu labels and prices, story cup silhouette, philosophy, receipt, mobile navigation, and adding/removing an espresso in the local basket. No horizontal phone overflow was observed. Reduced-motion rules are implemented but were not separately tested with browser preference emulation.

The initial Three.js environment shader produced a precision warning during review. The earlier browser runtime error was corrected by bundling Three.js's browser ES module. No performance benchmark was conducted; shorter animation durations do not imply a measured frame-rate improvement.

Generated images, custom cup/bag geometry, fonts and inferred timing still differ from the reference. Original assets and animation curves would be required for an exact match. The clock drink remains an image and the beans use canvas, rather than Three.js. Orders are local demonstrations; there is no checkout, payment or backend.

The AI-agent playbook previously moved to the Desktop is a separate historical document. This README describes the current migrated implementation.

## Library references

- [React createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia())
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Three.js physical materials](https://threejs.org/docs/pages/MeshPhysicalMaterial.html)

## Graphify status — September 19
The installed Graphify runtime could not be executed because filesystem access was denied. No Graphify graph, report, or visualization was generated. The source map above is a manually documented guide, not Graphify output.

