"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Prisma } from "@prisma/client"
import moment from "moment"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/skeleton"

import { CreateReviewModal } from "./create-review-modal"

type OrderCardProps = {
  order: Prisma.OrderGetPayload<{
    include: { products: { include: { product: true } } }
  }>
  userEmail: string
}

export const OrderCard = ({ order, userEmail }: OrderCardProps) => {
  const searchParamsValues = useSearchParams()
  const router = useRouter()

  const time = moment(order.created_at).format("LLLL")

  function viewOrderDetails() {
    const searchParams = new URLSearchParams(searchParamsValues.toString())
    searchParams.set("orderId", order.id)
    router.replace(`/orders?${searchParams.toString()}`)
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-opacity-50 px-4 py-2.5 shadow-sm dark:border-gray-800 dark:bg-slate-950 dark:bg-opacity-50 dark:shadow-gray-800 ">
      <div className="flex items-center justify-between lg:h-10">
        <div className="text-xs">{time}</div>
        <span className="rounded-md bg-blue-200 p-1.5 text-xs font-medium tracking-wide dark:bg-blue-900">
          {order.status}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:gap-10">
        <div className="flex w-full items-center gap-4 border-r-slate-200 dark:border-r-gray-800  lg:w-4/6 lg:border-r">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border dark:border-gray-800 lg:h-20 lg:w-20">
            <Image
              src={order.products[0].product.featured_image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm">{order.products[0].product.name}</div>
            <div className="text-sm">
              {order.products[0].amount} x Rp{" "}
              {order.products[0].product.price.toLocaleString("id")}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium lg:text-sm">Total</div>
          <div className="text-xs lg:text-base">
            Rp.{" "}
            {order.products
              .reduce((total, product) => total + product.total, 0)
              .toLocaleString("id")}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {order.products.length > 1 && (
          <span className="text-xs font-medium text-gray-400">
            + {order.products.length - 1} other products
          </span>
        )}
        <Button onClick={viewOrderDetails} size="sm" className="lg:text-xs">
          View Order Details
        </Button>
        {order.status === "Done" && (
          <CreateReviewModal
            userEmail={userEmail}
            orderProducts={order.products}
          />
        )}
      </div>
    </div>
  )
}

export const OrderCardSkeleton = () => {
  return (
    <div className="flex h-40 flex-col gap-2 rounded-md border bg-slate-50 bg-opacity-50 p-2.5 shadow-md dark:border-gray-800 dark:bg-slate-950 dark:bg-opacity-50">
      <div className="flex h-10 items-center gap-3">
        <Skeleton className="h-6 w-24 " />
        <div>
          <Skeleton className="h-6 w-28 " />
        </div>
        <Skeleton className="h-6 w-32 " />
      </div>
      <div className="flex items-center gap-10">
        <div className="flex w-4/6 items-center gap-2.5 border-r border-r-slate-300 dark:border-r-gray-800">
          <Skeleton className="h-16 w-16 " />
          <Skeleton className="h-16 w-16 " />
          <Skeleton className="h-16 w-16 " />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-10 " />
          <Skeleton className="h-6 w-7 " />
        </div>
      </div>
    </div>
  )
}
