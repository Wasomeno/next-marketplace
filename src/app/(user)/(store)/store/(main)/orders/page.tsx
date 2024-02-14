import { StoreOrderList } from "@/components/user/store/order/store-order-list"

export default async function UserStoreOrders() {
  return (
    <div className="flex flex-1 flex-col gap-2 lg:gap-4">
      <h1 className="text-lg font-medium lg:text-2xl">Orders</h1>
      <StoreOrderList />
    </div>
  )
}
