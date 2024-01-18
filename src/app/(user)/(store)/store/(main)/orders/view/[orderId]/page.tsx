import React from "react"
import Image from "next/image"
import moment from "moment"

import { getStoreOrder } from "@/app/actions/store/order"

type StoreOrderPageProps = {
  params: { orderId: string }
}

export default async function StoreOrderPage({ params }: StoreOrderPageProps) {
  const { user, ...order } = await getStoreOrder(parseInt(params.orderId))
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-base font-medium lg:text-2xl">
            {order?.invoice}
          </h1>
          <div className="w-fit rounded-md bg-blue-400 px-2.5 py-2 text-xs font-medium text-gray-100 lg:px-4 lg:text-sm">
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
        <div className="w-full space-y-2">
          <span className="font-medium lg:text-lg">Products Ordered</span>
          <div className="flex flex-col gap-2">
            {order?.products.map((product) => (
              <div
                key={product.id}
                className="flex w-full flex-wrap items-center justify-between rounded-md border border-gray-200 px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-24 overflow-hidden rounded-md">
                    <Image
                      src={product.product.featured_image_url}
                      fill
                      alt="product-image"
                    />
                  </div>
                  <span className="text-sm">{product.product.name}</span>
                </div>
                <div className="flex  w-full flex-col items-end space-y-2 lg:w-auto">
                  <div>Rp. {product.product.price.toLocaleString("id")}</div>
                  <div className="text-end text-sm font-medium text-gray-500">
                    Amount : {product.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-fit">
          <h3 className="mb-2 font-medium lg:text-lg">Customer Details</h3>
          <div className="space-y-4 rounded-md border border-gray-100 px-4 py-2 shadow-sm lg:h-[35rem] lg:w-[30rem] lg:px-6 lg:py-4 ">
            <div className="flex items-center gap-3 ">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={user?.image as string}
                  fill
                  alt="user-profile-image"
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">
                  {user.email}
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
              <p className="text-sm">{user.address ?? "No Address"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
