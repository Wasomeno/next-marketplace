"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Prisma } from "@prisma/client"

export type CheckoutItem = Prisma.CartItemGetPayload<{
  include: { product: { include: { images: true } } }
}>

export function CheckoutItems() {
  const [selectedCartItems, setSelectedCartItems] =
    useState<Array<CheckoutItem>>()

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setSelectedCartItems(
        JSON.parse(localStorage.getItem("selectedCartItems") as string)
      )
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4">
      {selectedCartItems?.map((selectedCartItem) => (
        <div key={selectedCartItem.id} className="flex flex-1 gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border lg:h-24 lg:w-24">
            <Image
              src={selectedCartItem.product.featured_image_url}
              fill
              alt={selectedCartItem.product.name}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between lg:flex-row">
            <span className="inline w-full text-sm lg:w-fit">
              {selectedCartItem.product.name}
            </span>
            <div className="flex w-full flex-col gap-2 lg:w-fit lg:items-end">
              <h5 className="text-sm">
                Rp. {selectedCartItem.product.price.toLocaleString("id")}
              </h5>
              <h5 className="text-sm text-gray-500">
                Amount: {selectedCartItem.amount}
              </h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
