"use client"

import React, { ReactElement, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table"

import { TableDataSorter, TableSort } from "../table-data-sorter"
import { TableSearchInput } from "../table-search-input"
import { Button } from "../ui/button"
import {
  Table as ReactTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  getSortsData: (table: Table<T>) => TableSort[]
  deleteTrigger?: ReactElement
  addTrigger?: ReactElement
}

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  getSortsData,
  deleteTrigger,
  addTrigger,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-scroll">
      <div className="mb-2 flex  justify-between gap-2.5">
        <div className="flex w-full items-center gap-2">
          <TableSearchInput
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            placeholder="Search by product name"
          />
          <TableDataSorter table={table} sortsData={getSortsData(table)} />
        </div>
        <div className="flex items-center gap-2">
          {deleteTrigger}
          {addTrigger}
        </div>
      </div>
      <div className="flex-1 overflow-x-scroll rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
        <ReactTable className="w-full border-collapse text-left text-sm text-gray-500 dark:bg-neutral-800">
          <TableHeader className="bg-blue-100 dark:bg-blue-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                aria-rowspan={1}
                className="dark:border-neutral-600"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="px-6 py-4 text-center text-xs font-medium text-gray-900 lg:text-sm dark:text-white"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative divide-y divide-gray-100 border-t border-gray-100 dark:divide-neutral-600 dark:border-neutral-600">
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-white dark:border-neutral-600 dark:bg-neutral-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="px-3 py-2 text-center text-xs  lg:px-6 lg:py-4 lg:text-sm dark:text-white"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!table.getRowModel().rows?.length && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-96 text-center font-medium tracking-wider text-gray-400"
                >
                  No Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ReactTable>
      </div>
      <div className="my-2 flex items-center justify-start gap-2.5">
        <Button
          variant="default"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-20 border dark:border-neutral-600 dark:bg-neutral-900"
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-20 border dark:border-neutral-600 dark:bg-neutral-900"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export function useSelectedData() {
  const [selectedData, setSelectedData] = useState<number[]>([])

  function selectData(dataId: number) {
    const newSelectedData = [...selectedData, dataId]
    setSelectedData(newSelectedData)
  }

  function deselectData(dataId: number) {
    const newSelectedData = selectedData.filter(
      (currentData) => currentData !== dataId
    )
    setSelectedData(newSelectedData)
  }

  function selectAllData(dataIds: number[]) {
    setSelectedData(dataIds)
  }

  function deselectAllData() {
    setSelectedData([])
  }

  return {
    selectedData,
    selectData,
    deselectData,
    selectAllData,
    deselectAllData,
  }
}
