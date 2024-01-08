"use client"

import { useRouter } from "next/navigation";
import { BsPlus, BsTrash3 } from "react-icons/bs";
import { GiCookingPot, GiShirt } from "react-icons/gi";

import { Button } from "@/components/ui/button";
import { getProductSorts } from "@/config/table/sorts/productSorts";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable, useSelectedData } from "../data-table";
import { DeleteProductModal } from "./forms/delete-product-modal";
import { productTableColumns } from "./product-table-columns";

export const ProductTable = ({
  products,
}: {
  products: Prisma.ProductGetPayload<{
    include: { images: true; categories: true }
  }>[]
}) => {
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
            onClick={() => router.replace("/store/products?delete=true")}
            className="h-8 w-8 hover:scale-[105%] lg:h-9 lg:w-9"
          >
            <BsTrash3 className="text-slate-50" />
          </Button>
        }
      />
      <DeleteProductModal selectedProducts={selectedData} />
    </>
  )
}
