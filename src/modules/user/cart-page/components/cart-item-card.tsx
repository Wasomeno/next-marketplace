"use client"

import { useTransition } from "react"
import Image from "next/image"
import { removeFromCart, updateCartItem } from "@/actions/user/cart"
import { Checkbox } from "@radix-ui/react-checkbox"
import { BiTrash } from "react-icons/bi"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { CheckBox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/skeleton"
import { CartItem } from "@/app/(user)/(main)/cart/page"

interface CartItemCardProps {
  isSelected: boolean
  item: CartItem
  onClick: () => void
}

export const CartItemCard = ({
  item,
  isSelected,
  onClick,
}: CartItemCardProps) => {
  const [isPending, startTransition] = useTransition()

  function increment() {
    item.amount >= item.product.stock
      ? toast.error("Amount can't be more than the stock")
      : startTransition(async () => {
          await updateCartItem(item.id, item.amount + 1)
        })
  }

  function decrement() {
    item.amount <= 1
      ? toast.error("Amount can't be lower than 1")
      : startTransition(async () => {
          await updateCartItem(item.id, item.amount - 1)
        })
  }

  return (
    <div className="flex items-center gap-4 border-t p-4 dark:border-t-gray-800">
      <CheckBox onCheckedChange={onClick} checked={isSelected} />
      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-md bg-slate-200 lg:h-28 lg:w-28">
            <Image
              src={item.product.featured_image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <span className="text-sm tracking-wide lg:text-base">
              Rp {item.product.price.toLocaleString("id")}
            </span>
            <span className="text-xs tracking-wide text-slate-500 lg:text-base">
              {item.product.name}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-4 lg:w-auto">
          <div className="bg-slate-white flex h-7 w-20 items-center justify-center gap-4 rounded-lg border border-slate-300 px-3 text-sm font-medium dark:border-gray-700 lg:h-10 lg:w-20">
            <button onClick={decrement}>-</button>
            <span className="text-xs lg:text-sm">{item.amount}</span>
            <button onClick={increment}>+</button>
          </div>
          <Button
            variant="danger"
            size="sm"
            className="h-7 w-7 p-2 text-white dark:bg-red-800 lg:h-8 lg:w-8"
            onClick={() =>
              startTransition(async () => {
                await removeFromCart(item.id)
                toast.success(`Removed ${item.product.name} from cart`)
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
      <Checkbox disabled />
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
          <Skeleton className="relative h-20 w-28 lg:h-32 lg:w-36 " />
          <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
            <Skeleton className="h-[14px] w-40  lg:h-[18px] " />
            <Skeleton className="h-[12px] w-32  lg:h-[18px] " />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-4 lg:w-auto">
          <div className="flex h-7 w-20 items-center justify-center gap-4 rounded-lg border border-slate-300 bg-gray-200 px-3 text-sm font-medium dark:border-gray-700 lg:h-10 lg:w-20">
            <button disabled>-</button>
            <Skeleton className="h-[12px] lg:h-[14px]" />
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
