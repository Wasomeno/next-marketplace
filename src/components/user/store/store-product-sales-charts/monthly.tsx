"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import moment from "moment"
import { BiChevronRight } from "react-icons/bi"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { ProductSalesChart } from "@/components/admin/product/product-sales-chart"
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

  const [monthOption, setMonthOption] = useState<{
    label: string
    value: number
  }>(monthOptions[month])

  const [isOpen, setIsOpen] = useState(false)

  const params = useParams<{ productId: string }>()

  const sales = useQuery({
    queryKey: ["productSales", params.productId, monthOption],
    queryFn: () =>
      getProductMonthlyStats(parseInt(params.productId), monthOption?.value),
  })

  return (
    <div className="col-span-3 space-y-4 rounded-md border border-gray-300 p-3 lg:col-span-1">
      <div className="flex items-center justify-between">
        <span className="font-medium">This Month</span>
        <Dropdown onOpenChange={(open) => setIsOpen(open)}>
          <DropdownTrigger asChild>
            <button className="tems-center flex h-8 w-32 items-center  justify-between rounded-md border bg-white px-2 text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900">
              <span className="text-xs">{monthOption.label}</span>
              <div className="w-5">
                <BiChevronRight
                  size="20"
                  className={clsx(
                    "text-slate-600 transition-all duration-200 lg:block dark:text-white",
                    { "rotate-90": isOpen }
                  )}
                />
              </div>
            </button>
          </DropdownTrigger>
          <AnimatePresence>
            {isOpen && (
              <DropdownContent asChild>
                <motion.div
                  initial={{ height: "0px" }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: "0px" }}
                  className="flex w-32 flex-col overflow-hidden rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
                >
                  {monthOptions.map((option) => (
                    <DropdownItem key={option.value} asChild>
                      <button
                        onClick={() => setMonthOption(option)}
                        className="px-3 py-2 text-start text-xs outline-0 ring-0  transition duration-200 hover:bg-blue-100 dark:hover:bg-neutral-800"
                      >
                        {option.label}
                      </button>
                    </DropdownItem>
                  ))}
                </motion.div>
              </DropdownContent>
            )}
          </AnimatePresence>
        </Dropdown>
      </div>
      <ProductSalesChart
        data={sales.data?.map((sale) => ({ name: sale.date, uv: sale.sales }))}
      />
    </div>
  )
}
