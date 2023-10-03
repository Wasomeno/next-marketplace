"use client"

import { useState } from "react"
import { Prisma } from "@prisma/client"
import { RxCrossCircled } from "react-icons/rx"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { addWishlistsToCart } from "@/app/actions/wishlist"

import { WishListItemCard } from "./wishlist-item-card"

type WishlistItemsSectionProps = {
  items:
    | Prisma.WishlistItemGetPayload<{
        include: { product: { include: { images: true } } }
      }>[]
    | undefined
}

export const WishlistItemsSection = ({ items }: WishlistItemsSectionProps) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  return (
    <div className="flex flex-1 flex-col justify-between  lg:flex-row ">
      <div className="w-full px-4 lg:w-7/12 lg:px-8">
        <div className="mt-2">
          {items?.length ? (
            items?.map((item) => (
              <WishListItemCard
                key={item.id}
                item={item}
                setSelectedItems={setSelectedItems}
              />
            ))
          ) : (
            <div className="flex h-96 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm lg:text-base">No items in Cart</span>
              <RxCrossCircled size="20" />
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white dark:bg-neutral-950 lg:w-2/6 lg:px-8">
        <div className="flex flex-col justify-between border-t border-slate-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-gray-800 lg:h-72 lg:rounded-lg lg:border lg:border-slate-300 lg:p-4 lg:shadow-none">
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
            className="my-1 w-full rounded-lg bg-blue-400 py-3 text-xs font-medium text-slate-50 dark:bg-blue-900 lg:text-sm"
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
