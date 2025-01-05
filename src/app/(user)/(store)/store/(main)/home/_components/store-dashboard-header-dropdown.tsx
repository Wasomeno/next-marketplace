"use client"

import { DatePicker, DateRange } from "@/components/ui/date-picker"
import { useSearchParamsValues } from "@/utils"
import { format } from "date-fns"
import { usePathname, useRouter } from "next/navigation"

export const StoreDashboardHeaderDropdown = () => {
  const searchParamValues = useSearchParamsValues<{
    month: string
    year: string
  }>()

  const pathname = usePathname()
  const router = useRouter()

  function onSelectDate(date: Date | Date[] | DateRange | undefined) {
    // const searchParams = new URLSearchParams(searchParamValues)
    // if (date) {
    //   searchParams.set("date", format(date, "m"))
    //   searchParams.set("month", format(date, "m"))
    //   searchParams.set("year", format(date, "yyyy"))
    // } else {
    //   searchParams.delete("month")
    //   searchParams.delete("year")
    // }
    // router.replace(`${pathname}?${searchParams.toString()}`)
    console.log(date)
  }

  return (
    <div className="flex items-center gap-2">
      <DatePicker mode="range" onChange={onSelectDate} />
    </div>
  )
}
