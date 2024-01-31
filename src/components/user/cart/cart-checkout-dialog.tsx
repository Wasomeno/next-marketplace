"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { CartItem } from "../../../app/(user)/(main)/cart/page"

interface CartCheckoutDialogProps {
  selectedItems: CartItem[]
}

export const CartCheckoutDialog = ({
  selectedItems,
}: CartCheckoutDialogProps) => {
  const router = useRouter()
  const total = selectedItems.reduce(
    (firstValue, item) => item.amount * item.product.price + firstValue,
    0
  )

  return (
    <div className="sticky bottom-0 w-full bg-white lg:w-2/6 lg:px-8 dark:bg-neutral-950">
      <div className="border-t border-gray-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] lg:rounded-md lg:border lg:border-gray-200 lg:p-4 lg:shadow-none dark:border-t-gray-800 lg:dark:border-gray-800">
        <span className="hidden text-xs lg:inline lg:text-lg">
          Cart Summary
        </span>
        <div className="my-2 flex justify-between">
          <span className="text-xs text-slate-500 lg:text-base">Subtotal</span>
          <span className="text-sm lg:text-lg">
            Rp {total.toLocaleString("id")}
          </span>
        </div>
        <Button
          variant="default"
          disabled={!selectedItems.length}
          onClick={() => {
            localStorage.setItem(
              "selectedCartItems",
              JSON.stringify(selectedItems)
            )
            router.push("/cart/checkout")
          }}
          className="my-1 w-full rounded-lg bg-blue-400 py-3  text-xs font-medium text-white lg:text-sm dark:bg-blue-900"
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}
