import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCachedSession } from "@/actions/store/user"

import { OrderSearchInput } from "./_components/order-search-input"
import { OrderStatusDropdown } from "./_components/order-status-dropdown"
import { UserOrders } from "./_components/orders"
import { UserViewOrderModal } from "./_components/user-view-order-modal"

export const metadata: Metadata = {
  title: "Orders",
}

export default async function OrdersPage() {
  const session = await getCachedSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  return (
    <div className="flex flex-1 flex-col px-5 lg:px-28">
      <div className="mb-4 mt-2">
        <h1 className="text-base font-bold lg:text-2xl">Orders</h1>
      </div>
      <div className="flex flex-1 flex-col lg:w-7/12">
        <div className="mb-2.5 flex items-center gap-2.5 overflow-x-scroll">
          <OrderSearchInput />
          <OrderStatusDropdown />
        </div>
        <UserOrders userEmail={session.user.email} />
      </div>
      <UserViewOrderModal />
    </div>
  )
}
