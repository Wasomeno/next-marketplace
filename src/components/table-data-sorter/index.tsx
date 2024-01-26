import { Option } from "../dropdown"
import { TableDataSorterDesktop } from "./table-data-sorter-desktop"
import { TableDataSorterMobile } from "./table-data-sorter-mobile"

export interface TableDataSorterProps {
  disabled?: boolean
  sortOptions: Option[]
}

export const TableDataSorter = (props: TableDataSorterProps) => {
  return (
    <>
      <TableDataSorterDesktop {...props} />
      <TableDataSorterMobile {...props} />
    </>
  )
}
