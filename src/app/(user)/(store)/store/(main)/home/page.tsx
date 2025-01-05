import { Metadata } from "next"
import { redirect } from "next/navigation"
import React from "react"
import { FaBoxArchive, FaFileInvoiceDollar } from "react-icons/fa6"
import { LiaMoneyBillSolid } from "react-icons/lia"

import { getCachedSession } from "@/actions/store/user"
import { getStoreOrderCount } from "@/actions/user/order"
import { getUserStore } from "@/actions/user/user-details"

import { FaBox } from "react-icons/fa"
import { getStoreSales } from "../../_actions"
import { AnalyticCard } from "./_components/analytic-card"
import { StoreDashboardHeaderDropdown } from "./_components/store-dashboard-header-dropdown"
import { StoreRecentOrderList } from "./_components/store-recent-order-list"
import { StoreSalesChart } from "./_components/store-sales-chart"

export const metadata: Metadata = {
  title: "Store Dashboard",
}

export default async function UserStorePage() {
  const session = await getCachedSession()

  if (!session?.user.email) {
    redirect("/login")
  }

  const store = await getUserStore({ userEmail: session.user.email })

  if (!store) {
    redirect("/")
  }

  const sales = await getStoreSales()

  const orderAmount = await getStoreOrderCount({ storeId: store.id })

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex justify-between items-center ">
        <div className="lg:space-y-2">
          <h1 className="text-lg font-medium lg:text-2xl">Store Dashboard</h1>
          <p className="text-xs text-gray-500 lg:text-base">
            Monitor your store performance
          </p>
        </div>
        <StoreDashboardHeaderDropdown />
      </div>

      <div className="wrap grid w-full grid-cols-2 gap-4 lg:h-24 lg:grid-cols-4">
        <AnalyticCard
          title="Total Sales"
          performancePercentage={{
            number: 10,
            type: "positive",
          }}
          icon={
            <LiaMoneyBillSolid className=" h-8 w-8 text-green-600 lg:h-10 lg:w-10" />
          }
          data={`Rp. ${sales.toLocaleString("id")}`}
        />
        <AnalyticCard
          title="Total Orders"
          performancePercentage={{
            number: 10,
            type: "positive",
          }}
          icon={
            <FaFileInvoiceDollar className="h-8 w-8 text-blue-600 lg:h-10 lg:w-10" />
          }
          data={orderAmount}
        />
        <AnalyticCard
          title="Products Sold"
          performancePercentage={{
            number: 10,
            type: "negative",
          }}
          icon={
            <FaBoxArchive className="h-8 w-8 text-orange-600 lg:h-10 lg:w-10" />
          }
          data={orderAmount}
        />
      </div>
      <StoreSalesChart />

      <StoreRecentOrderList storeId={store.id} />
    </div>
  )
}
