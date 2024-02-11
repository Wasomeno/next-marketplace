import { useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"

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
  activeFilters,
  onOptionClick,
  filterOptions,
  disabled,
  placeholder,
}: DataFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const [activeParent, setActiveParent] = useState<string | null>()

  const isActive =
    activeFilters &&
    activeFilters.some((filter) =>
      Object.values(filter).some((value) => value !== "")
    )

  const activeFilterAmount = activeFilters?.filter((filter) =>
    Object.values(filter).every((value) => value !== "")
  ).length

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
                              checked={activeFilters?.some(
                                (filter) =>
                                  filter[option.value as string] ===
                                  childOption.value
                              )}
                              onCheckedChange={() =>
                                onOptionClick(option, childOption)
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
