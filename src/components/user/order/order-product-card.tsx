"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Order, OrderStatus, Prisma } from "@prisma/client"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

import { buttonVariants } from "@/components/ui/button"

type OrderCardProps = {
  orderProduct: Prisma.OrderProductGetPayload<{
    include: {
      order: { include: { status: true } }
      product: { include: { images: true } }
    }
  }>
}

export const OrderProductCard = ({ orderProduct }: OrderCardProps) => {
  const date = new Date(orderProduct.order.created_at)
  const searchParams = useSearchParams()

  function getSearchParams(values: string[][]) {
    const newSearchParams = new URLSearchParams(searchParams)
    values.forEach((value) => {
      newSearchParams.set(value[0], value[1])
    })
    return newSearchParams
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-slate-50 bg-opacity-50 px-4 py-2.5 shadow-sm dark:border-gray-800 dark:bg-slate-950 dark:bg-opacity-50 dark:shadow-gray-800 ">
      <div className="flex items-center gap-3 lg:h-10">
        <div className="text-xs">{date.toDateString()}</div>
        <span className="rounded-md bg-blue-200 p-1.5 text-xs font-medium tracking-wide dark:bg-blue-900">
          {orderProduct.order.status.name}
        </span>
        <div className="hidden text-xs lg:block">
          {orderProduct.order.invoice}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:gap-10">
        <div className="flex w-full items-center gap-4 border-r-slate-200 dark:border-r-gray-800  lg:w-4/6 lg:border-r">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border dark:border-gray-800 lg:h-20 lg:w-20">
            <Image
              src={orderProduct.product.images[0].image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">
              {orderProduct.product.name}
            </div>
            <div className="text-sm font-medium opacity-50">
              {orderProduct.amount} x Rp{" "}
              {orderProduct.product.price.toLocaleString("id")}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium lg:text-sm">Total</div>
          <div className="text-xs lg:text-base">
            Rp. {orderProduct.total.toLocaleString("id")}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/orders?${getSearchParams([
            ["id", orderProduct.order_id.toString()],
            ["view", "true"],
          ])}`}
          className={twMerge(
            clsx(
              buttonVariants({
                variant: "defaultOutline",
                size: "sm",
              }),
              "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white lg:text-xs"
            )
          )}
        >
          View Order Details
        </Link>
        {orderProduct.order.status_id === 6 && (
          <Link
            href={`/orders?${getSearchParams([
              ["id", orderProduct.product.id.toString()],
              ["rating", "true"],
            ])}`}
            className={twMerge(
              clsx(
                buttonVariants({
                  variant: "default",
                  size: "sm",
                }),
                "bg-blue-400 text-white hover:bg-blue-500 lg:text-xs"
              )
            )}
          >
            Rate Product
          </Link>
        )}
      </div>
    </div>
  )
}

export const OrderProductCardSkeleton = () => {
  return (
    <div className="flex h-40 flex-col gap-2 rounded-md border bg-slate-50 bg-opacity-50 p-2.5 shadow-md dark:border-gray-800 dark:bg-slate-950 dark:bg-opacity-50">
      <div className="flex h-10 items-center gap-3">
        <div className="h-6 w-24 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        <div>
          <div className="h-6 w-28 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        </div>
        <div className="h-6 w-32 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
      </div>
      <div className="flex items-center gap-10">
        <div className="flex w-4/6 items-center gap-2.5 border-r border-r-slate-300 dark:border-r-gray-800">
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
          <div className="h-16 w-16 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-10 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
          <div className="h-6 w-7 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-400" />
        </div>
      </div>
    </div>
  )
}
