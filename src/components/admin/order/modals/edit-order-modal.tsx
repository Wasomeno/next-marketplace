"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { OrderStatus } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FaSpinner } from "react-icons/fa"
import { Id, toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { getOrder, updateOrderStatus } from "@/app/actions/order"

import { OrderStatusPicker } from "./order-status-picker"

export function EditOrderModal() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>()

  const toastRef = useRef<Id>(0)
  const params = useSearchParams()
  const router = useRouter()
  const orderId = parseInt(params.get("id") as string)
  const open = params.get("edit") !== null

  const orderDetails = useQuery(
    ["orderDetails", orderId],
    async () => await getOrder(orderId),
    {
      enabled: open,
    }
  )

  const updateOrder = useMutation(
    () =>
      updateOrderStatus({ orderId, statusId: selectedStatus?.id as number }),
    {
      onMutate: () => {
        router.push("/admin/orders")
        toastRef.current = toast.loading(
          `Updating Order ${orderDetails.data?.invoice}`
        )
      },
      onSuccess: () => {
        toast.update(toastRef.current, {
          type: "success",
          render: "Update Success",
          isLoading: false,
          autoClose: 1500,
        })
      },
    }
  )

  const date = new Date(orderDetails.data?.created_at as Date)

  useEffect(() => {
    if (!orderDetails.isLoading) {
      setSelectedStatus(orderDetails.data?.status)
    }
  }, [orderDetails.isLoading])

  return (
    <Dialog open={open} onOpenChange={() => router.push("/admin/orders")}>
      <DialogContent
        open={open}
        className="flex w-full flex-1 flex-col gap-4 lg:h-4/6 lg:w-3/6"
      >
        <DialogHeader title="Edit Order" />
        {orderDetails.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <FaSpinner className="animate-spin fill-blue-500" size={30} />
          </div>
        ) : (
          <>
            <div className="px-4">
              <OrderStatusPicker
                status={selectedStatus as OrderStatus}
                selectStatus={(status) =>
                  setSelectedStatus(status as OrderStatus)
                }
              />
              <div className="my-4 flex items-center justify-between text-xs lg:text-sm">
                <span className="font-medium ">Invoice Number</span>
                <span>{orderDetails.data?.invoice}</span>
              </div>
              <div className="flex items-center justify-between text-xs lg:text-sm">
                <span className="font-medium ">Transaction Date</span>
                <span>{date.toDateString()}</span>
              </div>
            </div>
            <div className="flex w-full flex-1 flex-col px-4">
              <span className="text-sm font-semibold lg:text-base">
                Products
              </span>
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
          </>
        )}
        <div className="sticky bottom-0 flex  items-center justify-center border-t bg-white py-2">
          <Button
            onClick={() => updateOrder.mutate()}
            variant="success"
            className="text-sm font-medium text-white"
          >
            Update Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
