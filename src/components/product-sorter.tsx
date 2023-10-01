"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"
import { HiArrowsUpDown } from "react-icons/hi2"

import { Button } from "@/components/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"

export interface ProductSort {
  id: number
  label: string
  value: string
}

const sortOptions: ProductSort[] = [
  {
    id: 1,
    label: "Price low to high",
    value: "price.asc",
  },
  {
    id: 2,
    label: "Price high to low",
    value: "price.desc",
  },
  {
    id: 3,
    label: "Name from A to Z",
    value: "name.asc",
  },
  {
    id: 4,
    label: "Name from Z to A",
    value: "name.desc",
  },
]

export function ProductSorter() {
  const searchParams = useSearchParams()
  const activeSort = sortOptions.find(
    (sort) => sort.value === searchParams.get("sort")
  )

  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState<ProductSort | undefined>(
    activeSort
  )

  const router = useRouter()
  const path = usePathname()

  function selectSort(sort: ProductSort) {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("sort", sort.value)
    const url = `${path}?${newParams.toString()}`
    setSelectedSort(sort)
    router.push(url)
  }

  return (
    <Dropdown open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 dark:border-gray-800 dark:bg-slate-950 lg:h-10 lg:w-52 lg:justify-between">
          <span className="hidden font-medium lg:block">
            {selectedSort ? selectedSort.label : "Select Sort"}
          </span>
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
          <DropdownContent asChild align="end">
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "0px" }}
              className="flex w-52 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm dark:border-gray-800 dark:bg-slate-950 lg:rounded-b-md lg:rounded-t-none lg:border-t-0"
            >
              {sortOptions.map((sort) => (
                <DropdownItem key={sort.id} asChild>
                  <button
                    onClick={() => selectSort(sort)}
                    className="px-3 py-2 text-start text-xs font-medium outline-0 ring-0 transition  duration-200 hover:bg-slate-100 hover:dark:bg-slate-800 lg:text-sm"
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

export function ProductSorterSkeleton() {
  const searchParams = useSearchParams()
  const activeSort = sortOptions.find(
    (sort) => sort.value === searchParams.get("sort")
  )
  return (
    <Dropdown>
      <DropdownTrigger asChild disabled>
        <Button
          disabled
          variant="defaultOutline"
          className="h-8 w-8 border-slate-300 bg-white px-3 dark:border-gray-700 dark:bg-slate-950 lg:h-10 lg:w-52 lg:justify-between"
        >
          <span className="hidden font-medium lg:block">
            {activeSort?.label ?? "Select Sort"}
          </span>
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
        </Button>
      </DropdownTrigger>
    </Dropdown>
  )
}
