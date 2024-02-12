import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { AnimatePresence } from "framer-motion"
import { CiFilter } from "react-icons/ci"

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
import { DataFilterOption, DataFilterProps } from "./"

export const DataFilterMobile = ({
  filterOptions,
  disabled,
}: DataFilterProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  const [activeFilters, setActiveFilters] =
    useState<Record<string, string>[]>(getActiveFilters())

  const isActive =
    activeFilters &&
    activeFilters.some((filter) =>
      Object.values(filter).some((value) => value !== "")
    )

  const activeFilterAmount = activeFilters?.filter((filter) =>
    Object.values(filter).every((value) => value !== "")
  ).length

  function getActiveFilters() {
    const activeFilters = filterOptions.map((option) => ({
      [option.value as string]: searchParams.get(option.value as string) ?? "",
    }))

    return activeFilters
  }

  function selectFilter(parentOption: DataFilterOption, childOption: Option) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (childOption.value === "") {
      newSearchParams.delete(parentOption.value as string)
    } else if (parentOption.isMultipleValues) {
      const searchParamsValue =
        searchParams.get(parentOption.value as string)?.split(" ") ?? []
      newSearchParams.set(
        parentOption.value as string,
        [...searchParamsValue, childOption.value].join(" ")
      )
    } else {
      newSearchParams.set(
        parentOption.value as string,
        childOption.value as string
      )
    }

    const currentActiveFilters = activeFilters

    const filterIndex = currentActiveFilters.findIndex((filter) =>
      Object.keys(filter).includes(parentOption.value as string)
    )
    if (!parentOption.isMultipleValues) {
      currentActiveFilters[filterIndex] = {
        [parentOption.value as string]: childOption.value as string,
      }
    } else {
      currentActiveFilters[filterIndex] = {
        [parentOption.value as string]: [
          ...currentActiveFilters[filterIndex][parentOption.value].split(" "),
          childOption.value,
        ].join(
          currentActiveFilters[filterIndex][parentOption.value].length > 0
            ? " "
            : ""
        ),
      }
    }

    setActiveFilters(currentActiveFilters)

    const url = `${pathname}?${newSearchParams.toString()}`

    router.replace(url)
  }

  function deselectFilter(parentOption: DataFilterOption, childOption: Option) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (!parentOption.isMultipleValues) {
      newSearchParams.delete(parentOption.value as string)
    } else {
      const filterValues =
        searchParams.get(parentOption.value as string)?.split(" ") ?? []

      const filteredFilterValues = filterValues.filter(
        (value) => value !== childOption.value.toString()
      )

      if (filteredFilterValues.length > 0) {
        newSearchParams.set(
          parentOption.value as string,
          filteredFilterValues.join(" ")
        )
      } else {
        newSearchParams.delete(parentOption.value as string)
      }
    }

    const currentActiveFilters = activeFilters

    const filterIndex = currentActiveFilters.findIndex((filter) =>
      Object.keys(filter).includes(parentOption.value as string)
    )

    if (!parentOption.isMultipleValues) {
      currentActiveFilters[filterIndex] = {
        [parentOption.value as string]: "",
      }
    } else {
      currentActiveFilters[filterIndex] = {
        [parentOption.value as string]: currentActiveFilters[filterIndex][
          parentOption.value
        ]
          .split(" ")
          .filter((value) => value !== childOption.value.toString())
          .join(" "),
      }
    }

    setActiveFilters(currentActiveFilters)

    const url = `${pathname}?${newSearchParams.toString()}`

    router.replace(url)
  }

  function getIsFilterActive(
    parentOption: DataFilterOption,
    childOption: Option
  ) {
    return activeFilters?.some(
      (filter) =>
        filter[parentOption.value as string] !== undefined &&
        filter[parentOption.value as string]
          ?.split(" ")
          .includes(childOption.value.toString())
    )
  }

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
                          onClick={() =>
                            getIsFilterActive(option, childOption)
                              ? deselectFilter(option, childOption)
                              : selectFilter(option, childOption)
                          }
                          key={childOption.value}
                          variant="default"
                          size="sm"
                          className={clsx(
                            getIsFilterActive(option, childOption) &&
                              "bg-blue-400 text-white"
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
