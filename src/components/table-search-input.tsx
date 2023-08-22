"use client"

import clsx from "clsx"
import { RxMagnifyingGlass } from "react-icons/rx"

import { Input } from "./ui/input"

export function TableSearchInput({
  disabled,
  onChange = () => {},
  placeholder,
}: {
  disabled?: boolean
  onChange?: (value: string) => void
  placeholder?: string
}) {
  return (
    <div
      className={clsx(
        "flex h-8 w-40 items-center rounded-md border bg-white p-1.5 dark:border-neutral-600 dark:bg-neutral-900 lg:h-10 lg:w-96",
        disabled && "opacity-50"
      )}
    >
      <div className="flex w-10 items-center justify-center">
        <RxMagnifyingGlass className="text-slate-400 dark:text-white" />
      </div>
      <Input
        type="text"
        onChange={(event) => {
          onChange(event.target.value)
        }}
        className="h-auto w-full appearance-none border-none p-0 text-xs focus:border-0 focus-visible:ring-0 dark:bg-neutral-900 lg:text-base"
        placeholder={placeholder}
      />
    </div>
  )
}
