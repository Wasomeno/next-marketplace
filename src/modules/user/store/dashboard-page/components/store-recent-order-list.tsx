"use client"

import React from "react"
import { getStoreOrders } from "@/actions/user/order"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { IoList } from "react-icons/io5"

import { NoData } from "@/components/no-data"
import { Skeleton } from "@/components/skeleton"

export const StoreRecentOrderList: React.FC<{ storeId: number }> = ({
  storeId,
}) => {
  const transactions = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getStoreOrders({ storeId }),
  })

  const skeletons = Array(5)
    .fill("")
    .map((_, index) => (
      <Skeleton key={index} className="h-12 w-full lg:w-1/2" />
    ))

  return (
    <ol className="space-y-2">
      {transactions.isLoading && skeletons}
      {!transactions.isLoading &&
        transactions.data &&
        (transactions.data.length > 0 ? (
          transactions.data?.map((transaction) => (
            <div className="space-y-2 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
              <div className="flex flex-wrap items-center justify-between border-b  border-b-gray-200 bg-gray-50 px-4 py-2">
                <span className="text-sm font-medium">{transaction.id}</span>
                <span className="text-sm font-medium text-gray-400">
                  {moment(transaction.created_at).format("LLLL")}
                </span>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap justify-between gap-4 pb-0">
                  <div className="space-y-2">
                    {transaction.products.length} Items
                  </div>
                  <div className="flex items-center gap-4 pt-0">
                    <span className="text-sm font-medium">Total</span>
                    <span>Rp. {transaction.total.toLocaleString("id")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-72 items-center justify-center">
            <NoData text="No Recent Transaction" icon={<IoList size={24} />} />
          </div>
        ))}

      {!transactions.isLoading && !transactions.data && (
        <div className="flex h-72 items-center justify-center">
          <NoData text="No Recent Transaction" icon={<IoList size={24} />} />
        </div>
      )}
    </ol>
  )
}
