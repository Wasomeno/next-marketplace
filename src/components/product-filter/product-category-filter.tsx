"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Category } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { BiChevronRight } from "react-icons/bi"
import { HiArrowsUpDown } from "react-icons/hi2"

import { getCategories } from "@/app/actions/categories"

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../ui/dropdown"

export function ProductCategoryFilter() {
  const [isOpen, setIsOpen] = useState(false)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const categories = useQuery(["categories"], () => getCategories())

  const activeCategory = categories.data?.find(
    (category) => category.id.toString() === searchParams.get("category")
  )

  const [category, setCategory] = useState<Category | undefined>(activeCategory)

  function selectCategory(category: Category) {
    setCategory(category)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("category", category?.id.toString() as string)
    const url = `${pathname}?${newParams.toString()}`
    setTimeout(() => router.push(url), 750)
  }

  return (
    <div>
      <h6 className="mb-2 text-xs font-medium tracking-wide lg:text-sm">
        Categories
      </h6>
      <Dropdown open={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 dark:border-gray-800 dark:bg-slate-950 lg:h-10 lg:w-52 lg:justify-between">
            <span className="hidden font-medium lg:block">
              {category?.name ?? "Select Category"}
            </span>
            <div className="w-5">
              <BiChevronRight
                size="20"
                className="hidden text-slate-600 dark:text-white lg:block"
              />
              <HiArrowsUpDown
                size="16"
                className="text-slate-600 dark:text-white lg:hidden"
              />
            </div>
          </button>
        </DropdownTrigger>
        <AnimatePresence>
          {isOpen && (
            <DropdownContent asChild align="end">
              <motion.div
                initial={{ height: "0px" }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: "0px" }}
                className="z-[60] flex w-52 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm dark:border-gray-800 dark:bg-slate-950 lg:rounded-b-md lg:rounded-t-none lg:border-t-0"
              >
                <DropdownItem asChild>
                  <button
                    onClick={() => {
                      setCategory(undefined)
                      const newSearchParams = new URLSearchParams(
                        searchParams.toString()
                      )
                      newSearchParams.delete("category")
                      router.replace(
                        `${pathname}?${newSearchParams.toString()}`
                      )
                    }}
                    className="px-3 py-2  text-start text-xs font-medium outline-0 ring-0 transition  duration-200 hover:bg-slate-100 hover:dark:bg-slate-800 lg:text-sm"
                  >
                    All Category
                  </button>
                </DropdownItem>
                {categories.data?.map((category) => (
                  <DropdownItem key={category.id} asChild>
                    <button
                      onClick={() => selectCategory(category)}
                      className="px-3 py-2  text-start text-xs font-medium outline-0 ring-0 transition  duration-200 hover:bg-slate-100 hover:dark:bg-slate-800 lg:text-sm"
                    >
                      {category.name}
                    </button>
                  </DropdownItem>
                ))}
              </motion.div>
            </DropdownContent>
          )}
        </AnimatePresence>
      </Dropdown>
    </div>
  )
}
