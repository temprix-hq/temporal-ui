import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { Portal } from "@ark-ui/react/portal";
import type { ColorInputProps as CoreColorInputProps } from "@temporal-ui/core/color-input";
import { testId as testIdFn } from "@temporal-ui/core/utils/string";
import type React from "react";
import { forwardRef } from "react";
import { Field } from "../field";
import { ColorPanelControls } from "./ColorPanel";

export interface ColorInputProps
	extends
		CoreColorInputProps<React.ReactNode>,
		Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "value"> {}

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>((props, ref) => {
	const {
		label,
		hint,
		error,
		required,
		readOnly,
		disabled,
		testId,
		value,
		defaultValue,
		onValueChange,
		className,
		position,
		...inputProps
	} = props;
	const tid = testIdFn(testId);
	return (
		<Field
			label={label}
			hint={hint}
			required={required}
			readOnly={readOnly}
			error={error}
			disabled={disabled}
			testId={tid("-field")}
		>
			<ColorPicker.Root
				value={value ? parseColor(String(value)) : undefined}
				defaultValue={defaultValue ? parseColor(String(defaultValue)) : undefined}
				onValueChange={(details) => onValueChange?.(details.value.toString("hex"))}
				data-testid={tid("--root")}
				data-scope={"color-input"}
				openAutoFocus={false}
				positioning={{ placement: "bottom-start", ...position }}
			>
				<ColorPicker.Control data-scope={"color-input"} data-testid={tid("--control")}>
					<ColorPicker.Trigger
						data-scope={"color-input"}
						className={className}
						aria-invalid={error ? true : undefined}
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
							<ColorPanelControls testId={testId} />
						</ColorPicker.Content>
					</ColorPicker.Positioner>
				</Portal>
				<ColorPicker.HiddenInput
					ref={ref}
					{...inputProps}
					data-testid={tid("--input")}
					data-scope={"color-input"}
				/>
			</ColorPicker.Root>
		</Field>
	);
});
