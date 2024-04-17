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

  const [selectedStatus, setSelectedStatus] = useState<Option>(
    activeFilter ?? statusOptions[0]
  )

  const router = useRouter()

  function selectStatus(status: Option) {
    if (status.value === "") {
      router.replace(`${location.pathname}`)
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("status", status.value.toString())
      router.replace(`${location.pathname}?${newSearchParams.toString()}`)
    }
    setSelectedStatus(status)
  }

  return (
    <Dropdown
      isMulti={false}
      options={statusOptions}
      selectedOption={selectedStatus}
      placeholder="Select order status"
      onOptionClick={selectStatus}
    />
  )
}
