import { getStoreProducts } from "@/actions/store/store"
import { queryOptions } from "@tanstack/react-query"

import { TBaseDataFilter } from "../../../../../types"

queryOptions
type StoreProductsQueryParams = TBaseDataFilter & {
  storeId: number
  categoryIds?: Array<number>
}

export const storeProductsQuery = (params: StoreProductsQueryParams) =>
  queryOptions({
    queryKey: [
      "storeProducts",
      params.storeId,
      params.sort,
      params.search,
      params.page,
      params.categoryIds,
    ],
    queryFn: () => getStoreProducts(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
