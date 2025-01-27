"use client"

import { useSearchParamsValues } from "@/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"

import { getOrderStatuses } from "@/actions/user/order"
import { Dropdown, Option } from "@/components/dropdown"
import { useQuery } from "@tanstack/react-query"

export const OrderStatusDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParamValues = useSearchParamsValues<{ status: string }>()

  const orderStatuses = useQuery({
    queryKey: ["order-statuses"],
    queryFn: () => getOrderStatuses(),
  })

  const orderStatusOptions = orderStatuses.data?.map((status) => ({
    label: status.name,
    value: status.id,
  }))

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
      options={orderStatusOptions}
      selectedOption={orderStatusOptions?.find(
        (option) => option.value.toString() === searchParamValues.status
      )}
      placeholder="Select Status"
      onOptionClick={selectOption}
      deselectOption={deselectOption}
      isLoading={orderStatuses.isLoading}
    />
  )
}
