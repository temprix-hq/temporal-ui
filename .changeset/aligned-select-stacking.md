---
"@temporal-ui/core": patch
"@temporal-ui/react": patch
"@temporal-ui/solid": patch
---

Fix `Select` with `alignItemWithTrigger` opening underneath later positioned content when it is not portaled. The positioner is now `position: relative` instead of `static`, so its z-index applies.
