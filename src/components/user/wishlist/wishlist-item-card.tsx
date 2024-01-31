"use client"

import { Dispatch, SetStateAction, useTransition } from "react"
import Image from "next/image"
import { Prisma } from "@prisma/client"
import { BiTrash } from "react-icons/bi"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { removeProductFromWishlist } from "@/app/actions/user/wishlist"

type WishListItemCardProps = {
  setSelectedItems: Dispatch<SetStateAction<number[]>>
  item: Prisma.WishlistItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>
}

export function WishlistItemCard({
  setSelectedItems,
  item,
}: WishListItemCardProps) {
  const [isPending, startTransition] = useTransition()

  function selectItem() {
    setSelectedItems((selectedItems) => {
      if (selectedItems.includes(item.product_id)) {
        return selectedItems.filter(
          (selectedItem) => selectedItem !== item.product_id
        )
      } else {
        return [...selectedItems, item.product_id]
      }
    })
  }

  function deleteItem() {
    startTransition(async () => {
      await removeProductFromWishlist(item.product.slug, "/wishlist")
      toast.error(`Removed ${item.product.name} from wishlist`)
    })
  }

  return (
    <div className="flex items-center gap-4 border-t p-4 dark:border-t-gray-800">
      <CheckBox onCheckedChange={selectItem} />
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
            className="h-7 w-7 p-2 text-white lg:h-8 lg:w-8 dark:bg-red-800"
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
            <div className="relative h-16 w-full animate-pulse rounded-md bg-slate-300 lg:h-32" />
          </div>
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <div className="h-[0.75rem] w-32 animate-pulse rounded-md bg-slate-300 lg:h-[1rem]" />
            <div className="h-[0.75rem] w-40 animate-pulse rounded-md bg-slate-300 lg:h-[1rem]" />
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
