"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Category, Prisma, Product } from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"

import { getCategorySorts } from "@/config/table/sorts/categorySorts"
import { Button } from "@/components/ui/button"
import { TableDataSorter } from "@/components/table-data-sorter"
import { TableRowMenu } from "@/components/table-row-menu"
import { TableSearchInput } from "@/components/table-search-input"

import { DeleteCategoriesModal } from "./modals/delete-categories-modal"

export const CategoryTable = ({
  categories,
}: {
  categories: Prisma.CategoryGetPayload<{
    include: { _count: { select: { products: true } }; images: true }
  }>[]
}) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const router = useRouter()

  const columns: ColumnDef<
    Prisma.CategoryGetPayload<{
      include: { _count: { select: { products: true } }; images: true }
    }>
  >[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer accent-blue-300 dark:accent-gray-300"
          checked={
            table.getCoreRowModel().rows.length === selectedCategories.length
          }
          onChange={() => {
            setSelectedCategories((currentSelected) => {
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
            checked={selectedCategories.includes(row.original.id)}
            onChange={() =>
              setSelectedCategories((currentSelected) => {
                if (currentSelected.includes(row.original.id)) {
                  return currentSelected.filter(
                    (categoryId) => categoryId !== row.original.id
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
      cell: (id) => id.getValue(),
      footer: (props) => props.column.id,
      enableColumnFilter: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (name) => name.getValue(),
      footer: (props) => props.column.id,
    },
    {
      accessorKey: "_count",
      header: "Product Amount",
      cell: (productCount) => {
        const count = productCount.getValue() as { products: number }
        return count.products
      },
      footer: (props) => props.column.id,
      enableColumnFilter: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableRowMenu>
          <TableRowMenu.Link
            href={`/admin/categories?id=${row.original.id}&view=true`}
          >
            View Category
          </TableRowMenu.Link>
          <TableRowMenu.Link
            href={`/admin/categories?id=${row.original.id}&edit=true`}
          >
            Edit Category
          </TableRowMenu.Link>
        </TableRowMenu>
      ),
    },
  ]

  const table = useReactTable<
    Prisma.CategoryGetPayload<{
      include: { _count: { select: { products: true } }; images: true }
    }>
  >({
    data: categories,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-scroll">
      <div className="my-2 flex justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <TableSearchInput
            onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
            placeholder="Search by category name"
          />
          <TableDataSorter table={table} sortsData={getCategorySorts(table)} />
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedCategories.length}
            onClick={() => router.push("/admin/categories?delete=true")}
            className="hover:scale-[105%]"
          >
            <BsTrash3 className="text-slate-50" />
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => {
              router.push(`/admin/categories?add=true`)
            }}
            className="hover:scale-[105%]"
          >
            <BsPlus className="text-slate-50" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-x-scroll rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-neutral-800">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 dark:bg-neutral-800 dark:text-slate-50">
          <thead className="bg-blue-100 dark:bg-blue-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-900 dark:text-neutral-50 lg:text-sm"
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
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="relative border-t border-gray-100 dark:border-neutral-600 dark:bg-neutral-800">
            {table.getRowModel().rows?.length &&
              table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          className="dark:background-neutral-800 border-b border-b-gray-200 px-3 py-2 text-center text-xs dark:border-b-neutral-600 lg:px-6 lg:py-4 lg:text-sm"
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            {!table.getRowModel().rows?.length && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-96 text-center font-medium tracking-wider text-gray-400"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
      <DeleteCategoriesModal selectedCategories={selectedCategories} />
    </div>
  )
}
