"use client"

import { useState } from "react"
import { RxCross2 } from "react-icons/rx"

import { Button } from "@/components/ui/button"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTrigger,
} from "../responsive-dialog"
import { ProductCategoryFilter } from "./product-category-filter"
import { ProductPriceFilter } from "./product-price-filter"

type ProductsFilterProps = {
  withCategories?: boolean
}

export const ProductsFilter = (props: ProductsFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant="defaultOutline"
          className="lg h-8 border-slate-200 dark:border-gray-800 dark:bg-slate-950 lg:h-10"
        >
          Filter
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent
        open={isOpen}
        className="flex fixed space-y-4 h-96 w-full flex-col rounded-t-lg bg-white dark:border-l-gray-800 dark:bg-neutral-950 lg:right-0 lg:top-0 lg:h-screen lg:w-2/6 lg:translate-x-0 lg:translate-y-0 lg:rounded-l-lg"
      >
        <ResponsiveDialogHeader title="Filters" />
        <div className="space-y-4 px-6">
          <ProductPriceFilter />
          {props.withCategories && <ProductCategoryFilter />}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
