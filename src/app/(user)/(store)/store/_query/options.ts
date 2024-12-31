import { queryOptions } from "@tanstack/react-query"

import { getStoreProducts } from "@/app/(user)/(store)/store/_actions"
import { TBaseDataFilter } from "../../../../../../types"
import { storeQueryKeys } from "./keys"

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
