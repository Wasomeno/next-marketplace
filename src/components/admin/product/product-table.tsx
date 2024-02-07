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
import { CheckBox } from "@/components/ui/checkbox"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Skeleton } from "@/components/skeleton"
import { deleteProduct } from "@/app/actions/store/products"
import {
  getStoreProducts,
  getStoreProductsCount,
} from "@/app/actions/store/store"

import { BaseDataFilters } from "../../../../types"
import { DataTable, useSelectedData } from "../data-table"
import {
  productTableColumns,
  productTablePlaceholderColumns,
} from "./product-table-columns"

type StoreProduct = Prisma.ProductGetPayload<{
  include: { images: true; categories: true }
}>

const pageSize = 3

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

  const searchParamsValues = useSearchParamsValues<
    BaseDataFilters & { status: string }
  >()

  const {
    selectedData,
    selectData,
    selectAllData,
    deselectData,
    deselectAllData,
  } = useSelectedData()

  const { data: productsCount, isLoading: isProductsCountLoading } = useQuery({
    queryKey: ["productsCount", searchParamsValues?.search],
    queryFn: () =>
      getStoreProductsCount({ search: searchParamsValues?.search }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: [
      "products",
      searchParamsValues?.page,
      searchParamsValues?.search,
      searchParamsValues?.sort,
      searchParamsValues?.status,
    ],
    queryFn: () => getStoreProducts({ ...searchParamsValues, pageSize }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<StoreProduct>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <CheckBox
          checked={table.getCoreRowModel().rows.length === selectedData.length}
          onCheckedChange={() => {
            table.getCoreRowModel().rows.length === selectedData.length
              ? deselectAllData()
              : selectAllData(
                  table.getCoreRowModel().rows.map((row) => row.original.id)
                )
          }}
        />
      ),
      cell: ({ row }) => (
        <CheckBox
          checked={selectedData.includes(row.original.id)}
          onCheckedChange={() => {
            if (selectedData.includes(row.original.id)) {
              deselectData(row.original.id)
            } else {
              selectData(row.original.id)
            }
          }}
        />
      ),
    },
    ...productTableColumns,
  ]

  const placeholderColumns: ColumnDef<
    Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>
  >[] = [
    {
      id: "select",
      header: () => <CheckBox disabled />,
      cell: () => <CheckBox disabled />,
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
      {isProductsCountLoading ? (
        <Skeleton className="h-[18px] w-20" />
      ) : (
        <span className="font text-sm text-gray-500 lg:text-base">
          {productsCount} Products
        </span>
      )}
      <DataTable
        data={
          (isProductsLoading ? Array(5).fill({}) : products) as StoreProduct[]
        }
        columns={isProductsLoading ? placeholderColumns : columns}
        pagination={
          products?.length ? (
            <DataTable.Pagination
              dataLength={productsCount ?? 0}
              pageSize={pageSize}
            />
          ) : (
            <></>
          )
        }
        dataSorter={<DataTable.Sorter sortOptions={productSortOptions} />}
        searchInput={
          <DataTable.SearchInput
            disabled={isProductsLoading}
            placeholder="Search by product name"
          />
        }
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
