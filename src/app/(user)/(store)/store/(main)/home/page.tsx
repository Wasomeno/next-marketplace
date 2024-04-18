import React from "react"
import { Metadata } from "next"
import { getStoreSales, getStoreTransactionCount } from "@/actions/store/store"
import { AnalyticCard } from "@/modules/user/store/dashboard-page/components/analytic-card"
import RecentTransactionList from "@/modules/user/store/dashboard-page/components/recent-transaction-list"
import { StoreSalesChart } from "@/modules/user/store/dashboard-page/components/store-sales-chart"
import { FaFileInvoiceDollar } from "react-icons/fa6"
import { LiaMoneyBillSolid } from "react-icons/lia"

export const metadata: Metadata = {
  title: "Store Dashboard",
}

export default async function UserStorePage() {
  const [transactionCount, sales] = await Promise.all([
    getStoreTransactionCount(),
    getStoreSales(),
  ])
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="space-y-2">
        <h1 className="text-lg font-medium lg:text-2xl">Dashboard</h1>
        <p className="text-gray-500">Monitor your store performance</p>
      </div>
      <div className="wrap grid w-full grid-cols-2 gap-4 lg:h-24 lg:grid-cols-3">
        <AnalyticCard
          title="Sales"
          icon={
            <LiaMoneyBillSolid className=" h-8 w-8 text-green-700 lg:h-10 lg:w-10" />
          }
          data={`Rp. ${sales.toLocaleString("id")}`}
        />
        <AnalyticCard
          title="Orders"
          icon={
            <FaFileInvoiceDollar className="h-8 w-8 text-blue-700 lg:h-10 lg:w-10" />
          }
          data={transactionCount}
        />
      </div>
      <StoreSalesChart />
      <div className="space-y-2">
        <h2 className="text-base font-medium lg:text-lg">
          Recent Transactions
        </h2>
        <RecentTransactionList />
      </div>
    </div>
  )
}
