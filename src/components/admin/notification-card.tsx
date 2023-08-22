"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Order } from "@prisma/client"

type NotificationCardProps = Pick<Order, "id" | "invoice" | "created_at"> & {
  productCount: number
}

export const NotificationCard = ({
  id,
  invoice,
  created_at,
  productCount,
}: NotificationCardProps) => {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(`/admin/orders?id=${id}&view=true`)}
      className="w-full border-b px-4 py-2 text-start dark:border-b-neutral-800"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-600">Order</span>
        <span className="text-xs text-gray-400 dark:text-gray-600">
          {`${created_at.getHours()}:${created_at.getMinutes()}`}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-gray-300 dark:bg-gray-500" />
        <div className="flex flex-col">
          <span className="text-xs font-medium">{invoice}</span>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-600">
            {productCount} Items
          </span>
        </div>
      </div>
    </button>
  )
}
