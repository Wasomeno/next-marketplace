import Image from "next/image"
import { Prisma } from "@prisma/client"
import * as HoverCard from "@radix-ui/react-hover-card"
import { ColumnDef } from "@tanstack/react-table"
import { GiCookingPot, GiPoloShirt } from "react-icons/gi"

import { TableActions } from "@/components/table-row-menu"

function getCategoryIcons(name: string) {
  switch (name) {
    case "Clothing":
      return <GiPoloShirt size={20} />

    case "Kitchen Ware":
      return <GiCookingPot size={20} />
  }
}

export const productTableColumns: ColumnDef<
  Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>
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
        <div className="relative flex items-center justify-center">
          <Image
            src={url.getValue() as string}
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
    cell: (name) => name.getValue(),
  },
  {
    accessorKey: "categories",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.original.categories.map(
        (category) => category.name
      )
      return (
        <div className="flex items-center justify-center gap-1.5">
          {categories.map((category) => (
            <HoverCard.Root key={category} openDelay={0.1} closeDelay={0.1}>
              <HoverCard.Trigger asChild>
                <div
                  key={category}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-50 bg-gray-100 p-2 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-black"
                >
                  {getCategoryIcons(category)}
                </div>
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content
                  sideOffset={3}
                  className="rounded-md border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm"
                >
                  {category}
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: (stock) => stock.getValue(),
  },
  {
    id: "action",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <TableActions
          viewAction={
            <TableActions.View
              href={`/store/products/view/${row.original.id}`}
            />
          }
          editAction={
            <TableActions.Edit
              href={`/store/products/edit/${row.original.id}`}
            />
          }
          deleteAction={<TableActions.Delete href={""} />}
        />
      )
    },
  },
]
