"use client"

import React from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { bannersQuery } from "@/modules/user/common/queryOptions/bannerQueryOptions"
import { useSearchParamsValues } from "@/utils"
import { Banner } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus } from "react-icons/bs"

import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/skeleton"
import { TableActions } from "@/components/table-actions"

import { TBaseDataFilterParams } from "../../../../../types"
import { DataTable, useSelectedData } from "../../../../components/data-table"
import { DeleteBannerModal } from "./delete-banner-modal"

export const bannerSortOptions = [
  {
    label: "Id from low to high",
    value: "id.asc",
  },
  {
    label: "Id from high to low",
    value: "id.desc",
  },
]

export const BannerTable = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const banners = useQuery(
    bannersQuery({ ...searchParamsValues, pageSize: "5" })
  )

  const {
    deselectAllData,
    selectAllData,
    deselectData,
    selectData,
    selectedData,
  } = useSelectedData()

  const columns: ColumnDef<Banner>[] = [
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
      accessorKey: "url",
      header: "Image",
      cell: ({ row }) => (
        <div className="relative h-28 w-48 overflow-hidden rounded-lg">
          <Image alt={row.original.name} src={row.original.url} fill />
        </div>
      ),
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions
          editAction={
            <TableActions.Edit
              asLink={false}
              onClick={() => openEditBannerModal(row.original.id)}
            />
          }
        />
      ),
    },
  ]

  const placeholderColumns: ColumnDef<{}>[] = [
    {
      id: "select",
      header: () => <CheckBox disabled />,
      cell: () => <CheckBox disabled />,
    },
    {
      header: "Id",
      cell: () => <Skeleton className="h-6 w-20" />,
      enableColumnFilter: false,
    },
    {
      header: "Image",
      cell: () => <Skeleton className="h-28 w-48" />,
      footer: (props) => props.column.id,
      enableColumnFilter: false,
    },
    {
      header: "Name",
      cell: () => <Skeleton className="h-6 w-32" />,
      footer: (props) => props.column.id,
    },

    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <TableActions
          viewAction={<TableActions.View asLink={false} disabled />}
          editAction={<TableActions.Edit asLink={false} disabled />}
        />
      ),
    },
  ]

  function openCreateBannerModal() {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.set("add", "true")
    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  function openEditBannerModal(bannerId: number) {
    const urlSearchParams = new URLSearchParams(searchParamsValues)
    urlSearchParams.set("edit", "true")
    urlSearchParams.set("id", bannerId.toString())
    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  return (
    <DataTable
      data={banners.data ?? Array(5).fill({})}
      columns={banners.isLoading ? placeholderColumns : columns}
      searchInput={
        <DataTable.SearchInput placeholder="Search by banner name" />
      }
      dataSorter={<DataTable.Sorter sortOptions={bannerSortOptions} />}
      addTrigger={
        <Button
          variant="defaultOutline"
          size="sm"
          onClick={openCreateBannerModal}
          className="h-8 w-8 shadow-sm lg:h-9 lg:w-9"
        >
          <BsPlus />
        </Button>
      }
      deleteTrigger={<DeleteBannerModal selectedBanners={selectedData} />}
    />
  )
}
