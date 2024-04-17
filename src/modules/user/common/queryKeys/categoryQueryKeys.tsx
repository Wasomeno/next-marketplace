import { TBaseDataFilterParams } from "../../../../../types"

export const categoryQueryKeys = {
  all: (filters?: TBaseDataFilterParams) => ["categories", "all", filters],
  single: (categoryId: number, filters?: TBaseDataFilterParams) => [
    "categories",
    "single",
    categoryId,
    filters,
  ],
  products: (categoryId: number, filters?: TBaseDataFilterParams) => [
    "category",
    "products",
    categoryId,
    filters,
  ],
  count: (categoryId?: number, filters?: TBaseDataFilterParams) => [
    "products",
    "count",
    categoryId,
    filters,
  ],
}
