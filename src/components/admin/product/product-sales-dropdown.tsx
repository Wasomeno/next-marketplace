"use client"

import React, { useState } from "react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"
import { HiArrowsUpDown } from "react-icons/hi2"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const ProductSalesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dropdown onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger asChild>
        <button className="tems-center flex h-8 w-32 items-center  justify-between rounded-md border bg-white px-2 text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900">
          <span className="text-xs">Tuesday</span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className={clsx(
                "text-slate-600 transition-all duration-200 dark:text-white lg:block",
                { "rotate-90": isOpen }
              )}
            />
          </div>
        </button>
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent asChild>
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "0px" }}
              className="flex w-32 flex-col overflow-hidden rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {daysOfWeek.map((day) => (
                <DropdownItem key={day} asChild>
                  <button
                    onClick={() => {}}
                    className="px-3 py-2 text-start text-xs outline-0 ring-0  transition duration-200 hover:bg-blue-100 dark:hover:bg-neutral-800"
                  >
                    {day}
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
