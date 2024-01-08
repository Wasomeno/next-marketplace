import { UpdateOrderStatusModal } from "@/components/admin/order/modals/update-order-status-modal"
import { ViewOrderModal } from "@/components/admin/order/modals/view-order-modal"
import { OrderTable } from "@/components/admin/order/order-table"
import { getOrders } from "@/app/actions/order"

export default async function UserStoreOrders() {
  const orders = await getOrders()
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Orders</h1>
      <OrderTable orders={orders} />
      <ViewOrderModal />
      <UpdateOrderStatusModal />
    </div>
  )
}
