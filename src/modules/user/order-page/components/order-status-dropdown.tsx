"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSearchParamsValues } from "@/utils"

import { Dropdown, Option } from "@/components/dropdown"

const statusOptions: Option[] = [
  { label: "All", value: "" },
  { label: "Awaiting Payment", value: "Awaiting Payment" },
  { label: "Payment Confirmed", value: "Payment Confirmed" },
  { label: "On Proccess", value: "On Proccess" },
  { label: "On Shipping", value: "On Shipping" },
  { label: "Arrived", value: "Arrived" },
  { label: "Done", value: "Done" },
]

export const OrderStatusDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParamValues = useSearchParamsValues<{ status: string }>()

  function selectOption(option: Option) {
    const searchParams = new URLSearchParams(searchParamValues)
    searchParams.set("status", option.value as string)
    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  function deselectOption() {
    const searchParams = new URLSearchParams(searchParamValues)
    searchParams.delete("status")
    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <Dropdown
      options={statusOptions}
      selectedOption={statusOptions.find(
        (option) => option.value === searchParamValues.status
      )}
      placeholder="Select Status"
      isMulti={false}
      onOptionClick={selectOption}
      deselectOption={deselectOption}
    />
  )
}
