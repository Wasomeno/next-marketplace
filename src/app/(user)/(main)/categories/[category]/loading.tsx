import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/skeleton"
import ProductCard from "@/components/user/product-card"
import { ProductSorterSkeleton } from "@/components/user/product-sorter/product-sorter-skeleton"

export default function CategoryLoading() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex h-36 w-full items-center gap-6 bg-gradient-to-r from-blue-300 to-sky-100 px-6 dark:bg-neutral-900 lg:h-72 lg:px-16 ">
        <Skeleton className="h-24 w-24  rounded-full  shadow-md lg:h-36 lg:w-36" />
        <div className="space-y-1 lg:space-y-2">
          <Skeleton className="h-[20px] w-52 lg:h-[40px]" />
          <Skeleton className="h-[16px] w-40 lg:h-[20px]" />
          <Skeleton className="h-[16px] w-36 lg:h-[20px]" />
        </div>
      </div>
      <div className="relative flex w-full justify-center gap-10 px-4 lg:px-10">
        <div className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <h6 className="text-sm font-medium lg:text-lg">Products</h6>
            <div className="flex items-center gap-2">
              <ProductSorterSkeleton />
              <Button
                disabled
                variant="defaultOutline"
                className="border-slate-200"
              >
                Filter
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-4">
            {["dummy", "dummy", "dummy", "dummy", "dummy"].map(
              (dummy, index) => (
                <ProductCard.Skeleton key={index} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
