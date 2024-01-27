"use client"

import React from "react"
import router from "next/router"
import { Banner } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { BsPlus, BsTrash3 } from "react-icons/bs"

import { Button } from "@/components/ui/button"
import { TableActions } from "@/components/table-row-menu"

import { DataTable, useSelectedData } from "../data-table"

export const BannerTable = ({ banners }: { banners: Banner[] }) => {
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
      accessorKey: "url",
      header: "Url",
      cell: (url) => url.getValue(),
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
              href={`/admin/banners?id=${row.original.id}&view=true`}
            />
          }
          editAction={
            <TableActions.Edit
              href={`/admin/banners?id=${row.original.id}&edit=true`}
            />
          }
        />
      ),
    },
  ]
  return (
    <DataTable
      data={banners}
      columns={columns}
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
  )
}
