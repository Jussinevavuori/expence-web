import "./TransactionListItem.scss";
import React, { useCallback, useMemo } from "react"
import cx from "classnames"
import { Transaction } from "../../classes/Transaction";
import {
	Check as SelectedIcon,
} from "react-feather"
import useLongPress from "../../hooks/useLongPress";
import { useVibration } from "../../hooks/useVibration";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";
import { motion, Variants } from "framer-motion";
import { useTransactionListItemController } from "./useTransactionListItemController";

export type TransactionListItemProps = {
	transaction: Transaction;
}

export function TransactionListItem(props: TransactionListItemProps) {

	const controller = useTransactionListItemController(props)
	const { handleSelect, handleDeselect, selected, selectionActive } = controller

	const vibrate = useVibration()

	/**
	 * Long presses acts as toggle: this function is the callback when a long
	 * press activates
	 */
	const handleLongPress = useCallback(() => {
		if (selectionActive) {
			vibrate("weak")
		}
		if (selected) {
			handleDeselect()
		} else {
			handleSelect()
		}
	}, [handleSelect, handleDeselect, selected, selectionActive, vibrate])

	/**
	 * No timeout when selected, else default timeout for long presses
	 */
	const longPressTimeout = useMemo(() => {
		return selectionActive ? 0 : undefined
	}, [selectionActive])

	/**
	 * Long press handler
	 */
	const pressHandler = useLongPress(handleLongPress, {
		pressTimeInMs: longPressTimeout,
		disableVibrate: selectionActive,
	})

	return <div
		className={cx("TransactionListItem", {
			pressed: pressHandler.pressed,
			upcoming: props.transaction.isUpcoming,
		})}
		{...pressHandler.props}
		onContextMenu={e => {
			e.stopPropagation()
			controller.handleContextMenu(e)
		}}
	>
		<div className={cx("icon", {
			pressed: pressHandler.pressed,
			selected: controller.selected,
			selectionActive: controller.selectionActive
		})}>
			<motion.div
				variants={iconVariants}
				animate={
					controller.selectionActive
						? controller.selected
							? "selected"
							: "unselected"
						: "regular"
				}
			>
				<div
					className="iconContainer"
					onClick={() => {
						if (controller.selected) {
							controller.handleDeselect()
						} else {
							controller.handleSelect()
						}
						vibrate("weak")
					}}
					{...pressHandler.childlockProps}
				>
					{
						controller.selectionActive
							? controller.selected
								? <SelectedIcon />
								: null
							: props.transaction.amount.isPositive
								? <span className="emoji">
									{props.transaction.category.incomeIcon.substr(0, 2)}
								</span>
								: <span className="emoji">
									{props.transaction.category.expenseIcon.substr(0, 2)}
								</span>
					}
				</div>
			</motion.div>
		</div>
		<div className="category">
			<Type color="gray-800" size="md" variant="bold">
				{props.transaction.category.value}
			</Type>
		</div>
		<div className="comment">
			<Type color="gray-600" size="md" variant="regular">
				{props.transaction.comment}
			</Type>
		</div>
		<div className={cx("amount")}>
			<MoneyType
				amount={props.transaction.amount}
				colorIfPositive="green-600"
				colorIfNegative="red-600"
				size="lg"
				variant="bold"
			/>
		</div>
	</div >
}

const iconVariants: Variants = {

	selected: {
		scale: 1.4,
		transition: {
			repeat: 1,
			repeatType: "mirror",
			type: "spring",
			duration: 0.2,
			bounce: 1,
		}
	},
	unselected: {
		scale: 1,
	},
	regular: {
		scale: 1,
	},
}