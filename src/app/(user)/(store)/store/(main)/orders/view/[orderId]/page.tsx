import React from "react"
import Image from "next/image"
import moment from "moment"

import { ProductsOrderedTable } from "@/components/products-ordered-table"
import { getStoreOrder } from "@/app/actions/store/order"

type StoreOrderPageProps = {
  params: { orderId: string }
}

export default async function StoreOrderPage({ params }: StoreOrderPageProps) {
  const order = await getStoreOrder(parseInt(params.orderId))

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-base font-medium lg:text-2xl">
            {order?.invoice}
          </h1>
          <div className="w-fit rounded-md bg-blue-100 px-2.5 py-2 text-xs font-medium lg:px-4 lg:text-sm">
            {order?.status}
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">
            {moment(order?.created_at).format("LLLL")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full">
          <span className="font-medium lg:text-lg">Products Ordered</span>
          <ProductsOrderedTable products={order?.products ?? []} />
        </div>
        <div className="w-full lg:w-fit">
          <h3 className="mb-2 font-medium lg:text-lg">Customer Details</h3>
          <div className="space-y-4 rounded-md border border-gray-200 px-4 py-2 shadow-sm lg:h-[35rem] lg:w-[30rem] lg:px-6 lg:py-4 ">
            <div className="flex items-center gap-3 ">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={order?.user?.image as string}
                  fill
                  alt="user-profile-image"
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">{order?.user.name}</div>
                <div className="text-sm font-medium text-gray-500">
                  {order?.user.email}
                </div>
              </div>
            </div>
            <hr className="h-px w-full border border-gray-200" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Phone Number</h4>
              <p className="text-sm">{"08131781"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Shipping Address</h4>
              <p className="text-sm">{order?.user.address ?? "No Address"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
