import { TBaseDataFilterParams } from "../../../../../types"

export const productQueryKeys = {
  all: (filters?: TBaseDataFilterParams) => ["products", "all", filters],
  single: (productId?: number, filters?: TBaseDataFilterParams) => [
    "products",
    "single",
    productId,
    filters,
  ],
  multiple: (productIds?: number[], filters?: TBaseDataFilterParams) => [
    "products",
    "single",
    productIds,
    filters,
  ],
  category: (categoryId: number, filters?: TBaseDataFilterParams) => [
    "products",
    "category",
    categoryId,
    filters,
  ],
  count: (productId?: number, filters?: TBaseDataFilterParams) => [
    "products",
    "count",
    productId,
    filters,
  ],
  store: (
    storeSlug: string,
    categoryId?: string,
    filters?: TBaseDataFilterParams
  ) => ["products", "store", storeSlug, categoryId, filters],
}
