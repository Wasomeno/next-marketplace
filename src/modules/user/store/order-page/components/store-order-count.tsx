"use client"

import React from "react"
import { getStoreInvoicesCount } from "@/actions/store/invoice"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/components/skeleton"

import { TBaseDataFilterParams } from "../../../../../../types"

export const StoreOrderCount = () => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const invoiceCount = useQuery({
    queryKey: ["storeInvoicesCount", searchParamsValues],
    queryFn: () =>
      getStoreInvoicesCount({
        search: searchParamsValues?.search,
      }),
  })
  return invoiceCount.isLoading ? (
    <Skeleton className="h-[18px] w-20" />
  ) : (
    <span className="font text-xs text-gray-500 lg:text-base">
      {invoiceCount.data} Orders
    </span>
  )
}
