"use client"

import Image from "next/image";
import { Dispatch, SetStateAction, useTransition } from "react";
import { BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";

import { removeProductFromWishlist } from "@/actions/user/wishlist";
import { Skeleton } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { CheckBox } from "@/components/ui/checkbox";
import { Prisma } from "@prisma/client";

type WishListItemCardProps = {
  item: Prisma.WishlistItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>
  onItemSelect: (item: WishListItemCardProps["item"]) => void
}

export function WishlistItemCard({
  onItemSelect,
  item,
}: WishListItemCardProps) {
  const [isPending, startTransition] = useTransition()

  function deleteItem() {
    startTransition(async () => {
      await removeProductFromWishlist(item.product.slug, "/wishlist")
      toast.error(`Removed ${item.product.name} from wishlist`)
    })
  }

  return (
    <div className="flex items-center gap-4 border-t p-4 dark:border-t-gray-800">
      <CheckBox onCheckedChange={() => onItemSelect(item)} />
      <div className="flex w-full items-end justify-between">
        <div className="flex w-full gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-md bg-slate-200 lg:h-28 lg:w-28">
            <Image
              src={item.product.featured_image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <span className="text-sm tracking-wide lg:text-base">
              Rp {item.product.price.toLocaleString("id")}
            </span>
            <span className="text-xs tracking-wide text-slate-500 lg:text-base">
              {item.product.name}
            </span>
          </div>
        </div>
        <div>
          <Button
            variant="danger"
            size="sm"
            className="h-7 w-7 p-2 text-white dark:bg-red-800 lg:h-8 lg:w-8"
            onClick={deleteItem}
          >
            <BiTrash size="14" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function WishListItemCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border-t p-4">
      <CheckBox disabled />
      <div className="flex w-full items-end justify-between">
        <div className="flex w-full gap-4">
          <div className="w-[60px] lg:w-[120px]">
            <Skeleton className="h-16 w-full lg:h-32" />
          </div>
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <Skeleton className="h-[0.75rem] w-32 lg:h-[1rem]" />
            <Skeleton className="h-[0.75rem] w-40 lg:h-[1rem]" />
          </div>
        </div>
        <div>
          <Button
            disabled
            variant="danger"
            size="sm"
            className="h-7 w-7 p-2 text-white lg:h-8 lg:w-8"
          >
            <BiTrash size="14" />
          </Button>
        </div>
      </div>
    </div>
  )
}
