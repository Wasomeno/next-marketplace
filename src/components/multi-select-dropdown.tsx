"use client"

import React, { useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"
import { HiXMark } from "react-icons/hi2"
import { IoShirt } from "react-icons/io5"

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
  onSelect: (option: Option) => void
  selectedOptions: Option[]
  options: Option[]
  placeholder?: string
}

export const MultiSelectDropdown = ({
  onSelect,
  options,
  selectedOptions,
  placeholder,
}: Props) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  return (
    <Dropdown onOpenChange={(open) => setIsOptionsOpen(open)}>
      <DropdownTrigger asChild>
        <div className="flex max-h-96 w-full max-w-96 rounded-md border bg-white text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900">
          {selectedOptions.length > 0 && (
            <div className="flex flex-1 flex-wrap items-center gap-2 p-2">
              {selectedOptions.map((selectedOption) => (
                <div
                  key={selectedOption.value}
                  className="flex w-fit items-center justify-between overflow-hidden rounded-md border border-gray-200"
                >
                  <div className="flex justify-center gap-2 break-keep px-2.5 py-1.5 text-xs font-medium">
                    <IoShirt /> {selectedOption?.label}
                  </div>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center border-l transition-all duration-200 hover:bg-gray-100 "
                  >
                    <HiXMark />
                  </button>
                </div>
              ))}
            </div>
          )}
          {selectedOptions.length < 1 && (
            <span className="text-gray-400">
              {placeholder ?? "Select item"}
            </span>
          )}
        </div>
      </DropdownTrigger>
      <AnimatePresence>
        {isOptionsOpen && (
          <DropdownContent align="start" asChild>
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "0px" }}
              className="flex max-h-96 w-96 flex-col overflow-hidden rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {options.map((option) => (
                <DropdownItem key={option.value} asChild>
                  <button
                    onClick={() => onSelect(option)}
                    className="w-full px-3 py-2 text-start outline-0 ring-0  transition duration-200 hover:bg-blue-100 dark:hover:bg-neutral-800"
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
