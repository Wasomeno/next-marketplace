"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FaSpinner } from "react-icons/fa"
import { Id, toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { getOrder, TOrderStatus, updateOrderStatus } from "@/app/actions/order"

import { OrderStatusPicker } from "./order-status-picker"

export function UpdateOrderStatusModal() {
  const toastRef = useRef<Id>(0)
  const params = useSearchParams()
  const router = useRouter()
  const orderId = parseInt(params.get("id") as string)
  const open = params.get("edit") !== null

  const order = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => await getOrder(orderId),
    enabled: open,
  })

  const [selectedStatus, setSelectedStatus] = useState<TOrderStatus>(
    order.data?.status as TOrderStatus
  )

  const date = new Date(order.data?.created_at as Date)

  const updateOrder = useMutation({
    mutationFn: () => updateOrderStatus({ orderId, status: selectedStatus }),
    onMutate: () => {
      router.push("/admin/orders")
      toastRef.current = toast.loading(`Updating Order ${order.data?.invoice}`)
    },
    onSuccess: () => {
      toast.update(toastRef.current, {
        type: "success",
        render: "Update Success",
        isLoading: false,
        autoClose: 1500,
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={() => router.push("/store/orders")}>
      <DialogContent
        open={open}
        className="flex flex-col gap-4 lg:h-4/6 lg:w-3/6"
      >
        <DialogHeader title="Edit Order" />
        {order.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <FaSpinner className="animate-spin fill-blue-500" size={30} />
          </div>
        ) : (
          <>
            <div className="px-4">
              <OrderStatusPicker
                status={selectedStatus ?? order.data?.status}
                selectStatus={(status) => setSelectedStatus(status)}
              />
              <div className="my-4 flex items-center justify-between text-xs lg:text-sm">
                <span className="font-medium ">Invoice Number</span>
                <span>{order.data?.invoice}</span>
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
                {order.data?.products.map((orderProduct) => (
                  <div
                    key={orderProduct.id}
                    className="flex items-center gap-4 border-t p-4 dark:border-t-neutral-700"
                  >
                    <div className="flex w-full flex-wrap items-end justify-between gap-2">
                      <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
                        <div className="relative h-20 w-28 rounded-md bg-slate-300 lg:h-20 lg:w-24 dark:bg-neutral-400">
                          <Image
                            src={orderProduct.product.featured_image_url}
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

        <div className="sticky bottom-0 flex  items-center justify-center border-t bg-slate-50 py-2">
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
