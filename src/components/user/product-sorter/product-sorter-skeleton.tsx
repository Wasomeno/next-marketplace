import React from "react"
import { BiChevronRight } from "react-icons/bi"
import { HiArrowsUpDown } from "react-icons/hi2"

export const ProductSorterSkeleton = () => {
  return (
    <button className="hidden h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm opacity-50 outline-0 lg:flex lg:h-10 lg:w-52 lg:justify-between dark:border-gray-800 dark:bg-slate-950">
      <span className="hidden font-medium lg:block">Select Sort</span>
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
  )
}
