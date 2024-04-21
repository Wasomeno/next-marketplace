"use client"

import { getStoreProductsCount } from "@/actions/store/store";
import { Skeleton } from "@/components/skeleton";
import { productQueryKeys } from "@/modules/user/common/queryKeys/productQueryKeys";
import { useSearchParamsValues } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { TBaseDataFilterParams } from "../../../../../../types";

export function ProductCount() {
  const searchParamsValues = useSearchParamsValues<
    TBaseDataFilterParams & {
      status: string
      categories: string
      delete: string
      id: string
    }
  >()
  const productCount = useQuery({
    queryKey: productQueryKeys.count(),
    queryFn: () => getStoreProductsCount({ search: searchParamsValues.search }),
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
