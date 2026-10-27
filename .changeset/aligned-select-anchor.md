---
"@temporal-ui/core": patch
"@temporal-ui/react": patch
"@temporal-ui/solid": patch
---

Fix `Select` with `alignItemWithTrigger` so the popup stays anchored to the select while the page scrolls, and so the open popup covers the select. The select's top border no longer shows above the popup, and the corners line up.
