import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"

import { Option } from "../dropdown"
import { CheckBox } from "../ui/checkbox"
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "../ui/dropdown"
import { DataFilterOption, DataFilterProps } from "./"

export const DataFilterDesktop = ({
  filterOptions,
  disabled,
  placeholder,
}: DataFilterProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  const [activeParent, setActiveParent] = useState<string | null>()

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
    <Dropdown
      onOpenChange={(open) => {
        setIsOpen(open)
        setActiveParent(null)
      }}
    >
      <DropdownTrigger asChild>
        <button
          disabled={disabled}
          className="hidden h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900 lg:flex lg:h-10 lg:w-72 lg:justify-between"
        >
          <span
            className={clsx(
              "hidden lg:block",
              isActive ? "text-black" : "text-gray-400"
            )}
          >
            {isActive ? (
              <>
                Active Filters
                <span className="ml-2 text-sm font-medium text-blue-500">
                  {activeFilterAmount}
                </span>
              </>
            ) : (
              placeholder ?? "Select Filter"
            )}
          </span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className={clsx(
                "hidden text-slate-600 transition duration-300 dark:text-white lg:block",
                isOpen && "rotate-90"
              )}
            />
          </div>
        </button>
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent asChild>
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "0px" }}
              className="hidden w-72 flex-col overflow-hidden rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900 lg:flex"
            >
              {filterOptions.map((option) => (
                <DropdownMenu.Sub
                  open={activeParent === option.value}
                  key={option.value}
                >
                  <DropdownMenu.SubTrigger
                    onClick={() => {
                      activeParent === option.value
                        ? setActiveParent(null)
                        : setActiveParent(option.value as string)
                    }}
                    asChild
                  >
                    <div
                      className={clsx(
                        "flex cursor-pointer items-center gap-4 p-3 outline-0 ring-0 transition duration-200 dark:hover:bg-neutral-800"
                      )}
                    >
                      <span className="text-sm">{option.label}</span>
                    </div>
                  </DropdownMenu.SubTrigger>

                  <DropdownPortal>
                    <DropdownMenu.SubContent className="hidden w-72 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900 lg:flex">
                      {option.children.map((childOption) => (
                        <DropdownItem key={childOption.value} asChild>
                          <label
                            id={childOption.label}
                            className={clsx(
                              "flex cursor-pointer items-center gap-4 p-3 outline-0 ring-0 transition duration-200 dark:hover:bg-neutral-800"
                            )}
                          >
                            <CheckBox
                              id={childOption.label}
                              checked={getIsFilterActive(option, childOption)}
                              onCheckedChange={() =>
                                getIsFilterActive(option, childOption)
                                  ? deselectFilter(option, childOption)
                                  : selectFilter(option, childOption)
                              }
                            />
                            <span className="text-sm">{childOption.label}</span>
                          </label>
                        </DropdownItem>
                      ))}
                    </DropdownMenu.SubContent>
                  </DropdownPortal>
                </DropdownMenu.Sub>
              ))}
            </motion.div>
          </DropdownContent>
        )}
      </AnimatePresence>
    </Dropdown>
  )
}
