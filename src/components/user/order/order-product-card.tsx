"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Prisma } from "@prisma/client"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/skeleton"

type OrderCardProps = {
  invoice: Prisma.InvoiceGetPayload<{
    include: { products: { include: { product: true } } }
  }>
}

export const InvoiceCard = ({ invoice }: OrderCardProps) => {
  const searchParamsValues = useSearchParams()
  const router = useRouter()

  const date = new Date()

  function viewOrderDetails() {
    const searchParams = new URLSearchParams(searchParamsValues.toString())
    searchParams.set("invoice", invoice.id)
    router.replace(`/orders?${searchParams.toString()}`)
  }

  function rateProduct() {}

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-slate-50 bg-opacity-50 px-4 py-2.5 shadow-sm dark:border-gray-800 dark:bg-slate-950 dark:bg-opacity-50 dark:shadow-gray-800 ">
      <div className="flex items-center justify-between lg:h-10">
        <span className="rounded-md bg-blue-200 p-1.5 text-xs font-medium tracking-wide dark:bg-blue-900">
          {invoice.status}
        </span>
        <div className="text-xs">{date.toDateString()}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:gap-10">
        <div className="flex w-full items-center gap-4 border-r-slate-200 lg:w-4/6  lg:border-r dark:border-r-gray-800">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border lg:h-20 lg:w-20 dark:border-gray-800">
            <Image
              src={invoice.products[0].product.featured_image_url}
              alt="product-image"
              fill
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">
              {invoice.products[0].product.name}
            </div>
            <div className="text-sm font-medium opacity-50">
              {invoice.products[0].amount} x Rp{" "}
              {invoice.products[0].product.price.toLocaleString("id")}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium lg:text-sm">Total</div>
          <div className="text-xs lg:text-base">
            Rp.{" "}
            {invoice.products
              .reduce((total, product) => total + product.total, 0)
              .toLocaleString("id")}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {invoice.products.length > 1 && (
          <span className="text-sm font-medium text-gray-500">
            + {invoice.products.length - 1} other products
          </span>
        )}
        <Button
          onClick={viewOrderDetails}
          className={twMerge(
            clsx(
              buttonVariants({
                variant: "defaultOutline",
                size: "sm",
              }),
              "border border-blue-400 bg-white text-blue-400 hover:bg-blue-400 hover:text-white lg:text-xs"
            )
          )}
        >
          View Order Details
        </Button>
        {invoice.status === "Done" && !invoice.products[0].isReviewed ? (
          <Button
            onClick={rateProduct}
            className={twMerge(
              clsx(
                buttonVariants({
                  variant: "default",
                  size: "sm",
                }),
                "bg-white text-white hover:bg-blue-500 lg:text-xs"
              )
            )}
          >
            Rate Product
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export const OrderProductCardSkeleton = () => {
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
