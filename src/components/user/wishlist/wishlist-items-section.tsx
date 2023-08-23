"use client"

import { useState, useTransition } from "react"
import { Prisma } from "@prisma/client"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { ProductSorter } from "@/components/product-sorter"
import { addAllToCart } from "@/app/actions/wishlist"

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
  const [isPending, startTransition] = useTransition()
  return (
    <div className="flex flex-1 flex-col justify-between lg:flex-row">
      <div className="w-full lg:w-7/12">
        <div className="flex items-center justify-between px-4 lg:px-0">
          <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
            {items?.length ?? 0} items
          </span>
          <ProductSorter />
        </div>
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
            <div className="flex h-96 flex-col items-center justify-center">
              <span className="text-sm font-medium text-slate-400 lg:text-base">
                No items
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white dark:bg-neutral-950 lg:w-2/6">
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
            onClick={() =>
              startTransition(async () => {
                await addAllToCart(selectedItems)
                toast.success("Added all selected items to cart")
              })
            }
          >
            Add all to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
