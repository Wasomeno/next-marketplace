import { TBaseDataFilterParams } from "../../../../../types"

export const storeQueryKeys = {
  products: (
    params: { storeId?: number; storeSlug?: string } & TBaseDataFilterParams
  ) => [
    params.storeId ?? params.storeSlug,
    params.page,
    params.pageSize,
    params.search,
    params.sort,
  ],
  productCount: (
    params: { storeId: number } & Pick<TBaseDataFilterParams, "search">
  ) => [params.storeId, params.search],
  reviews: (params: { storeId: number } & TBaseDataFilterParams) => [
    params.storeId,
    params.page,
    params.search,
    params.sort,
  ],
  reviewCount: (
    params: { storeId: number } & Pick<TBaseDataFilterParams, "search">
  ) => [params.storeId, params.search],
}
