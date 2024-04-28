"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { deleteProduct } from "@/actions/store/products"
import { getStoreProducts, StoreProduct } from "@/actions/store/store"
import { productQueryKeys } from "@/modules/user/common/queryKeys/productQueryKeys"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

import { TBaseDataFilterParams } from "../../../../../../types"
import {
  DataTable,
  useSelectedData,
} from "../../../../../components/data-table"
import { ProductFilter } from "./product-filter"
import {
  productTableColumns,
  productTablePlaceholderColumns,
} from "./product-table-columns"

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

const placeholderColumns: ColumnDef<
  Prisma.ProductGetPayload<{
    include: { images: true; categories: true; reviews: true; store: true }
  }>
>[] = [
  {
    id: "select",
    header: () => <CheckBox disabled />,
    cell: () => <CheckBox disabled />,
  },
  ...productTablePlaceholderColumns,
]

export const ProductTable: React.FC<{ userEmail: string }> = ({
  userEmail,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const searchParamsValues = useSearchParamsValues<
    TBaseDataFilterParams & {
      status: string
      categories: string
      delete: string
      id: string
    }
  >()

  const {
    selectedData,
    selectData,
    selectAllData,
    deselectData,
    deselectAllData,
  } = useSelectedData()

  const products = useQuery({
    queryKey: [
      productQueryKeys.userStore(userEmail),
      searchParamsValues.status,
      searchParamsValues.sort,
      searchParamsValues.categories,
      searchParamsValues.search,
      searchParamsValues.page,
    ],
    queryFn: () =>
      getStoreProducts({
        ...searchParamsValues,
        userEmail,
        sort: getParsedSortParams(searchParamsValues.sort),
        pageSize: pageSize.toString(),
        categoryIds: searchParamsValues?.categories
          ?.split(" ")
          ?.map((categoryId) => parseInt(categoryId)),
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<StoreProduct>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <CheckBox
          checked={
            table.getCoreRowModel().rows.length === selectedData.length &&
            selectedData.length > 0
          }
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

  const router = useRouter()
  const pathname = usePathname()

  function openCreateProductModal() {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.set("create", "true")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

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

  const isSingleDelete =
    searchParamsValues?.id !== undefined &&
    searchParamsValues.delete !== undefined

  return (
    <>
      <DataTable
        data={
          (products.isLoading
            ? Array(5).fill({})
            : products.data?.products) as StoreProduct[]
        }
        columns={products.isLoading ? placeholderColumns : columns}
        pagination={
          products.data?.products.length ? (
            <DataTable.Pagination
              dataLength={products.data.amount}
              pageSize={pageSize}
            />
          ) : (
            <></>
          )
        }
        dataSorter={
          <DataTable.Sorter
            sortOptions={productSortOptions}
            disabled={products.isLoading}
          />
        }
        dataFilter={<ProductFilter />}
        searchInput={
          <DataTable.SearchInput
            disabled={products.isLoading}
            placeholder="Search by product name"
          />
        }
        addTrigger={
          <Button
            variant="defaultOutline"
            size="sm"
            onClick={openCreateProductModal}
            className="h-8 w-8 gap-1 px-0 shadow-sm lg:h-9 lg:w-auto lg:px-2.5"
          >
            <span className="hidden text-xs lg:inline">Create</span> <BsPlus />
          </Button>
        }
        deleteTrigger={
          <Button
            variant="defaultOutline"
            size="sm"
            disabled={!selectedData.length}
            onClick={() => setIsDeleteModalOpen(true)}
            className="h-8 w-8 px-0 shadow-sm disabled:hover:bg-white lg:h-9 lg:w-auto lg:px-2.5"
          >
            <span className="hidden text-xs lg:inline">Remove</span>{" "}
            <BsTrash3 />
          </Button>
        }
      />
      <ConfirmationDialog
        open={isDeleteModalOpen}
        title={"Delete Multiple Products"}
        body={`Are you sure want to delete ${selectedData.length} products? This action can't be undone`}
        onOpenChange={() => setIsDeleteModalOpen(true)}
        onConfirm={() => deleteProducts()}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <ConfirmationDialog
        open={isSingleDelete}
        title={"Delete Product"}
        body={`Are you sure want to delete ${products?.data?.products.find((product) => product.id.toString() === (searchParamsValues?.id as string))?.name} ? This action can't be undone`}
        onOpenChange={() => {
          const searchParams = new URLSearchParams(searchParamsValues)
          searchParams.delete("id")
          searchParams.delete("delete")
          router.replace(`${pathname}?${searchParams.toString()}`)
        }}
        onConfirm={() => deleteProducts()}
        onCancel={() => {
          const searchParams = new URLSearchParams(searchParamsValues)
          searchParams.delete("id")
          searchParams.delete("delete")
          router.replace(`${pathname}?${searchParams.toString()}`)
        }}
      />
    </>
  )
}

export function ProductTableSkeleton() {
  return (
    <DataTable
      data={Array(5).fill({})}
      columns={placeholderColumns}
      pagination={<></>}
      dataSorter={
        <DataTable.Sorter sortOptions={productSortOptions} disabled />
      }
      dataFilter={<ProductFilter disabled />}
      searchInput={
        <DataTable.SearchInput disabled placeholder="Search by product name" />
      }
      addTrigger={
        <Button
          variant="defaultOutline"
          size="sm"
          className="h-8 w-8 gap-1 px-0 shadow-sm lg:h-9 lg:w-auto lg:px-2.5"
          disabled
        >
          <span className="hidden text-xs lg:inline">Create</span> <BsPlus />
        </Button>
      }
      deleteTrigger={
        <Button
          variant="defaultOutline"
          size="sm"
          className="h-8 w-8 px-0 shadow-sm lg:h-9 lg:w-auto lg:px-2.5"
          disabled
        >
          <span className="hidden text-xs lg:inline">Remove</span> <BsTrash3 />
        </Button>
      }
    />
  )
}
