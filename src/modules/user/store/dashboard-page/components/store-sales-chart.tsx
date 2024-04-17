"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getStoreMonthlySales } from "@/actions/store/store"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { HiEllipsisHorizontal } from "react-icons/hi2"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Dropdown, Option } from "@/components/dropdown"

function getMonthOptions() {
  const monthOptions: Option[] = []
  for (let i = 0; i < 12; i++) {
    const time = moment().set("month", i)
    monthOptions.push({ label: time.format("MMMM"), value: i })
  }
  return monthOptions
}

export const StoreSalesChart = () => {
  const [chartMode, setChartMode] = useState<"month" | "year">("month")

  const searchParamValues = useSearchParamsValues<{
    month: string
    year: string
  }>()
  const pathname = usePathname()
  const router = useRouter()
  const sales = useQuery({
    queryKey: ["sales", searchParamValues],
    queryFn: () => getStoreMonthlySales(),
  })

  function onMonthSelect(month: string) {
    const searchParams = new URLSearchParams(searchParamValues)
    searchParams.set("month", month)
    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  function onMonthDeselect() {
    const searchParams = new URLSearchParams(searchParamValues)
    searchParams.delete("month")
    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <div className="w-full space-y-2 lg:w-1/2">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium lg:text-lg">Sales Report</h2>
        <div className="flex gap-2">
          {chartMode === "month" && (
            <Dropdown
              placeholder="Select Month"
              isMulti={false}
              options={getMonthOptions()}
              selectedOption={getMonthOptions().find(
                (option) => option.value.toString() === searchParamValues.month
              )}
              onOptionClick={(option) => onMonthSelect(option.value as string)}
              deselectOption={onMonthDeselect}
            />
          )}
          {chartMode === "year" && (
            <Dropdown placeholder="Select Year" isMulti={false} />
          )}
          <Button size="sm" className="bg-transparent hover:bg-gray-100">
            <HiEllipsisHorizontal size={20} />
          </Button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={sales.data?.map((sale) => ({
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
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
