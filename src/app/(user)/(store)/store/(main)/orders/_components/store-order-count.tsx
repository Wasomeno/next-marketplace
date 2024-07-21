"use client"

import React from "react"

import { getStoreOrderCount } from "@/actions/user/order"
import { Skeleton } from "@/components/skeleton"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"

import { TBaseDataFilterParams } from "../../../../../../../../types"

export const StoreOrderCount: React.FC<{ storeId: number }> = ({ storeId }) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const invoiceCount = useQuery({
    queryKey: ["storeInvoicesCount", searchParamsValues],
    queryFn: () =>
      getStoreOrderCount({
        storeId,
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
