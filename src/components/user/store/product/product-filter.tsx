"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"

import { DataFilter, DataFilterOption } from "@/components/data-filter"
import { getCategories } from "@/app/actions/categories"

export const ProductFilter = () => {
  const { data } = useQuery({
    queryKey: ["categories"],
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
