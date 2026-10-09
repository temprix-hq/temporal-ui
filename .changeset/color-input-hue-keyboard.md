---
"@temporal-ui/core": patch
"@temporal-ui/react": patch
"@temporal-ui/solid": patch
---

Fix `ColorInput` throwing `Unknown color channel: hue` when the hue slider thumb in its popover is used with the keyboard (arrow keys, Page Up/Down, Home, End). The picker keeps its value in RGB, so the hue keys are now applied to the HSB equivalent instead. The hidden input value (`rgba(r, g, b, 1)`) and the hex string passed to `onValueChange` are unchanged. Core adds a `getHueKeyAction` helper to `@temporal-ui/core/utils/color`.
