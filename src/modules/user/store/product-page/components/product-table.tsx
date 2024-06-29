"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { StoreProduct } from "@/actions/store/store"
import { storeProductsQuery } from "@/modules/user/common/queryOptions/storeQueryOptions"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"

import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { TableActions } from "@/components/table-actions"

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
import { StoreProductMultipleDeleteModal } from "./store-product-multiple-delete-modal"
import { StoreProductSingleDeleteModal } from "./store-product-single-delete-modal"

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

export const ProductTable: React.FC<{ storeId: number }> = ({ storeId }) => {
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

  const products = useQuery(
    storeProductsQuery({
      ...searchParamsValues,
      storeId,
      categoryIds: searchParamsValues.categories
        ?.split(" ")
        .map((categoryId) => Number(categoryId)),
      pageSize: "3",
      sort: getParsedSortParams(searchParamsValues.sort),
    })
  )

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
    {
      id: "action",
      header: "Actions",
      cell: ({ row }) => {
        const urlSearchParams = new URLSearchParams(searchParamsValues)

        function openEditProductModal() {
          urlSearchParams.set("edit", "true")
          urlSearchParams.set("id", row.original.id.toString())

          return router.replace(`${pathname}?${urlSearchParams.toString()}`)
        }

        return (
          <TableActions
            viewAction={
              <TableActions.View
                href={`/store/products/view/${row.original.id}`}
                asLink
              />
            }
            editAction={
              <TableActions.Edit
                onClick={openEditProductModal}
                asLink={false}
              />
            }
            deleteAction={
              <StoreProductSingleDeleteModal product={row.original} />
            }
          />
        )
      },
    },
  ]

  const router = useRouter()
  const pathname = usePathname()

  function openCreateProductModal() {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.set("create", "true")
    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  return (
    <DataTable
      data={products.data?.products}
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
      dataFilter={<ProductFilter disabled={products.isLoading} />}
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
        <StoreProductMultipleDeleteModal
          storeId={storeId}
          selectedIds={selectedData}
        />
      }
    />
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
