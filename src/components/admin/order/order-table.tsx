"use client"

import { useMemo } from "react"
import { useSearchParamsValues } from "@/utils"
import { Order } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

import { TableActions } from "@/components/table-actions"
import { getStoreOrders } from "@/app/actions/store/order"

import { BaseDataFilters } from "../../../../types"
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

const pageSize = 3

export const OrderTable = () => {
  const searchParamsValues = useSearchParamsValues<BaseDataFilters>()

  const { data, isLoading } = useQuery({
    queryKey: ["storeOrders", searchParamsValues],
    queryFn: () =>
      getStoreOrders({
        ...searchParamsValues,
        pageSize,
      }),
  })

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
                  asLink
                  href={`/store/orders/edit/${row.original.id}`}
                />
              }
              viewAction={
                <TableActions.View
                  asLink
                  href={`/store/orders/view/${row.original.id}`}
                />
              }
            />
          )
        },
      },
    ],
    [data?.orders.length]
  )

  const placeholderColumns = useMemo<ColumnDef<StoreOrder>[]>(
    () => [
      {
        header: "Id",
        cell: () => <div className="h-8 w-20 rounded-lg bg-gray-200" />,
        enableColumnFilter: false,
      },
      {
        header: "Invoice",
        cell: () => <div className="h-8 w-20 rounded-lg bg-gray-200" />,
        enableColumnFilter: false,
      },
      {
        header: "Product Amount",
        cell: () => <div className="h-8 w-20 rounded-lg bg-gray-200" />,
        enableColumnFilter: false,
      },
      {
        header: "Status",
        cell: () => <div className="h-8 w-20 rounded-lg bg-gray-200" />,
        enableColumnFilter: false,
      },
      {
        header: "Ordered At",
        cell: () => <div className="h-8 w-20 rounded-lg bg-gray-200" />,
        enableColumnFilter: false,
      },
      {
        id: "action",
        header: "Actions",
        cell: () => {
          return (
            <TableActions
              editAction={<TableActions.Edit asLink={false} />}
              viewAction={<TableActions.View asLink={false} />}
            />
          )
        },
      },
    ],
    [data?.orders.length]
  )

  return (
    <>
      <span className="font text-sm text-gray-500 lg:text-base">
        {data?.totalAmount ?? 0} Orders
      </span>
      <DataTable
        data={isLoading ? Array(5).fill({}) : (data?.orders as StoreOrder[])}
        columns={isLoading ? placeholderColumns : columns}
        searchInput={<DataTable.SearchInput placeholder="Search by invoice" />}
        dataSorter={<DataTable.Sorter sortOptions={orderSortOptions} />}
        pagination={
          <DataTable.Pagination
            dataLength={data?.totalAmount as number}
            pageSize={pageSize}
          />
        }
      />
    </>
  )
}

OrderTable.displayName = "OrderTable"
