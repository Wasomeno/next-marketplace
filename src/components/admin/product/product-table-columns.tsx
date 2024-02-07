import Image from "next/image"
import { Prisma } from "@prisma/client"
import * as HoverCard from "@radix-ui/react-hover-card"
import { ColumnDef } from "@tanstack/react-table"
import { GiCookingPot, GiPoloShirt } from "react-icons/gi"

import { Skeleton } from "@/components/skeleton"
import { TableActions } from "@/components/table-actions"

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
                  className="flex h-8 w-10 items-center justify-center rounded-lg border border-gray-50 bg-gray-100 p-2 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-black"
                >
                  {getCategoryIcons(category)}
                </div>
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content
                  sideOffset={3}
                  className="rounded-lg border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm"
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
    header: "Status",
    cell: ({ row }) => (
      <span className="rounded-lg bg-gray-100 p-2 font-medium">
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
  {
    id: "action",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <TableActions
          viewAction={
            <TableActions.View
              href={`/store/products/view/${row.original.id}`}
              asLink
            />
          }
          editAction={
            <TableActions.Edit
              href={`/store/products/edit/${row.original.id}`}
              asLink
            />
          }
          deleteAction={<TableActions.Delete href={""} asLink />}
        />
      )
    },
  },
]

export const productTablePlaceholderColumns: ColumnDef<
  Prisma.ProductGetPayload<{ include: { images: true; categories: true } }>
>[] = [
  {
    header: "Id",
    enableColumnFilter: false,
    cell: () => <Skeleton className="h-8 w-20 " />,
  },
  {
    header: "Image",
    cell: () => {
      return <Skeleton className="h-[140px] w-[120px] " />
    },
    enableColumnFilter: false,
  },
  {
    id: "name",
    header: "Name",
    cell: () => <Skeleton className="h-8 w-20 " />,
  },
  {
    header: "Category",
    cell: () => {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <Skeleton className="h-8 w-20 " />
        </div>
      )
    },
  },
  {
    header: "Status",
    cell: () => <Skeleton className="h-8 w-20 " />,
  },
  {
    header: "Stock",
    cell: (stock) => <Skeleton className="h-8 w-20 " />,
  },
  {
    id: "action",
    header: "Actions",
    cell: () => {
      return (
        <TableActions
          viewAction={<TableActions.View asLink={false} />}
          editAction={<TableActions.Edit asLink={false} />}
          deleteAction={<TableActions.Delete asLink={false} />}
        />
      )
    },
  },
]
