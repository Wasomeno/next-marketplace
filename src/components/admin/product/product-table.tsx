"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { deleteProduct } from "@/app/actions/store/products"
import { getStoreProducts } from "@/app/actions/store/store"

import { DataTable, useSelectedData } from "../data-table"
import {
  productTableColumns,
  productTablePlaceholderColumns,
} from "./product-table-columns"

type StoreProduct = Prisma.ProductGetPayload<{
  include: { images: true; categories: true }
}>

export const productSortOptions = [
  {
    label: "Id from low to high",
    value: "id.asc",
  },
  {
    label: "Id from high to low",
    value: "id.desc",
  },
  {
    label: "Stock from high to low",
    value: "stock.desc",
  },
  {
    label: "Stock from low to high",
    value: "stock.asc",
  },
]

export const ProductTable = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const searchParams = useSearchParamsValues<{
    sort: Record<string, "desc" | "asc">
    status: string
    search: string
  }>()

  const {
    selectedData,
    selectData,
    selectAllData,
    deselectData,
    deselectAllData,
  } = useSelectedData()

  const { data, isLoading } = useQuery({
    queryKey: ["products", searchParams],
    queryFn: () => getStoreProducts({ sort: searchParams?.sort }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<StoreProduct>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer p-1.5"
          checked={table.getCoreRowModel().rows.length === selectedData.length}
          onChange={() => {
            table.getCoreRowModel().rows.length === selectedData.length
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
            className="h-4 w-4 cursor-pointer rounded-md accent-blue-300 dark:accent-gray-300"
            checked={selectedData.includes(row.original.id)}
            onChange={() => {
              if (selectedData.includes(row.original.id)) {
                deselectData(row.original.id)
              } else {
                selectData(row.original.id)
              }
            }}
          />
        </div>
      ),
    },
    ...productTableColumns,
  ]

  const placeholderColumns: ColumnDef<
    Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>
  >[] = [
    {
      id: "select",
      header: () => (
        <input type="checkbox" className="h-4 w-4 cursor-pointer p-1.5" />
      ),
      cell: () => (
        <div className="px-1">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded-md accent-blue-300 dark:accent-gray-300"
          />
        </div>
      ),
    },
    ...productTablePlaceholderColumns,
  ]

  const router = useRouter()

  async function deleteProducts() {
    await toast.promise(deleteProduct(selectedData), {
      success: `Successfully deleted ${selectedData.length} products`,
      pending: {
        render() {
          setIsDeleteModalOpen(false)
          return `Deleting ${selectedData.length} products`
        },
      },
      error: "Error when deleting products",
    })
    deselectAllData()
  }

  return (
    <>
      <DataTable
        data={isLoading ? Array(5).fill({}) : (data as StoreProduct[])}
        columns={isLoading ? placeholderColumns : columns}
        sortOptions={productSortOptions}
        addTrigger={
          <Button
            variant="success"
            size="sm"
            onClick={() => router.push("/store/products/create")}
            className="h-8 w-8 hover:scale-[105%] lg:h-9 lg:w-9"
          >
            <BsPlus className="text-slate-50" />
          </Button>
        }
        deleteTrigger={
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedData.length}
            onClick={() => setIsDeleteModalOpen(true)}
            className="h-8 w-8 hover:scale-[105%] lg:h-9 lg:w-9"
          >
            <BsTrash3 className="text-slate-50" />
          </Button>
        }
      />
      <ConfirmationDialog
        open={isDeleteModalOpen}
        body={`Delete ${selectedData.length} products? This action can't be undone`}
        onOpenChange={() => setIsDeleteModalOpen(true)}
        onConfirm={() => deleteProducts()}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  )
}
