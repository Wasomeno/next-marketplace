import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";

import { Option } from "../dropdown";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTrigger
} from "../responsive-dialog";
import { Button } from "../ui/button";
import { TableDataSorterProps } from "./";

export const DataSorterMobile = (props: TableDataSorterProps) => {
  const searchParams = useSearchParams()
  const activeSort = props.sortOptions?.find(
    (option) => option.value === searchParams.get("sort")
  )

  const [isOpen, setIsOpen] = useState(false)
  const [selectedSorting, setSelectedSorting] = useState<Option | null>(
    activeSort ?? null
  )

  const router = useRouter()
  const pathname = usePathname()

  function selectOption(option: Option) {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    setSelectedSorting(option)
    urlSearchParams.set("sort", option.value.toString())
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  function deselectOption() {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    setSelectedSorting(null)
    urlSearchParams.delete("sort")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <ResponsiveDialogTrigger asChild>
        <button
          disabled={props?.disabled}
          className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900 lg:hidden"
        >
          <div className="w-5">
            <HiArrowsUpDown
              size="16"
              className="text-slate-600 dark:text-white lg:hidden"
            />
          </div>
        </button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent open={isOpen} className="h-auto lg:hidden">
        <ResponsiveDialogHeader title="Sort Products" />
        <div className="flex flex-wrap items-center gap-2 p-4">
          {props.sortOptions.map((option) => (
            <Button
              key={option.value}
              variant="defaultOutline"
              onClick={() => {
                if (option.value === activeSort?.value) {
                  deselectOption()
                  return
                }
                selectOption(option)
              }}
              className={clsx(
                "shadow-sm",
                option.value === activeSort?.value &&
                  "bg-gray-100 lg:hover:bg-gray-100"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
