"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { RxCross2 } from "react-icons/rx"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { ProductCategoryFilter } from "./product-category-filter"
import { ProductPriceFilter } from "./product-price-filter"

export const ProductsFilter = () => {
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant="defaultOutline"
          className="lg h-8 border-slate-200 lg:h-10 dark:border-gray-800 dark:bg-slate-950"
        >
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent
        open={isOpen}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="flex h-96 w-full flex-col rounded-none border-l bg-white lg:right-0 lg:top-0 lg:h-screen lg:w-2/6 lg:translate-x-0 lg:translate-y-0 dark:border-l-gray-800 dark:bg-neutral-950"
      >
        <div className="mb-4 flex items-center justify-between border-b p-4 dark:border-b-gray-700">
          <h5 className="text-sm font-medium lg:text-lg">Filters</h5>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <RxCross2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-3 px-4">
            <ProductPriceFilter />
            {pathname === "/search" && <ProductCategoryFilter />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
