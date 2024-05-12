"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "../skeleton"
import { CheckBox } from "../ui/checkbox"

export function ProductCategoryFilter() {
  const searchParams = useSearchParams()

  const [categoryIds, setCategoryIds] = useState<number[]>(
    getActiveCategories()
  )

  const pathname = usePathname()
  const router = useRouter()

  const { data: categories, isLoading } = useQuery({
    queryKey: categoryQueryKeys.all().baseKey,
    queryFn: () => getCategories(),
  })

  function getActiveCategories() {
    const categories = searchParams.get("categories")

    if (categories) {
      return categories.length > 1
        ? categories.split(" ").map((categoryId) => parseInt(categoryId))
        : [parseInt(categories)]
    }
    return []
  }

  function selectCategory(categoryId: number) {
    const currentCategoryIds = [...categoryIds, categoryId]
    setCategoryIds(currentCategoryIds)

    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("categories", currentCategoryIds.join(" "))

    const url = `${pathname}?${newParams.toString()}`

    router.replace(url)
  }

  function deselectCategory(categoryId: number) {
    const filteredCategoryIds = categoryIds.filter((id) => id !== categoryId)
    setCategoryIds(filteredCategoryIds)
    const newParams = new URLSearchParams(searchParams.toString())

    if (filteredCategoryIds.length < 1) {
      newParams.delete("categories")
    } else {
      newParams.set("categories", filteredCategoryIds.join(" "))
    }

    const url = `${pathname}?${newParams.toString()}`

    router.replace(url)
  }

  const skeletons = Array(5).fill(
    <div className="flex cursor-pointer items-center gap-4 py-2">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-[16px] w-32" />
    </div>
  )

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium lg:text-base">Categories</span>
      {isLoading && skeletons}
      {!isLoading &&
        categories?.map((category) => (
          <label
            id={category.slug}
            key={category.id}
            className="flex cursor-pointer items-center gap-2 py-2 lg:gap-4"
          >
            <CheckBox
              checked={categoryIds.includes(category.id)}
              onCheckedChange={() =>
                categoryIds.includes(category.id)
                  ? deselectCategory(category.id)
                  : selectCategory(category.id)
              }
              id={category.slug}
            />
            <span className="text-xs lg:text-sm"> {category.name}</span>
          </label>
        ))}
    </div>
  )
}
