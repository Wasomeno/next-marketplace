"use client"

import { Prisma } from "@prisma/client"
import { Table } from "@tanstack/react-table"

import { TableSort } from "@/components/table-data-sorter"

export function getProductSorts(
  table?: Table<
    Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>
  >
): TableSort[] {
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
    {
      id: 3,
      text: "Stock from high to low",
      onClick() {
        table?.getColumn("stock")?.toggleSorting(true)
      },
    },
    {
      id: 4,
      text: "Stock from low to high",
      onClick() {
        table?.getColumn("stock")?.toggleSorting(false)
      },
    },
  ]
}
