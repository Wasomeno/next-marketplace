import clsx from "clsx";
import { memo, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import { Category } from "@prisma/client";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";

interface CategoryScrollableListProps {
  selectedCategory: number;
  selectCategory: (id: number) => void;
}

const CategoryScrollableList = ({
  selectedCategory,
  selectCategory,
}: CategoryScrollableListProps) => {
  const categories = useQuery(["categories"], () => fetchCategories(), {});

  async function fetchCategories(): Promise<Category[]> {
    const result = await fetch("/api/categories", { method: "GET" });
    return result.json();
  }

  if (categories.isLoading) {
    return (
      <div className="flex h-72 w-full animate-pulse flex-col overflow-hidden rounded-md border">
        <div className="w-full cursor-pointer px-3 py-2">
          <div className="h-5 w-3/6 rounded-md bg-slate-200" />
        </div>
        <div className="w-full cursor-pointer px-3 py-2">
          <div className="h-5 w-3/6 rounded-md bg-slate-200" />
        </div>
        <div className="w-full cursor-pointer px-3 py-2">
          <div className="h-5 w-3/6 rounded-md bg-slate-200" />
        </div>
        <div className="w-full cursor-pointer px-3 py-2">
          <div className="h-5 w-3/6 rounded-md bg-slate-200" />
        </div>
        <div className="w-full cursor-pointer px-3 py-2">
          <div className="h-5 w-3/6 rounded-md bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <ScrollArea.Root className="h-72 w-full overflow-hidden rounded-md border">
      <ScrollArea.Viewport className="h-full w-full bg-white">
        {categories.data?.map((category) => (
          <div
            key={category.id}
            onClick={() => selectCategory(category.id)}
            className={twMerge(
              clsx(
                "w-full cursor-pointer border-b px-3 py-2 text-sm tracking-wide transition duration-200 hover:bg-blue-100",
                selectedCategory === category.id && "bg-blue-100"
              )
            )}
          >
            {category.name}
          </div>
        ))}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex transition duration-150"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="relative flex" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default memo(CategoryScrollableList);
