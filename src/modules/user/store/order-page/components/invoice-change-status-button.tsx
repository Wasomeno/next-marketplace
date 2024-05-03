"use client"

import React from "react"
import { changeOrderStatus } from "@/actions/user/order"
import { useSearchParamsValues } from "@/utils"
import { useMutation } from "@tanstack/react-query"
import { BiChevronRight } from "react-icons/bi"
import { ImSpinner8 } from "react-icons/im"
import { IoCheckmark } from "react-icons/io5"
import { LuPackage, LuPackageCheck, LuTruck } from "react-icons/lu"
import { toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"

import { OrderStatus, TBaseDataFilterParams } from "../../../../../../types"

export const OrderChangeStatusButton = ({
  orderId,
  status,
}: {
  orderId: string
  status: OrderStatus
}) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const changeStatus = useMutation({
    mutationFn: async (status: OrderStatus) => {
      await changeOrderStatus({
        orderId,
        status,
      })
      queryClient.invalidateQueries({
        queryKey: ["storeOrders", searchParamsValues],
      })
    },
    onError: () => {
      toast.error("Error When Updating Order Status")
    },
    onSuccess: () => {
      toast.success(`Order Status Updated`)
    },
  })

  switch (status) {
    case "Payment Confirmed":
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate("On Proccess")}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2 ">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <LuPackage size={20} />
            )}
            <span>Change Status to On Proccess</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case "On Proccess":
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate("On Shipping")}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <LuTruck size={20} />
            )}
            <span>Change Status to On Shipping</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case "On Shipping":
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate("Arrived")}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <LuPackageCheck size={20} />
            )}
            <span>Change Status to Arrived</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case "Arrived":
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate("Done")}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <IoCheckmark size={20} />
            )}
            <span>Change Status to Done</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
  }
}
