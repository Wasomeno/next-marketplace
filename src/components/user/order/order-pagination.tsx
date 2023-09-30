"use client"

import { useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export function OrderPagination({ count }: { count: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activePage = searchParams.get("page")
  const pageArray = Array(Math.ceil(count / 5))
    .fill("")
    .map((value, index) => (index + 1).toString())

  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      {pageArray.map((value) => (
        <button
          onClick={() => {
            const newSearchParams = new URLSearchParams(searchParams.toString())
            value === "1"
              ? newSearchParams.delete("page")
              : newSearchParams.set("page", value)
            router.push(`${location.pathname}?${newSearchParams.toString()}`)
          }}
          key={value}
          className={twMerge(
            clsx(
              "text-sm font-medium lg:text-base",
              activePage === value || (value === "1" && activePage === null)
                ? "font-semibold text-blue-400"
                : ""
            )
          )}
        >
          {value}
        </button>
      ))}
    </div>
  )
}
