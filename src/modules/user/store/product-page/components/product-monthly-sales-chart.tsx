"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { getProductMonthlySales } from "@/actions/store/product-sales"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { FaSpinner } from "react-icons/fa"
import { ImSpinner8 } from "react-icons/im"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import { Dropdown, Option } from "@/components/dropdown"

function getMonthOptions() {
  const monthOptions: Option[] = []
  for (let i = 0; i < 12; i++) {
    const time = moment().set("month", i)
    monthOptions.push({ label: time.format("MMMM"), value: i })
  }
  return monthOptions
}

export const ProductMonthlySalesChart = () => {
  const searchParamValues = useSearchParamsValues<{
    month: string
  }>()

  const params = useParams<{ productId: string }>()

  const month = moment().get("month")

  const sales = useQuery({
    queryKey: ["monthlySales", params.productId, searchParamValues.month],
    queryFn: () =>
      getProductMonthlySales(
        Number(params.productId),
        searchParamValues.month ? Number(searchParamValues.month) : month
      ),
  })

  const router = useRouter()
  const pathname = usePathname()

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium lg:text-lg">Monthly Sales</h2>
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
      </div>
      <div className="rounded-lg border px-4 py-2">
        {sales.isLoading ? (
          <div className="flex h-[180px] items-center justify-center">
            <ImSpinner8 className="animate-spin opacity-50" size={20} />
          </div>
        ) : (
          <ResponsiveContainer width={"100%"} height={180}>
            <AreaChart
              width={750}
              height={180}
              data={sales.data?.map((sale) => ({
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
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
