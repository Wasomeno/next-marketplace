import { Suspense } from "react"
import { Metadata } from "next"
import { getUserInvoices } from "@/actions/user/invoice"
import { OrderCard } from "@/modules/user/order-page/components/order-card"
import { UserViewOrderModal } from "@/modules/user/order-page/components/order-details-modal"
import { RateProductModal } from "@/modules/user/order-page/components/rate-product-modal"
import { RxCrossCircled, RxMagnifyingGlass } from "react-icons/rx"

import { Input } from "@/components/ui/input"
import { DataFilter, DataFilterOption } from "@/components/data-filter"

type Props = {
  searchParams: {
    status: string
    page: string
    rate: string
    invoice: string
  }
}

export const metadata: Metadata = {
  title: "Orders",
}

const statusOptions: DataFilterOption[] = [
  {
    label: "Status",
    value: "status",
    children: [
      { label: "All", value: "" },
      { label: "Awaiting Payment", value: "Awaiting Payment" },
      { label: "Payment Confirmed", value: "Payment Confirmed" },
      { label: "On Proccess", value: "On Proccess" },
      { label: "On Shipping", value: "On Shipping" },
      { label: "Arrived", value: "Arrived" },
      { label: "Done", value: "Done" },
    ],
  },
]

export default async function OrdersPage({ searchParams }: Props) {
  const invoices = await getUserInvoices({ status: searchParams.status })

  return (
    <div className="flex flex-1 flex-col px-5 lg:px-8">
      <div className="mb-4 mt-2">
        <h1 className="text-base font-medium lg:text-xl">Orders</h1>
      </div>
      <div className="flex flex-1 flex-col lg:w-7/12">
        <div className="mb-2.5 flex items-center gap-2.5  overflow-x-scroll">
          <div className="flex h-8  items-center rounded-md border bg-white p-1.5 dark:border-gray-800 dark:bg-slate-950 lg:h-10">
            <div className="flex w-10 items-center justify-center">
              <RxMagnifyingGlass className="text-slate-400" />
            </div>
            <Input
              type="text"
              className="h-auto w-32 border-none p-0 focus-visible:ring-0 dark:bg-slate-950 lg:w-96"
              placeholder="Search orders"
            />
          </div>
          <Suspense fallback={<>Hello</>}>
            <DataFilter
              placeholder="Select Filter"
              filterOptions={statusOptions}
            />
          </Suspense>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {invoices.length > 0 &&
            invoices.map((invoice) => (
              <Suspense key={invoice.id} fallback={<>Hello</>}>
                <OrderCard invoice={invoice} />
              </Suspense>
            ))}
          {invoices.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm">No Transactions</span>
              <RxCrossCircled size="25" />
            </div>
          )}
        </div>
      </div>
      {searchParams.invoice && (
        <Suspense fallback={<>Hello</>}>
          <UserViewOrderModal />
        </Suspense>
      )}
      {searchParams.rate && (
        <Suspense fallback={<>Hello</>}>
          <RateProductModal />
        </Suspense>
      )}
    </div>
  )
}
