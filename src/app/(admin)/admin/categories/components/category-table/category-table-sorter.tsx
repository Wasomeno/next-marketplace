import { useEffect, useMemo } from "react";
import { BiChevronRight } from "react-icons/bi";
import { HiArrowsUpDown } from "react-icons/hi2";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { Category } from "@prisma/client";
import { Table } from "@tanstack/react-table";

export interface CategoryTableSort {
  id: number;
  text: string;
  onClick(): void;
}

interface CategoryTableSorterProps {
  table: Table<Category>;
  selectedSorting: CategoryTableSort;
  selectSorting: (sort: CategoryTableSort) => void;
}

export const CategoryTableSorter = ({
  table,
  selectedSorting,
  selectSorting,
}: CategoryTableSorterProps) => {
  const sortings = useMemo(
    () => [
      {
        id: 1,
        text: "Id from low to high",
        onClick() {
          table.getColumn("id")?.toggleSorting(false);
        },
      },
      {
        id: 2,
        text: "Id from high to low",
        onClick() {
          table.getColumn("id")?.toggleSorting(true);
        },
      },
    ],
    []
  );

  useEffect(() => {
    selectSorting(sortings[0]);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-white px-3 text-sm outline-0 lg:h-10 lg:w-72 lg:justify-between">
          <span className="hidden lg:block">{selectedSorting?.text}</span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="hidden text-slate-600 lg:block"
            />
            <HiArrowsUpDown size="16" className="text-slate-600 lg:hidden" />
          </div>
        </button>
      </DropdownTrigger>
      <DropdownContent className="flex w-72 flex-col rounded-md rounded-t-none border-x border-b bg-white text-sm shadow-sm">
        {sortings.map((sorting) => (
          <DropdownItem key={sorting.id} asChild>
            <button
              onClick={() => {
                sorting.onClick();
                selectSorting(sorting);
              }}
              className="px-3 py-2 text-start outline-0 ring-0  transition duration-200 hover:bg-blue-100"
            >
              {sorting.text}
            </button>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};
