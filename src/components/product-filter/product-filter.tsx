"use client"

import { useState } from "react"
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog"
import { AnimatePresence } from "framer-motion"
import { RxCross2 } from "react-icons/rx"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"

import { ProductCategoryFilter } from "./product-category-filter"
import { ProductPriceFilter } from "./product-price-filter"

type ProductsFilterProps = {
  withCategories?: boolean
}

export const ProductsFilter = (props: ProductsFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant="defaultOutline"
          className="lg h-8 border-slate-200 dark:border-gray-800 dark:bg-slate-950 lg:h-10"
        >
          Filter
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay />
            <DialogContent
              open={isOpen}
              onOpenAutoFocus={(event) => event.preventDefault()}
              className="flex h-96 w-full flex-col rounded-t-lg bg-white dark:border-l-gray-800 dark:bg-neutral-950 lg:right-0 lg:top-0 lg:h-screen lg:w-2/6 lg:translate-x-0 lg:translate-y-0 lg:rounded-l-lg"
            >
              <div className="mb-4 flex items-center justify-between border-b p-4 dark:border-b-gray-700">
                <h5 className="font-medium lg:text-lg">Filters</h5>
                <button onClick={() => setIsOpen(false)} className="lg:hidden">
                  <RxCross2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4 px-6">
                <ProductPriceFilter />
                {props.withCategories && <ProductCategoryFilter />}
              </div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
