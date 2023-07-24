import { BiChevronRight } from "react-icons/bi";
import { HiArrowsUpDown } from "react-icons/hi2";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";

export interface ProductSort {
  id: number;
  text: string;
  sort: {};
}

interface ProductSorterProps {
  productSort: ProductSort;
  setProductSort: (sort: ProductSort) => void;
}

const sorts: ProductSort[] = [
  {
    id: 1,
    text: "Price low to high",
    sort: { price: "asc" },
  },
  {
    id: 2,
    text: "Price high to low",
    sort: { price: "desc" },
  },
];

export function ProductSorter({
  productSort,
  setProductSort,
}: ProductSorterProps) {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 lg:h-10 lg:w-52 lg:justify-between">
          <span className="hidden lg:block">{productSort?.text}</span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="hidden text-slate-600 lg:block"
            />
            <HiArrowsUpDown size="16" className="text-slate-600 lg:hidden" />
          </div>
        </button>
      </DropdownTrigger>
      <DropdownContent
        side="bottom"
        sideOffset={-3}
        className="flex w-52 flex-col rounded-b-md border border-t-0 bg-white text-sm shadow-sm"
      >
        {sorts.map((sort) => (
          <DropdownItem key={sort.id} asChild>
            <button
              onClick={() => {
                setProductSort(sort);
              }}
              className="px-3 py-2 text-start outline-0 ring-0  transition duration-200 hover:bg-blue-100"
            >
              {sort.text}
            </button>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

export function ProductSorterSkeleton() {
  return (
    <Dropdown>
      <DropdownTrigger asChild disabled>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 lg:h-10 lg:w-52 lg:justify-between">
          <div className="h-6 w-32 animate-pulse rounded-md bg-slate-300" />
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="hidden text-slate-600 lg:block"
            />
            <HiArrowsUpDown size="16" className="text-slate-600 lg:hidden" />
          </div>
        </button>
      </DropdownTrigger>
    </Dropdown>
  );
}
