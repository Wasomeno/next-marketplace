"use client"

import { useState } from "react"
import invariant from "tiny-invariant"

import { Prisma } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { CartItem } from "../_types"
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

  function getIsSelected(cartItemId: number) {
    return selectedItems.some((item) => item.id === cartItemId)
  }

  function onItemClick(cartItem: CartItem) {
    if (getIsSelected(cartItem.id)) {
      deselectItem(cartItem.id)
    } else {
      selectItem(cartItem)
    }
  }

  invariant(items)

  return (
    <div className="flex flex-1 flex-col w-full px-28">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <div className="space-y-6">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                isSelected={getIsSelected(item.id)}
                onClick={() => onItemClick(item)}
                item={item}
              />
            ))}
          </div>
        </div>

        <CartSummary selectedItems={selectedItems} />
      </div>
    </div>
  )
}
