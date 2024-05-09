"use client"

import { useSearchParams } from "next/navigation";

export function useSearchParamsValues<T>() {
  const searchParams = useSearchParams()
  let searchParamsObject = {}
  for (const [key, value] of searchParams.entries()) {
    const params = { [key]: value }
    searchParamsObject = { ...searchParamsObject, ...params }
  }

  return searchParamsObject as T
}

export function getParsedSortParams(
  sort?: string
): Record<string, "asc" | "desc"> {
  if (!sort) {
    return {}
  }
  return { [sort.split("."[0])[0]]: sort.split(".")[1] } as Record<
    string,
    "asc" | "desc"
  >
}
