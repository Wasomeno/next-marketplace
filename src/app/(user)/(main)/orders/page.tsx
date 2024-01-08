import { getServerSession } from "next-auth"
import { RxCrossCircled, RxMagnifyingGlass } from "react-icons/rx"

import { prisma } from "@/lib/prisma"
import { Input } from "@/components/ui/input"
import { OrderDetailsModal } from "@/components/user/order/order-details-modal"
import { OrderPagination } from "@/components/user/order/order-pagination"
import { OrderProductCard } from "@/components/user/order/order-product-card"
import { OrderProductRating } from "@/components/user/order/order-product-rating"
import { OrderStatusFilter } from "@/components/user/order/order-status-filter"

type Props = {
  searchParams: {
    status: string
    page: string
    id: string
    rating: string
    view: string
  }
}

export const metadata = {
  title: "Orders | Next Marketplace",
}

async function getUserOrderProduct(status?: string, page?: string) {
  const session = await getServerSession()
  const orderProductCount = await prisma.orderProduct.count({
    where: {
      order: {
        user_email: { equals: session?.user.email as string },
        status,
      },
    },
  })

  const orderProducts = await prisma.orderProduct.findMany({
    where: {
      order: {
        user_email: { equals: session?.user.email as string },
        status,
      },
    },
    include: {
      order: true,
      product: { include: { images: true } },
    },
    skip: page ? parseInt(page) * 5 - 5 : 0,
    take: page ? parseInt(page) * 5 : 5,
  })
  return { orderProducts, count: orderProductCount }
}

export default async function OrdersPage({ searchParams }: Props) {
  const { orderProducts, count } = await getUserOrderProduct(
    searchParams.status,
    searchParams.page
  )

  return (
    <div className="flex flex-1 flex-col px-5 lg:px-8">
      <div className="mb-4 mt-2">
        <h1 className="text-base font-medium lg:text-xl">Orders</h1>
      </div>
      <div className="flex flex-1 flex-col lg:w-7/12">
        <div className="mb-2.5 flex items-center gap-2.5  overflow-x-scroll">
          <div className="flex h-8  items-center rounded-md border bg-white p-1.5 lg:h-10 dark:border-gray-800 dark:bg-slate-950">
            <div className="flex w-10 items-center justify-center">
              <RxMagnifyingGlass className="text-slate-400" />
            </div>
            <Input
              type="text"
              className="h-auto w-32 border-none p-0 focus-visible:ring-0 lg:w-96 dark:bg-slate-950"
              placeholder="Search orders"
            />
          </div>
          <OrderStatusFilter />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {orderProducts.length > 0 &&
            orderProducts.map((orderProduct) => (
              <OrderProductCard
                key={orderProduct.id}
                orderProduct={orderProduct}
              />
            ))}
          {orderProducts.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm">No Transactions</span>
              <RxCrossCircled size="25" />
            </div>
          )}
        </div>
        {count > 5 && <OrderPagination count={count} />}
      </div>
      {searchParams.view && <OrderDetailsModal />}
      {searchParams.rating && <OrderProductRating />}
    </div>
  )
}
