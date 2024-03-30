"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"

import { Dropdown, Option } from "@/components/dropdown"
import { ProductSalesChart } from "@/components/user/store/product/product-sales-chart"
import { getProductMonthlyStats } from "@/app/actions/store/product-sales"

function getMonthOptions() {
  const monthOptions = []
  for (let i = 0; i <= 11; i++) {
    monthOptions.push({
      label: moment().month(i).format("MMM"),
      value: i,
    })
  }
  return monthOptions
}

export const ProductSalesMonthlyChart = () => {
  const month = moment().get("month")
  const monthOptions = getMonthOptions()

  const [monthOption, setMonthOption] = useState<Option>(monthOptions[month])
  const [isOpen, setIsOpen] = useState(false)

  const params = useParams<{ productId: string }>()

  const sales = useQuery({
    queryKey: ["productSales", params.productId, monthOption],
    queryFn: () =>
      getProductMonthlyStats(parseInt(params.productId), monthOption?.value),
  })

  return (
    <div className="w-full space-y-4 rounded-md border border-gray-300 p-3 lg:w-96">
      <div className="flex items-center justify-between">
        <span className="font-medium">This Month</span>
        <Dropdown
          options={monthOptions}
          selectedOption={monthOption}
          onOptionClick={(option) => setMonthOption(option)}
          isMulti={false}
          className="w-32"
        />
      </div>
      <ProductSalesChart
        data={
          sales.data?.map((sale) => ({
            name: sale.date.toString(),
            uv: sale.sales,
          })) ?? []
        }
      />
    </div>
  )
}
