"use client"

import { useState } from "react"
import { Prisma } from "@prisma/client"
import { RxCrossCircled } from "react-icons/rx"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { addWishlistsToCart } from "@/app/actions/user/wishlist"

import { WishlistItemCard } from "./wishlist-item-card"

type WishlistItemsSectionProps = {
  items:
    | Prisma.WishlistItemGetPayload<{
        include: { product: { include: { images: true } } }
      }>[]
    | undefined
}

export function WishlistItems({ items }: WishlistItemsSectionProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  return (
    <div className="flex flex-1 flex-col justify-between  lg:flex-row ">
      <div className="w-full px-4 lg:w-7/12 lg:px-8">
        <div className="mt-2">
          {items?.length ? (
            items?.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                setSelectedItems={setSelectedItems}
              />
            ))
          ) : (
            <div className="flex h-96 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm lg:text-base">No items in Wishlist</span>
              <RxCrossCircled size="20" />
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white lg:w-2/6 lg:px-8 dark:bg-neutral-950">
        <div className="flex flex-col justify-between border-t border-gray-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] lg:h-72 lg:rounded-lg lg:border lg:border-gray-200 lg:p-4 lg:shadow-none dark:border-gray-800">
          <div className="">
            <span className="hidden text-xs font-medium lg:inline lg:text-base">
              Selected Items Summary
            </span>
            <div className="my-2 flex justify-between">
              <span className="text-xs text-slate-500 lg:text-base">
                Subtotal
              </span>
              <span className="text-sm lg:text-lg">Rp 0</span>
            </div>
          </div>
          <Button
            disabled={!selectedItems.length}
            variant="default"
            className="my-1 w-full rounded-lg bg-blue-400 py-3 text-xs font-medium text-slate-50 lg:text-sm dark:bg-blue-900"
            onClick={async () => {
              await addWishlistsToCart(selectedItems)
              toast.success("Added all selected items to cart")
            }}
          >
            Add all to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
