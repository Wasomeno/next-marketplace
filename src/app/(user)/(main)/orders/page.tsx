import { Suspense } from "react"
import { Metadata } from "next"
import { getUserInvoices } from "@/actions/user/invoice"
import { OrderCard } from "@/modules/user/order-page/components/order-card"
import { UserViewOrderModal } from "@/modules/user/order-page/components/order-details-modal"
import { OrderSearchInput } from "@/modules/user/order-page/components/order-search-input"
import { OrderStatusDropdown } from "@/modules/user/order-page/components/order-status-dropdown"
import { RateProductModal } from "@/modules/user/order-page/components/rate-product-modal"
import { RxCrossCircled, RxMagnifyingGlass } from "react-icons/rx"

import { Input } from "@/components/ui/input"

type Props = {
  searchParams: {
    status: string
    page: string
    rate: string
    invoice: string
    search: string
  }
}

export const metadata: Metadata = {
  title: "Orders",
}

export default async function OrdersPage({ searchParams }: Props) {
  const invoices = await getUserInvoices({
    status: searchParams.status,
    search: searchParams.search,
  })
  return (
    <div className="flex flex-1 flex-col px-5 lg:px-8">
      <div className="mb-4 mt-2">
        <h1 className="text-base font-medium lg:text-xl">Orders</h1>
      </div>
      <div className="flex flex-1 flex-col lg:w-7/12">
        <div className="mb-2.5 flex items-center gap-2.5 overflow-x-scroll">
          <OrderSearchInput />
          <OrderStatusDropdown />
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
