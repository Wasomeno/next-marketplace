"use client"

import { useState } from "react"
import { BiChevronRight } from "react-icons/bi"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"

const statuses = [
  { id: 0, title: "All" },
  { id: 1, title: "Awaiting Payment" },
  { id: 2, title: "Payment Confirmed" },
  { id: 3, title: "Processed" },
  { id: 4, title: "On Shipping" },
  { id: 5, title: "Shipped" },
  { id: 6, title: "Completed" },
]

export const OrderStatusFilter = () => {
  const [selectedStatus, setSelectedStatus] = useState(statuses[0])
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button className="flex h-8 w-36 items-center justify-between rounded-md border bg-white px-3 outline-0 dark:border-gray-800 dark:bg-slate-950 lg:h-10 lg:w-72 lg:justify-between">
          <span className="text-xs lg:text-sm">{selectedStatus.title}</span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="text-slate-600 dark:text-white"
            />
          </div>
        </button>
      </DropdownTrigger>
      <DropdownContent
        align="start"
        className="flex w-36 flex-col overflow-hidden rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm dark:border-gray-700 dark:bg-slate-950 lg:w-72"
      >
        {statuses.map((status) => (
          <DropdownItem key={status.id} asChild>
            <button
              onClick={() => setSelectedStatus(status)}
              className="w-full px-3 py-2 text-start text-xs outline-0 ring-0 transition duration-200 hover:bg-blue-100 hover:dark:bg-slate-800 lg:text-sm"
            >
              {status.title}
            </button>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  )
}
