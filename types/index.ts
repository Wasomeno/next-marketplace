export type TBaseDataFilter = {
  search?: string
  sort?: Record<string, "asc" | "desc">
  pageSize?: string
  page?: string
  startDate?: string
  endDate?: string
}

export type TBaseDataFilterParams = {
  startDate?: string
  endDate?: string
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

export type TPageProps = {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string>>
}
