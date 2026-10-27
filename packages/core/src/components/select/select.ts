import type { FieldProps } from "../field";

export interface SelectItem<D = unknown, T = unknown> {
	value: string;
	label: string;
	group?: string;
	icon?: T;
	disabled?: boolean;
	data?: D;
}

export interface SelectProps<T = unknown> extends FieldProps<T> {
	portal?: boolean;
	icon?: T;
	maxDropdownHeight?: number;
	deselectable?: boolean;
	placeholder?: string;
	/**
	 * Overlap the dropdown on the trigger so the selected item covers the select and
	 * its text lines up with the value. The popup stays anchored to the select while
	 * the page scrolls, and it disappears in place when it closes.
	 */
	alignItemWithTrigger?: boolean;
	/** Minimum dropdown height required before falling back to standard placement. */
	alignItemWithTriggerMinHeight?: number;
	classes?: {
		root?: string;
		label?: string;
		hint?: string;
		error?: string;
		selectRoot?: string;
		positioner?: string;
		scrollArea?: string;
		content?: string;
		control?: string;
		trigger?: string;
		itemGroup?: string;
		itemIndicator?: string;
		item?: string;
		indicator?: string;
		valueText?: string;
		itemText?: string;
	};
}
