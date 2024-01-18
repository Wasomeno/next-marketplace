"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"
import { toast } from "react-toastify"

import { getProductSorts } from "@/config/table/sorts/productSorts"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { deleteProduct } from "@/app/actions/store/products"

import { DataTable, useSelectedData } from "../data-table"
import { productTableColumns } from "./product-table-columns"

export const ProductTable = ({
  products,
}: {
  products: Prisma.ProductGetPayload<{
    include: { images: true; categories: true }
  }>[]
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, startTransition] = useTransition()
  const {
    selectedData,
    selectData,
    selectAllData,
    deselectData,
    deselectAllData,
  } = useSelectedData()

  const columns: ColumnDef<
    Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>
  >[] = [
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

  const router = useRouter()

  function deleteProducts() {
    startTransition(async () => {
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
    })
  }

  return (
    <>
      <DataTable
        data={products}
        columns={columns}
        getSortsData={(table) => getProductSorts(table)}
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
