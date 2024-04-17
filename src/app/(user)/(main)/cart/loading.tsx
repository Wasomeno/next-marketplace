import { CartItemCardSkeleton } from "@/modules/user/cart-page/components/cart-item-card"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/skeleton"

export default function CartLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 px-4 lg:px-8">
        <h1 className="mb-2 text-base font-medium lg:text-xl">Cart</h1>
        <span className="font-sans text-xs font-medium text-slate-400 lg:text-sm">
          0 items
        </span>
      </div>
      <div className="flex flex-1 flex-col items-start justify-between lg:flex-row lg:justify-center">
        <div className="w-full px-4 lg:w-4/6 lg:px-8">
          <div className="flex w-full flex-col gap-4">
            <CartItemCardSkeleton />
            <CartItemCardSkeleton />
            <CartItemCardSkeleton />
            <CartItemCardSkeleton />
          </div>
        </div>
        <div className="sticky bottom-0 w-full bg-white dark:bg-neutral-950 lg:w-2/6 lg:px-8">
          <div className="border-t border-slate-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-gray-800 lg:rounded-md lg:border lg:p-4 lg:shadow-none">
            <span className="hidden text-xs lg:inline lg:text-lg">
              Cart Summary
            </span>
            <div className="my-2 flex justify-between">
              <span className="text-xs text-slate-500 lg:text-base">
                Subtotal
              </span>
              <Skeleton className="h-[14px] w-40 lg:h-[18px]" />
            </div>
            <Button
              disabled
              variant="default"
              className="my-1 w-full rounded-lg border-0 bg-blue-400 py-3 text-xs font-medium text-slate-50 dark:bg-blue-900 lg:text-sm"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
