"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Prisma } from "@prisma/client"
import moment from "moment"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/skeleton"

import { OrderStatus } from "../../../../../../types"
import { InvoiceChangeStatusButton } from "./invoice-change-status-button"

export const StoreOrderCard = ({
  invoice,
}: {
  invoice: Prisma.InvoiceGetPayload<{
    include: {
      products: {
        include: { product: { include: { images: true } } }
      }
      _count: { select: { products: true } }
    }
  }>
}) => {
  const [isShowOtherProducts, setIsShowOtherProducts] = useState(false)
  return (
    <div className="space-y-2 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
      <div className="flex flex-wrap items-center justify-between border-b  border-b-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-sm font-medium">{invoice.id}</span>
        <span className="text-sm font-medium text-gray-400">
          {moment(invoice.created_at).format("LLLL")}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-4 pb-0 lg:gap-10">
          <div className="space-y-2">
            <div className="flex w-72 gap-3">
              <div className="relative h-28 w-28 overflow-hidden rounded-md border border-gray-200 shadow-sm">
                <Image
                  src={invoice.products[0].product.featured_image_url}
                  alt="product-image"
                  fill
                />
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">
                  {invoice.products[0].product.name}
                </h5>
                <span className="text-sm text-gray-500">
                  {invoice.products[0].amount} x Rp{" "}
                  {invoice.products[0].product.price.toLocaleString("id")}
                </span>
              </div>
            </div>
            {isShowOtherProducts &&
              invoice.products
                .slice(1, invoice.products.length)
                .map((product) => (
                  <div key={product.id} className="flex w-72 gap-3">
                    <div className="relative h-28 w-28 overflow-hidden rounded-md border border-gray-200 shadow-sm">
                      <Image
                        src={product.product.featured_image_url}
                        alt="product-image"
                        fill
                      />
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">
                        {product.product.name}
                      </h5>
                      <span className="text-sm text-gray-500">
                        {product.amount} x Rp{" "}
                        {product.product.price.toLocaleString("id")}
                      </span>
                    </div>
                  </div>
                ))}
            {invoice.products.length > 1 && (
              <button
                onClick={() => setIsShowOtherProducts(!isShowOtherProducts)}
                className="text-sm font-medium text-blue-400"
              >
                Show {invoice.products.length - 1} other products
              </button>
            )}
          </div>
          <Separator
            decorative
            orientation="vertical"
            className="hidden h-20 w-px bg-gray-200 lg:inline-block"
          />
          <Separator
            decorative
            orientation="horizontal"
            className="h-px w-full bg-gray-200 lg:hidden"
          />
          <div className="w-48 space-y-2">
            <h5 className="text-sm font-medium">Address</h5>
            <p className="whitespace-pre-line text-sm text-gray-500">
              {invoice.address}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm font-medium">Total</span>
          <span>Rp. {invoice.total.toLocaleString("id")}</span>
        </div>
        <div className="flex justify-end">
          <InvoiceChangeStatusButton
            invoiceId={invoice.id}
            status={invoice?.status as OrderStatus}
          />
        </div>
      </div>
    </div>
  )
}

export const StoreOrderCardSkeleton = () => {
  return (
    <div className="space-y-2 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
      <div className="flex flex-wrap items-center justify-between border-b  border-b-gray-200 bg-gray-50 px-4 py-2">
        <Skeleton className="h-[18px] w-32" />
        <Skeleton className="h-[18px] w-36" />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-4 pb-0 lg:gap-10">
          <div className="space-y-2">
            <div className="flex w-72 gap-3">
              <Skeleton className="h-28 w-28  shadow-sm" />
              <div className="space-y-2">
                <Skeleton className="h-[18px] w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-[18px] w-10" />
                  <Skeleton className="h-[18px] w-28" />
                </div>
              </div>
            </div>
          </div>
          <Separator
            decorative
            orientation="vertical"
            className="hidden h-20 w-px bg-gray-200 lg:inline-block"
          />
          <Separator
            decorative
            orientation="horizontal"
            className="h-px w-full bg-gray-200 lg:hidden"
          />
          <div className="w-48 space-y-2">
            <Skeleton className="h-[18px] w-24" />

            <div className="flex flex-col gap-2">
              <Skeleton className="h-[18px] w-36" />
              <Skeleton className="h-[18px] w-32" />
              <Skeleton className="h-[18px] w-28" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-0">
          <Skeleton className="h-[18px] w-20" />
          <Skeleton className="h-[20px] w-36" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
    </div>
  )
}
