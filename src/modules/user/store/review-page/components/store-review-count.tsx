"use client"

import { getStoreProductReviewsCount } from "@/actions/store/review"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/components/skeleton"

import { TBaseDataFilterParams } from "../../../../../../types"

export const StoreReviewCount: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const reviewCount = useQuery({
    queryKey: ["storeProductReviewsCount", searchParamsValues?.search],
    queryFn: () =>
      getStoreProductReviewsCount({
        storeId,
        search: searchParamsValues?.search,
      }),
  })

  return reviewCount.isLoading ? (
    <Skeleton className="h-[18px] w-20 " />
  ) : (
    <span className="font text-sm text-gray-500 lg:text-base">
      {reviewCount.data} Reviews
    </span>
  )
}
