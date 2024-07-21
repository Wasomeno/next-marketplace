import React, { ReactNode } from "react"

export const AnalyticCard: React.FC<{
  data: number | string
  title: string
  icon: ReactNode
}> = ({ data, title, icon }) => {
  return (
    <div className="col-span-1 flex items-center gap-2 rounded-lg border p-2 shadow-sm">
      <div className="flex w-16 items-center justify-center">{icon}</div>
      <div className="space-y-2">
        <h6 className="text-xs text-gray-500 lg:text-sm">{title}</h6>
        <span className="text-xs font-medium lg:text-2xl">{data}</span>
      </div>
    </div>
  )
}
