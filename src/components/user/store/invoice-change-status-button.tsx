"use client"

import React from "react"
import { useParams } from "next/navigation"
import { BiChevronRight } from "react-icons/bi"
import { LuPackage, LuPackageCheck, LuTruck } from "react-icons/lu"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { updateInvoiceStatus } from "@/app/actions/store/invoice"

import { OrderStatus } from "../../../../types"

export const InvoiceChangeStatusButton = ({
  invoiceId,
  status,
}: {
  invoiceId: string
  status: OrderStatus
}) => {
  async function changeStatus(status: OrderStatus) {
    toast.promise(
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
  }
}
