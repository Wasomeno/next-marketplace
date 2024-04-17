"use client"

import { useState } from "react"
import { Prisma } from "@prisma/client"
import { IoCartOutline } from "react-icons/io5"
import invariant from "tiny-invariant"

import { NoData } from "@/components/no-data"
import { CartItem } from "@/app/(user)/(main)/cart/page"

import { CartItemCard } from "./cart-item-card"
import { CartSummary } from "./cart-summary"

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
    setSelectedItems((items) =>
      items?.filter((selectedItem) => cartItemId !== selectedItem.id)
    )
  }

  invariant(items)

  return (
    <div className="flex flex-1 flex-col items-start justify-between lg:flex-row lg:justify-center">
      <div className="w-full px-4 lg:w-4/6 lg:px-8">
        {items.length > 0 && (
          <div className="flex w-full flex-col gap-4">
            {items.map((item) => (
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
          </div>
        )}
        {items.length === 0 && (
          <div className="flex h-96 flex-col items-center justify-center">
            <NoData
              text="No Items in Cart"
              icon={<IoCartOutline size={26} />}
            />
          </div>
        )}
      </div>
      <CartSummary selectedItems={selectedItems} />
    </div>
  )
}
