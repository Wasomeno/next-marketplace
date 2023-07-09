import { useState } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";

import { Input } from "@/components/ui/input";

export const CategoryTableSearchInput = ({
  searchCategory,
}: {
  searchCategory: (category: string) => void;
}) => {
  const [nameFilter, setNameFilter] = useState<string>();
  return (
    <div className="flex h-8 w-40 items-center rounded-md border bg-white p-1.5 lg:h-10 lg:w-96">
      <div className="flex w-10 items-center justify-center">
        <RxMagnifyingGlass className="text-slate-400" />
      </div>
      <Input
        type="text"
        value={nameFilter}
        onChange={(event) => {
          setNameFilter(event.target.value);
          searchCategory(event.target.value);
        }}
        className="h-auto w-full border-none p-0 focus-visible:ring-0"
        placeholder="Search by category name"
      />
    </div>
  );
};
