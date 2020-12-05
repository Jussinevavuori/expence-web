import "./TransactionCreatorDrawer.scss";
import React from "react"
import { TransactionForm } from "../TransactionForm/TransactionFormController";
import { Drawer } from "@material-ui/core";
import { useMdMedia } from "../../hooks/useMedia";

export type TransactionCreatorDrawerViewProps = {
	open: boolean;
	onOpen(): void;
	onClose(): void;
}

export function TransactionCreatorDrawerView(props: TransactionCreatorDrawerViewProps) {

	const largerScreen = useMdMedia()

	return <Drawer
		className="TransactionCreatorDrawer"
		open={props.open}
		onClose={props.onClose}
		anchor={largerScreen ? "left" : "bottom"}
	>
		<div className="TransactionCreatorDrawer__Content">
			<TransactionForm
				onClose={props.onClose}
			/>
		</div>
	</Drawer>
}