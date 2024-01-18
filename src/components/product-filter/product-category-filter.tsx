"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Category } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"

import { getCategories } from "@/app/actions/admin/categories"

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

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  })

  const [category, setCategory] = useState<Category | undefined>()

  function selectCategory(category: Category) {
    setCategory(category)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("category", category?.id.toString() as string)
    const url = `${pathname}?${newParams.toString()}`
    setTimeout(() => router.push(url), 750)
  }

  useEffect(() => {
    if (searchParams.get("category") !== null && !categories.isLoading) {
      const activeCategory = categories.data?.find(
        (category) => category.id.toString() === searchParams.get("category")
      )
      setCategory(activeCategory)
    }
  }, [categories.isLoading])

  return (
    <div>
      <h6 className="mb-2 text-xs font-medium tracking-wide lg:text-sm">
        Categories
      </h6>
      {categories.isLoading && (
        <div className="h-10 w-52 animate-pulse rounded-md border bg-slate-200  outline-0 dark:border-gray-800 dark:bg-slate-800 " />
      )}
      {!categories.isLoading && (
        <Dropdown open={isOpen} onOpenChange={setIsOpen}>
          <DropdownTrigger asChild>
            <button className="block h-10 w-52 items-center justify-center rounded-md border bg-white px-3 text-start text-xs font-medium outline-0 lg:justify-between lg:text-sm dark:border-gray-800 dark:bg-slate-950">
              {category?.name ?? "Select Category"}
            </button>
          </DropdownTrigger>
          <AnimatePresence>
            {isOpen && (
              <DropdownContent asChild align="end">
                <motion.div
                  initial={{ height: "0px" }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: "0px" }}
                  className="z-[60] flex w-52 flex-col overflow-hidden rounded-md border bg-white text-sm shadow-sm lg:rounded-b-md lg:rounded-t-none lg:border-t-0 dark:border-gray-800 dark:bg-slate-950"
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
                      className="px-3 py-2  text-start text-xs font-medium outline-0 ring-0 transition  duration-200 hover:bg-slate-100 lg:text-sm hover:dark:bg-slate-800"
                    >
                      All Category
                    </button>
                  </DropdownItem>
                  {categories.data?.map((category) => (
                    <DropdownItem key={category.id} asChild>
                      <button
                        onClick={() => selectCategory(category)}
                        className="px-3 py-2  text-start text-xs font-medium outline-0 ring-0 transition  duration-200 hover:bg-slate-100 lg:text-sm hover:dark:bg-slate-800"
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
      )}
    </div>
  )
}
