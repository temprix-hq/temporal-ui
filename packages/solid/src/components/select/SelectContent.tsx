import { Select as ArkSelect, useSelectContext } from "@ark-ui/solid/select";
import type { SelectItem as CoreSelectItem } from "@temporal-ui/core/select";
import { CheckIcon } from "lucide-solid";
import { For, mergeProps, Show, type JSX } from "solid-js";
import { useAlignItemWithTrigger } from "./use-align-item-with-trigger";

export type SelectItem<D = unknown> = CoreSelectItem<D, JSX.Element>;

export interface SelectContentProps {
	tid: (str: string) => string | undefined;
	maxHeight?: number;
	alignItemWithTrigger?: boolean;
	alignItemWithTriggerMinHeight?: number;
	openedWithTouch?: boolean;
	selectIds?: {
		control: string;
		trigger: string;
		valueText: string;
		positioner: string;
		content: string;
	};
	classes?: {
		content?: string;
		itemGroup?: string;
		itemGroupLabel?: string;
		item?: string;
		itemText?: string;
		itemIndicator?: string;
		positioner?: string;
		scrollArea?: string;
		input?: string;
	};
}

export function SelectContent(_props: SelectContentProps) {
	const props = mergeProps({ maxHeight: 500 }, _props);
	const context = useSelectContext();
	const { alignedStyles, isAlignPending, showAligned, shouldAlign } = useAlignItemWithTrigger(
		context,
		() => ({
			alignItemWithTrigger: props.alignItemWithTrigger,
			alignItemWithTriggerMinHeight: props.alignItemWithTriggerMinHeight,
			openedWithTouch: props.openedWithTouch,
			selectIds: props.selectIds,
		}),
	);

	const contentStyle = () =>
		showAligned() ? alignedStyles()?.content : { "max-height": `${props.maxHeight}px` };

	return (
		<ArkSelect.Positioner
			id={props.selectIds?.positioner}
			class={props.classes?.positioner}
			data-testid={props.tid("--positioner")}
			data-align-item-with-trigger={shouldAlign() ? "" : undefined}
			data-align-item-with-trigger-pending={isAlignPending() ? "" : undefined}
			style={showAligned() ? alignedStyles()?.positioner : undefined}
		>
			{/* Zag copies the positioner's first child's computed z-index onto `--z-index`.
			    The wrapper exists only while aligned so standard placement reads Select.Content. */}
			<Show
				when={showAligned()}
				fallback={
					<SelectContentBody
						tid={props.tid}
						classes={props.classes}
						selectIds={props.selectIds}
						style={contentStyle()}
					/>
				}
			>
				<div data-align-item-with-trigger-active="" style={alignedStyles()?.popup}>
					<SelectContentBody
						tid={props.tid}
						classes={props.classes}
						selectIds={props.selectIds}
						style={contentStyle()}
					/>
				</div>
			</Show>
		</ArkSelect.Positioner>
	);
}

function SelectContentBody(bodyProps: {
	tid: SelectContentProps["tid"];
	classes: SelectContentProps["classes"];
	selectIds: SelectContentProps["selectIds"];
	style?: Record<string, string>;
}) {
	const context = useSelectContext();

	return (
		<ArkSelect.Content
			id={bodyProps.selectIds?.content}
			class={bodyProps.classes?.content}
			data-testid={bodyProps.tid("--content")}
			style={bodyProps.style}
		>
			<div data-component="select" data-slot="list" data-testid={bodyProps.tid("--content-list")}>
				<For each={context().collection.group()}>
					{([type, group]) => (
						<ArkSelect.ItemGroup
							class={bodyProps.classes?.itemGroup}
							data-testid={bodyProps.tid("--item-group")}
						>
							<Show when={type}>
								<ArkSelect.ItemGroupLabel
									class={bodyProps.classes?.itemGroupLabel}
									data-testid={bodyProps.tid("--item-group-label")}
								>
									{type}
								</ArkSelect.ItemGroupLabel>
							</Show>
							<For each={group}>
								{(item) => (
									<ArkSelect.Item
										class={bodyProps.classes?.item}
										data-testid={bodyProps.tid("--item")}
										item={item}
									>
										<ArkSelect.ItemIndicator
											class={bodyProps.classes?.itemIndicator}
											data-testid={bodyProps.tid("--item-indicator")}
										>
											<CheckIcon />
										</ArkSelect.ItemIndicator>
										<Show when={item.icon}>{item.icon}</Show>
										<ArkSelect.ItemText
											class={bodyProps.classes?.itemText}
											data-testid={bodyProps.tid("--item-text")}
										>
											{item.label}
										</ArkSelect.ItemText>
									</ArkSelect.Item>
								)}
							</For>
						</ArkSelect.ItemGroup>
					)}
				</For>
			</div>
		</ArkSelect.Content>
	);
}
