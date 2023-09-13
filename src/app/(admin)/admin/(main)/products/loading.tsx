"use client"

import { BsPlus, BsTrash3 } from "react-icons/bs"
import { ImSpinner7 } from "react-icons/im"

import { getProductSorts } from "@/config/table/sorts/productSorts"
import { Button } from "@/components/ui/button"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { TableDataSorter } from "@/components/table-data-sorter"
import { TableSearchInput } from "@/components/table-search-input"

export default function ProductLoadingPage() {
  return (
    <PageTransitionWrapper className="flex w-full flex-1 flex-col bg-gray-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Products
        </h1>
      </div>
      <div className="my-2 flex justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <TableSearchInput placeholder="Search by product name" disabled />
          <TableDataSorter disabled sortsData={getProductSorts()} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled
            variant="danger"
            size="sm"
            className="h-8 w-8 hover:scale-[105%] lg:h-9 lg:w-9"
          >
            <BsTrash3 className="text-slate-50" />
          </Button>
          <Button
            disabled
            variant="success"
            size="sm"
            className="h-8 w-8 hover:scale-[105%] lg:h-9 lg:w-9"
          >
            <BsPlus className="text-slate-50" />
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <ImSpinner7 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    </PageTransitionWrapper>
  )
}
