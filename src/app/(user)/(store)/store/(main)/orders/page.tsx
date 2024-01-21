import { ViewOrderModal } from "@/components/admin/order/modals/view-order-modal"
import { OrderTable } from "@/components/admin/order/order-table"
import { getOrders } from "@/app/actions/user/order"

export default async function UserStoreOrders() {
  const orders = await getOrders()
  return (
    <div className="flex flex-1 flex-col gap-2 lg:gap-4">
      <h1 className="text-lg font-medium lg:text-2xl">Orders</h1>
      <OrderTable orders={orders} />
      <ViewOrderModal />
    </div>
  )
}
