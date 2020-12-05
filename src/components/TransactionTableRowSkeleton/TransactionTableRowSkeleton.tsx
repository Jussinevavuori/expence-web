import "./TransactionTableRowSkeleton.scss";
import React from "react"
import { Skeleton } from "../Skeleton/Skeleton";

export type TransactionTableRowSkeletonProps = {

}

export function TransactionTableRowSkeleton(props: TransactionTableRowSkeletonProps) {
	return <div className="TransactionTableRowSkeleton">

		<div className="action" >
			<Skeleton
				width="24px"
				height="24px"
			/>
		</div>
		<div className="category">
			<Skeleton
				width={{ min: 20, max: 90, unit: "%" }}
				height="100%"
			/>
		</div>
		<div className="amount">
			<Skeleton
				width={{ min: 48, max: 64, unit: "px" }}
				height="100%"
			/>
		</div>
		<div className="comment">
			<Skeleton
				width={{ min: 20, max: 80, unit: "%" }}
				height="100%"
			/>
		</div>
		<div className="date">
			<Skeleton
				width={{ min: 48, max: 64, unit: "px" }}
				height="100%"
			/>
		</div>

	</div>
}