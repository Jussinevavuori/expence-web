import React, { useMemo } from "react"
import { useStoreActions, useStoreState } from "../../store"
import { DataUtils } from "../../utils/DataUtils/DataUtils"
import { TransactionTableHeaderView } from "./TransactionTableHeaderView"

export type TransactionTableHeaderProps = {

}

export function TransactionTableHeader(props: TransactionTableHeaderProps) {

	const selection = useStoreState(_ => _.selection.selection)
	const transactions = useStoreState(_ => _.transactions.filtered.items)

	const toggleSort = useStoreActions(_ => _.transactions.sort.toggle)

	const sortingStrategy = useStoreState(_ => _.transactions.sort.strategy)

	const isSelectionActive = useStoreState(_ => _.selection.selectionActive)
	const isAllSelected = useMemo(() => {
		return DataUtils.compareArrays(transactions.map(_ => _.id), selection.map(_ => _.id))
	}, [transactions, selection])

	const handleSelectAll = useStoreActions(_ => _.selection.selectAll)
	const handleDeselectAll = useStoreActions(_ => _.selection.deselectAll)

	return <TransactionTableHeaderView
		isSelectionActive={isSelectionActive}
		isAllSelected={isAllSelected}

		onSelectAll={() => handleSelectAll(transactions.map(_ => _.id))}
		onDeselectAll={() => handleDeselectAll()}

		sortingStrategy={sortingStrategy}
		onToggleSort={(property) => toggleSort(property)}
	/>
}