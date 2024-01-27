"use client"

import React from "react"
import Image from "next/image"
import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "./admin/data-table"

type OrderProduct = Prisma.OrderProductGetPayload<{
  include: { product: true }
}>

export const ProductsOrderedTable = ({
  products,
}: {
  products: OrderProduct[]
}) => {
  const columns: ColumnDef<OrderProduct>[] = [
    {
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.original.product.featured_image_url}
          alt="product-image"
          className="rounded-md"
          width={90}
          height={90}
        />
      ),
    },
    {
      header: "Name",
      accessorFn: ({ product }) => product.name,
    },
    {
      header: "Price",
      accessorFn: ({ product }) => `Rp. ${product.price.toLocaleString("id")}`,
    },
    {
      header: "Amount",
      accessorKey: "amount",
    },
    {
      header: "Total",
      accessorFn: ({ product, amount }) =>
        `Rp ${(product.price * amount).toLocaleString("id")}`,
    },
  ]

  return <DataTable data={products} columns={columns} />
}
