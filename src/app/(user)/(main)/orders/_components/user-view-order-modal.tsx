"use client"

import { getOrder } from "@/actions/user/order"
import { Separator } from "@radix-ui/react-separator"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ImSpinner8 } from "react-icons/im"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from "@/components/responsive-dialog"

export function UserViewOrderModal() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const orderId = searchParams.get("orderId")

  const isOpen = orderId !== null

  const order = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => await getOrder({ orderId: orderId as string }),
    enabled: isOpen,
  })

  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    if (isOpen) {
      urlSearchParams.set("orderId", orderId as string)
    } else {
      urlSearchParams.delete("orderId")
    }

    router.replace(`/orders?${urlSearchParams.toString()}`)
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        open={isOpen}
        className="flex w-full flex-1 flex-col gap-2 lg:w-[50rem] lg:h-[45rem] lg:gap-4"
      >
        <ResponsiveDialogHeader title="Order Details" />
        {order.isLoading ? (
          <div className="flex h-full items-center justify-center">
            <ImSpinner8 size={30} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="flex h-full flex-1 flex-col justify-between gap-4 px-4 pb-4 lg:px-6 lg:pb-6 lg:pt-2">
            <div className="flex flex-1 flex-col gap-4">
              <div className="space-y-2">
                <div className="flex  flex-row justify-between gap-2">
                  <span className="text-xs text-gray-500 lg:text-base">
                    Order Id:{" "}
                    <span className="font-medium text-black">
                      {order.data?.id}
                    </span>
                  </span>
                </div>
                <h3 className="text-xs text-gray-500 lg:text-sm">
                  Ordered at:{" "}
                  <span className="text-black">
                    {moment(order.data?.created_at).format("LLLL")}
                  </span>
                </h3>
              </div>
              <Separator
                orientation="horizontal"
                className="h-px w-full bg-gray-200"
              />
              <div className="flex flex-col space-y-2 overflow-y-scroll">
                {order.data?.products.map((product) => (
                  <div key={product.id} className="flex flex-1 gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border lg:h-24 lg:w-24">
                      <Image
                        src={product.product.featured_image_url}
                        fill
                        alt={product.product.name}
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between lg:flex-row">
                      <span className="inline w-full text-xs lg:w-fit lg:text-sm">
                        {product.product.name}
                      </span>
                      <div className="flex w-full flex-col gap-2 lg:w-fit lg:items-end">
                        <h5 className="text-xs lg:text-sm">
                          Rp. {product.product.price.toLocaleString("id")}
                        </h5>
                        <h5 className="text-xs text-gray-500 lg:text-sm">
                          Amount: {product.amount}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Separator
                orientation="horizontal"
                className="h-px w-full bg-gray-200"
              />
              <div className="flex gap-6">
                <div className="w-1/2">
                  <h3 className="text-sm font-medium lg:text-base">Payment</h3>
                </div>
                <div className="w-1/2 space-y-2">
                  <h3 className="text-sm font-medium lg:text-base">Delivery</h3>
                  <p className="text-xs lg:text-sm">
                    {`${order.data?.address.street}, ${order.data?.address.subdistrict}, ${order.data?.address.city},
              ${order.data?.address.province}, ${order.data?.address.postNumber} (${order.data?.address.recipient})`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
