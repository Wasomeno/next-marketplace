"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";

export function SearchProduct() {
  const [searchParams, setSearchParams] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/search?q=" + searchParams);
      }}
      className="w-5/6 lg:w-5/6"
    >
      <Input
        placeholder="Search..."
        className="h-8 w-full rounded-md border bg-slate-50 p-2 font-sans text-xs lg:h-10 lg:text-sm"
        onChange={(event) => setSearchParams(event.target.value)}
      />
    </form>
  );
}
