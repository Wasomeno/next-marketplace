import { memo } from "react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

import { getCategories } from "@/app/actions/admin/categories"

interface CategoryScrollableListProps {
  selectedCategory: number
  selectCategory: (id: number) => void
}

export function CategoryPicker({
  selectedCategory,
  selectCategory,
}: CategoryScrollableListProps) {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  })

  const skeletons = Array(5).fill("")
  if (categories.isLoading) {
    return (
      <div className="h-72 w-full overflow-hidden rounded-md border dark:border-neutral-600">
        <div className="h-full w-full bg-white dark:bg-neutral-800">
          {skeletons.map((empty, index) => (
            <div
              key={index}
              className="w-full border-b px-3 py-2 dark:border-b-neutral-600 dark:bg-neutral-800"
            >
              <div className="h-5 w-3/6 animate-pulse rounded-md bg-slate-300 dark:bg-neutral-600" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ScrollArea.Root className="h-72 w-full overflow-hidden rounded-md border dark:border-neutral-600">
      <ScrollArea.Viewport className="h-full w-full bg-white dark:bg-neutral-800">
        {categories.data?.map((category) => (
          <div
            key={category.id}
            onClick={() => selectCategory(category.id)}
            className={twMerge(
              clsx(
                "w-full cursor-pointer border-b px-3 py-2 text-sm tracking-wide transition duration-200 hover:bg-blue-100 dark:border-b-neutral-600 dark:bg-neutral-800",
                selectedCategory === category.id &&
                  "bg-blue-100 dark:bg-blue-900"
              )
            )}
          >
            {category.name}
          </div>
        ))}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex transition duration-150"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="relative flex" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
