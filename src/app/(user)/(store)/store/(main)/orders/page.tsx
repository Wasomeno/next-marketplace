import { StoreOrderCount } from "@/modules/user/store/order-page/components/store-order-count"
import { StoreOrderList } from "@/modules/user/store/order-page/components/store-order-list"

export default async function UserStoreOrdersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Orders</h1>
        <StoreOrderCount />
      </div>
      <StoreOrderList />
    </div>
  )
}
