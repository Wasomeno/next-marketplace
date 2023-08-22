"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"
import { HiArrowsUpDown } from "react-icons/hi2"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"

export interface TableSort {
  id: number
  text: string
  onClick(table?: Table<any>): void
}
interface TableDataSorterProps {
  disabled?: boolean
  table?: Table<any>
  sortsData: TableSort[]
}

export const TableDataSorter = ({
  disabled,
  table,
  sortsData,
}: TableDataSorterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSorting, setSelectedSorting] = useState(sortsData[0])
  return (
    <Dropdown onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger asChild>
        <button
          disabled={disabled}
          className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900 lg:h-10 lg:w-72 lg:justify-between"
        >
          <span className="hidden lg:block">{selectedSorting?.text}</span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="hidden text-slate-600 dark:text-white lg:block"
            />
            <HiArrowsUpDown
              size="16"
              className="text-slate-600 dark:text-white lg:hidden"
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
              className="flex w-72 flex-col overflow-hidden rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {sortsData.map((sort) => (
                <DropdownItem key={sort.id} asChild>
                  <button
                    onClick={() => {
                      sort.onClick(table)
                      setSelectedSorting(sort)
                    }}
                    className="px-3 py-2 text-start outline-0 ring-0  transition duration-200 hover:bg-blue-100 dark:hover:bg-neutral-800"
                  >
                    {sort.text}
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
