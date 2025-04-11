"use client"

import { useSearchParamsValues } from "@/utils"
import { usePathname, useRouter } from "next/navigation"
import React, { ChangeEvent, useRef } from "react"
import { RxMagnifyingGlass } from "react-icons/rx"

import { time } from "console"
import { Input } from "@/components/ui/input"

export const OrderSearchInput = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParamsValues = useSearchParamsValues<{
    status: string
    search: string
  }>()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const value = event.target.value
    const searchParams = new URLSearchParams(searchParamsValues)
    if (value !== "") {
      searchParams.set("search", event.target.value)
    } else {
      searchParams.delete("search")
    }

    timeoutRef.current = setTimeout(
      () => router.replace(`${pathname}?${searchParams.toString()}`),
      750
    )
  }

  return (
    <div className="flex h-8  items-center rounded-md border bg-white p-1.5 dark:border-gray-800 dark:bg-slate-950 lg:h-10">
      <div className="flex w-10 items-center justify-center">
        <RxMagnifyingGlass className="text-slate-400" />
      </div>
      <Input
        type="text"
        className="h-auto w-32 border-none p-0 text-xs focus-visible:ring-0 dark:bg-slate-950 lg:w-96 lg:text-sm"
        placeholder="Search orders"
        onChange={onChange}
      />
    </div>
  )
}
