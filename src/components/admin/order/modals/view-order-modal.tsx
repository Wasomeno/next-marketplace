"use client"

import React from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { getOrder } from "@/app/actions/order"

export const ViewOrderModal = () => {
  const params = useSearchParams()
  const router = useRouter()

  const open = params.get("view") !== null
  const orderId = parseInt(params.get("id") as string)

  const orderDetails = useQuery(
    ["orderDetails", orderId],
    async () => await getOrder(orderId),
    {
      enabled: open,
    }
  )

  const date = new Date(orderDetails.data?.created_at as Date)

  return (
    <Dialog open={open} onOpenChange={() => router.push("/admin/orders")}>
      <DialogContent open={open} className="w-full lg:h-4/6 lg:w-3/6">
        <DialogHeader title="Order Details" />
        <div className="px-4">
          <span className="rounded-lg bg-blue-200 px-3 py-2 text-xs font-medium dark:bg-blue-900 lg:text-base">
            {orderDetails.data?.status.name}
          </span>
          <div className="my-4 flex items-center justify-between text-sm">
            <span className="font-medium">Invoice Number</span>
            <span>{orderDetails.data?.invoice}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Transaction Date</span>
            <span>{date.toDateString()}</span>
          </div>
        </div>
        <div className="mt-6 w-full px-4">
          <span className="text-sm font-semibold lg:text-base">Products</span>
          <div className="mt-4 flex flex-col gap-2.5">
            {orderDetails.data?.products.map((orderProduct) => (
              <div
                key={orderProduct.id}
                className="flex items-center gap-4 border-t p-4 dark:border-t-neutral-700"
              >
                <div className="flex w-full flex-wrap items-end justify-between gap-2">
                  <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
                    <div className="relative h-20 w-28 rounded-md bg-slate-300 dark:bg-neutral-400 lg:h-20 lg:w-24">
                      <Image
                        src={orderProduct.product.images[0].image_url}
                        alt="orderProduct-image"
                        fill
                      />
                    </div>
                    <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
                      <span className="text-sm font-medium">
                        {orderProduct.product.name}
                      </span>
                      <span className="text-sm">
                        Rp {orderProduct.product.price.toLocaleString("id")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
