"use client"

import { useState } from "react"
import { Prisma } from "@prisma/client"
import { RxCrossCircled } from "react-icons/rx"
import invariant from "tiny-invariant"

import { CartItem } from "@/app/(user)/(main)/cart/page"

import { CartCheckoutDialog } from "./cart-checkout-dialog"
import { CartItemCard } from "./cart-item-card"

export const CartItems = ({
  items,
}: {
  items:
    | Prisma.CartItemGetPayload<{
        include: { product: { include: { images: true } } }
      }>[]
    | undefined
}) => {
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])

  function selectItem(cartItem: CartItem) {
    setSelectedItems((items) => [...items, cartItem])
  }

  function deselectItem(cartItemId: number) {
    setSelectedItems(
      (items) => items?.filter((selectedItem) => cartItemId !== selectedItem.id)
    )
  }

  invariant(items)

  return (
    <div className="flex flex-1 flex-col items-start justify-between lg:flex-row lg:justify-center">
      <div className="w-full px-4 lg:w-4/6 lg:px-8">
        <div className="flex w-full flex-col gap-4">
          {items.length > 0 &&
            items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                isSelected={selectedItems?.some(
                  (selectedItem) => selectedItem.id === item.id
                )}
                onClick={() =>
                  selectedItems?.some(
                    (selectedItem) => selectedItem.id === item.id
                  )
                    ? deselectItem(item.id)
                    : selectItem(item)
                }
              />
            ))}
          {items.length === 0 && (
            <div className="flex h-96 flex-col items-center justify-center gap-2.5 opacity-50">
              <span className="text-sm lg:text-base">No items in Cart</span>
              <RxCrossCircled size="20" />
            </div>
          )}
        </div>
      </div>
      <CartCheckoutDialog selectedItems={selectedItems} />
    </div>
  )
}
