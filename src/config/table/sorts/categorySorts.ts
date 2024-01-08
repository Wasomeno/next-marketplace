import { Table } from "@tanstack/react-table"

import { TableSort } from "@/components/table-data-sorter"

export function getCategorySorts<T>(table?: Table<T>): TableSort[] {
  return [
    {
      id: 1,
      text: "Id from low to high",
      onClick() {
        table?.getColumn("id")?.toggleSorting(false)
      },
    },
    {
      id: 2,
      text: "Id from high to low",
      onClick() {
        table?.getColumn("id")?.toggleSorting(true)
      },
    },
  ]
}
