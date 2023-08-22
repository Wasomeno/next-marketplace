"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"

import { getOrderSorts } from "@/config/table/sorts/orderSorts"
import { getProductSorts } from "@/config/table/sorts/productSorts"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableDataSorter } from "@/components/table-data-sorter"
import { TableRowMenu } from "@/components/table-row-menu"
import { TableSearchInput } from "@/components/table-search-input"
import { getAllOrders } from "@/app/actions/order"

export const OrdersTable = ({
  orders,
}: {
  orders: Prisma.OrderGetPayload<{
    include: {
      products: { include: { images: true; category: true } }
      status: true
      _count: { select: { products: true } }
    }
  }>[]
}) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedOrders, setSelectedOrders] = useState<Array<number>>([])

  const columns = useMemo<
    ColumnDef<
      Prisma.OrderGetPayload<{
        include: {
          products: { include: { images: true; category: true } }
          status: true
          _count: { select: { products: true } }
        }
      }>
    >[]
  >(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer p-1.5"
            checked={
              table.getCoreRowModel().rows.length === selectedOrders.length
            }
            onChange={() => {
              setSelectedOrders((currentSelected) => {
                return table.getCoreRowModel().rows.length ===
                  currentSelected.length
                  ? []
                  : table.getCoreRowModel().rows.map((row) => row.original.id)
              })
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded-md accent-blue-300 dark:accent-gray-300"
              checked={selectedOrders.includes(row.original.id)}
              onChange={() =>
                setSelectedOrders((currentSelected) => {
                  if (currentSelected.includes(row.original.id)) {
                    return currentSelected.filter(
                      (productId) => productId !== row.original.id
                    )
                  } else {
                    return [...currentSelected, row.original.id]
                  }
                })
              }
            />
          </div>
        ),
      },
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
        cell: (info) => info.getValue().products,
        enableColumnFilter: false,
      },
      {
        id: "action",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <TableRowMenu>
              <TableRowMenu.Link
                href={`/admin/orders?id=${row.original.id}&view=true`}
              >
                View Order Details
              </TableRowMenu.Link>
              <TableRowMenu.Link
                href={`/admin/orders?id=${row.original.id}&edit=true`}
              >
                Edit Order
              </TableRowMenu.Link>
            </TableRowMenu>
          )
        },
      },
    ],
    [orders.length]
  )

  const table = useReactTable<
    Prisma.OrderGetPayload<{
      include: {
        products: { include: { images: true; category: true } }
        status: true
        _count: { select: { products: true } }
      }
    }>
  >({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full">
      <div className="my-2 flex justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <TableSearchInput
            onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
            placeholder="Search by order invoice"
          />
          <TableDataSorter table={table} sortsData={getOrderSorts(table)} />
        </div>
      </div>
      <div className="flex-1 overflow-x-scroll rounded-lg border border-gray-200 shadow-sm dark:border-neutral-600">
        <Table className="w-full border-collapse text-left text-sm text-gray-500 dark:bg-neutral-800">
          <TableHeader className="bg-blue-100 dark:bg-blue-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                aria-rowspan={1}
                className="dark:border-neutral-600"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="px-6 py-4 text-center text-xs font-medium text-gray-900 dark:text-white lg:text-sm"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative divide-y divide-gray-100 border-t border-gray-100 dark:divide-neutral-600 dark:border-neutral-600">
            {table.getRowModel().rows?.length &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="dark:border-neutral-600">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="px-3 py-2 text-center text-xs  dark:text-white lg:px-6 lg:py-4 lg:text-sm"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!table.getRowModel().rows?.length && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-96 text-center font-medium tracking-wider text-gray-400"
                >
                  No Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="my-2 flex items-center justify-start gap-2.5">
        <Button
          variant="default"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-20 border dark:border-neutral-600 dark:bg-neutral-900"
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-20 border dark:border-neutral-600 dark:bg-neutral-900"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
