import "./Type.scss";
import React, { ElementType, forwardRef } from "react"
import cx from "classnames"
import { Typography, TypographyProps } from "@material-ui/core";

export type TypeProps = Omit<TypographyProps, "color" | "variant"> & {
	component?: ElementType;

	color?:
	| "white"
	| "black"
	| "blue-100"
	| "blue-200"
	| "blue-300"
	| "blue-400"
	| "blue-500"
	| "blue-600"
	| "blue-700"
	| "blue-800"
	| "blue-900"
	| "gray-100"
	| "gray-200"
	| "gray-300"
	| "gray-400"
	| "gray-500"
	| "gray-600"
	| "gray-700"
	| "gray-800"
	| "gray-900"
	| "red-100"
	| "red-200"
	| "red-300"
	| "red-400"
	| "red-500"
	| "red-600"
	| "red-700"
	| "red-800"
	| "red-900"
	| "green-100"
	| "green-200"
	| "green-300"
	| "green-400"
	| "green-500"
	| "green-600"
	| "green-700"
	| "green-800"
	| "green-900"
	| "yellow-100"
	| "yellow-200"
	| "yellow-300"
	| "yellow-400"
	| "yellow-500"
	| "yellow-600"
	| "yellow-700"
	| "yellow-800"
	| "yellow-900"
	| "pink-100"
	| "pink-200"
	| "pink-300"
	| "pink-400"
	| "pink-500"
	| "pink-600"
	| "pink-700"
	| "pink-800"
	| "pink-900"
	| "purple-100"
	| "purple-200"
	| "purple-300"
	| "purple-400"
	| "purple-500"
	| "purple-600"
	| "purple-700"
	| "purple-800"
	| "purple-900"
	| "primary-100"
	| "primary-200"
	| "primary-300"
	| "primary-400"
	| "primary-500"
	| "primary-600"
	| "primary-700"
	| "primary-800"
	| "primary-900"

	variant?: "regular" | "bold" | "boldcaps";

	size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";

	center?: boolean;

	disablePointerEvents?: boolean;

}

export const Type = forwardRef<HTMLElement, TypeProps>((props, ref) => {

	const {
		className,
		size,
		color,
		variant,
		center,
		disablePointerEvents,
		...typographyProps
	} = props

	const textColor = color ?? "gray-900"
	const textVariant = variant ?? "regular"
	const textSize = size ?? "md"

	return <Typography

		ref={ref}

		{...typographyProps}

		className={cx(
			"Type",
			className,
			`Type-color-${textColor}`,
			`Type-variant-${textVariant}`,
			`Type-size-${textSize}`,
			{
				centered: center,
				pointerEventsDisabled: disablePointerEvents,
			}
		)}
	/>
})