"use client"

import React from "react"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { BsBoxSeam } from "react-icons/bs"
import { HiXMark } from "react-icons/hi2"

import { DataSorter } from "@/components/data-sorter"
import { Option } from "@/components/dropdown"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/skeleton"
import { TableSearchInput } from "@/components/table-search-input"
import {
  getStoreInvoices,
  getStoreInvoicesCount,
} from "@/app/actions/store/invoice"

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
  const searchParamsValues = useSearchParamsValues<BaseDataFilters>()

  const { data: invoicesCount, isLoading: isInvoicesCountLoading } = useQuery({
    queryKey: ["storeInvoicesCount", searchParamsValues?.search],
    queryFn: () =>
      getStoreInvoicesCount({
        search: searchParamsValues?.search,
      }),
  })

  const { data: invoices, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["storeOrders", searchParamsValues],
    queryFn: () =>
      getStoreInvoices({
        sort: searchParamsValues?.sort,
        search: searchParamsValues?.search,
        page: searchParamsValues?.page,
        pageSize: 5,
      }),
  })

  return (
    <>
      {isInvoicesCountLoading ? (
        <Skeleton className="h-[18px] w-20" />
      ) : (
        <span className="font text-sm text-gray-500 lg:text-base">
          {invoicesCount} Reviews
        </span>
      )}
      <div className="flex items-center gap-4">
        <TableSearchInput placeholder="Search for order" />
        <DataSorter sortOptions={sortOptions} />
      </div>
      {isInvoicesLoading &&
        Array(5)
          .fill("")
          .map((_, index) => <StoreOrderCardSkeleton key={index} />)}

      {!isInvoicesLoading &&
        (invoices?.length as number) > 0 &&
        invoices?.map((invoice) => (
          <StoreOrderCard key={invoice.id} invoice={invoice} />
        ))}

      {!isInvoicesLoading && (invoices?.length as number) < 1 && (
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
      {invoicesCount && <Pagination dataLength={invoicesCount} pageSize={5} />}
    </>
  )
}
