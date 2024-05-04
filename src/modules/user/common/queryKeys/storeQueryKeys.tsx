import { TBaseDataFilterParams } from "../../../../../types"

export const storeQueryKeys = {
  products: (
    params: { storeId?: number; storeSlug?: string } & TBaseDataFilterParams
  ) => ["storeProducts", { ...params }],
  productCount: (
    params: { storeId: number } & Pick<TBaseDataFilterParams, "search">
  ) => ["storeProducts", "count", { ...params }],
  reviews: (params: { storeId: number } & TBaseDataFilterParams) => [
    "storeProductReviews",
    params.storeId,
    params.page,
    params.search,
    params.sort,
  ],
  reviewCount: (
    params: { storeId: number } & Pick<TBaseDataFilterParams, "search">
  ) => ["storeProductReviewCount", params.storeId, params.search],
}
