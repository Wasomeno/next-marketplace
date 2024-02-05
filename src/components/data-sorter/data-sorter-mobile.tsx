import React, { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { HiArrowsUpDown } from "react-icons/hi2"

import { Option } from "../dropdown"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "../ui/dialog"
import { TableDataSorterProps } from "./"

export const DataSorterMobile = (props: TableDataSorterProps) => {
  const searchParams = useSearchParams()
  const activeSort = props.sortOptions?.find(
    (option) => option.value === searchParams.get("sort")
  )

  const [isOpen, setIsOpen] = useState(false)
  const [selectedSorting, setSelectedSorting] = useState<Option | null>(
    activeSort ?? null
  )

  const router = useRouter()
  const pathname = usePathname()

  function selectOption(option: Option) {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    setSelectedSorting(option)
    urlSearchParams.set("sort", option.value.toString())
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  function deselectOption() {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    setSelectedSorting(null)
    urlSearchParams.delete("sort")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <button
          disabled={props?.disabled}
          className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 disabled:opacity-50 lg:hidden dark:border-neutral-600 dark:bg-neutral-900"
        >
          <div className="w-5">
            <HiArrowsUpDown
              size="16"
              className="text-slate-600 lg:hidden dark:text-white"
            />
          </div>
        </button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay className="lg:hidden" />
            <DialogContent open={isOpen} className="h-72 lg:hidden" asChild>
              <DialogHeader title="Sort Products" />
              <div className="flex flex-wrap items-center gap-2 p-4">
                {props.sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="default"
                    onClick={() => {
                      if (option.value === activeSort?.value) {
                        deselectOption()
                        return
                      }
                      selectOption(option)
                    }}
                    className={
                      option.value === activeSort?.value
                        ? "bg-blue-100 hover:bg-blue-100"
                        : "hover:bg-blue-100"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
