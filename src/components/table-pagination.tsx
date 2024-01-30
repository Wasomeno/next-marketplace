import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"

import { Button } from "./ui/button"

type TablePaginationProps = {
  pageSize: number
  dataLength: number
}

export const TablePagination = (props: TablePaginationProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const searchParamsValues = new URLSearchParams(searchParams.toString())

  const currentPage = searchParamsValues.get("page") as string

  function generatePages() {
    let pages = []
    for (let index = 0; index < props.dataLength / props.pageSize; index++) {
      pages[index] = index + 1
    }

    return pages
  }

  function nextPage() {
    searchParamsValues.set("page", (parseInt(currentPage ?? 1) + 1).toString())
    router.replace(`${pathname}?${searchParamsValues.toString()}`)
  }

  function previousPage() {
    if (parseInt(currentPage as string) > 1) {
      searchParamsValues.set(
        "page",
        (parseInt(currentPage as string) + 1).toString()
      )
      router.replace(`${pathname}?${searchParamsValues.toString()}`)
    }
  }

  function setPage(page: number) {
    if (page === 1) {
      searchParamsValues.delete("page")
    } else {
      searchParamsValues.set("page", page.toString())
    }
    router.replace(`${pathname}?${searchParamsValues.toString()}`)
  }

  return (
    <div className="my-2 flex items-center justify-center gap-2.5">
      <Button
        disabled={!currentPage}
        variant="defaultOutline"
        size="sm"
        className="h-8 w-8 lg:h-10 lg:w-10"
        onClick={() => previousPage()}
      >
        <HiChevronLeft />
      </Button>
      {generatePages().map((page) => (
        <Button
          key={page}
          variant="defaultOutline"
          size="sm"
          className="h-8 w-8 lg:h-10 lg:w-10"
          onClick={() => setPage(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        disabled={generatePages().length === parseInt(currentPage ?? "1")}
        variant="defaultOutline"
        size="sm"
        className="h-8 w-8 lg:h-10 lg:w-10"
        onClick={() => nextPage()}
      >
        <HiChevronRight />
      </Button>
    </div>
  )
}
