import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { use, useState } from "react"
import { BiChevronRight } from "react-icons/bi"
import { HiChevronRight } from "react-icons/hi2"

import { CheckBox } from "../ui/checkbox"
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "../ui/dropdown"
import { DataFilterProps } from "./"

export const DataFilterDesktop = ({
  filterOptions,
  disabled,
  placeholder,
}: DataFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isActive = filterOptions.some(
    (parentOption) => searchParams.get(parentOption.value as string) !== null
  )

  function getActiveFilterCount() {
    const activeOptions = filterOptions.filter(
      (parentOption) => searchParams.get(parentOption.value as string) !== null
    )

    return activeOptions.length
  }

  function getIsChildOptionActive(parentValue: string, childValue: string) {
    const filterParams = searchParams.get(parentValue)

    let splittedFilterParams: Array<string> = []

    if (filterParams !== null) {
      splittedFilterParams = filterParams.split(" ")
    }

    return splittedFilterParams.includes(childValue.toString())
  }

  function selectOption(parentValue: string, childValue: string) {
    const urlSearchParams = new URLSearchParams(searchParams)
    const filterParams = searchParams.get(parentValue)

    let splittedFilterParams: Array<string> = []

    if (filterParams !== null) {
      splittedFilterParams = filterParams.split(" ")
    }

    if (childValue !== "") {
      splittedFilterParams.push(childValue)
    }

    urlSearchParams.set(parentValue, splittedFilterParams.join(" "))

    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  function deselectOption(parentValue: string, childValue: string) {
    const urlSearchParams = new URLSearchParams(searchParams)
    const filterParams = searchParams.get(parentValue)

    let splittedFilterParams: Array<string> = []

    if (filterParams !== null) {
      splittedFilterParams = filterParams.split(" ")
    }

    const filteredFilterParams = splittedFilterParams.filter(
      (value) => value !== childValue.toString()
    )

    const joinedFilteredFilterParams = filteredFilterParams.join(" ")

    if (joinedFilteredFilterParams !== "") {
      urlSearchParams.set(parentValue, joinedFilteredFilterParams)
    } else {
      urlSearchParams.delete(parentValue)
    }

    router.replace(`${pathname}?${urlSearchParams.toString()}`, {
      scroll: false,
    })
  }

  return (
    <Dropdown
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DropdownTrigger asChild>
        <button
          disabled={disabled}
          className="hidden h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 disabled:opacity-80 dark:border-neutral-600 dark:bg-neutral-900 lg:flex lg:h-10 lg:w-72 lg:justify-between"
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
                  {getActiveFilterCount()}
                </span>
              </>
            ) : (
              placeholder ?? "Select Filter"
            )}
          </span>
          <div className="w-5">
            <HiChevronRight
              size={14}
              className={clsx(
                "hidden transition duration-300 lg:block",
                isOpen && "rotate-90"
              )}
            />
          </div>
        </button>
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent sideOffset={6} asChild>
            <motion.div
              initial={{ opacity: 0, translateY: "-5px", scale: 0.95 }}
              animate={{ opacity: 1, translateY: "0px", scale: 1 }}
              exit={{ opacity: 0, translateY: "-5px", scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="hidden w-72 p-1.5 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900 lg:flex"
            >
              {filterOptions.map((option) => (
                <DropdownMenu.Sub key={option.value}>
                  <DropdownMenu.SubTrigger asChild>
                    <button
                      className={clsx(
                        "w-full px-3 rounded-md py-1.5 text-start outline-0 ring-0 transition  duration-200 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-neutral-800"
                      )}
                    >
                      <span className="text-sm">{option.label}</span>
                    </button>
                  </DropdownMenu.SubTrigger>

                  <DropdownPortal>
                    <DropdownMenu.SubContent asChild sideOffset={6}>
                      <motion.div
                        initial={{ opacity: 0, translateX: "4px" }}
                        animate={{ opacity: 1, translateX: "6px" }}
                        exit={{ opacity: 0, translateX: "4px" }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                          type: "spring",
                        }}
                        className="hidden w-72 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900 lg:flex"
                      >
                        {option.children.map((childOption) => (
                          <DropdownItem key={childOption.value} asChild>
                            <div className="flex cursor-pointer items-center gap-4 p-3 outline-0 ring-0 transition duration-200 dark:hover:bg-neutral-800">
                              <CheckBox
                                id={childOption.label}
                                checked={getIsChildOptionActive(
                                  option.value as string,
                                  childOption.value as string
                                )}
                                className="w-[20px] h-[18px]"
                                onCheckedChange={() => {
                                  if (
                                    getIsChildOptionActive(
                                      option.value as string,
                                      childOption.value as string
                                    )
                                  ) {
                                    deselectOption(
                                      option.value as string,
                                      childOption.value as string
                                    )
                                  } else {
                                    selectOption(
                                      option.value as string,
                                      childOption.value as string
                                    )
                                  }
                                }}
                              />
                              <label
                                htmlFor={childOption.label}
                                className="w-full text-sm"
                              >
                                {childOption.label}
                              </label>
                            </div>
                          </DropdownItem>
                        ))}
                      </motion.div>
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
