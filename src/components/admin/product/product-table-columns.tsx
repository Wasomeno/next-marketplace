import Image from "next/image"
import { Category, Prisma, ProductImage } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { TableRowMenu } from "@/components/table-row-menu"

export const productTableColumns: ColumnDef<
  Prisma.ProductGetPayload<{ include: { images: true; category: true } }>
>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: (category) => category.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: (info) => {
      const images = info.getValue() as ProductImage[]
      return (
        <div className="relative flex items-center justify-center">
          <Image
            src={images[0].image_url}
            alt="product-image"
            width={90}
            height={90}
          />
        </div>
      )
    },
    enableColumnFilter: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: (category) => category.getValue(),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (category) => {
      const value = category.getValue() as Category
      return (
        <button className="w-28 rounded-md bg-gray-100 py-2.5 text-xs tracking-wider text-slate-800">
          {value.name}
        </button>
      )
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: (category) => category.getValue(),
  },
  {
    id: "action",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <TableRowMenu>
          <TableRowMenu.Link
            href={`/admin/products?id=${row.original.id}&view=true`}
          >
            View Product
          </TableRowMenu.Link>
          <TableRowMenu.Link
            href={`/admin/products?id=${row.original.id}&edit=true`}
          >
            Edit Product
          </TableRowMenu.Link>
        </TableRowMenu>
      )
    },
  },
]
