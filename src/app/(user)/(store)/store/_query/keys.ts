import { TBaseDataFilter, TBaseDataFilterParams } from "../../../../../../types"

export const storeQueryKeys = {
  products: (
    params?: {
      storeId?: number
      storeSlug?: string
      categoryIds?: Array<number>
    } & TBaseDataFilter
  ) => ({
    baseKey: ["storeProducts"],
    key: [
      "storeProducts",
      {
        storeId: params?.storeId,
        page: params?.page,
        sort: params?.sort,
        search: params?.search,
        categoryIds: params?.categoryIds,
      },
    ],
  }),
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
