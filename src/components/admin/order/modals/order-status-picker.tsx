"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { TOrderStatus } from "@/app/actions/user/order"

const statuses = [
  "Payment Confirmed",
  "On Shipping",
  "On Proccess",
  "Done",
  "Arrived",
] as TOrderStatus[]

export function OrderStatusPicker({
  status,
  selectStatus,
}: {
  status: TOrderStatus
  selectStatus: Dispatch<SetStateAction<TOrderStatus>>
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger asChild>
        <button className="flex h-9 w-48 items-center justify-between rounded-md  border bg-white px-3 outline-0 lg:h-10 lg:w-52 dark:border-gray-800 dark:bg-slate-950">
          <span className="text-xs font-medium lg:block lg:text-sm">
            {status}
          </span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className=" text-slate-600 opacity-50 dark:text-white"
            />
          </div>
        </button>
      </DropdownTrigger>
      <AnimatePresence>
        {open && (
          <DropdownContent asChild align="end" className="z-[55]">
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "0px" }}
              className="flex w-48 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm lg:w-52 lg:rounded-b-md lg:rounded-t-none lg:border-t-0 dark:border-gray-800 dark:bg-slate-950"
            >
              {statuses.map((status) => (
                <DropdownItem key={status} asChild>
                  <button
                    onClick={() => selectStatus(status)}
                    className="px-3 py-2 text-start text-xs font-medium outline-0 ring-0 transition  duration-200 hover:bg-slate-100 lg:text-sm hover:dark:bg-slate-800"
                  >
                    {status}
                  </button>
                </DropdownItem>
              ))}
            </motion.div>
          </DropdownContent>
        )}
      </AnimatePresence>
    </Dropdown>
  )
}
