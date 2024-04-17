"use client"

import Image from "next/image"
import { Prisma } from "@prisma/client"

export function CheckoutItems() {
  const selectedCartItems: Prisma.CartItemGetPayload<{
    include: { product: { include: { images: true } } }
  }>[] = JSON.parse(localStorage?.getItem("selectedCartItems") as string)

  return (
    <div className="flex flex-1 flex-col gap-2 px-4 lg:px-8">
      {selectedCartItems.map((selectedCartItem) => (
        <div
          key={selectedCartItem.id}
          className="flex items-center gap-4 border-t p-4 dark:border-t-gray-800"
        >
          <div className="flex w-full flex-wrap items-end justify-between gap-2">
            <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
              <div className="relative h-12 w-16 rounded-md bg-slate-300 dark:bg-neutral-400 lg:h-20 lg:w-24">
                <Image
                  src={selectedCartItem.product.featured_image_url}
                  alt="product-image"
                  fill
                />
              </div>
              <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
                <span className="text-xs font-medium lg:text-sm">
                  {selectedCartItem.product.name}
                </span>
                <span className="text-xs lg:text-sm">
                  Rp {selectedCartItem.product.price.toLocaleString("id")} x{" "}
                  {selectedCartItem.amount}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
