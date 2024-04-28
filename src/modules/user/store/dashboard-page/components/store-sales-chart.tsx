"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  getStoreMonthlySales,
  getStoreYearlySales,
} from "@/actions/store/store"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import moment from "moment"
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

function getYearOptions() {
  const yearOptions: Option[] = []
  for (let i = 0; i <= 10; i++) {
    const time = moment().add("year", i)
    yearOptions.push({ label: time.format("YYYY"), value: time.format("YYYY") })
  }
  return yearOptions
}

export const StoreSalesChart = () => {
  const [chartMode, setChartMode] = useState<"month" | "year">("month")

  const searchParamValues = useSearchParamsValues<{
    month: string
    year: string
  }>()

  const pathname = usePathname()
  const router = useRouter()
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

  function onYearSelect(year: string) {
    const searchParams = new URLSearchParams(searchParamValues)
    searchParams.set("year", year)
    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  function onYearDeselect() {
    const searchParams = new URLSearchParams(searchParamValues)
    searchParams.delete("year")
    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-medium lg:text-lg">Sales Report</h2>
        <div className="flex items-center gap-2">
          {chartMode === "year" && (
            <Dropdown
              placeholder="Select year"
              isMulti={false}
              options={getYearOptions()}
              selectedOption={getYearOptions().find(
                (option) => option.value.toString() === searchParamValues.year
              )}
              onOptionClick={(option) => onYearSelect(option.value as string)}
              deselectOption={onYearDeselect}
            />
          )}
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
          <Button
            size="sm"
            onClick={() => setChartMode("year")}
            className={clsx(
              "lg:text-xs",
              chartMode === "year" &&
                "bg-gray-900 text-white  lg:hover:bg-gray-800"
            )}
          >
            Year
          </Button>
          <Button
            size="sm"
            onClick={() => setChartMode("month")}
            className={clsx(
              "lg:text-xs",
              chartMode === "month" &&
                "bg-gray-900 text-white  lg:hover:bg-gray-800"
            )}
          >
            Month
          </Button>
        </div>
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
