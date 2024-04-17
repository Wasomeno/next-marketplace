"use client"

import React from "react"
import { getStoreInvoices } from "@/actions/store/invoice"
import { useQuery } from "@tanstack/react-query"
import { IoList } from "react-icons/io5"
import { LiaStackpath } from "react-icons/lia"

import { NoData } from "@/components/no-data"
import { Skeleton } from "@/components/skeleton"

const RecentTransactionList = () => {
  const transactions = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getStoreInvoices(),
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
            <div
              key={transaction.id}
              className="space-y-2 rounded-lg px-4 py-2 shadow-sm"
            >
              {transaction.id}
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

export default RecentTransactionList
