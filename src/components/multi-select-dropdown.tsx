"use client"

import { AnimatePresence, motion } from "framer-motion"
import React, { MouseEvent, useState } from "react"
import { HiChevronRight, HiXMark } from "react-icons/hi2"

import clsx from "clsx"
import { ImSpinner8 } from "react-icons/im"
import { Skeleton } from "./skeleton"
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./ui/dropdown"

export type Option = {
  label: string
  value: string | number
}

type Props = {
  onOptionsChange: (options: Option[]) => void
  options: Option[]
  placeholder?: string
  isLoading?: boolean
  defaultValue?: Option["value"][]
}

export const MultiSelectDropdown = ({
  onOptionsChange,
  options,
  placeholder,
  isLoading,
  defaultValue,
}: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Array<Option>>(
    !isLoading && !!defaultValue
      ? options.filter((option) => defaultValue?.includes(option.value))
      : []
  )
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  function selectOption(option: Option) {
    const newSelectedOptions = [...selectedOptions, option]
    setSelectedOptions(newSelectedOptions)
    onOptionsChange(newSelectedOptions)
  }

  function deselectOption(option: Option, event: MouseEvent) {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    const newSelectedOptions = selectedOptions.filter(
      (currentOption) => currentOption.value !== option.value
    )
    setSelectedOptions(newSelectedOptions)
    onOptionsChange(newSelectedOptions)
  }

  return (
    <Dropdown
      open={isOptionsOpen}
      modal={false}
      onOpenChange={(open) => setIsOptionsOpen(open)}
    >
      <DropdownTrigger asChild>
        <div className="flex w-full cursor-pointer items-center rounded-md border bg-white p-1.5 outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900">
          {!isLoading && selectedOptions.length > 0 ? (
            <div className="flex flex-1 flex-wrap gap-2">
              {selectedOptions.map((selectedOption) => (
                <div
                  key={selectedOption.value}
                  className="flex w-fit items-center justify-between overflow-hidden rounded-md border border-gray-200"
                >
                  <div className="flex justify-center gap-2 break-keep px-2.5 py-1.5 text-xs font-medium">
                    {selectedOption?.label}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => deselectOption(selectedOption, event)}
                    className="flex h-8 w-8 items-center justify-center border-l transition-all duration-200 hover:bg-gray-100 "
                  >
                    <HiXMark />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {selectedOptions.length < 1 && (
            <span className="text-sm text-gray-400 w-full">
              {placeholder ?? "Select item"}
            </span>
          )}

          {!isLoading && (
            <HiChevronRight
              size={14}
              className={clsx(
                "transition duration-300 mx-1.5",
                isOptionsOpen && "rotate-90"
              )}
            />
          )}
          {isLoading && (
            <ImSpinner8
              className="animate-spin text-gray-500 mx-1.5"
              size={14}
            />
          )}
        </div>
      </DropdownTrigger>
      <AnimatePresence>
        {isOptionsOpen && (
          <DropdownContent align="start" asChild sideOffset={6}>
            <motion.div
              initial={{ opacity: 0, translateY: "-5px", scale: 0.95 }}
              animate={{ opacity: 1, translateY: "0px", scale: 1 }}
              exit={{ opacity: 0, translateY: "-5px", scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring" }}
              style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
              className="z-[80] flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {isLoading &&
                Array(5)
                  .fill("")
                  .map((_, index) => (
                    <div key={index} className="px-3 w-full py-1.5">
                      <Skeleton className="h-6" />
                    </div>
                  ))}
              {!isLoading && !options?.length ? (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  No Options
                </div>
              ) : null}
              {!isLoading && options?.length
                ? options.map((option) => (
                    <DropdownItem key={option.value} asChild>
                      <button
                        onClick={() => selectOption(option)}
                        className="w-full px-3 py-2 text-start text-sm outline-0 ring-0 transition  duration-200 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-neutral-800"
                      >
                        {option.label}
                      </button>
                    </DropdownItem>
                  ))
                : null}
            </motion.div>
          </DropdownContent>
        )}
      </AnimatePresence>
    </Dropdown>
  )
}
