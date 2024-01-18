"use client"

import clsx from "clsx"
import { RxMagnifyingGlass } from "react-icons/rx"
import { twMerge } from "tailwind-merge"

import { Input } from "./ui/input"

interface TableSearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function TableSearchInput({
  className,
  ...props
}: TableSearchInputProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex h-8 w-full items-center rounded-md border bg-white p-1.5 lg:h-10 lg:w-96 dark:border-neutral-600 dark:bg-neutral-900",
          props.disabled && "opacity-70"
        )
      )}
    >
      <div
        className={clsx(
          "flex w-10 items-center justify-center",
          props.disabled && "opacity-50"
        )}
      >
        <RxMagnifyingGlass className="text-slate-400 dark:text-white" />
      </div>
      <Input
        type="text"
        className={twMerge(
          clsx(
            "h-auto w-full appearance-none border-none p-0 text-xs focus:border-0 focus-visible:ring-0 lg:text-base dark:bg-neutral-900",
            className
          )
        )}
        {...props}
      />
    </div>
  )
}
