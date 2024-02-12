import { Metadata } from "next"
import { RxCrossCircled, RxMagnifyingGlass } from "react-icons/rx"

import { Input } from "@/components/ui/input"
import { DataFilter, DataFilterOption } from "@/components/data-filter"
import { OrderDetailsModal } from "@/components/user/order/order-details-modal"
import { InvoiceCard } from "@/components/user/order/order-product-card"
import { RateProductModal } from "@/components/user/order/rate-product-modal"
import { getUserInvoices } from "@/app/actions/user/invoice"

type Props = {
  searchParams: {
    status: string
    page: string
    rate: string
    invoice: string
  }
}

export const metadata: Metadata = {
  title: "Orders | Next Marketplace",
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
          <DataFilter
            placeholder="Select Filter"
            filterOptions={statusOptions}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {invoices.length > 0 &&
            invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          {invoices.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm">No Transactions</span>
              <RxCrossCircled size="25" />
            </div>
          )}
        </div>
      </div>
      {searchParams.invoice && <OrderDetailsModal />}
      {searchParams.rate && <RateProductModal />}
    </div>
  )
}
