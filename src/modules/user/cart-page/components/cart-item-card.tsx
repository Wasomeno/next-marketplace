"use client"

import { MouseEvent, MouseEventHandler } from "react"
import Image from "next/image"
import { removeFromCart, updateCartItem } from "@/actions/user/cart"
import { useMutation } from "@tanstack/react-query"
import clsx from "clsx"
import { BiTrash } from "react-icons/bi"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
import { twMerge } from "tailwind-merge"

import { Button } from "@/components/ui/button"
import { CartItem } from "@/app/(user)/(main)/cart/page"

type CartItemCardProps = {
  isSelected: boolean
  item: CartItem
  onClick: MouseEventHandler<HTMLDivElement>
}

export const CartItemCard = ({
  item,
  isSelected,
  onClick,
}: CartItemCardProps) => {
  async function increment(event: MouseEvent) {
    event.stopPropagation()
    item.amount >= item.product.stock
      ? toast.error("Amount can't be more than the stock")
      : await updateCartItem(item.id, item.amount + 1)
  }

  async function decrement(event: MouseEvent) {
    event.stopPropagation()
    item.amount <= 1
      ? toast.error("Amount can't be lower than 1")
      : await updateCartItem(item.id, item.amount - 1)
  }

  const removeItem = useMutation({
    mutationFn: async (event: MouseEvent) => {
      event.stopPropagation()
      await removeFromCart(item.id)
    },
    onSuccess: () => toast.success(`Removed ${item.product.name} from cart`),
    onError: () => toast.error(`Error when removing item`),
  })

  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          "flex cursor-pointer items-center gap-4 rounded-lg rounded-t-none border border-x-transparent border-b-transparent p-4 transition-all duration-200 dark:border-t-gray-800",
          isSelected &&
            "rounded-t-lg border-blue-400 border-x-blue-400 border-b-blue-400 shadow-md"
        )
      )}
    >
      <div className="flex w-full items-end justify-between gap-2">
        <div className="flex w-full gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-slate-200 shadow-sm lg:h-28 lg:w-28">
            <Image
              src={item.product.featured_image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="flex flex-1 flex-wrap justify-between gap-2">
            <div className="flex w-full flex-col gap-1 lg:w-fit">
              <span className="text-xs tracking-wide  lg:text-base">
                {item.product.name}
              </span>
              <span className="text-sm tracking-wide text-gray-500 lg:text-base">
                Rp {item.product.price.toLocaleString("id")}
              </span>
            </div>
            <div className="flex w-full items-center justify-end gap-2 lg:w-fit">
              <div className="bg-slate-white flex h-8 w-20 items-center justify-center gap-4 rounded-lg border border-gray-200 px-3 text-sm font-medium shadow-sm dark:border-gray-700">
                <button onClick={decrement}>-</button>
                <span className="text-xs lg:text-sm">{item.amount}</span>
                <button onClick={increment}>+</button>
              </div>
              <Button
                variant="defaultOutline"
                size="sm"
                className="h-8 w-8 p-2 shadow-sm"
                disabled={removeItem.isPending}
                onClick={removeItem.mutate}
              >
                {removeItem.isPending ? (
                  <ImSpinner8 className="animate-spin" size={14} />
                ) : (
                  <BiTrash size={14} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
