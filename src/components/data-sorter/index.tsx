import { Option } from "../dropdown"
import { DataSorterDesktop } from "./data-sorter-desktop"
import { DataSorterMobile } from "./data-sorter-mobile"

export interface TableDataSorterProps {
  disabled?: boolean
  sortOptions: Option[]
}

export const DataSorter = (props: TableDataSorterProps) => {
  return (
    <>
      <DataSorterDesktop {...props} />
      <DataSorterMobile {...props} />
    </>
  )
}
