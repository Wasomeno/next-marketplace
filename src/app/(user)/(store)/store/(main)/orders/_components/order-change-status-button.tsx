"use client"

import React from "react"
import { BiChevronRight } from "react-icons/bi"
import { ImSpinner8 } from "react-icons/im"
import { IoCheckmark } from "react-icons/io5"
import { LuPackage, LuPackageCheck, LuTruck } from "react-icons/lu"
import { toast } from "sonner"

import { changeOrderStatus } from "@/actions/user/order"
import { Button } from "@/components/ui/button"
import { queryClient } from "@/lib/react-query-client"
import { useSearchParamsValues } from "@/utils"
import { useMutation } from "@tanstack/react-query"

import { TBaseDataFilterParams } from "../../../../../../../../types"

export const OrderChangeStatusButton = ({
  orderId,
  statusId,
}: {
  orderId: string
  statusId: number
}) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const changeStatus = useMutation({
    mutationFn: async () => {
      await changeOrderStatus({
        orderId,
        statusId,
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

  switch (statusId) {
    case 1:
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate()}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2 ">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <LuPackage size={20} />
            )}
            <span>Change Status to Payment Confirmed</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case 2:
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate()}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <LuTruck size={20} />
            )}
            <span>Change Status to On Process</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case 3:
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate()}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <LuPackageCheck size={20} />
            )}
            <span>Change Status to On Shipping</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case 4:
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate()}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            {changeStatus.isPending ? (
              <ImSpinner8 className="animate-spin" size={16} />
            ) : (
              <IoCheckmark size={20} />
            )}
            <span>Change Status to Arrived</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case 5:
      return (
        <Button
          disabled={changeStatus.isPending}
          onClick={() => changeStatus.mutate()}
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
