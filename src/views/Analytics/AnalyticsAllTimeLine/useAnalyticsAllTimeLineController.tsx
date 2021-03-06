import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { DateUtils } from "../../../utils/DateUtils/DateUtils";
import { AnalyticsAllTimeLineProps } from "./AnalyticsAllTimeLine"

export function useAnalyticsAllTimeLineController(props: AnalyticsAllTimeLineProps) {

	const analytics = useAnalyticsContext()

	const data: { x: number, y: number }[] =
		Object.values(analytics.allTime.months)
			.sort((a, b) => a.key - b.key)
			.map((month) => ({ x: month.key, y: month.cumulativeTotal }))

	const labelOffset = Object.values(analytics.allTime.months)
		.reduce((min, next) => next.key < min ? next.key : min, Infinity)

	const total = analytics.allTime.total.total

	return {
		data,
		labelOffset,
		total,
		serializeMonth: DateUtils.serializeMonth,
		deserializeMonth: DateUtils.deserializeMonth,
	}
}