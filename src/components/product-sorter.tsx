"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { HiArrowsUpDown } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";

export interface ProductSort {
  id: number;
  label: string;
  value: string;
}

const sortOptions: ProductSort[] = [
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
];

export function ProductSorter() {
  const searchParams = useSearchParams();

  const getActiveSort = () => {
    const sortParams = searchParams.get("sort");
    const activeSort = sortOptions.find((sort) => sort.value === sortParams);
    return activeSort;
  };

  const [selectedSort, setSelectedSort] = useState<ProductSort | undefined>(
    getActiveSort()
  );

  const router = useRouter();
  const path = usePathname();

  const createSearchParams = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", selectedSort?.value as string);
    return newParams.toString();
  };

  useEffect(() => {
    if (selectedSort) {
      const url = `${path}?${createSearchParams()}`;
      router.push(url);
    }
  }, [selectedSort]);

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border bg-white dark:bg-slate-950 dark:border-gray-700 px-3 text-sm outline-0 lg:h-10 lg:w-52 lg:justify-between">
          <span className="hidden font-medium lg:block">
            {selectedSort ? selectedSort.label : "Select Sort"}
          </span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="hidden text-slate-600 dark:text-white lg:block"
            />
            <HiArrowsUpDown
              size="16"
              className="text-slate-600 dark:text-white lg:hidden"
            />
          </div>
        </button>
      </DropdownTrigger>
      <DropdownContent
        align="end"
        className="flex w-52 flex-col overflow-hidden rounded-md border bg-white dark:border-slate-700 dark:bg-slate-950 text-sm shadow-sm lg:rounded-b-md lg:rounded-t-none lg:border-t-0"
      >
        {sortOptions.map((sort) => (
          <DropdownItem key={sort.id} asChild>
            <button
              onClick={() => setSelectedSort(sort)}
              className="px-3 py-2 text-start text-xs font-medium outline-0 ring-0 transition  duration-200 hover:bg-slate-100 hover:dark:bg-slate-800 lg:text-sm"
            >
              {sort.label}
            </button>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

export function ProductSorterSkeleton() {
  const searchParams = useSearchParams();
  const getActiveSort = () => {
    const sortParams = searchParams.get("sort");
    const activeSort = sortOptions.find((sort) => sort.value === sortParams);
    return activeSort;
  };
  return (
    <Dropdown>
      <DropdownTrigger asChild disabled>
        <Button
          disabled
          variant="defaultOutline"
          className="h-8 w-8 border-slate-300 dark:border-gray-700 dark:bg-slate-950 bg-white px-3 lg:h-10 lg:w-52 lg:justify-between"
        >
          <span className="hidden font-medium lg:block">
            {getActiveSort()?.label ?? "Select Sort"}
          </span>
          <div className="w-5">
            <BiChevronRight
              size="20"
              className="hidden text-slate-600 dark:text-white lg:block"
            />
            <HiArrowsUpDown
              size="16"
              className="text-slate-600 dark:text-white lg:hidden"
            />
          </div>
        </Button>
      </DropdownTrigger>
    </Dropdown>
  );
}
