import { useMemo } from "react"
import { MoneyAmount } from "../../../classes/MoneyAmount"
import { useStoreState } from "../../../store"
import { DashboardHeaderProps } from "./DashboardHeader"

export function useDashboardHeaderController(props: DashboardHeaderProps) {

	const intervalString = useStoreState(_ => _.interval.smartDisplayString)

	const transactions = useStoreState(_ => _.transactions.filtered.items)

	const isSelectionActive = useStoreState(_ => _.selection.selectionActive)

	const selectionLength = useStoreState(_ => _.selection.selectionLength)

	const transactionsCount = useMemo(() => {
		return transactions.length
	}, [transactions])

	const transactionsTotal = useMemo(() => {
		return MoneyAmount.sum(transactions.map(_ => _.amount))
	}, [transactions])

	const transactionsTotalIncome = useMemo(() => {
		return MoneyAmount.sum(transactions.filter(_ => _.amount.isPositive).map(_ => _.amount))
	}, [transactions])

	const transactionsTotalExpense = useMemo(() => {
		return MoneyAmount.sum(transactions.filter(_ => _.amount.isNegative).map(_ => _.amount))
	}, [transactions])

	return {
		intervalString,
		transactionsCount,
		transactionsTotal,
		transactionsTotalIncome,
		transactionsTotalExpense,
		isSelectionActive,
		selectionLength,
	}
}