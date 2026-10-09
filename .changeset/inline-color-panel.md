---
"@temporal-ui/core": minor
"@temporal-ui/react": minor
"@temporal-ui/solid": minor
---

Add `ColorPanel`, an inline colour panel (hex field, saturation and brightness area, hue slider) with no trigger, popover or field wrapper. The value is a hex string in and out: `value` / `defaultValue` accept `#rrggbb`, `rrggbb` or 3-digit shorthand, and `onValueChange` receives lowercase `#rrggbb`. It supports `disabled`, `readOnly`, `autoFocus` (hex field), `hexLabel`, `actions` (content after the hex field, such as a Done button), `className` and `testId`. Arrow keys work on the area and hue slider, the hex field commits on Enter and on blur, invalid text leaves the value unchanged, and Escape is left to the host. Core adds the `ColorPanelProps` type and a `normalizeHexColor` helper (`@temporal-ui/core/utils/color`, re-exported from `@temporal-ui/react/utils/color` and `@temporal-ui/solid/utils/color`).

`ColorInput` now renders the same area and hue slider in its popover. Its markup, test ids and output are unchanged. The popover width (`w-96`) moved from the content part to the positioner, and the area height can be changed with the `--color-input-area-height` CSS variable (default `200px`).
