import Image from "next/image"
import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { Skeleton } from "@/components/skeleton"
import { TableActions } from "@/components/table-actions"

import { StoreProductSingleDeleteModal } from "./store-product-single-delete-modal"

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

export const productTablePlaceholderColumns: ColumnDef<
  Prisma.ProductGetPayload<{
    include: { images: true; categories: true; reviews: true; store: true }
  }>
>[] = [
  {
    header: "Id",
    enableColumnFilter: false,
    cell: () => <Skeleton className="h-6 w-20 " />,
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
    cell: () => <Skeleton className="h-6 w-20 " />,
  },
  {
    header: "Category",
    cell: () => {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <Skeleton className="h-6 w-20 " />
        </div>
      )
    },
  },
  {
    header: "Status",
    cell: () => <Skeleton className="h-6 w-20 " />,
  },
  {
    header: "Stock",
    cell: (stock) => <Skeleton className="h-6 w-20 " />,
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
