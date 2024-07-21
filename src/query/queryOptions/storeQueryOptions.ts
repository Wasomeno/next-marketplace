import { getStoreProducts } from "@/actions/store/store"
import { queryOptions } from "@tanstack/react-query"

import { TBaseDataFilter } from "../../../types"
import { storeQueryKeys } from "../queryKeys/storeQueryKeys"

type StoreProductsQueryParams = TBaseDataFilter & {
  storeId: number
  categoryIds?: Array<number>
}

export const storeProductsQuery = (params: StoreProductsQueryParams) => {
  return queryOptions({
    queryKey: storeQueryKeys.products({ ...params }).key,
    queryFn: () => getStoreProducts(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
