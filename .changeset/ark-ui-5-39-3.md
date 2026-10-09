---
"@temporal-ui/react": patch
"@temporal-ui/solid": patch
---

Upgrade `@ark-ui/react` and `@ark-ui/solid` to 5.39.3 (zag 1.45.0). `Menu` keeps calling `onSelect` with the item that was clicked, including when a different item is highlighted from the keyboard; Ark UI 5.39.2 reported the highlighted item instead, so 5.39.2 is skipped.
