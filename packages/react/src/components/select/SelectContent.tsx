import { Select as ArkSelect, useSelectContext } from "@ark-ui/react/select";
import type { SelectItem as CoreSelectItem } from "@temporal-ui/core/select";
import { CheckIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { useAlignItemWithTrigger } from "./use-align-item-with-trigger";

export type SelectItem<D = unknown> = CoreSelectItem<D, React.ReactNode>;

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

export function SelectContent(props: SelectContentProps) {
	const {
		tid,
		maxHeight = 500,
		classes,
		alignItemWithTrigger,
		alignItemWithTriggerMinHeight,
		openedWithTouch,
		selectIds,
	} = props;
	const context = useSelectContext();
	const { alignedStyles, isAlignPending, showAligned, shouldAlign } = useAlignItemWithTrigger(
		context,
		{
			alignItemWithTrigger,
			alignItemWithTriggerMinHeight,
			openedWithTouch,
			selectIds,
		},
	);

	const contentStyle = showAligned ? alignedStyles?.content : { maxHeight: `${maxHeight}px` };

	return (
		<ArkSelect.Positioner
			id={selectIds?.positioner}
			className={classes?.positioner}
			data-testid={tid("--positioner")}
			data-align-item-with-trigger={shouldAlign ? "" : undefined}
			data-align-item-with-trigger-pending={isAlignPending ? "" : undefined}
			style={showAligned ? alignedStyles?.positioner : undefined}
		>
			{/* Zag copies the positioner's first child's computed z-index onto `--z-index`.
			    The wrapper exists only while aligned so standard placement reads Select.Content. */}
			{showAligned ? (
				<div data-align-item-with-trigger-active="" style={alignedStyles?.popup}>
					<SelectContentBody
						tid={tid}
						classes={classes}
						selectIds={selectIds}
						style={contentStyle}
					/>
				</div>
			) : (
				<SelectContentBody tid={tid} classes={classes} selectIds={selectIds} style={contentStyle} />
			)}
		</ArkSelect.Positioner>
	);
}

function SelectContentBody(props: {
	tid: SelectContentProps["tid"];
	classes: SelectContentProps["classes"];
	selectIds: SelectContentProps["selectIds"];
	style?: CSSProperties | Record<string, string>;
}) {
	const context = useSelectContext();

	return (
		<ArkSelect.Content
			id={props.selectIds?.content}
			className={props.classes?.content}
			data-testid={props.tid("--content")}
			style={props.style}
		>
			<div data-component="select" data-slot="list" data-testid={props.tid("--content-list")}>
				{context.collection.group().map(([type, group]) => (
					<ArkSelect.ItemGroup
						key={type}
						className={props.classes?.itemGroup}
						data-testid={props.tid("--item-group")}
					>
						{type && (
							<ArkSelect.ItemGroupLabel
								className={props.classes?.itemGroupLabel}
								data-testid={props.tid("--item-group-label")}
							>
								{type}
							</ArkSelect.ItemGroupLabel>
						)}
						{group.map((item) => (
							<ArkSelect.Item
								key={item.value}
								className={props.classes?.item}
								data-testid={props.tid("--item")}
								item={item}
							>
								<ArkSelect.ItemIndicator
									className={props.classes?.itemIndicator}
									data-testid={props.tid("--item-indicator")}
								>
									<CheckIcon />
								</ArkSelect.ItemIndicator>
								{item.icon}
								<ArkSelect.ItemText
									className={props.classes?.itemText}
									data-testid={props.tid("--item-text")}
								>
									{item.label}
								</ArkSelect.ItemText>
							</ArkSelect.Item>
						))}
					</ArkSelect.ItemGroup>
				))}
			</div>
		</ArkSelect.Content>
	);
}
