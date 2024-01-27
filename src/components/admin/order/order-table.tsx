"use client"

import { useMemo } from "react"
import { Order } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

import { TableActions } from "@/components/table-row-menu"

import { DataTable } from "../data-table"

type StoreOrder = Order & {
  productAmount: number
}

export const orderSortOptions = [
  {
    label: "Id from low to high",
    value: "id.asc",
  },
  {
    label: "Id from high to low",
    value: "id.desc",
  },
]

export const OrderTable = ({ orders }: { orders: StoreOrder[] }) => {
  const columns = useMemo<ColumnDef<StoreOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        cell: (category) => category.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "invoice",
        header: "Invoice",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        header: "Product Amount",
        accessorKey: "productAmount",
        enableColumnFilter: false,
      },
      { header: "Status", accessorKey: "status", enableColumnFilter: false },
      {
        header: "Ordered At",
        accessorFn: (order) => moment(order.created_at).format("LLL"),
        enableColumnFilter: false,
      },
      {
        id: "action",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <TableActions
              editAction={
                <TableActions.Edit
                  href={`/store/orders/edit/${row.original.id}`}
                />
              }
              viewAction={
                <TableActions.View
                  href={`/store/orders/view/${row.original.id}`}
                />
              }
            />
          )
        },
      },
    ],
    [orders.length]
  )

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchInput={<DataTable.SearchInput placeholder="Search by invoice" />}
      dataSorter={<DataTable.Sorter sortOptions={orderSortOptions} />}
    />
  )
}

OrderTable.displayName = "OrderTable"
