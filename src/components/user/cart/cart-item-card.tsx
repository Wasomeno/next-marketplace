"use client"

import { useTransition } from "react"
import Image from "next/image"
import * as Checkbox from "@radix-ui/react-checkbox"
import { BiTrash } from "react-icons/bi"
import { BsCheck } from "react-icons/bs"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { CartItem } from "@/app/(user)/(main)/cart/page"
import { removeFromCart, updateCartItem } from "@/app/actions/cart"

interface CartItemCardProps {
  isSelected: boolean
  itemDetails: CartItem
  onClick: () => void
}

export const CartItemCard = ({
  itemDetails,
  isSelected,
  onClick,
}: CartItemCardProps) => {
  const [isPending, startTransition] = useTransition()

  function increment() {
    itemDetails.amount >= itemDetails.product.stock
      ? toast.error("Amount can't be more than the stock")
      : startTransition(async () => {
          await updateCartItem(itemDetails.id, itemDetails.amount + 1)
        })
  }

  function decrement() {
    itemDetails.amount <= 1
      ? toast.error("Amount can't be lower than 1")
      : startTransition(async () => {
          await updateCartItem(itemDetails.id, itemDetails.amount - 1)
        })
  }

  return (
    <div className="flex items-center gap-4 border-t p-4 dark:border-t-gray-800">
      <Checkbox.Root
        checked={isSelected}
        onClick={() => onClick()}
        className="flex h-5 w-5 items-center justify-center rounded-sm border border-slate-400 bg-slate-50 dark:border-gray-700 dark:bg-slate-800 lg:h-5 lg:w-5"
      >
        <Checkbox.Indicator color="black">
          <BsCheck className="h-4 w-4" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
          <div className="relative h-20 w-28 rounded-md bg-slate-200 lg:h-32 lg:w-36">
            <Image
              src={itemDetails.product.images[0].image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <span className="text-sm tracking-wide lg:text-base">
              Rp {itemDetails.product.price.toLocaleString("id")}
            </span>
            <span className="text-xs tracking-wide text-slate-500 lg:text-base">
              {itemDetails.product.name}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-4 lg:w-auto">
          <div className="bg-slate-white flex h-7 w-20 items-center justify-center gap-4 rounded-lg border border-slate-300 px-3 text-sm font-medium dark:border-gray-700 lg:h-10 lg:w-20">
            <button onClick={decrement}>-</button>
            <span className="text-xs lg:text-sm">{itemDetails.amount}</span>
            <button onClick={increment}>+</button>
          </div>
          <Button
            variant="danger"
            size="sm"
            className="h-7 w-7 p-2 text-white dark:bg-red-800 lg:h-8 lg:w-8"
            onClick={() =>
              startTransition(async () => {
                await removeFromCart(itemDetails.id)
                toast.success(`Removed ${itemDetails.product.name} from cart`)
              })
            }
          >
            <BiTrash size="14" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const CartItemCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 border-t p-4 dark:border-t-gray-700">
      <Checkbox.Root
        disabled
        className="flex h-5 w-5 items-center justify-center rounded-sm border border-slate-400 bg-slate-50 opacity-50 dark:border-slate-600 dark:bg-slate-800 lg:h-5 lg:w-5"
      >
        <Checkbox.Indicator color="black">
          <BsCheck className="h-4 w-4" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
          <div className="relative h-20 w-28 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400 lg:h-32 lg:w-36" />
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <div className="h-[14px] w-40 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400 lg:h-[18px]" />
            <div className="h-[12px] w-32 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400 lg:h-[18px]" />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-4 lg:w-auto">
          <div className="bg-slate-white flex h-7 w-20 items-center justify-center gap-4 rounded-lg border border-slate-300 px-3 text-sm font-medium dark:border-gray-700 lg:h-10 lg:w-20">
            <button disabled>-</button>
            <div className="h-[12px] lg:h-[14px]" />
            <button disabled>+</button>
          </div>
          <Button
            disabled
            variant="danger"
            size="sm"
            className="h-7 w-7 p-2 text-white opacity-50 dark:bg-red-800 lg:h-8 lg:w-8"
          >
            <BiTrash size="14" />
          </Button>
        </div>
      </div>
    </div>
  )
}
