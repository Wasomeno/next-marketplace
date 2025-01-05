"use client"

import { usePathname, useRouter } from "next/navigation"
import React from "react"

import { Button } from "@/components/ui/button"
import { useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTrigger,
} from "@/components/responsive-dialog"
import { OrderReviewCard } from "./order-review-card"

export const CreateReviewModal: React.FC<{
  userEmail: string
  orderProducts: Prisma.OrderProductGetPayload<{
    include: { product: true }
  }>[]
}> = ({ userEmail, orderProducts }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParamsValues<{
    productId: string
    orderProductId: string
    review: string
  }>()

  const isOpen = searchParams.review !== undefined

  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParams)
    if (isOpen) {
      urlSearchParams.set("review", "true")
    } else {
      urlSearchParams.delete("review")
    }
    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogTrigger asChild>
        <Button size="sm" className="lg:text-xs">
          Rate Product
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent
        open={isOpen}
        className="flex w-full flex-1 flex-col lg:h-[45rem] lg:w-[50rem]"
      >
        <ResponsiveDialogHeader
          title="Product Review"
          description="Give your review to ordered products"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          {orderProducts.map((orderProduct) => (
            <OrderReviewCard
              key={orderProduct.id}
              userEmail={userEmail}
              orderProduct={orderProduct}
            />
          ))}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
