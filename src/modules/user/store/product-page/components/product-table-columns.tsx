import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Prisma } from "@prisma/client"
import * as HoverCard from "@radix-ui/react-hover-card"
import { ColumnDef } from "@tanstack/react-table"
import { GiCookingPot, GiPoloShirt } from "react-icons/gi"

import { Skeleton } from "@/components/skeleton"
import { TableActions } from "@/components/table-actions"

import { StoreProductSingleDeleteModal } from "./store-product-single-delete-modal"

function getCategoryIcons(name: string) {
  switch (name) {
    case "Clothing":
      return <GiPoloShirt size={20} />

    case "Kitchen Ware":
      return <GiCookingPot size={20} />
  }
}

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
  {
    id: "action",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter()
      const pathname = usePathname()
      const searchParams = useSearchParams()
      const urlSearchParams = new URLSearchParams(searchParams)

      function openEditProductModal() {
        urlSearchParams.set("edit", "true")
        urlSearchParams.set("id", row.original.id.toString())

        return router.replace(`${pathname}?${urlSearchParams.toString()}`)
      }

      return (
        <TableActions
          viewAction={
            <TableActions.View
              href={`/store/products/view/${row.original.id}`}
              asLink
            />
          }
          editAction={
            <TableActions.Edit onClick={openEditProductModal} asLink={false} />
          }
          deleteAction={
            <StoreProductSingleDeleteModal product={row.original} />
          }
        />
      )
    },
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
