import { getServerSession } from "next-auth"
import { RxCrossCircled, RxMagnifyingGlass } from "react-icons/rx"

import { prisma } from "@/lib/prisma"
import { Input } from "@/components/ui/input"
import { OrderCard } from "@/components/user/order/order-card"
import { OrderDetailsModal } from "@/components/user/order/order-details-modal"
import { OrderStatusFilter } from "@/components/user/order/order-status-filter"

export const metadata = {
  title: "Orders | Next Marketplace",
}

async function getUserTransactions() {
  const session = await getServerSession()
  const transactions = await prisma.order.findMany({
    where: { user: session?.user?.email as string },
    include: { products: { include: { images: true } }, status: true },
  })
  return transactions
}

export default async function OrdersPage() {
  const transactions = await getUserTransactions()
  return (
    <div className="flex flex-1 flex-col px-5 lg:px-8">
      <div className="mb-4 mt-2 lg:mb-4">
        <h1 className="text-base font-medium lg:text-xl">Orders</h1>
      </div>
      <div className="flex flex-1 flex-col lg:w-7/12">
        <div className="mb-2.5 flex items-center gap-2.5  overflow-x-scroll">
          <div className="flex h-8  items-center rounded-md border bg-white p-1.5 dark:border-gray-800 dark:bg-slate-950 lg:h-10">
            <div className="flex w-10 items-center justify-center">
              <RxMagnifyingGlass className="text-slate-400" />
            </div>
            <Input
              type="text"
              className="h-auto w-32 border-none p-0 focus-visible:ring-0 dark:bg-slate-950 lg:w-96"
              placeholder="Search orders"
            />
          </div>
          <OrderStatusFilter />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {transactions.length > 0 &&
            transactions.map((transaction) => (
              <OrderCard
                transactionDetails={transaction}
                key={transaction.id}
              />
            ))}
          {!transactions.length ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm">No Transactions</span>
              <RxCrossCircled size="25" />
            </div>
          ) : null}
        </div>
      </div>
      <OrderDetailsModal />
    </div>
  )
}
