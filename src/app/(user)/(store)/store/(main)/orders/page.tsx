import { redirect } from "next/navigation"
import { getStore } from "@/actions/store/store"
import { getCachedSession } from "@/actions/store/user"
import { StoreOrderCount } from "@/modules/user/store/order-page/components/store-order-count"
import { StoreOrderList } from "@/modules/user/store/order-page/components/store-order-list"

export default async function UserStoreOrdersPage() {
  const session = await getCachedSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  const store = await getStore({ userEmail: session.user.email })

  if (!store?.id) {
    redirect("/")
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Orders</h1>
        <StoreOrderCount storeId={store.id} />
      </div>
      <StoreOrderList storeId={store.id} />
    </div>
  )
}
