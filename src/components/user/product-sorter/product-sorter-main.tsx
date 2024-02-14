"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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

import { ProductSortOption } from "./"

export function ProductSorterMain({
  sortOptions,
}: {
  sortOptions: ProductSortOption[]
}) {
  const searchParams = useSearchParams()
  const activeSort = sortOptions.find(
    (sort) => sort.value === searchParams.get("sort")
  )

  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState<
    ProductSortOption | undefined
  >(activeSort)

  const router = useRouter()
  const path = usePathname()

  function selectSort(sort: ProductSortOption) {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("sort", sort.value)
    const url = `${path}?${newParams.toString()}`
    setSelectedSort(sort)
    router.replace(url)
    setIsOpen(false)
  }

  function deselectSort(sort: ProductSortOption) {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete("sort", sort.value)
    const url = `${path}?${newParams.toString()}`
    setSelectedSort(undefined)
    router.replace(url)
  }

  return (
    <Dropdown open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger asChild>
        <button className="hidden h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 lg:flex lg:h-10 lg:w-52 lg:justify-between dark:border-gray-800 dark:bg-slate-950">
          <span className="hidden font-medium lg:block">
            {selectedSort ? selectedSort.label : "Select Sort"}
          </span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="hidden text-slate-600 lg:block dark:text-white"
            />
            <HiArrowsUpDown
              size="16"
              className="text-slate-600 lg:hidden dark:text-white"
            />
          </div>
        </button>
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent asChild align="end">
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "0px" }}
              className="hidden w-52 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm lg:flex lg:rounded-b-md lg:rounded-t-none lg:border-t-0 dark:border-gray-800 dark:bg-slate-950"
            >
              {sortOptions.map((sort) => (
                <DropdownItem key={sort.id} asChild>
                  <button
                    onClick={() => {
                      if (selectedSort?.id === sort.id) {
                        deselectSort(sort)
                        return
                      }
                      selectSort(sort)
                    }}
                    className={clsx(
                      "px-3 py-2 text-start text-xs font-medium outline-0 ring-0 transition  duration-200  lg:text-sm hover:dark:bg-slate-800",
                      selectedSort?.id === sort.id
                        ? "bg-blue-100 hover:bg-blue-100"
                        : "hover:bg-slate-100"
                    )}
                  >
                    {sort.label}
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
