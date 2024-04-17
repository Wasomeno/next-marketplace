"use client"

import React from "react"
import { getCategories } from "@/actions/categories"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useQuery } from "@tanstack/react-query"

import { DataFilter, DataFilterOption } from "@/components/data-filter"

export const ProductFilter = () => {
  const { data } = useQuery({
    queryKey: categoryQueryKeys.all(),
    queryFn: () => getCategories(),
  })

  const productFilterOptions: DataFilterOption[] = [
    {
      label: "Categories",
      value: "categories",
      isMultipleValues: true,
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

  return (
    <DataFilter
      filterOptions={productFilterOptions}
      placeholder="Select Filter"
    />
  )
}
