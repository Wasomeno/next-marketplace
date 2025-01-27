"use client"

import { getUserOrders } from "@/actions/user/order"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { RxCrossCircled } from "react-icons/rx"
import { OrderCard, OrderCardSkeleton } from "./order-card"

export function UserOrders({ userEmail }: { userEmail: string }) {
  const searchParams = useSearchParams()
  const orderStatusId = searchParams.get("status")
  const search = searchParams.get("search")

  const orders = useQuery({
    queryKey: ["user-orders", orderStatusId],
    queryFn: async () => {
      return await getUserOrders({
        userEmail: userEmail,
        search: search ? search : undefined,
        statusId: orderStatusId ? Number(orderStatusId) : undefined,
      })
    },
  })

  const skeletons = Array.from({ length: 5 }).map(() => <OrderCardSkeleton />)

  return (
    <div className="flex flex-1 flex-col gap-2">
      {orders.isLoading && skeletons}

      {!orders.isLoading && (
        <>
          {orders.data && orders.data.length > 0 ? (
            orders.data?.map((order) => (
              <OrderCard
                key={order.id}
                userEmail={order.user_email}
                order={order}
              />
            ))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 opacity-50">
              <span>No Orders</span>
              <RxCrossCircled size="25" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
