import { ViewOrderModal } from "@/components/admin/order/modals/view-order-modal"
import { OrderTable } from "@/components/admin/order/order-table"
import { getOrders } from "@/app/actions/user/order"

type OrderPageProps = {
  searchParams: {
    sort?: string
    search?: string
  }
}

export default async function UserStoreOrders(props: OrderPageProps) {
  const { sort, search } = props.searchParams
  const sortOrders: Record<string, "asc" | "desc"> = sort
    ? {
        [sort.split(".")[0]]: sort.split(".")[1] as "asc" | "desc",
      }
    : { id: "desc" }
  const orders = await getOrders({ sort: sortOrders, search })
  return (
    <div className="flex flex-1 flex-col gap-2 lg:gap-4">
      <h1 className="text-lg font-medium lg:text-2xl">Orders</h1>
      <OrderTable orders={orders} />
      <ViewOrderModal />
    </div>
  )
}
