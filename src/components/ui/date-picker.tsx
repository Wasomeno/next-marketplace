import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React from "react"

type DatePickerMode = "single" | "range" | "multiple"

export type DateRange = {
  from: Date | null
  to: Date | null
}

type DatePickerProps = {
  mode?: DatePickerMode
  className?: string
  onChange?: (value: Date | null | DateRange | Date[]) => void
  initialValue?: Date | null | DateRange | Date[]
}

export const DatePicker = ({
  mode = "single",
  className,
  onChange,
  initialValue = null,
}: DatePickerProps) => {
  // Type guard to check if value is a DateRange
  const isDateRange = (value: any): value is DateRange => {
    return (
      value && typeof value === "object" && "from" in value && "to" in value
    )
  }

  // Type guard to check if value is a Date array
  const isDateArray = (value: any): value is Date[] => {
    return Array.isArray(value) && value.every((item) => item instanceof Date)
  }

  // Initialize state based on mode and initialValue
  const [date, setDate] = React.useState<Date | null>(() => {
    if (mode === "single" && initialValue instanceof Date) {
      return initialValue
    }
    return null
  })

  const [dateRange, setDateRange] = React.useState<DateRange>(() => {
    if (mode === "range" && isDateRange(initialValue)) {
      return initialValue
    }
    return { from: null, to: null }
  })

  const [selectedDays, setSelectedDays] = React.useState<Date[]>(() => {
    if (mode === "multiple" && isDateArray(initialValue)) {
      return initialValue
    }
    return []
  })

  const handleSelect = (selectedDate: Date | null | DateRange | Date[]) => {
    switch (mode) {
      case "single":
        setDate(selectedDate as Date | null)
        onChange?.(selectedDate)
        break
      case "range":
        setDateRange(selectedDate as DateRange)
        onChange?.(selectedDate)
        break
      case "multiple":
        setSelectedDays(selectedDate as Date[])
        onChange?.(selectedDate)
        break
      default:
        const _exhaustiveCheck: never = mode
        break
    }
  }

  const getButtonText = () => {
    switch (mode) {
      case "single":
        return date ? format(date, "PPP") : "Pick a date"
      case "range":
        return dateRange?.from ? (
          dateRange?.to ? (
            <>
              {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
            </>
          ) : (
            format(dateRange.from, "PPP")
          )
        ) : (
          "Pick a date range"
        )
      case "multiple":
        return selectedDays.length > 0
          ? `${selectedDays.length} days selected`
          : "Pick multiple dates"
      default:
        const _exhaustiveCheck: never = mode
        return "Pick a date"
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="defaultOutline"
            className={cn(
              "w-[360px] justify-start text-left font-normal",
              !date &&
                !dateRange?.from &&
                selectedDays.length === 0 &&
                "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getButtonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {mode === "single" && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect as (date: Date | null) => void}
              initialFocus
            />
          )}
          {mode === "range" && (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleSelect as (range: DateRange) => void}
              numberOfMonths={2}
              initialFocus
            />
          )}
          {mode === "multiple" && (
            <Calendar
              mode="multiple"
              selected={selectedDays}
              onSelect={handleSelect as (dates: Date[]) => void}
              initialFocus
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
