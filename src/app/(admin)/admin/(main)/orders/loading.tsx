"use client"

import { ImSpinner7 } from "react-icons/im"

import { getOrderSorts } from "@/config/table/sorts/orderSorts"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { TableDataSorter } from "@/components/table-data-sorter"
import { TableSearchInput } from "@/components/table-search-input"

export default function OrderLoadingPage() {
  return (
    <PageTransitionWrapper className="flex w-full flex-1 flex-col bg-gray-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Orders
        </h1>
      </div>
      <div className="my-2 flex justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <TableSearchInput placeholder="Search by order invoice" disabled />
          <TableDataSorter disabled sortsData={getOrderSorts()} />
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <ImSpinner7 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    </PageTransitionWrapper>
  )
}
