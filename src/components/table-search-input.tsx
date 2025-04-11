"use client"

import clsx from "clsx"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useEffect, useRef } from "react"
import { RxMagnifyingGlass } from "react-icons/rx"
import { twMerge } from "tailwind-merge"

import { Input } from "./ui/input"

interface TableSearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const TableSearchInput = ({
  className,
  ...props
}: TableSearchInputProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  function search(event: ChangeEvent<HTMLInputElement>) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const searchParamsInstance = new URLSearchParams(searchParams.toString())
    if (event.target.value !== "") {
      searchParamsInstance.set("search", event.target.value)
    } else {
      searchParamsInstance.delete("search")
    }

    timeoutRef.current = setTimeout(
      () => router.replace(`${pathname}?${searchParamsInstance.toString()}`),
      750
    )
  }

  return (
    <div
      className={twMerge(
        clsx(
          "flex h-8 w-44 items-center rounded-md border border-gray-200 bg-white lg:h-10 lg:w-96",
          props.disabled && "opacity-80"
        )
      )}
    >
      <div className="flex w-10 items-center justify-center">
        <RxMagnifyingGlass className="text-slate-400 dark:text-white" />
      </div>
      <Input
        type="text"
        placeholder="Search Data"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={search}
        className={twMerge(
          clsx(
            "h-auto w-full appearance-none border-none p-0 text-xs focus:border-0 focus-visible:ring-0 dark:bg-neutral-900 lg:text-sm",
            className
          )
        )}
        {...props}
      />
    </div>
  )
}
