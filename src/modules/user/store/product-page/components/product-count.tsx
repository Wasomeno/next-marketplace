"use client"

import { getStoreProductsCount } from "@/actions/store/store"
import { storeQueryKeys } from "@/modules/user/common/queryKeys/storeQueryKeys"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/components/skeleton"

import { TBaseDataFilterParams } from "../../../../../../types"

export const ProductCount: React.FC<{ storeId: number }> = ({ storeId }) => {
  const searchParamsValues = useSearchParamsValues<
    TBaseDataFilterParams & {
      status: string
      categories: string
      delete: string
      id: string
    }
  >()
  const productCount = useQuery({
    queryKey: storeQueryKeys.productCount({
      storeId,
      search: searchParamsValues.search,
    }),
    queryFn: () =>
      getStoreProductsCount({ storeId, search: searchParamsValues.search }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  return productCount.isLoading ? (
    <Skeleton className="h-[18px] w-20" />
  ) : (
    <span className="font text-sm text-gray-500 lg:text-base">
      {productCount.data} Products
    </span>
  )
}

export function ProductCountSkeleton() {
  return <Skeleton className="h-[18px] w-20" />
}
