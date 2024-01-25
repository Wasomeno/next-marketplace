"use client"

import { useSearchParams } from "next/navigation"

export function useSearchParamsValues<T>() {
  const searchParams = useSearchParams()
  let searchParamsObject = {}
  for (const [key, value] of searchParams.entries()) {
    const params =
      key === "sort"
        ? { [key]: { [value.split("."[0])[0]]: value.split(".")[1] } }
        : { [key]: value }
    searchParamsObject = { ...searchParamsObject, ...params }
  }

  return searchParamsObject as T | null
}
