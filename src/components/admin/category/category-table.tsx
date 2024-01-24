"use client"

import { useRouter } from "next/navigation"
import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"

import { Button } from "@/components/ui/button"
import { TableActions } from "@/components/table-row-menu"

import { DataTable, useSelectedData } from "../data-table"
import { DeleteCategoriesModal } from "./modals/delete-categories-modal"

type CategoryTableProps = {
  categories: Prisma.CategoryGetPayload<{
    include: { _count: { select: { products: true } }; images: true }
  }>[]
}

export const categorySortOptions = [
  {
    label: "Id from low to high",
    value: "id.asc",
  },
  {
    label: "Id from high to low",
    value: "id.desc",
  },
]

export const CategoryTable = ({ categories }: CategoryTableProps) => {
  const router = useRouter()
  const {
    selectedData,
    deselectAllData,
    deselectData,
    selectData,
    selectAllData,
  } = useSelectedData()
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
          className="h-4 w-4 cursor-pointer rounded-md border border-slate-300 accent-white dark:accent-gray-300"
          checked={table.getCoreRowModel().rows.length === selectedData?.length}
          onChange={() => {
            table.getCoreRowModel().rows.length === selectedData?.length
              ? deselectAllData()
              : selectAllData(
                  table.getCoreRowModel().rows.map((row) => row.original.id)
                )
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded-md border accent-black dark:accent-gray-300"
            checked={selectedData?.includes(row.original.id)}
            onChange={() => {
              if (selectedData?.includes(row.original.id)) {
                deselectData(row.original.id)
              } else {
                selectData(row.original.id)
              }
            }}
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
        <TableActions
          viewAction={
            <TableActions.View
              href={`/admin/categories?id=${row.original.id}&view=true`}
            />
          }
          editAction={
            <TableActions.Edit
              href={`/admin/categories?id=${row.original.id}&edit=true`}
            />
          }
        />
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={categories}
        columns={columns}
        sortOptions={categorySortOptions}
        addTrigger={
          <Button
            variant="success"
            size="sm"
            onClick={() => {
              router.push(`/admin/categories?add=true`)
            }}
            className="h-8 w-8 hover:scale-[105%] lg:h-9 lg:w-9"
          >
            <BsPlus className="text-slate-50" />
          </Button>
        }
        deleteTrigger={
          <Button
            variant="danger"
            size="sm"
            disabled={selectedData.length < 1}
            onClick={() => router.push("/admin/categories?delete=true")}
            className="h-8 w-8 hover:scale-[105%] lg:h-9 lg:w-9"
          >
            <BsTrash3 className="text-slate-50" />
          </Button>
        }
      />
      <DeleteCategoriesModal selectedCategories={selectedData} />
    </>
  )
}
