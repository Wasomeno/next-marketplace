import { TBaseDataFilterParams } from "../../../../../types"

export const categoryQueryKeys = {
  all: (filters?: TBaseDataFilterParams) => [
    "categories",
    filters?.page,
    filters?.pageSize,
    filters?.search,
    filters?.sort,
  ],
  single: (categoryId: number, filters?: TBaseDataFilterParams) => [
    "categories",
    "single",
    categoryId,
    filters?.page,
    filters?.pageSize,
    filters?.search,
    filters?.sort,
  ],
  products: (categoryId: number, filters?: TBaseDataFilterParams) => [
    "category",
    "products",
    categoryId,
    filters?.page,
    filters?.pageSize,
    filters?.search,
    filters?.sort,
  ],
  count: (categoryId?: number, filters?: TBaseDataFilterParams) => [
    "products",
    "count",
    categoryId,
    filters?.page,
    filters?.pageSize,
    filters?.search,
    filters?.sort,
  ],
}
