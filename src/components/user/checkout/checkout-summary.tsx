"use client"

import { useRouter } from "next/navigation"
import { Prisma } from "@prisma/client"

import { Button } from "@/components/ui/button"

export function CheckoutSummary() {
  const router = useRouter()

  const selectedCartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[] = JSON.parse(localStorage?.getItem("selectedCartItems") as string)

  const total = selectedCartItems.reduce(
    (prev, current) => (prev += current.amount * current.product.price),
    0
  )

  return (
    <div className="sticky bottom-0 w-full lg:w-2/6 lg:px-8">
      <div className="border-t border-gray-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] lg:rounded-md lg:border  lg:p-4 lg:shadow-none dark:border-t-gray-800 lg:dark:border-gray-800">
        <span className="hidden text-xs lg:inline lg:text-lg">
          Order Summary
        </span>
        <div className="my-2 flex justify-between">
          <span className="text-xs text-slate-500 lg:text-base">Subtotal</span>
          <span className="text-sm lg:text-lg">
            Rp {total.toLocaleString("id")}
          </span>
        </div>
        <Button
          variant="default"
          onClick={() => router.push("/cart/checkout?payment=true")}
          className="my-1 w-full rounded-lg bg-blue-400 py-3  text-xs font-medium text-white lg:text-sm dark:bg-blue-900"
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}
