import "./Type.scss";
import React, { ElementType, forwardRef } from "react"
import cx from "classnames"
import { Typography, TypographyProps } from "@material-ui/core";

export type TypeProps = Omit<TypographyProps, "color"> & {
	component?: ElementType;
	color?: TypographyProps["color"] | "white" | "black"
	condensed?: boolean;
}

export const Type = forwardRef<HTMLElement, TypeProps>((props, ref) => {

	const { condensed, className, color, ...typographyProps } = props

	return <Typography

		ref={ref}

		{...typographyProps}

		color={(() => {
			switch (color) {
				case "white":
					return undefined;
				case "black":
					return undefined;
				default:
					return color;
			}
		})()}

		className={cx(
			className,
			"Type",
			{ condensed },
			`color-${String(color)}`
		)}
	/>
})