"use client"

import { DatePicker, DateRange } from "@/components/ui/date-picker"
import { useSearchParamsValues } from "@/utils"
import { format } from "date-fns"
import { usePathname, useRouter } from "next/navigation"

export const StoreDashboardHeaderDropdown = () => {
  const searchParamValues = useSearchParamsValues<{
    startDate: string
    endDate: string
  }>()

  const pathname = usePathname()
  const router = useRouter()

  function onSelectDate(date: Date | Date[] | DateRange | undefined) {
    const searchParams = new URLSearchParams(searchParamValues)
    const dateAsRange = date as DateRange

    if (dateAsRange?.from && dateAsRange?.to) {
      searchParams.set("startDate", format(dateAsRange.from, "yyyy-MM-dd"))
      searchParams.set("endDate", format(dateAsRange.to, "yyyy-MM-dd"))
    } else {
      searchParams.delete("startDate")
      searchParams.delete("endDate")
    }
    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <DatePicker
        mode="range"
        onChange={onSelectDate}
        initialValue={{
          from: searchParamValues.startDate
            ? new Date(searchParamValues.startDate)
            : undefined,
          to: searchParamValues.endDate
            ? new Date(searchParamValues.endDate)
            : undefined,
        }}
      />
    </div>
  )
}
