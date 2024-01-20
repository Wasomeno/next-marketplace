"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HiArrowsUpDown } from "react-icons/hi2"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ProductSortOption } from "./"

export const ProductSorterMobile = ({
  sortOptions,
}: {
  sortOptions: ProductSortOption[]
}) => {
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
    <Dialog onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-white text-sm outline-0 lg:hidden lg:h-10 lg:w-52 lg:justify-between dark:border-gray-800 dark:bg-slate-950">
          <HiArrowsUpDown
            size="16"
            className="text-slate-600 lg:hidden dark:text-white"
          />
        </button>
      </DialogTrigger>
      <DialogContent open={isOpen} className="h-fit space-y-4">
        <DialogHeader title="Product Sorts" />
        <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
          {sortOptions.map((option) => (
            <Button
              key={option.id}
              variant="default"
              size="default"
              className={selectedSort?.id === option.id ? "bg-blue-200" : ""}
              onClick={() => {
                if (selectedSort?.id === option.id) {
                  deselectSort(option)
                  return
                }
                selectSort(option)
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
