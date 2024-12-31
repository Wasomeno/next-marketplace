"use client"

import { usePathname, useRouter } from "next/navigation"
import { BsPlus } from "react-icons/bs"

import { getCategories } from "@/actions/categories"
import { Skeleton } from "@/components/skeleton"
import { TableActions } from "@/components/table-actions"
import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { categoryQueryKeys } from "@/query/keys/category"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"

import { TBaseDataFilterParams } from "../../../../../../../types"
import {
  DataTable,
  useSelectedData,
} from "../../../../../../components/data-table"
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

  const pathname = usePathname()
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const categories = useQuery({
    queryKey: categoryQueryKeys.all(searchParamsValues).key,
    queryFn: () =>
      getCategories({
        ...searchParamsValues,
        sort: getParsedSortParams(searchParamsValues.sort),
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<
    Prisma.CategoryGetPayload<{
      include: { _count: { select: { products: true } }; image: true }
    }>
  >[] = [
    {
      id: "select",
      header: ({ table }) => (
        <CheckBox
          checked={
            table.getCoreRowModel().rows.length === selectedData.length &&
            selectedData.length > 0
          }
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
              onClick={() => openEditCategoryModal(row.original.id.toString())}
              asLink={false}
            />
          }
        />
      ),
    },
  ]

  const placeHolderColumns: ColumnDef<
    Prisma.CategoryGetPayload<{
      include: { _count: { select: { products: true } }; image: true }
    }>
  >[] = [
    {
      id: "select",
      header: () => <CheckBox disabled />,
      cell: () => <CheckBox disabled />,
    },
    {
      header: "Id",
      cell: () => <Skeleton className="h-6 w-24" />,
    },
    {
      header: "Name",
      cell: () => <Skeleton className="h-6 w-44" />,
    },
    {
      header: "Product Amount",
      cell: () => <Skeleton className="h-6 w-28" />,
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

  function openAddCategoryModal() {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.set("add", "true")
    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  function openEditCategoryModal(categoryId: string) {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.set("edit", "true")
    urlSearchParams.set("id", categoryId)
    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  return (
    <DataTable
      data={categories.data}
      columns={categories.isLoading ? placeHolderColumns : columns}
      searchInput={
        <DataTable.SearchInput placeholder="Search by category name" />
      }
      dataSorter={<DataTable.Sorter sortOptions={categorySortOptions} />}
      addTrigger={
        <Button
          variant="defaultOutline"
          size="sm"
          onClick={openAddCategoryModal}
          className="h-8 w-8 shadow-sm lg:h-9 lg:w-9"
        >
          <BsPlus />
        </Button>
      }
      deleteTrigger={
        <DeleteCategoriesModal selectedCategories={selectedData} />
      }
    />
  )
}
