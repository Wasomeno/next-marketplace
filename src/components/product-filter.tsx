"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DialogTrigger } from "@radix-ui/react-dialog"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export const ProductsFilter = () => {
  const [openFilter, setOpenFilter] = useState(false)

  return (
    <Dialog open={openFilter} onOpenChange={setOpenFilter}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpenFilter(true)}
          variant="defaultOutline"
          className="lg h-8 border-slate-200 dark:border-gray-800 dark:bg-slate-950 lg:h-10"
        >
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent
        open={openFilter}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="flex h-5/6 w-full flex-col rounded-none border-l bg-white dark:border-l-gray-800 dark:bg-neutral-950 lg:right-0 lg:top-0 lg:h-screen lg:w-2/6 lg:translate-x-0 lg:translate-y-0"
      >
        <div className="mb-4 border-b p-4 dark:border-b-gray-700">
          <h5 className="text-sm font-medium lg:text-lg">Filters</h5>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-3 px-4">
            <ProductPriceFilter />
            <div>
              <h6 className="text-xs font-medium tracking-wide lg:text-sm">
                Categories
              </h6>
              <Input
                placeholder="Select Categories"
                className="mt-2 text-xs dark:border-gray-800 dark:bg-neutral-900 lg:text-sm"
              />
            </div>
          </div>
          <div className="sticky bottom-0 flex h-16 items-center justify-center border-t px-4 dark:border-t-gray-800">
            <Button
              variant="default"
              className="w-full bg-blue-400 text-white dark:bg-blue-950"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ProductPriceFilter = () => {
  const router = useRouter()
  const path = usePathname()
  const searchParams = useSearchParams()

  const [priceFilter, setPriceFilter] = useState({
    pmin: searchParams.get("pmin") ?? 0,
    pmax: searchParams.get("pmax") ?? 0,
  })

  const createSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set(key, value)
    return newParams.toString()
  }

  function onMinimumPriceChange(price: string) {
    setPriceFilter((current) => ({ ...current, pmin: price }))
    const url = `${path}?${createSearchParams("pmin", price)}`
    setTimeout(() => router.push(url), 500)
  }

  function onMaximumPrichange(price: string) {
    setPriceFilter((current) => ({ ...current, pmax: price }))
    const url = `${path}?${createSearchParams("pmax", price)}`
    setTimeout(() => router.push(url), 500)
  }

  return (
    <div>
      <h6 className="text-xs font-medium tracking-wide lg:text-sm">Price</h6>
      <div className="mt-2 flex gap-2">
        <Input
          type="number"
          placeholder="Min Price"
          className="text-xs dark:border-gray-800 dark:bg-neutral-900 lg:text-sm"
          value={priceFilter.pmin}
          onChange={(event) => onMinimumPriceChange(event?.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Price"
          className="text-xs dark:border-gray-800 dark:bg-neutral-900 lg:text-sm"
          value={priceFilter.pmax}
          onChange={(event) => onMaximumPrichange(event?.target.value)}
        />
      </div>
    </div>
  )
}
