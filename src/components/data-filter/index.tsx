"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { Option, OptionWithChild } from "../dropdown"
import { DataFilterDesktop } from "./data-filter-desktop"
import { DataFilterMobile } from "./data-filter-mobile"

export type DataFilterProps = {
  activeFilters?: Record<string, string>[]
  disabled?: boolean
  onOptionClick: (parentOption: Option, childOption: Option) => void
  placeholder?: string
  filterOptions: OptionWithChild[]
}

export const DataFilter = (props: DataFilterProps) => {
  const searchParams = useSearchParams()

  const [activeFilters, setActiveFilters] =
    useState<Record<string, string>[]>(getActiveFilters())

  function getActiveFilters() {
    const activeFilters = props.filterOptions.map((option) => ({
      [option.value as string]: searchParams.get(option.value as string) ?? "",
    }))

    return activeFilters
  }

  function selectFilter(parentOption: Option, childOption: Option) {
    setActiveFilters((current) => {
      const foundFilter = current.findIndex((filter) =>
        Object.keys(filter).includes(parentOption.value as string)
      )

      current[foundFilter] = {
        [parentOption.value as string]: childOption.value as string,
      }

      return current
    })
  }

  return (
    <>
      <DataFilterDesktop
        {...props}
        activeFilters={activeFilters}
        onOptionClick={(parentOption, childOption) => {
          selectFilter(parentOption, childOption)
          props.onOptionClick(parentOption, childOption)
        }}
      />
      <DataFilterMobile
        {...props}
        activeFilters={activeFilters}
        onOptionClick={(parentOption, childOption) => {
          selectFilter(parentOption, childOption)
          props.onOptionClick(parentOption, childOption)
        }}
      />
    </>
  )
}
