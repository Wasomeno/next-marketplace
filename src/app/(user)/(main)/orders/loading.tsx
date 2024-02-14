import { RxMagnifyingGlass } from "react-icons/rx"

import { Input } from "@/components/ui/input"
import { OrderProductCardSkeleton } from "@/components/user/order/order-product-card"
import { OrderStatusFilter } from "@/components/user/order/order-status-filter"

export default function OrdersLoadingPage() {
  return (
    <div className="flex flex-1 flex-col px-5 lg:px-8">
      <div className="mb-4 mt-2">
        <h1 className="text-base font-medium lg:text-xl">Orders</h1>
      </div>
      <div className="flex flex-1 flex-col lg:w-7/12">
        <div className="mb-2.5 flex items-center gap-2.5  overflow-x-scroll">
          <div className="flex h-8  items-center rounded-md border bg-white p-1.5 lg:h-10 dark:border-gray-700 dark:bg-slate-950">
            <div className="flex w-10 items-center justify-center">
              <RxMagnifyingGlass className="text-slate-400" />
            </div>
            <Input
              type="text"
              className="h-auto w-32 border-none p-0 focus-visible:ring-0 lg:w-96 dark:bg-slate-950"
              placeholder="Search orders"
            />
          </div>
          <OrderStatusFilter />
        </div>
        <div className="flex w-full flex-1 flex-col gap-2">
          <OrderProductCardSkeleton />
          <OrderProductCardSkeleton />
          <OrderProductCardSkeleton />
        </div>
      </div>
    </div>
  )
}
