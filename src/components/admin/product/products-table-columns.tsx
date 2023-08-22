import Image from "next/image"
import { Category, Prisma, ProductImage } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

export const productsTableColumns = ({
  tableRowMenu,
  checkBox,
}: {
  tableRowMenu: ColumnDef<
    Prisma.ProductGetPayload<{ include: { images: true; category: true } }>
  >
  checkBox: ColumnDef<
    Prisma.ProductGetPayload<{ include: { images: true; category: true } }>
  >
}): ColumnDef<
  Prisma.ProductGetPayload<{ include: { images: true; category: true } }>
>[] => [
  checkBox,
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
        <div className="relative h-20 w-20">
          <Image src={images[0].image_url} alt="product-image" fill />
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
  tableRowMenu,
]
