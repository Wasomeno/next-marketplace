export type BaseDataFilters = {
  search?: string
  sort?: Record<string, "desc" | "asc">
  pageSize?: number
  page?: number
}

export type OrderStatus =
  | "Payment Confirmed"
  | "On Proccess"
  | "On Shipping"
  | "Arrived"
  | "Done"
