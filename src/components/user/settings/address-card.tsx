"use client"

import React from "react"
import { UserAddress } from "@prisma/client"

import { setMainAddress } from "@/app/actions/user/settings"

export const AddressCard = ({ address }: { address: UserAddress }) => {
  return (
    <div
      key={address.id}
      onClick={() => setMainAddress(address.id)}
      className="w-ful relative rounded-md border  border-gray-200 shadow-sm lg:w-72"
    >
      <div className="border-b border-gray-200 px-4 py-3 font-medium">
        {address.title}
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
        <div className="absolute bottom-2 right-2 w-16 rounded-full border border-blue-100 bg-blue-200 py-1 text-center text-xs">
          Main
        </div>
      )}
    </div>
  )
}
