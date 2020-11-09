import "./AppFrame.scss";
import React from "react"
import { Sidebar } from "../Sidebar/SidebarController";
import { TransactionEditorDrawer } from "../../components/TransactionEditorDrawer/TransactionEditorDrawerController";
import { TransactionCreatorDrawer } from "../../components/TransactionCreatorDrawer/TransactionCreatorDrawerController";

export type AppFrameViewProps = {
	children: React.ReactNode;
	initialized: boolean;
}

export function AppFrameView(props: AppFrameViewProps) {

	return <div className="AppFrame">
		{
			props.initialized && <>
				<TransactionCreatorDrawer />
				<TransactionEditorDrawer />
			</>
		}
		<div className="sidebar">
			<Sidebar />
		</div>
		<div className="main">
			{props.children}
		</div>
	</div>
}