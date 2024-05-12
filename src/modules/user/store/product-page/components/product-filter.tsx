"use client"

import React from "react"
import { getCategories } from "@/actions/categories"
import { categoryQueryKeys } from "@/modules/user/common/queryKeys/categoryQueryKeys"
import { useQuery } from "@tanstack/react-query"

import {
  DataFilter,
  DataFilterOption,
  DataFilterProps,
} from "@/components/data-filter"

export const ProductFilter = (props: Pick<DataFilterProps, "disabled">) => {
  const categories = useQuery({
    queryKey: categoryQueryKeys.all().baseKey,
    queryFn: () => getCategories(),
  })

  const productFilterOptions: DataFilterOption[] = [
    {
      label: "Categories",
      value: "categories",
      isMultipleValues: true,
      children: !categories.data
        ? []
        : categories.data.map((category) => ({
            label: category.name,
            value: category.id,
          })),
    },
    {
      label: "Status",
      value: "status",
      children: [
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
      {...props}
      filterOptions={productFilterOptions}
      placeholder="Select Filter"
    />
  )
}
