import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HiChevronRight, HiXMark } from "react-icons/hi2"
import { IoShirt } from "react-icons/io5"

import {
  DropdownContent,
  DropdownItem,
  Dropdown as DropdownRoot,
  DropdownTrigger,
} from "./ui/dropdown"

export type Option = {
  label: string
  value: string | number
}

interface BaseDropdownProps {
  options: Option[]
  placeholder?: string
  onOptionClick: (option: Option) => void
  isMulti?: boolean
}

interface MultipleProps extends BaseDropdownProps {
  isMulti: true
  selectedOptions: Option[]
  deselectOption: (option: Option) => void
}

interface SingleProps extends BaseDropdownProps {
  isMulti: false
  selectedOption?: Option
}

type DropdownProps = MultipleProps | SingleProps

export const Dropdown = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <DropdownRoot onOpenChange={(open) => setIsOpen(open)}>
      {props.isMulti && (
        <div className="flex max-h-96 min-h-12 w-full max-w-96 items-center rounded-md border bg-white text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900">
          {props?.selectedOptions !== undefined &&
          props.selectedOptions.length > 0 ? (
            <div className="flex flex-1 flex-wrap items-center gap-2 p-2">
              {props.selectedOptions.map((selectedOption) => (
                <div
                  key={selectedOption.value}
                  className="flex w-fit items-center justify-between overflow-hidden rounded-md border border-gray-200"
                >
                  <div className="flex justify-center gap-2 break-keep px-2.5 py-1.5 text-xs font-medium">
                    <IoShirt /> {selectedOption?.label}
                  </div>
                  <button
                    type="button"
                    onClick={() => props.deselectOption(selectedOption)}
                    className="flex h-8 w-8 items-center justify-center border-l transition-all duration-200 hover:bg-gray-100 "
                  >
                    <HiXMark />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {props.selectedOptions !== undefined &&
          props.selectedOptions.length < 1 ? (
            <div className="w-full p-2">
              <span className="w-full text-gray-400">
                {props.placeholder ?? "Select Option"}
              </span>
            </div>
          ) : null}
          <DropdownTrigger asChild>
            <button className="flex h-full w-10 items-center justify-center border-l border-gray-200">
              <HiChevronRight />
            </button>
          </DropdownTrigger>
        </div>
      )}
      {!props.isMulti && (
        <DropdownTrigger asChild>
          <div className="flex h-10 w-full max-w-96 items-center rounded-md border bg-white px-4 py-2 text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900">
            {props?.selectedOption !== undefined && props.selectedOption.label}
            {!props?.selectedOption && (
              <span className="text-gray-400">
                {props.placeholder ?? "Select Option"}
              </span>
            )}
          </div>
        </DropdownTrigger>
      )}
      <AnimatePresence>
        {isOpen && (
          <DropdownContent
            align={props.isMulti ? "end" : "start"}
            sideOffset={5}
            asChild
          >
            <motion.div
              initial={{ height: "0px" }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "0px" }}
              className="z-50 flex max-h-96 w-96 flex-col items-start overflow-hidden rounded-md border bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {props.options.map((option) => (
                <DropdownItem key={option.value} asChild>
                  <button
                    disabled={
                      (props.isMulti &&
                        props.selectedOptions.some(
                          (selectedOption) =>
                            selectedOption.value === option.value
                        )) ||
                      (!props.isMulti &&
                        props.selectedOption?.value === option.value)
                    }
                    onClick={() => props.onOptionClick(option)}
                    className="w-full px-3 py-2 text-start outline-0 ring-0 transition  duration-200 hover:bg-blue-100 disabled:opacity-50 dark:hover:bg-neutral-800"
                  >
                    {option.label}
                  </button>
                </DropdownItem>
              ))}
            </motion.div>
          </DropdownContent>
        )}
      </AnimatePresence>
    </DropdownRoot>
  )
}
