"use client"

import React, { ReactElement, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { CiViewList } from "react-icons/ci"

import { DataSorter } from "./data-sorter"
import { NoData } from "./no-data"
import { Pagination } from "./pagination"
import { TableSearchInput } from "./table-search-input"
import {
  Table as ReactTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data?: T[]
  dataSorter?: ReactElement
  dataFilter?: ReactElement
  deleteTrigger?: ReactElement
  addTrigger?: ReactElement
  searchInput?: ReactElement
  pagination?: ReactElement
  noDataFallback?: ReactElement
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  deleteTrigger,
  addTrigger,
  dataSorter,
  searchInput,
  pagination,
  dataFilter,
  noDataFallback,
}: DataTableProps<T>) {
  const table = useReactTable<T>({
    data: data ?? Array(5).fill({}),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex w-full flex-1 flex-col ">
      <div className="mb-2 flex  justify-between gap-2.5">
        <div className="flex w-full items-center gap-2">
          {searchInput}
          {dataSorter}
          {dataFilter}
        </div>
        <div className="flex items-center gap-2">
          {deleteTrigger}
          {addTrigger}
        </div>
      </div>
      <div className="data-table__container flex-1 overflow-x-scroll rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
        <ReactTable className="w-full border-collapse text-left text-sm text-gray-500 dark:bg-neutral-800">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                aria-rowspan={1}
                className="dark:border-neutral-600"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-xs font-medium text-gray-900 dark:text-white lg:text-sm"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      <div className="flex items-center justify-center px-3 py-2  lg:px-6 lg:py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
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
                      className="text-center text-xs   dark:text-white lg:text-sm"
                      key={cell.id}
                    >
                      <div className="flex  items-center justify-center px-3 py-2 lg:px-6 lg:py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
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
                  {noDataFallback ?? (
                    <NoData
                      icon={<CiViewList size={26} />}
                      text="No Available Data"
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ReactTable>
      </div>
      {pagination}
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

DataTable.SearchInput = TableSearchInput
DataTable.Sorter = DataSorter
DataTable.Pagination = Pagination
