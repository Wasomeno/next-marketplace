"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"

import { CheckoutItem } from "./checkout-items"

export function CheckoutSummary() {
  const [selectedCartItems, setSelectedCartItems] =
    useState<Array<CheckoutItem>>()
  const router = useRouter()

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const total =
    selectedCartItems?.reduce(
      (prev, current) => (prev += current.amount * current.product.price),
      0
    ) ?? 0

  function openPaymentModal() {
    const urlSearchParams = new URLSearchParams(searchParams)
    urlSearchParams.set("payment", "true")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setSelectedCartItems(
        JSON.parse(localStorage.getItem("selectedCartItems") as string)
      )
    }
  }, [])

  return (
    <div className="sticky bottom-0 w-full bg-white lg:w-2/6 lg:px-8">
      <div className="border-t border-gray-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:rounded-md  lg:border lg:p-4 lg:shadow-none lg:dark:border-gray-800">
        <span className="hidden text-xs font-medium lg:inline lg:text-base">
          Order Summary
        </span>
        <div className="my-2 flex justify-between">
          <span className="text-sm text-slate-500 lg:text-base">Subtotal</span>
          <span className="text-sm lg:text-base">
            Rp {total.toLocaleString("id")}
          </span>
        </div>
        <Button onClick={openPaymentModal} className="w-full lg:text-xs">
          Checkout
        </Button>
      </div>
    </div>
  )
}
