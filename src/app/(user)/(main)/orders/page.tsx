import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/actions/store/user"
import { getUserOrders } from "@/actions/user/order"
import { OrderCard } from "@/modules/user/order-page/components/order-card"
import { OrderSearchInput } from "@/modules/user/order-page/components/order-search-input"
import { OrderStatusDropdown } from "@/modules/user/order-page/components/order-status-dropdown"
import { UserViewOrderModal } from "@/modules/user/order-page/components/user-view-order-modal"
import { RxCrossCircled } from "react-icons/rx"

type Props = {
  searchParams: {
    statusId: number
    page: string
    rate: string
    search: string
  }
}

export const metadata: Metadata = {
  title: "Orders",
}

export default async function OrdersPage({ searchParams }: Props) {
  const session = await getCachedSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  const orders = await getUserOrders({
    userEmail: session.user.email,
    statusId: searchParams.statusId,
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
          {orders.length > 0 &&
            orders.map((order) => (
              <OrderCard
                userEmail={session.user.email as string}
                order={order}
              />
            ))}
          {orders.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm">No Transactions</span>
              <RxCrossCircled size="25" />
            </div>
          )}
        </div>
      </div>
      <UserViewOrderModal />
    </div>
  )
}
