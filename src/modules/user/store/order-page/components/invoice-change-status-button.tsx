"use client"

import React from "react"
import { updateInvoiceStatus } from "@/actions/store/invoice"
import { useSearchParamsValues } from "@/utils"
import { BiChevronRight } from "react-icons/bi"
import { IoCheckmark } from "react-icons/io5"
import { LuPackage, LuPackageCheck, LuTruck } from "react-icons/lu"
import { toast } from "react-toastify"

import { queryClient } from "@/lib/react-query-client"
import { Button } from "@/components/ui/button"

import { OrderStatus, TBaseDataFilterParams } from "../../../../../../types"

export const InvoiceChangeStatusButton = ({
  invoiceId,
  status,
}: {
  invoiceId: string
  status: OrderStatus
}) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()
  async function changeStatus(status: OrderStatus) {
    await toast.promise(
      () =>
        updateInvoiceStatus({
          invoiceId,
          status,
        }),
      {
        pending: "Updating Invoice Status",
        error: "Error When Updating Invoice Status",
        success: `Invoice Status Updated to ${status}`,
      }
    )

    queryClient.invalidateQueries({
      queryKey: ["storeOrders", searchParamsValues],
    })
  }

  switch (status) {
    case "Payment Confirmed":
      return (
        <Button
          onClick={() => changeStatus("On Proccess")}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2 ">
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
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            <LuTruck size={20} />
            <span>Change Status to On Shipping</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case "On Shipping":
      return (
        <Button
          onClick={() => changeStatus("Arrived")}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            <LuPackageCheck size={20} />
            <span>Change Status to Arrived</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
    case "Arrived":
      return (
        <Button
          onClick={() => changeStatus("Done")}
          className="flex items-center justify-between border-gray-200 shadow-sm"
          variant="defaultOutline"
        >
          <div className="flex items-center gap-2">
            <IoCheckmark size={20} />
            <span>Change Status to Done</span>
          </div>
          <BiChevronRight size={20} />
        </Button>
      )
  }
}
