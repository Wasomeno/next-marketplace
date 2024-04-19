"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { getProductYearlySales } from "@/actions/store/product-sales"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
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

function getYearOptions() {
  const yearOptions: Option[] = []
  for (let i = 0; i <= 10; i++) {
    const time = moment().add("year", i)
    yearOptions.push({ label: time.format("YYYY"), value: time.format("YYYY") })
  }
  return yearOptions
}

export const ProductYearlySalesChart = () => {
  const searchParamValues = useSearchParamsValues<{
    year: string
  }>()

  const params = useParams<{ productId: string }>()

  const month = moment().get("month")

  const sales = useQuery({
    queryKey: ["yearlySales", params.productId, searchParamValues.year],
    queryFn: () =>
      getProductYearlySales(
        Number(params.productId),
        searchParamValues.year ? Number(searchParamValues.year) : month
      ),
  })

  const router = useRouter()
  const pathname = usePathname()

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
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Yearly Sales</h2>
        <Dropdown
          placeholder="Select Year"
          isMulti={false}
          options={getYearOptions()}
          selectedOption={getYearOptions().find(
            (option) => option.value.toString() === searchParamValues.year
          )}
          onOptionClick={(option) => onYearSelect(option.value as string)}
          deselectOption={onYearDeselect}
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
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
