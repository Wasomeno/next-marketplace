import React from "react"

import { Button } from "@/components/ui/button"
import { WishListItemCardSkeleton } from "@/components/user/wishlist/wishlist-item-card"

export default function WishlistLoading() {
  return (
    <div className="flex flex-1 flex-col px-0 lg:flex-row lg:px-8">
      <div className="flex flex-1 flex-col gap-3 px-4 lg:w-4/6 lg:px-0">
        <h1 className="mb-2 text-base font-medium lg:text-xl">Wishlist</h1>
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
            0 items
          </span>
        </div>
        <div>
          <WishListItemCardSkeleton />
          <WishListItemCardSkeleton />
          <WishListItemCardSkeleton />
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white dark:bg-neutral-950 lg:w-2/6 lg:px-8">
        <div className="flex flex-col justify-between border-t border-slate-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] lg:h-72 lg:rounded-lg lg:border lg:border-slate-300 lg:p-4 lg:shadow-none">
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
            disabled
            variant="default"
            className="my-1 w-full rounded-lg border bg-blue-400  py-3 text-xs font-medium text-slate-50 lg:text-sm"
          >
            Add all to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
