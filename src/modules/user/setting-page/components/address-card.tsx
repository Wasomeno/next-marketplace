"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { UserAddress } from "@prisma/client"
import clsx from "clsx"

import { Skeleton } from "@/components/skeleton"

export const AddressCard = ({ address }: { address: UserAddress }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function openSetMainAddresConfirmationModal() {
    const urlSearchParams = new URLSearchParams(searchParams)
    urlSearchParams.set("mainAddressConfirm", "true")
    urlSearchParams.set("id", address.id)
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  return (
    <div
      key={address.id}
      onClick={() =>
        !address.isMainAddress && openSetMainAddresConfirmationModal()
      }
      className={clsx(
        "relative w-full rounded-md border  border-gray-200 shadow-sm lg:w-72",
        !address.isMainAddress && "cursor-pointer"
      )}
    >
      <div className="border-b border-gray-200 px-4 py-2">
        <span className="text-sm font-medium">{address.title}</span>
      </div>
      <div className="flex flex-col gap-2 px-4 py-2">
        <span className="text-sm">{address.recipient}</span>
        <span className="text-sm">
          {address.province}, {address.city}, {address.subdistrict}
        </span>
        <span className="text-sm">
          {address.street}, {address.postNumber}
        </span>
        <span className="text-sm">{address.phoneNumber}</span>
      </div>

      {address.isMainAddress && (
        <div className="absolute bottom-2 right-2 w-16 rounded-full bg-gray-100 py-1 text-center text-xs font-medium shadow-sm">
          Main
        </div>
      )}
    </div>
  )
}

export const AddressCardSkeleton = () => {
  return (
    <div className="relative w-full rounded-md border  border-gray-200 shadow-sm lg:w-72">
      <div className="border-b border-gray-200 px-4 py-2">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex flex-col gap-2 px-4 py-2">
        <Skeleton className="h-5 w-40 " />
        <Skeleton className="h-5 w-32 " />
        <Skeleton className="h-5 w-24 " />
        <Skeleton className="h-5 w-24 " />
      </div>
    </div>
  )
}
