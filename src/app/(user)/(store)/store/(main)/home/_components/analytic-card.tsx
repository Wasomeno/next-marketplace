import clsx from "clsx"
import React, { ReactNode } from "react"
import { HiArrowTrendingDown, HiArrowTrendingUp } from "react-icons/hi2"

export const AnalyticCard: React.FC<{
  data: number | string
  title: string
  performancePercentage: {
    number: number
    type: "negative" | "positive"
  }
  icon: ReactNode
}> = ({ data, title, icon, performancePercentage }) => {
  const performancePercentageStyle = {
    negative: {
      fontColor: "text-red-500",
      icon: <HiArrowTrendingDown />,
    },
    positive: {
      fontColor: "text-green-500",
      icon: <HiArrowTrendingUp />,
    },
  }
  return (
    <div className="relative col-span-1  flex items-center gap-2 rounded-lg border p-2 shadow-sm">
      <div className="flex w-16 items-center justify-center">{icon}</div>
      <div className="space-y-2">
        <h6 className="text-xs text-gray-500 lg:text-sm">{title}</h6>
        <span className="text-xs font-medium lg:text-2xl">{data}</span>
      </div>
      <div
        className={clsx(
          "absolute text-sm flex items-center gap-1 top-2 right-4",
          performancePercentageStyle[performancePercentage.type].fontColor
        )}
      >
        <span>
          {performancePercentage.type === "negative" ? "-" : "+"}
          {performancePercentage.number}%
        </span>
        {performancePercentageStyle[performancePercentage.type].icon}
      </div>
    </div>
  )
}
