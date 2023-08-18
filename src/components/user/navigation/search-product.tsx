"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"

export function SearchProduct() {
  const [searchParams, setSearchParams] = useState("")
  const router = useRouter()

  const searchInputRef = useRef<HTMLInputElement>()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        router.push("/search?q=" + searchParams)
        searchInputRef.current?.blur()
      }}
      className="w-5/6 lg:w-5/6"
    >
      <Input
        ref={searchInputRef as any}
        placeholder="Search..."
        className="h-8 w-full rounded-md border bg-slate-50 p-2 font-sans text-xs dark:border-gray-700 dark:bg-slate-950 lg:h-10 lg:text-sm"
        onChange={(event) => setSearchParams(event.target.value)}
      />
    </form>
  )
}
