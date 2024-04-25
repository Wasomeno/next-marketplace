"use client"

import React from "react"
import {
  getStoreInvoices,
  getStoreInvoicesCount,
} from "@/actions/store/invoice"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { BsBoxSeam } from "react-icons/bs"
import { HiXMark } from "react-icons/hi2"

import { DataSorter } from "@/components/data-sorter"
import { Option } from "@/components/dropdown"
import { NoData } from "@/components/no-data"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/skeleton"
import { TableSearchInput } from "@/components/table-search-input"

import { TBaseDataFilterParams } from "../../../../../../types"
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
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const invoices = useQuery({
    queryKey: ["storeOrders", searchParamsValues],
    queryFn: () =>
      getStoreInvoices({
        sort: getParsedSortParams(searchParamsValues?.sort),
        search: searchParamsValues?.search,
        page: searchParamsValues?.page,
        pageSize: "5",
      }),
  })

  return (
    <>
      <div className="flex items-center gap-2 lg:gap-4">
        <TableSearchInput placeholder="Search for order" />
        <DataSorter sortOptions={sortOptions} />
      </div>
      {invoices.isLoading &&
        Array(5)
          .fill("")
          .map((_, index) => <StoreOrderCardSkeleton key={index} />)}

      {!invoices.isLoading &&
        (invoices?.data?.length as number) > 0 &&
        invoices.data?.map((invoice) => (
          <StoreOrderCard key={invoice.id} invoice={invoice} />
        ))}

      {!invoices.isLoading && (invoices.data?.length as number) === 0 && (
        <NoData text="No Orders" icon={<BsBoxSeam size={24} />} />
      )}
      {!invoices.isLoading && (invoices.data?.length as number) > 0 && (
        <Pagination dataLength={invoices.data?.length as number} pageSize={5} />
      )}
    </>
  )
}
