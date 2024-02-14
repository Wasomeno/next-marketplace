import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/skeleton"

export default function ProductPageLoading() {
  return (
    <div className="relative flex flex-1 flex-col gap-10 lg:flex-row">
      <div className="mx-5 flex-1 space-y-10 lg:ml-20 lg:mr-0">
        <div className="flex flex-1 flex-wrap justify-center gap-10 lg:flex-nowrap lg:justify-normal">
          <Skeleton className="h-80 w-full lg:w-80" />
          <div className="flex flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-[18px] w-72 font-medium lg:h-[22px]" />
              <Skeleton className="h-5 w-5" />
            </div>
            <Skeleton className="mb-4 h-[20px] w-52 font-medium lg:h-[26px]" />
            <Separator
              decorative
              orientation="horizontal"
              className="w-full bg-slate-200 dark:bg-gray-800"
              style={{ height: "1px" }}
            />
            <div className="my-4 h-24 space-y-2 lg:h-48">
              <Skeleton className="h-[16px] w-32 font-medium lg:h-[18px]" />
              <Skeleton className="h-[16px] w-28" />
            </div>
            <Separator
              decorative
              orientation="horizontal"
              className="w-full bg-slate-200 dark:bg-gray-800"
              style={{ height: "1px" }}
            />
            <div className="my-4 flex h-10 items-center gap-4">
              <Skeleton className="h-10 w-10  rounded-full " />
              <div className="space-y-1">
                <Skeleton className="h-[16px] w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:justify-normal lg:gap-10">
          <div className="w-full space-y-2 lg:w-80 lg:space-y-4">
            <Skeleton className="h-[18px]  w-40 lg:h-[20px]" />
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-3xl lg:text-5xl">
                <Skeleton className="h-6 w-6 lg:h-8 lg:w-8" />

                <Skeleton className="h-[22px] w-32 lg:h-[32px]" />
              </div>
              <Skeleton className="h-[16px] w-32" />
            </div>
          </div>
          <div className="flex flex-1 flex-col space-y-2 lg:space-y-4">
            <Skeleton className="h-[18px] w-32 lg:h-[20px]" />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 m-0 h-fit w-screen border-t border-slate-200 bg-white p-2 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:top-20 lg:mr-20 lg:w-80 lg:rounded-lg lg:border lg:border-slate-200 lg:p-4 lg:shadow-sm lg:dark:border-gray-800">
        <Skeleton className="hidden h-[14px] w-32 lg:inline-block" />
        <div className="hidden lg:block">
          <div className="my-4 flex items-center justify-between gap-4">
            <Skeleton className="h-[14px] w-20 text-slate-500 lg:h-[16px]" />
            <div className="relative flex w-fit items-center justify-center gap-4 overflow-hidden rounded-md border border-gray-200 text-sm font-medium dark:bg-slate-800">
              <button
                disabled
                className="border-r border-gray-200 bg-gray-50 lg:h-6 lg:w-6"
              >
                -
              </button>
              <Skeleton className="h-[14px] w-16" />
              <button
                disabled
                className="border-l border-gray-200 bg-gray-50 lg:h-6 lg:w-6"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="my-2 hidden items-center justify-between lg:flex">
          <Skeleton className="h-[14px] w-20 text-slate-500 lg:h-[16px]" />
          <Skeleton className="h-[16px] w-40 lg:h-[18px]" />
        </div>
        <div className="flex w-full gap-2 lg:flex-col lg:gap-0">
          <Button
            disabled
            variant="default"
            className="my my-2 h-8 w-full rounded-lg  bg-blue-400 text-xs font-medium text-slate-50 dark:bg-blue-900 lg:h-10 lg:text-sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
