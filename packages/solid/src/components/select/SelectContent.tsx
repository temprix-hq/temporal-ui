import { Select as ArkSelect, useSelectContext } from "@ark-ui/solid/select";
import {
	syncAlignWrapperZIndex,
	type SelectItem as CoreSelectItem,
} from "@temporal-ui/core/select";
import { CheckIcon } from "lucide-solid";
import { createEffect, createSignal, For, mergeProps, Show, type JSX } from "solid-js";
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

/** Layout-neutral wrapper used while an alignable select is open but not (yet) aligned. */
const idleWrapperStyle = { display: "contents" };

export function SelectContent(_props: SelectContentProps) {
	const props = mergeProps({ maxHeight: 500 }, _props);
	const context = useSelectContext();
	const { alignedStyles, concealedStyles, isAlignPending, showAligned, shouldAlign } =
		useAlignItemWithTrigger(context, () => ({
			alignItemWithTrigger: props.alignItemWithTrigger,
			alignItemWithTriggerMinHeight: props.alignItemWithTriggerMinHeight,
			openedWithTouch: props.openedWithTouch,
			selectIds: props.selectIds,
		}));

	// A signal rather than `let` + `ref={el}`: the JSX is preserved in the build, so the bundler never sees
	// the ref write, treats the variable as always undefined and drops this effect's body.
	const [wrapperEl, setWrapperEl] = createSignal<HTMLDivElement>();
	createEffect(() => {
		showAligned();
		const wrapper = wrapperEl();
		if (shouldAlign() && context().open && wrapper) {
			syncAlignWrapperZIndex(wrapper);
		}
	});

	const heldStyles = () => (showAligned() ? alignedStyles() : concealedStyles());
	const contentStyle = () => heldStyles()?.content ?? { "max-height": `${props.maxHeight}px` };

	return (
		<ArkSelect.Positioner
			id={props.selectIds?.positioner}
			class={props.classes?.positioner}
			data-testid={props.tid("--positioner")}
			data-align-item-with-trigger={shouldAlign() ? "" : undefined}
			data-align-item-with-trigger-pending={isAlignPending() ? "" : undefined}
			style={heldStyles()?.positioner}
		>
			{/* Zag tracks the content element for outside presses and focus, so Select.Content must never
			    remount while the select is open. A select that can align therefore always renders the
			    wrapper and only changes its styles. Zag also copies the positioner's first child's computed
			    z-index onto `--z-index`, so the idle wrapper takes over the content's computed z-index. */}
			<Show
				when={shouldAlign()}
				fallback={
					<SelectContentBody
						tid={props.tid}
						classes={props.classes}
						selectIds={props.selectIds}
						style={contentStyle()}
					/>
				}
			>
				<div
					ref={setWrapperEl}
					data-align-item-with-trigger-active={heldStyles() ? "" : undefined}
					style={heldStyles()?.popup ?? idleWrapperStyle}
				>
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
