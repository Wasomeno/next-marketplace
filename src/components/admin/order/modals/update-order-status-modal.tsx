"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FaSpinner } from "react-icons/fa"
import { Id, toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import {
  getOrder,
  TOrderStatus,
  updateOrderStatus,
} from "@/app/actions/user/order"

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
            <div className="mb-4 px-6">
              <div className="mb-4 flex items-center justify-between text-xs lg:text-sm">
                <span className="font-medium ">Invoice Number</span>
                <span>{order.data?.invoice}</span>
              </div>
              <div className="flex items-center justify-between text-xs lg:text-sm">
                <span className="font-medium ">Transaction Date</span>
                <span>{date.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex w-full flex-1 flex-col gap-2 px-6">
              <span className="text-sm font-semibold lg:text-base">
                Products
              </span>
              <span className="w-full border-t border-gray-200" />
              <div className="mt-2 flex flex-col gap-2.5">
                {order.data?.products.map((orderProduct) => (
                  <div
                    key={orderProduct.id}
                    className="flex w-full gap-2 lg:gap-4"
                  >
                    <div className="relative h-20 w-28 overflow-hidden rounded-md border border-gray-300 bg-slate-300 lg:h-20 lg:w-24 dark:bg-neutral-400">
                      <Image
                        src={orderProduct.product.featured_image_url}
                        alt="orderProduct-image"
                        fill
                      />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm">
                        {orderProduct.product.name}
                      </span>
                      <div className="flex flex-col items-end gap-1 text-sm">
                        <span>
                          Rp {orderProduct.product.price.toLocaleString("id")}
                        </span>
                        <span className="font-medium text-gray-400">
                          Qty: {orderProduct.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
