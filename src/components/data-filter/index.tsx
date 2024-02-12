"use client"

import { Option, OptionWithChild } from "../dropdown"
import { DataFilterDesktop } from "./data-filter-desktop"
import { DataFilterMobile } from "./data-filter-mobile"

export type DataFilterOption = OptionWithChild & {
  isMultipleValues?: boolean
}

export type DataFilterProps = {
  activeFilters?: Record<string, string>[]
  disabled?: boolean
  placeholder?: string
  filterOptions: DataFilterOption[]
}

export const DataFilter = (props: DataFilterProps) => {
  return (
    <>
      <DataFilterDesktop {...props} />
      <DataFilterMobile {...props} />
    </>
  )
}
