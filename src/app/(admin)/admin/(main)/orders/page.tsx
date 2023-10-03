import { UpdateOrderStatusModal } from "@/components/admin/order/modals/update-order-status-modal"
import { ViewOrderModal } from "@/components/admin/order/modals/view-order-modal"
import { OrderTable } from "@/components/admin/order/order-table"
import { getOrders } from "@/app/actions/order"

export const metadata = {
  title: "Admin | Orders",
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  return (
    <div className="flex w-full flex-1 flex-col bg-gray-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Orders
        </h1>
      </div>
      <OrderTable orders={orders} />
      <ViewOrderModal />
      <UpdateOrderStatusModal />
    </div>
  )
}
