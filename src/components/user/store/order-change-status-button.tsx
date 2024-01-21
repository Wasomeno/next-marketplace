"use client"

import React from "react"
import { useParams } from "next/navigation"
import { BiChevronRight } from "react-icons/bi"
import { LuPackage, LuPackageCheck, LuTruck } from "react-icons/lu"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { OrderStatus, updateOrderStatus } from "@/app/actions/store/order"

export const OrderChangeStatusButton = ({
  status,
}: {
  status: OrderStatus
}) => {
  const params = useParams()

  async function changeStatus(status: OrderStatus) {
    toast.promise(
      () =>
        updateOrderStatus({
          orderId: Number(params.orderId as string),
          status,
        }),
      {
        pending: "Updating Order Status",
        error: "Error When Updating Order Status",
        success: `Order Status Updated to ${status}`,
      }
    )
  }

  switch (status) {
    case "Payment Confirmed":
      return (
        <Button
          onClick={() => changeStatus("On Proccess")}
          className="flex items-center justify-between bg-blue-200"
          variant="default"
        >
          <div className="flex items-center gap-2">
            <LuPackage size={20} />
            <span>Change Status to On Proccess</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case "On Proccess":
      return (
        <Button
          onClick={() => changeStatus("On Shipping")}
          className="flex items-center justify-between bg-blue-200"
          variant="default"
        >
          <div className="flex items-center gap-2">
            <LuTruck size={20} />
            <span>Change Status to On Shipping</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case "Arrived":
      return (
        <Button
          onClick={() => changeStatus("Arrived")}
          className="flex items-center justify-between bg-blue-200"
          variant="default"
        >
          <div className="flex items-center gap-2">
            <LuPackageCheck size={20} />
            <span>Change Status to Arrived</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
  }
}
