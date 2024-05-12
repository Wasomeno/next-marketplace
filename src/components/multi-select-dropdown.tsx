"use client"

import React, { MouseEvent, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HiXMark } from "react-icons/hi2"

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
}

export const MultiSelectDropdown = ({
  onOptionsChange,
  options,
  placeholder,
}: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Array<Option>>([])
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  function selectOption(option: Option) {
    const newSelectedOptions = [...selectedOptions, option]
    setSelectedOptions(newSelectedOptions)
    onOptionsChange(newSelectedOptions)
  }

  function deselectOption(option: Option, event: MouseEvent) {
    // TODO: FIND A WAY TO TRIGGER EVENT PROPAGATION
    event.stopPropagation()
    const newSelectedOptions = selectedOptions.filter(
      (currentOption) => currentOption.value !== option.value
    )
    setSelectedOptions(newSelectedOptions)
    onOptionsChange(newSelectedOptions)
  }

  return (
    <Dropdown
      open={isOptionsOpen}
      onOpenChange={(open) => setIsOptionsOpen(open)}
    >
      <DropdownTrigger asChild>
        <div className="flex w-full rounded-md border bg-white px-3 py-2 outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900">
          {selectedOptions.length > 0 && (
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
          )}
          {selectedOptions.length < 1 && (
            <span className="text-sm text-gray-400">
              {placeholder ?? "Select item"}
            </span>
          )}
        </div>
      </DropdownTrigger>
      <AnimatePresence>
        {isOptionsOpen && (
          <DropdownContent align="start" asChild sideOffset={6}>
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "120px", opacity: 1 }}
              exit={{ height: "0px" }}
              className="z-[80] flex w-96 flex-col overflow-hidden rounded-lg border bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {!options?.length && (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  No Options
                </div>
              )}
              {options?.length &&
                options.map((option) => (
                  <DropdownItem key={option.value} asChild>
                    <button
                      onClick={() => selectOption(option)}
                      className="w-full px-3 py-2 text-start text-sm outline-0 ring-0 transition  duration-200 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-neutral-800"
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
  )
}
