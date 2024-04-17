import React, { useState } from "react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { FaCircleXmark } from "react-icons/fa6"
import { HiChevronRight, HiXMark } from "react-icons/hi2"
import { IoList, IoShirt } from "react-icons/io5"
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

interface BaseDropdownProps {
  options?: Option[] | null | undefined
  placeholder?: string
  onOptionClick?: (option: Option) => void
  isMulti?: boolean
  isLoading?: boolean
  className?: string
}

interface MultipleProps extends BaseDropdownProps {
  isMulti: true
  selectedOptions?: Option[]
  deselectOption?: (option: Option) => void
}

interface SingleProps extends BaseDropdownProps {
  isMulti: false
  selectedOption?: Option
  deselectOption?: () => void
}

type DropdownProps = MultipleProps | SingleProps

export const Dropdown = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownRoot open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <div
        className={clsx(
          twMerge(
            "relative flex min-h-10 w-48 items-center rounded-md border bg-white outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900",
            props.className
          )
        )}
      >
        {props.isMulti && (
          <>
            <DropdownTrigger className="z-5 absolute h-full w-full" />
            <div className="z-10 flex flex-1">
              {props?.selectedOptions !== undefined &&
                props.selectedOptions.length > 0 && (
                  <div
                    className="flex flex-1 flex-wrap items-center gap-2 p-1.5"
                    onClick={() => setIsOpen(!isOpen)}
                  >
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
                          onClick={() =>
                            props.deselectOption &&
                            props?.deselectOption(selectedOption)
                          }
                          className="z-50 flex h-8 w-8 items-center justify-center border-l transition-all duration-200 hover:bg-gray-100 "
                        >
                          <HiXMark />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              {props.selectedOptions !== undefined &&
                props.selectedOptions.length < 1 && (
                  <div
                    className="w-full p-2"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="w-full text-sm text-gray-400">
                      {props.placeholder ?? "Select Option"}
                    </span>
                  </div>
                )}
            </div>
            <button
              type="button"
              className="flex h-full w-10 items-center justify-center border-l border-gray-200 transition duration-300"
            >
              <HiChevronRight
                className={clsx(
                  "transition duration-300",
                  isOpen && "rotate-90"
                )}
              />
            </button>
          </>
        )}
        {!props.isMulti && (
          <>
            <DropdownTrigger asChild>
              <div className="flex w-full items-center py-2 pl-3 text-sm">
                {props?.selectedOption !== undefined &&
                  props.selectedOption.label}
                {!props?.selectedOption && (
                  <span className="text-gray-400">
                    {props.placeholder ?? "Select Option"}
                  </span>
                )}
              </div>
            </DropdownTrigger>
            {props.selectedOption !== undefined && props.deselectOption ? (
              <button
                type="button"
                onClick={props?.deselectOption}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 transition-all duration-200 hover:text-gray-800"
              >
                <FaCircleXmark size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                  "px-3 transition duration-300",
                  isOpen && "rotate-90"
                )}
              >
                <HiChevronRight size={14} />
              </button>
            )}
          </>
        )}
        <AnimatePresence>
          {isOpen && (
            <DropdownContent align="start" sideOffset={5} asChild>
              <motion.div
                initial={{ height: "0px" }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: "0px" }}
                className="z-[80] flex max-h-48 w-48 flex-col items-start overflow-y-scroll rounded-md border bg-white text-sm shadow-sm dark:border-neutral-600 dark:bg-neutral-900"
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
                        disabled={
                          (props.isMulti &&
                            props?.selectedOptions?.some(
                              (selectedOption) =>
                                selectedOption.value === option.value
                            )) ||
                          (!props.isMulti &&
                            props.selectedOption?.value === option.value)
                        }
                        onClick={() =>
                          props.onOptionClick && props.onOptionClick(option)
                        }
                        className="w-full px-3 py-2 text-start outline-0 ring-0 transition  duration-200 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-neutral-800"
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
