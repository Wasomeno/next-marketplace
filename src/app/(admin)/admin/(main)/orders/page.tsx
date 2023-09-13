import { AdminOrderDetailsModal } from "@/components/admin/admin-order-details-modal"
import { OrdersTable } from "@/components/admin/order/orders-table"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { getAllOrders } from "@/app/actions/order"

export const metadata = {
  title: "Admin | Orders",
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()
  return (
    <PageTransitionWrapper className="flex w-full flex-1 flex-col bg-gray-50 p-5 dark:bg-neutral-900">
      <div className="mb-0 flex items-center justify-between lg:mb-4">
        <h1 className="text-base font-medium tracking-wider lg:text-2xl">
          Orders
        </h1>
      </div>
      <OrdersTable orders={orders} />
      <AdminOrderDetailsModal />
    </PageTransitionWrapper>
  )
}
