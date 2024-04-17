"use client"

import { useRouter } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"

import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/skeleton"
import { TableActions } from "@/components/table-actions"

import { TBaseDataFilterParams } from "../../../../../types"
import { DataTable, useSelectedData } from "../../../../components/data-table"
import { DeleteCategoriesModal } from "./delete-categories-modal"

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

export const CategoryTable = () => {
  const router = useRouter()
  const {
    selectedData,
    deselectAllData,
    deselectData,
    selectData,
    selectAllData,
  } = useSelectedData()

  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const { data: categories, isLoading } = useQuery({
    queryKey: categoryQueryKeys.all(searchParamsValues),
    queryFn: () =>
      getCategories({
        ...searchParamsValues,
        sort: getParsedSortParams(searchParamsValues.sort),
      }),
  })

  const columns: ColumnDef<
    Prisma.CategoryGetPayload<{
      include: { _count: { select: { products: true } }; images: true }
    }>
  >[] = [
    {
      id: "select",
      header: ({ table }) => (
        <CheckBox
          checked={table.getCoreRowModel().rows.length === selectedData?.length}
          onCheckedChange={() => {
            table.getCoreRowModel().rows.length === selectedData?.length
              ? deselectAllData()
              : selectAllData(
                  table.getCoreRowModel().rows.map((row) => row.original.id)
                )
          }}
        />
      ),
      cell: ({ row }) => (
        <CheckBox
          checked={selectedData?.includes(row.original.id)}
          onCheckedChange={() => {
            if (selectedData?.includes(row.original.id)) {
              deselectData(row.original.id)
            } else {
              selectData(row.original.id)
            }
          }}
        />
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
              asLink
              href={`/admin/categories/${row.original.id}`}
            />
          }
          editAction={
            <TableActions.Edit
              asLink
              href={`/admin/categories/${row.original.id}/edit`}
            />
          }
        />
      ),
    },
  ]

  const placeHolderColumns: ColumnDef<
    Prisma.CategoryGetPayload<{
      include: { _count: { select: { products: true } }; images: true }
    }>
  >[] = [
    {
      id: "select",
      header: () => <CheckBox disabled />,
      cell: () => <CheckBox disabled />,
    },
    {
      header: "Id",
      cell: () => <Skeleton className="h-[20px] w-24" />,
    },
    {
      header: "Name",
      cell: () => <Skeleton className="h-[20px] w-44" />,
    },
    {
      header: "Product Amount",
      cell: () => <Skeleton className="h-[20px] w-28" />,
    },
    {
      header: "Actions",
      cell: () => (
        <TableActions
          viewAction={<TableActions.View asLink={false} disabled />}
          editAction={<TableActions.Edit asLink={false} disabled />}
        />
      ),
    },
  ]

  const placeholderData = Array(5).fill("")

  return (
    <>
      <DataTable
        data={categories ?? placeholderData}
        columns={isLoading ? placeHolderColumns : columns}
        dataSorter={<DataTable.Sorter sortOptions={categorySortOptions} />}
        addTrigger={
          <Button
            variant="success"
            size="sm"
            onClick={() => {
              router.push("/admin/categories/add")
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
