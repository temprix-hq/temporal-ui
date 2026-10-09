import type { HTMLProps } from "@ark-ui/solid";
import { ColorPicker, parseColor } from "@ark-ui/solid/color-picker";
import type { ColorInputProps as CoreColorInputProps } from "@temporal-ui/core/color-input";
import { cx } from "@temporal-ui/core/utils/cx";
import { testId as testIdFn } from "@temporal-ui/core/utils/string";
import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Field } from "../field";
import { ColorPanelControls } from "./ColorPanel";
import { Portal } from "solid-js/web";

export interface ColorInputProps
	extends CoreColorInputProps<JSX.Element>, Omit<HTMLProps<"input">, "value"> {}

export function ColorInput(_props: ColorInputProps) {
	const [fieldProps, rootProps, inputProps] = splitProps(
		_props,
		["label", "hint", "error", "required", "readOnly", "disabled", "testId"],
		["value", "onValueChange", "defaultValue", "className", "class", "position"],
	);

	const tid = testIdFn(fieldProps.testId);

	return (
		<Field {...fieldProps} testId={tid("-field")}>
			<ColorPicker.Root
				value={rootProps.value ? parseColor(String(rootProps.value)) : undefined}
				defaultValue={
					rootProps.defaultValue ? parseColor(String(rootProps.defaultValue)) : undefined
				}
				onValueChange={(details) => rootProps.onValueChange?.(details.value.toString("hex"))}
				data-testid={tid("--root")}
				data-scope={"color-input"}
				openAutoFocus={false}
				positioning={{ placement: "bottom-start", ...rootProps.position }}
			>
				<ColorPicker.Control data-scope={"color-input"} data-testid={tid("--control")}>
					<ColorPicker.Trigger
						data-scope={"color-input"}
						class={cx(rootProps.className, rootProps.class)}
						aria-invalid={fieldProps.error ? true : undefined}
						data-testid={tid("--trigger")}
					>
						<ColorPicker.ChannelInput
							channel="hex"
							data-scope={"color-input"}
							data-testid={tid("--channel-input")}
						/>
						<ColorPicker.ValueSwatch
							style={{ position: "absolute" }}
							data-scope={"color-input"}
							data-testid={tid("--swatch")}
						/>
					</ColorPicker.Trigger>
				</ColorPicker.Control>
				<Portal>
					<ColorPicker.Positioner data-scope={"color-input"} data-testid={tid("--positioner")}>
						<ColorPicker.Content data-scope={"color-input"} data-testid={tid("--content")}>
							<ColorPanelControls testId={fieldProps.testId} />
						</ColorPicker.Content>
					</ColorPicker.Positioner>
				</Portal>
				<ColorPicker.HiddenInput
					{...inputProps}
					data-testid={tid("--input")}
					data-scope={"color-input"}
				/>
			</ColorPicker.Root>
		</Field>
	);
}
