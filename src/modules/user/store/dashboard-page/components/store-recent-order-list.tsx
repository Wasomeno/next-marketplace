"use client"

import React from "react"
import { getStoreOrders } from "@/actions/user/order"
import { Order, Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

import { DataTable } from "@/components/data-table"

const columns: ColumnDef<
  Prisma.OrderGetPayload<{ include: { products: true } }>
>[] = [
  {
    accessorKey: "id",
    header: "Id",
    enableColumnFilter: false,
  },
  {
    accessorFn: ({ products }) => products?.length,
    header: "Item Amount",
    enableColumnFilter: false,
  },
  {
    accessorFn: ({ total }) => `Rp. ${total?.toLocaleString("id")}`,
    header: "Total",
    enableColumnFilter: false,
  },
  {
    accessorFn: ({ created_at }) => moment(created_at).format("LLLL"),
    header: "Ordered at",
    enableColumnFilter: false,
  },
]

export const StoreRecentOrderList: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const transactions = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getStoreOrders({ storeId }),
  })

  return (
    <div className="space-y-2 rounded-lg border p-4 lg:px-6 lg:py-4">
      <h2 className="text-base font-medium lg:text-lg">Recent Transactions</h2>
      <DataTable
        data={transactions.data ?? Array(5).fill("")}
        columns={columns}
      />
    </div>
  )
}
