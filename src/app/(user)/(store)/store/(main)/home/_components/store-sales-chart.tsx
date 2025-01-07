"use client"

import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TBaseDataFilterParams } from "../../../../../../../../types"
import { getStoreSalesByTimeRange } from "../../../_actions"

export const StoreSalesChart: React.FC<{ storeId: number }> = ({ storeId }) => {
  const searchParamValues = useSearchParamsValues<TBaseDataFilterParams>()
  const storeSales = useQuery({
    queryKey: ["storeSales", searchParamValues],
    queryFn: async () => {
      const sales = await getStoreSalesByTimeRange(
        storeId,
        searchParamValues?.startDate,
        searchParamValues?.endDate
      )
      return sales
    },
  })

  return (
    <div className="w-full space-y-4">
      <h2 className="text-base font-medium lg:text-lg">Total Sales</h2>
      <div className="rounded-lg border p-4 shadow-sm lg:px-6 lg:py-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={storeSales.data?.map((sale) => ({
              name: sale.time,
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
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value) => `Rp. ${value.toLocaleString("id")}`}
            />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
