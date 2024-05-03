export type TBaseDataFilter = {
  search?: string
  sort?: Record<string, "asc" | "desc">
  pageSize?: string
  page?: string
}

export type TBaseDataFilterParams = {
  search?: string
  sort?: string
  pageSize?: string
  page?: string
}

export type OrderStatus =
  | "Payment Confirmed"
  | "On Proccess"
  | "On Shipping"
  | "Arrived"
  | "Done"
