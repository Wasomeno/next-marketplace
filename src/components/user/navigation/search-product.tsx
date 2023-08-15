"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Input } from "@/components/ui/input";

export function SearchProduct() {
  const [searchParams, setSearchParams] = useState("");
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/search?q=" + searchParams);
        searchInputRef.current?.blur();
      }}
      className="w-5/6 lg:w-5/6"
    >
      <Input
        ref={searchInputRef as any}
        placeholder="Search..."
        className="h-8 w-full rounded-md border dark:border-gray-700 bg-slate-50 dark:bg-slate-900 p-2 font-sans text-xs lg:h-10 lg:text-sm"
        onChange={(event) => setSearchParams(event.target.value)}
      />
    </form>
  );
}
