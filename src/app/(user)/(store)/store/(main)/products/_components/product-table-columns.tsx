import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

export const productTableColumns: ColumnDef<
  Prisma.ProductGetPayload<{
    include: { images: true; categories: true; reviews: true; store: true }
  }>
>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: (id) => id.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: "featured_image_url",
    header: "Image",
    cell: (url) => {
      return (
        <div className="relative flex h-[140px] w-[120px] items-center justify-center">
          <Image
            src={url.getValue() as string}
            alt="product-image"
            className="rounded-md"
            fill
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
    cell: (name) => name.getValue(),
  },
  {
    accessorKey: "categories",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.original.categories?.map(
        (category) => category.name
      )
      return (
        <div className="flex items-center justify-center gap-1.5">
          {categories.join(", ")}
        </div>
      )
    },
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <span className="rounded-lg bg-gray-100 p-2 text-xs font-medium">
        {`${row.original.status[0].toUpperCase()}${row.original.status.slice(
          1
        )}`}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: (stock) => stock.getValue(),
  },
]
