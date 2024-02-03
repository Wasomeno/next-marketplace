"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useSearchParamsValues } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { BsBoxSeam } from "react-icons/bs"
import { HiXMark } from "react-icons/hi2"

import { Separator } from "@/components/ui/separator"
import { Dropdown, Option } from "@/components/dropdown"
import { TableSearchInput } from "@/components/table-search-input"
import { InvoiceChangeStatusButton } from "@/components/user/store/invoice-change-status-button"
import { getStoreInvoices } from "@/app/actions/store/invoice"

import { BaseDataFilters, OrderStatus } from "../../../../../types"

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
  const [selectedSort, setSelectedSort] = useState<Option>()
  const [isShowOtherProducts, setIsShowOtherProducts] = useState(false)

  const searchParams = useSearchParamsValues<BaseDataFilters>()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["storeOrders", searchParams],
    queryFn: () =>
      getStoreInvoices({
        sort: searchParams?.sort,
        search: searchParams?.search,
      }),
  })

  function selectSort(sort: Option) {
    const searchParamsValues = new URLSearchParams(
      searchParams as Record<string, string>
    )
    searchParamsValues.set("sort", sort.value as string)

    setSelectedSort(sort)

    router.replace(`/store/orders?${searchParamsValues.toString()}`)
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <TableSearchInput placeholder="Search for order" />
        <Dropdown
          options={sortOptions}
          selectedOption={selectedSort}
          isMulti={false}
          placeholder="Sort orders"
          onOptionClick={selectSort}
        />
      </div>

      {isLoading &&
        Array(5)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
            >
              <div className="flex flex-wrap items-center justify-between border-b  border-b-gray-200 bg-gray-50 px-4 py-2">
                <div className="h-[18px] w-32 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-[18px] w-36 animate-pulse rounded-lg bg-gray-200" />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap gap-4 pb-0 lg:gap-10">
                  <div className="space-y-2">
                    <div className="flex w-72 gap-3">
                      <div className="h-28 w-28 animate-pulse rounded-lg border bg-gray-200 shadow-sm" />
                      <div className="space-y-2">
                        <div className="h-[18px] w-32 animate-pulse rounded-lg bg-gray-200" />
                        <div className="flex gap-2">
                          <div className="h-[18px] w-10 animate-pulse rounded-lg bg-gray-200" />
                          <div className="h-[18px] w-28 animate-pulse rounded-lg bg-gray-200" />
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
                    <div className="h-[18px] w-24 animate-pulse rounded-lg bg-gray-200" />

                    <div className="flex flex-col gap-2">
                      <div className="h-[18px] w-36 animate-pulse rounded-lg bg-gray-200" />
                      <div className="h-[18px] w-32 animate-pulse rounded-lg bg-gray-200" />
                      <div className="h-[18px] w-28 animate-pulse rounded-lg bg-gray-200" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-0">
                  <div className="h-[18px] w-20 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-[20px] w-36 animate-pulse rounded-lg bg-gray-200" />
                </div>
                <div className="flex justify-end">
                  <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
      {!isLoading &&
        (data?.length as number) > 0 &&
        data?.map((invoice) => (
          <div
            key={invoice.id}
            className="space-y-2 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          >
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
                      onClick={() =>
                        setIsShowOtherProducts(!isShowOtherProducts)
                      }
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
              <div className="flex items-center justify-between pt-0">
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
        ))}
      {!isLoading && (data?.length as number) < 1 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
            <div className="relative">
              <BsBoxSeam size={24} />
              <div className="absolute -right-[8px] -top-[5px] flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-white">
                <HiXMark size={10} />
              </div>
            </div>
            <span className="text-sm font-medium tracking-wider">
              No Orders
            </span>
          </div>
        </div>
      )}
    </>
  )
}
