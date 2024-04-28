"use client"

import { MouseEvent } from "react"
import Image from "next/image"
import { removeProductFromWishlist } from "@/actions/user/wishlist"
import { Prisma } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import clsx from "clsx"
import { BiTrash } from "react-icons/bi"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
import { twMerge } from "tailwind-merge"

import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/skeleton"

type WishListItemCardProps = {
  isSelected: boolean
  item: Prisma.WishlistItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>
  onClick: (event: MouseEvent) => void
}

export function WishlistItemCard({
  onClick,
  isSelected,
  item,
}: WishListItemCardProps) {
  const removeItem = useMutation({
    mutationFn: async (event: MouseEvent) => {
      event.stopPropagation()
      await removeProductFromWishlist(item.product.slug, "/wishlist")
    },
    onSuccess: () =>
      toast.success(`Removed ${item.product.name} from wishlist`),
    onError: () => toast.error(`Error when removing item`),
  })

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          "flex cursor-pointer items-center gap-4 rounded-lg rounded-t-none border border-x-transparent border-b-transparent p-4 transition-all duration-200 dark:border-t-gray-800",
          isSelected &&
            "rounded-t-lg border-blue-400 border-x-blue-400 border-b-blue-400 shadow-md"
        )
      )}
    >
      <div className="flex w-full items-end justify-between gap-2">
        <div className="flex w-full gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-slate-200 shadow-sm lg:h-28 lg:w-28">
            <Image
              src={item.product.featured_image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="flex flex-1 flex-wrap justify-between gap-2">
            <div className="flex w-full flex-col gap-1 lg:w-fit">
              <span className="text-xs tracking-wide  lg:text-base">
                {item.product.name}
              </span>
              <span className="text-sm tracking-wide text-gray-500 lg:text-base">
                Rp {item.product.price.toLocaleString("id")}
              </span>
            </div>
            <div className="flex w-full items-center justify-end gap-2 lg:w-fit lg:gap-4">
              <Button
                variant="defaultOutline"
                size="sm"
                className="h-8 w-8 p-2 shadow-sm"
                disabled={removeItem.isPending}
                onClick={removeItem.mutate}
              >
                {removeItem.isPending ? (
                  <ImSpinner8 className="animate-spin" size={14} />
                ) : (
                  <BiTrash size={14} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WishListItemCardSkeleton() {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-lg rounded-t-none border border-x-transparent border-b-transparent p-4 transition-all duration-200 dark:border-t-gray-800">
      <div className="flex w-full items-end justify-between gap-2">
        <div className="flex w-full gap-4">
          <Skeleton className="h-20 w-20 lg:h-28 lg:w-28" />
          <div className="flex flex-1 flex-wrap justify-between gap-2">
            <div className="flex w-full flex-col gap-1 lg:w-fit">
              <Skeleton className="h-6 w-32 lg:h-8" />
              <Skeleton className="h-7 w-32 lg:h-8" />
            </div>
            <div className="flex w-full items-center justify-end gap-2 lg:w-fit lg:gap-4">
              <Button
                variant="defaultOutline"
                size="sm"
                className="h-8 w-8 p-2 shadow-sm"
                disabled
              >
                <BiTrash size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
