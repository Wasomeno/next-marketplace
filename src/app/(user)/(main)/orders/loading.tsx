import { RxMagnifyingGlass } from "react-icons/rx";

import { Input } from "@/components/ui/input";
import { OrderCardSkeleton } from "@/components/user/order/order-card";
import { OrderStatusFilter } from "@/components/user/order/order-status-filter";

export default function OrdersLoadingPage() {
  return (
    <div className="flex flex-1 flex-col px-5 lg:px-8">
      <div className="mb-4">
        <h1 className="text-base font-medium lg:text-xl">Orders</h1>
      </div>
      <div className="flex-1 flex flex-col rounded-lg border dark:border-gray-700 p-2.5 lg:w-4/6 lg:p-4">
        <div className="mb-2.5 flex items-center gap-2.5  overflow-x-scroll">
          <div className="flex h-8  items-center rounded-md border dark:border-gray-700 bg-white dark:bg-slate-950 p-1.5 lg:h-10">
            <div className="flex w-10 items-center justify-center">
              <RxMagnifyingGlass className="text-slate-400" />
            </div>
            <Input
              type="text"
              className="h-auto w-32 border-none dark:bg-slate-950 p-0 focus-visible:ring-0 lg:w-96"
              placeholder="Search orders"
            />
          </div>
          <OrderStatusFilter />
        </div>
        <div className="flex flex-1 w-full flex-col gap-2">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </div>
    </div>
  );
}
