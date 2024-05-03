"use client"

import React from "react"
import { getStoreOrders } from "@/actions/user/order"
import { getParsedSortParams, useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { BsBoxSeam } from "react-icons/bs"

import { DataSorter } from "@/components/data-sorter"
import { Option } from "@/components/dropdown"
import { NoData } from "@/components/no-data"
import { Pagination } from "@/components/pagination"
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

export const StoreOrderList: React.FC<{ storeId: number }> = ({ storeId }) => {
  const searchParamsValues = useSearchParamsValues<TBaseDataFilterParams>()

  const orders = useQuery({
    queryKey: ["storeOrders", searchParamsValues],
    queryFn: () =>
      getStoreOrders({
        storeId,
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
      {orders.isLoading &&
        Array(5)
          .fill("")
          .map((_, index) => <StoreOrderCardSkeleton key={index} />)}

      {!orders.isLoading &&
        (orders?.data?.length as number) > 0 &&
        orders.data?.map((order) => (
          <StoreOrderCard key={order.id} order={order} />
        ))}

      {!orders.isLoading && (orders.data?.length as number) === 0 && (
        <NoData text="No Orders" icon={<BsBoxSeam size={24} />} />
      )}
      {!orders.isLoading && (orders.data?.length as number) > 0 && (
        <Pagination dataLength={orders.data?.length as number} pageSize={5} />
      )}
    </>
  )
}
