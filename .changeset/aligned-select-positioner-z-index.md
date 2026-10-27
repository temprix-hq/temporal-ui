---
"@temporal-ui/core": patch
"@temporal-ui/react": patch
"@temporal-ui/solid": patch
---

Select: keep the `alignItemWithTrigger` popup above positioned page content. The positioner now always takes the content's z-index, so sticky headers and other positioned elements no longer paint over the popup or take its hover. In Solid the built package had silently dropped the z-index copy, because the wrapper ref was a plain `let` that the bundler folded to undefined.
