import { ProductSorterMain } from "./product-sorter-main"
import { ProductSorterMobile } from "./product-sorter-mobile"

export interface ProductSortOption {
  id: number
  label: string
  value: string
}

const sortOptions: ProductSortOption[] = [
  {
    id: 1,
    label: "Price low to high",
    value: "price.asc",
  },
  {
    id: 2,
    label: "Price high to low",
    value: "price.desc",
  },
  {
    id: 3,
    label: "Name from A to Z",
    value: "name.asc",
  },
  {
    id: 4,
    label: "Name from Z to A",
    value: "name.desc",
  },
]

export function ProductSorter() {
  return (
    <>
      <ProductSorterMain sortOptions={sortOptions} />
      <ProductSorterMobile sortOptions={sortOptions} />
    </>
  )
}
