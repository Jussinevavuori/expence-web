import React from "react"
import HomeScreenView from "./HomeScreenView"
import { useStoreActions } from "../../store"

export default function HomeScreenController() {

	/**
	 * Load transactions for user
	 */
	const x = useStoreActions(_ => _.transactions.getTransactions)

	return <HomeScreenView />

}