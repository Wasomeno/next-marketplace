"use client"

import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import { FaCircleXmark } from "react-icons/fa6"
import { HiChevronRight } from "react-icons/hi2"
import { IoList } from "react-icons/io5"
import { twMerge } from "tailwind-merge"

import { NoData } from "./no-data"
import { Skeleton } from "./skeleton"
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

export type OptionWithChild = Option & {
  children: Option[]
}

interface TDropdownProps extends DropdownMenuTriggerProps {
  options?: Option[] | null | undefined
  placeholder?: string
  onOptionClick?: (option: Option) => void
  selectedOption?: Option
  deselectOption?: () => void
  isLoading?: boolean
  className?: string
}

export const Dropdown = (props: TDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownRoot open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <div
        className={twMerge(
          clsx(
            "relative flex items-center min-w-72 rounded-md border bg-white outline-0  dark:border-neutral-600 dark:bg-neutral-900",
            props.className,
            props.disabled
              ? "cursor-not-allowed opacity-80"
              : "cursor-pointer opacity-100"
          )
        )}
      >
        <DropdownTrigger asChild>
          <div className="flex w-full items-center py-2 pl-3 text-xs lg:text-sm">
            {props?.selectedOption !== undefined && props.selectedOption.label}
            {!props?.selectedOption && (
              <span className="text-gray-400">
                {props.placeholder ?? "Select Option"}
              </span>
            )}
          </div>
        </DropdownTrigger>
        <button
          type="button"
          onClick={props?.deselectOption}
          className={clsx(
            "absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 transition-all duration-200 hover:text-gray-800",
            props.selectedOption !== undefined && props.deselectOption
              ? "inline"
              : "hidden"
          )}
        >
          <FaCircleXmark size={16} />
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "px-3 transition duration-300",
            props.selectedOption !== undefined && props.deselectOption
              ? "hidden"
              : "inline",
            isOpen && "rotate-90"
          )}
        >
          <HiChevronRight size={14} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <DropdownContent align="start" sideOffset={6} asChild>
              <motion.div
                initial={{ opacity: 0, translateY: "-5px", scale: 0.95 }}
                animate={{ opacity: 1, translateY: "0px", scale: 1 }}
                exit={{ opacity: 0, translateY: "-5px", scale: 0.95 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="z-[80] w-72 p-1.5 gap-1 flex max-h-48 flex-col items-start overflow-y-scroll rounded-md border bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
              >
                {props.isLoading &&
                  Array(5)
                    .fill("")
                    .map((_, index) => (
                      <div key={index} className=" px-3 py-2">
                        <Skeleton className="h-6 w-36" />
                      </div>
                    ))}
                {!props.isLoading &&
                  props.options &&
                  props.options?.map((option) => (
                    <DropdownItem key={option.value} asChild>
                      <button
                        type="button"
                        onClick={() =>
                          props.onOptionClick && props.onOptionClick(option)
                        }
                        className="w-full px-3 rounded-md py-1.5 text-start outline-0 ring-0 transition  duration-200 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-neutral-800"
                      >
                        {option.label}
                      </button>
                    </DropdownItem>
                  ))}
                {!props.isLoading && !props.options && (
                  <div className="flex h-48 w-full items-center justify-center">
                    <NoData text="No Options" icon={<IoList size={24} />} />
                  </div>
                )}
              </motion.div>
            </DropdownContent>
          )}
        </AnimatePresence>
      </div>
    </DropdownRoot>
  )
}
