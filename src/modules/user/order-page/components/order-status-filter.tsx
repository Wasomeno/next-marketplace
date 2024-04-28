"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Dropdown, Option } from "@/components/dropdown"

const statusOptions: Option[] = [
  { label: "All", value: "" },
  { label: "Awaiting Payment", value: "Awaiting Payment" },
  { label: "Payment Confirmed", value: "Payment Confirmed" },
  { label: "Processed", value: "Processed" },
  { label: "On Shipping", value: "On Shipping" },
  { label: "Arrived", value: "Arrived" },
  { label: "Done", value: "Done" },
]

export const OrderStatusFilter = () => {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const activeFilter = statusOptions.find((option) => option.value === status)

  const router = useRouter()

  function selectStatus(status: Option) {
    if (status.value === "") {
      router.replace(`${location.pathname}`)
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("status", status.value.toString())
      router.replace(`${location.pathname}?${newSearchParams.toString()}`)
    }
  }

  return (
    <Dropdown
      isMulti={false}
      options={statusOptions}
      selectedOption={activeFilter}
      placeholder="Select status"
      onOptionClick={selectStatus}
    />
  )
}
