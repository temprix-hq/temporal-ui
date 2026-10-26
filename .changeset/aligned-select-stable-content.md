---
"@temporal-ui/core": patch
"@temporal-ui/react": patch
"@temporal-ui/solid": patch
---

Fix `Select` with `alignItemWithTrigger`: choosing an item with the mouse closed the list without selecting, keyboard navigation did nothing, and the item text touched the right edge. The list element is no longer remounted when alignment finishes, so focus and outside-press tracking stay on the real element, and the popup width now includes the item end padding.
