"use client"

import { useMemo } from "react"
import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { getOrderSorts } from "@/config/table/sorts/orderSorts"
import { Button } from "@/components/ui/button"
import { TableActions } from "@/components/table-row-menu"

import { DataTable } from "../data-table"

export const OrderTable = ({
  orders,
}: {
  orders: Prisma.OrderGetPayload<{
    include: {
      products: {
        include: { product: { include: { images: true } } }
      }
      status: true
      _count: { select: { products: true } }
    }
  }>[]
}) => {
  const columns = useMemo<
    ColumnDef<
      Prisma.OrderGetPayload<{
        include: {
          products: {
            include: {
              product: { include: { images: true } }
            }
          }
          status: true
          _count: { select: { products: true } }
        }
      }>
    >[]
  >(
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
        accessorKey: "_count",
        header: "Product Amount",
        cell: (info) => {
          const count = info.getValue() as { products: number }
          return count.products
        },
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
      getSortsData={(table) => getOrderSorts(table)}
    />
  )
}

OrderTable.displayName = "OrderTable"
