import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown"

import { Option } from "../dropdown"
import { TableDataSorterProps } from "./"

export const DataSorterDesktop = ({
  disabled,
  sortOptions,
}: TableDataSorterProps) => {
  const searchParams = useSearchParams()
  const activeSort = sortOptions?.find(
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
    <>
      <Dropdown onOpenChange={(open) => setIsOpen(open)}>
        <DropdownTrigger asChild>
          <button
            disabled={disabled}
            className="hidden h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 disabled:opacity-50 lg:flex lg:h-10 lg:w-72 lg:justify-between dark:border-neutral-600 dark:bg-neutral-900"
          >
            <span
              className={clsx(
                "hidden lg:block",
                selectedSorting ? "text-black" : "text-gray-400"
              )}
            >
              {selectedSorting?.label ?? "Select Sorting"}
            </span>
            <div className="w-5">
              <BiChevronRight
                size="20"
                className={clsx(
                  "hidden text-slate-600 transition duration-300 lg:block dark:text-white",
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
                className="hidden w-72 flex-col overflow-hidden rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm lg:flex dark:border-neutral-600 dark:bg-neutral-900"
              >
                {sortOptions.map((option) => (
                  <DropdownItem key={option.value} asChild>
                    <button
                      onClick={() => {
                        if (option.value === activeSort?.value) {
                          deselectOption()
                          return
                        }
                        selectOption(option)
                      }}
                      className={clsx(
                        "hidden px-3 py-2 text-start outline-0 ring-0 transition  duration-200 lg:inline-block dark:hover:bg-neutral-800",
                        option.value === activeSort?.value
                          ? "bg-blue-100 hover:bg-blue-100"
                          : "hover:bg-blue-100"
                      )}
                    >
                      {option.label}
                    </button>
                  </DropdownItem>
                ))}
              </motion.div>
            </DropdownContent>
          )}
        </AnimatePresence>
      </Dropdown>
    </>
  )
}
