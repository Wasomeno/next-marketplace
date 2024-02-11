"use client"

import React, { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { DataFilter } from "@/components/data-filter"
import { Option, OptionWithChild } from "@/components/dropdown"
import { getCategories } from "@/app/actions/categories"

export const ProductFilter = () => {
  const searchParams = useSearchParams()

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  })

  const productFilterOptions: OptionWithChild[] = [
    {
      label: "Categories",
      value: "categories",
      children: !data
        ? []
        : [
            { label: "All", value: "" },
            ...data.map((category) => ({
              label: category.name,
              value: category.id,
            })),
          ],
    },
    {
      label: "Status",
      value: "status",
      children: [
        { label: "All", value: "" },
        {
          label: "Published",
          value: "published",
        },
        {
          label: "Draft",
          value: "draft",
        },
      ],
    },
  ]

  const router = useRouter()
  const pathname = usePathname()

  function selectFilter(parentOption: Option, childOption: Option) {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    if (childOption.value === "") {
      newSearchParams.delete(parentOption.value as string)
    } else {
      newSearchParams.set(
        parentOption.value as string,
        childOption.value as string
      )
    }

    const url = `${pathname}?${newSearchParams.toString()}`

    router.replace(url)
  }

  return (
    <DataFilter
      filterOptions={productFilterOptions}
      onOptionClick={selectFilter}
      placeholder="Select Filter"
    />
  )
}
