import { useState } from "react"
import clsx from "clsx"
import { AnimatePresence } from "framer-motion"
import { CiFilter } from "react-icons/ci"
import { twMerge } from "tailwind-merge"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "../ui/dialog"
import { DataFilterProps } from "./"

export const DataFilterMobile = ({
  activeFilters,
  onOptionClick,
  filterOptions,
  disabled,
}: DataFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const isActive =
    activeFilters &&
    activeFilters.some((filter) =>
      Object.values(filter).some((value) => value !== "")
    )

  const activeFilterAmount = activeFilters?.filter((filter) =>
    Object.values(filter).every((value) => value !== "")
  ).length

  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <button
          disabled={disabled}
          className="relative flex h-8 w-8 items-center justify-center rounded-md border bg-white lg:hidden"
        >
          {isActive && (
            <div className="absolute -right-2 -top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-blue-400 text-xs text-white shadow-sm ">
              {activeFilterAmount}
            </div>
          )}

          <CiFilter />
        </button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay />
            <DialogContent open={isOpen} className="h-64">
              <DialogHeader title="Filter" />
              <div className="space-y-4 px-4 py-2">
                {filterOptions.map((option) => (
                  <div key={option.value} className="space-y-2">
                    <span className="text-sm font-medium">{option.label}</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {option.children.map((childOption) => (
                        <Button
                          onClick={() => onOptionClick(option, childOption)}
                          key={childOption.value}
                          variant="default"
                          size="sm"
                          className={clsx(
                            activeFilters?.some((filter) =>
                              filter[option.value as string]
                                ?.split(" ")
                                ?.includes(childOption.value.toString())
                            ) && "bg-blue-400 text-white"
                          )}
                        >
                          {childOption.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
