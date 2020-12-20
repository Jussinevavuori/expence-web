import "./TransactionList.scss";
import React, { createRef, useEffect } from "react"
import { TransactionListItem } from "../TransactionListItem/TransactionListItem";
import { format } from "date-fns"
import { AutoSizer, List } from "react-virtualized"
import { Type } from "../Type/Type";
import { TransactionListItemSkeleton } from "../TransactionListItemSkeleton/TransactionListItemSkeleton";
import { useTransactionListController } from "./useTransactionListController";

export type TransactionListProps = {
	showSkeletons?: boolean;
}

export function TransactionList(props: TransactionListProps) {

	const controller = useTransactionListController(props)

	// Recalculate virtualized list row heights each time the 
	// props change
	const virtualizedListRef = createRef<List>()
	useEffect(() => {
		virtualizedListRef.current?.recomputeRowHeights()
	}, [props, virtualizedListRef])

	// Render skeletons
	if (controller.showSkeletons) {
		return <div className="TransactionList">
			{
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
					return <TransactionListItemSkeleton i={i} key={i} />
				})
			}
		</div >
	}

	// Render list
	return <div className="TransactionList">
		<AutoSizer className="autoSizer">
			{
				(autoSizer) => <List
					ref={virtualizedListRef}
					className="virtualizedList"
					height={autoSizer.height}
					width={autoSizer.width}
					rowCount={controller.itemsByDates.length}
					rowHeight={({ index }) => {
						// Title total height    40 px
						// Item total height     80 px
						return controller.itemsByDates[index].items.length * 80 + 40
					}}
					noRowsRenderer={() => {
						return <Type className="emptyTransactions">
							{"No transactions"}
						</Type>
					}}
					rowRenderer={(rowProps) => {
						const entry = controller.itemsByDates[rowProps.index]

						return <div
							className="dateGroup"
							key={rowProps.key}
							style={rowProps.style}
						>
							<div className="dateGroupHeader">
								<Type variant="bold" color="gray-700" size="md">
									{toDatestring(entry.date)}
								</Type>
							</div>
							<ul>
								{
									entry.items.map(item => {
										return <li key={item.id}>
											<TransactionListItem transaction={item} />
										</li>
									})
								}
							</ul>
						</div>
					}}
				/>
			}
		</AutoSizer>

	</div>
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "dd.MM.")
		: format(date, "dd.MM.yyyy")
}

const currentYear = new Date().getFullYear()