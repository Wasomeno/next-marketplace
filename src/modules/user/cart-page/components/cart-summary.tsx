"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { CartItem } from "../../../../app/(user)/(main)/cart/page"

interface CartCheckoutDialogProps {
  selectedItems: CartItem[]
}

export const CartSummary = ({ selectedItems }: CartCheckoutDialogProps) => {
  const router = useRouter()
  const total = selectedItems.reduce(
    (firstValue, item) => item.amount * item.product.price + firstValue,
    0
  )

  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-neutral-950 lg:w-2/6 lg:px-8">
      <div className="border-t border-gray-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:rounded-md lg:border lg:border-gray-200 lg:p-4 lg:shadow-sm lg:dark:border-gray-800">
        <h5 className="hidden text-xs lg:inline lg:text-base">Cart Summary</h5>
        <div className="mb-4 mt-2 flex justify-between">
          <span className="text-xs text-slate-500 lg:text-sm">Subtotal</span>
          <span className="text-sm lg:text-base">
            Rp {total.toLocaleString("id")}
          </span>
        </div>
        <Button
          disabled={!selectedItems.length}
          onClick={() => {
            localStorage.setItem(
              "selectedCartItems",
              JSON.stringify(selectedItems)
            )
            router.push("/cart/checkout")
          }}
          className="w-full disabled:hover:bg-gray-100 lg:text-xs"
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}
