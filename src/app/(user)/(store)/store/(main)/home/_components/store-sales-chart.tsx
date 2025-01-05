"use client"

import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import { getStoreMonthlySales, getStoreYearlySales } from "../../../_actions"

export const StoreSalesChart = () => {
  const [chartMode, setChartMode] = useState<"month" | "year">("month")

  const searchParamValues = useSearchParamsValues<{
    month: string
    year: string
  }>()

  const currentTime = moment()

  const yearlySales = useQuery({
    queryKey: ["yearlySales", searchParamValues],
    queryFn: () =>
      getStoreYearlySales(
        searchParamValues.year
          ? Number(searchParamValues.year)
          : currentTime.get("year")
      ),
  })

  const monthlySales = useQuery({
    queryKey: ["montlySales", searchParamValues],
    queryFn: () =>
      getStoreMonthlySales(
        searchParamValues.month
          ? Number(searchParamValues.month)
          : currentTime.get("month")
      ),
  })

  return (
    <div className="w-full space-y-2 rounded-lg border p-4 shadow-sm lg:px-6 lg:py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-medium lg:text-lg">Total Sales</h2>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        {chartMode === "year" ? (
          <AreaChart
            data={yearlySales.data?.map((sale) => ({
              name: sale.month,
              uv: sale.sales,
            }))}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        ) : (
          <AreaChart
            data={monthlySales.data?.map((sale) => ({
              name: sale.date,
              uv: sale.sales,
            }))}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
