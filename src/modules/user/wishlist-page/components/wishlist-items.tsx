"use client"

import { useState } from "react"
import { addWishlistsToCart } from "@/actions/user/wishlist"
import { Prisma } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { BiHeart } from "react-icons/bi"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { NoData } from "@/components/no-data"

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

  const subtotal = items
    ?.filter((item) => selectedItems.includes(item.product_id))
    .reduce((accumulator, current) => (accumulator += current.product.price), 0)

  function selectItem(
    item: Prisma.WishlistItemGetPayload<{
      include: { product: { include: { images: true } } }
    }>
  ) {
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

  const addWishlistoCart = useMutation({
    mutationFn: () => addWishlistsToCart(selectedItems),
    onSuccess: () => toast.success("Added all selected items to cart"),
    onError: () => toast.error("Error when adding wishlist items to cart"),
  })

  return (
    <div className="flex flex-1 flex-col justify-between  lg:flex-row ">
      <div className="w-full px-4 lg:w-7/12 lg:px-8">
        <div className="mt-2">
          {items?.length ? (
            items?.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.product_id)}
                onClick={() => selectItem(item)}
              />
            ))
          ) : (
            <div className="flex h-96 flex-col items-center justify-center">
              <NoData
                text="No Items in Wishlist"
                icon={<BiHeart size={26} />}
              />
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white dark:bg-neutral-950 lg:w-2/6 lg:px-8">
        <div className="flex flex-col justify-between border-t border-gray-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-gray-800 lg:h-72 lg:rounded-lg lg:border lg:border-gray-200 lg:p-4 lg:shadow-none">
          <div className="">
            <span className="hidden text-xs font-medium lg:inline lg:text-base">
              Selected Items Summary
            </span>
            <div className="my-2 flex justify-between">
              <span className="text-xs text-slate-500 lg:text-base">
                Subtotal
              </span>
              <span className="text-sm lg:text-lg">
                Rp {subtotal?.toLocaleString("id")}
              </span>
            </div>
          </div>
          <Button
            disabled={!selectedItems.length || addWishlistoCart.isPending}
            variant="default"
            className="my-1 w-full py-3 text-xs disabled:hover:bg-gray-100 lg:text-sm"
            onClick={() => addWishlistoCart.mutate()}
          >
            {addWishlistoCart.isPending && (
              <ImSpinner8 className="animate-spin" size={16} />
            )}
            Add all to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
