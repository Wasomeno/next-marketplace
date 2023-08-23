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
  PaginationState,
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
  const [selectedOrders, setSelectedOrders] = useState<Array<number>>([])

  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

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
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-scroll">
      <div className="my-2 flex justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <TableSearchInput
            onChange={(event) =>
              table.getColumn("invoice")?.setFilterValue(event.target.value)
            }
            placeholder="Search by order invoice"
          />
          <TableDataSorter table={table} sortsData={getOrderSorts(table)} />
        </div>
      </div>
      <div className="flex-1 overflow-x-scroll rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
        <Table className="w-full border-collapse bg-white text-left text-sm text-gray-500 dark:bg-neutral-800">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                aria-rowspan={1}
                className="bg-blue-100 dark:border-neutral-600 dark:bg-blue-900"
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
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-white  dark:border-neutral-600 dark:bg-neutral-800"
                >
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
