"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { BsBoxSeam } from "react-icons/bs"
import { HiXMark } from "react-icons/hi2"

import { Dropdown, Option } from "@/components/dropdown"
import { TableSearchInput } from "@/components/table-search-input"
import { getStoreInvoices } from "@/app/actions/store/invoice"

import { BaseDataFilters } from "../../../../../types"
import { StoreOrderCard, StoreOrderCardSkeleton } from "./store-order-card"

const sortOptions: Option[] = [
  {
    label: " Oldest to Recent ",
    value: "created_at.asc",
  },
  {
    label: " Recent to Oldest ",
    value: "created_at.desc",
  },
]

export const StoreOrderList = () => {
  const searchParams = useSearchParams()
  const searchParamsValues = useSearchParamsValues<BaseDataFilters>()

  const activeSort = sortOptions.find(
    (sort) => searchParams?.get("sort") === sort.value
  )

  const [selectedSort, setSelectedSort] = useState<Option>(activeSort as Option)

  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["storeOrders", searchParamsValues],
    queryFn: () =>
      getStoreInvoices({
        sort: searchParamsValues?.sort,
        search: searchParamsValues?.search,
      }),
  })

  function selectSort(sort: Option) {
    const searchParamsValues = new URLSearchParams(searchParams.toString())
    searchParamsValues.set("sort", sort.value as string)

    setSelectedSort(sort)

    router.replace(`/store/orders?${searchParamsValues.toString()}`)
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <TableSearchInput placeholder="Search for order" />
        <Dropdown
          options={sortOptions}
          selectedOption={selectedSort}
          isMulti={false}
          placeholder="Sort orders"
          onOptionClick={selectSort}
        />
      </div>

      {isLoading &&
        Array(5)
          .fill("")
          .map((_, index) => <StoreOrderCardSkeleton key={index} />)}

      {!isLoading &&
        (data?.length as number) > 0 &&
        data?.map((invoice) => (
          <StoreOrderCard key={invoice.id} invoice={invoice} />
        ))}

      {!isLoading && (data?.length as number) < 1 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
            <div className="relative">
              <BsBoxSeam size={24} />
              <div className="absolute -right-[8px] -top-[5px] flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-white">
                <HiXMark size={10} />
              </div>
            </div>
            <span className="text-sm font-medium tracking-wider">
              No Orders
            </span>
          </div>
        </div>
      )}
    </>
  )
}
