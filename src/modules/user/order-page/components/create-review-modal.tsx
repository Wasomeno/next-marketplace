"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSearchParamsValues } from "@/utils"
import { Prisma } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog"

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="lg:text-xs">
          Rate Product
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          open={isOpen}
          className="flex h-5/6 w-full flex-1 flex-col lg:h-4/6 lg:w-2/6"
        >
          <DialogHeader title="Product Review" />
          <div className="flex flex-1 flex-col gap-2 p-4">
            {orderProducts.map((orderProduct) => (
              <OrderReviewCard
                key={orderProduct.id}
                userEmail={userEmail}
                orderProduct={orderProduct}
              />
            ))}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
