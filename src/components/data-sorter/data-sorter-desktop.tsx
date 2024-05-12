import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Dropdown, Option } from "../dropdown"
import { TableDataSorterProps } from "./"

export const DataSorterDesktop = ({
  disabled,
  sortOptions,
}: TableDataSorterProps) => {
  const searchParams = useSearchParams()
  const activeSort = sortOptions?.find(
    (option) => option.value === searchParams.get("sort")
  )

  const [selectedSorting, setSelectedSorting] = useState<Option | undefined>(
    activeSort
  )

  const router = useRouter()
  const pathname = usePathname()

  function selectOption(option: Option) {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    setSelectedSorting(option)
    urlSearchParams.set("sort", option.value.toString())
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  function deselectOption() {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    setSelectedSorting(undefined)
    urlSearchParams.delete("sort")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  return (
    <Dropdown
      disabled={disabled}
      options={sortOptions}
      deselectOption={deselectOption}
      selectedOption={selectedSorting}
      onOptionClick={selectOption}
      placeholder="Select Sorting"
      className="hidden w-48 lg:flex"
    />
  )
}
