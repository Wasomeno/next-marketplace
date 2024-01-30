export type BaseDataFilters = {
  search?: string
  sort?: Record<string, "desc" | "asc">
  pageSize?: number
  page?: number
}
