import "./Dashboard.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionListController";
import { Auth } from "../../classes/Auth";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { MoneyType } from "../../components/MoneyType/MoneyType";
import { FiltersPanel } from "../../components/FiltersPanel/FiltersPanelController";
import { useLgMedia } from "../../hooks/useMedia";
import { TransactionTable } from "../../components/TransactionTable/TransactionTableController";

export type DashboardViewProps = {
	user: Auth;
	intervalString: string;

	filteredSum: MoneyAmount;
	filteredIncomesSum: MoneyAmount;
	filteredExpensesSum: MoneyAmount;
}

export function DashboardView(props: DashboardViewProps) {

	const desktopLayout = useLgMedia()

	return <div className="Dashboard">

		<PageHeader>

			<div className="totals">

				<MoneyType
					amount={props.filteredSum}
					variant="h4"
				/>

			</div>

		</PageHeader>

		<section className="filtersPanel">

			<FiltersPanel />

		</section>

		<section className="transactionsList">

			{
				desktopLayout
					? <TransactionTable />
					: <TransactionList />
			}

		</section>

	</div>

}