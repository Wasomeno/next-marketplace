import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/skeleton"

export default function CheckoutLoadingPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="px-4 lg:px-8">
        <h1 className="text-base font-medium lg:text-xl">Checkout</h1>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 lg:flex-row">
        <div className="w-full space-y-4 px-4 lg:w-4/6 lg:px-8">
          <div className="space-y-2 rounded-lg border p-4 shadow-sm lg:space-y-3">
            <h2 className="text-sm font-medium lg:text-base">Your Address</h2>
            <Skeleton className="h-5 w-72 lg:h-6" />
            <div className="flex justify-end lg:justify-start">
              <Button disabled size="sm" className="h-8 w-24 lg:text-xs">
                Change
              </Button>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            {Array(5)
              .fill("")
              .map(() => (
                <div className="flex flex-1 gap-4">
                  <Skeleton className=" h-20 w-20 lg:h-24 lg:w-24" />
                  <div className="flex flex-1 flex-col justify-between lg:flex-row">
                    <Skeleton className="h-5 w-full lg:h-6 lg:w-32" />
                    <div className="flex w-full flex-col gap-2 lg:w-fit lg:items-end">
                      <Skeleton className="h-5 w-32 lg:h-6" />
                      <Skeleton className="h-5 w-32 lg:h-6" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="sticky bottom-0 w-full bg-white lg:w-2/6 lg:px-8">
          <div className="border-t border-gray-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:rounded-md  lg:border lg:p-4 lg:shadow-none lg:dark:border-gray-800">
            <span className="hidden text-xs font-medium lg:inline lg:text-base">
              Order Summary
            </span>
            <div className="my-2 flex items-center justify-between">
              <span className="text-sm text-slate-500 lg:text-base">
                Subtotal
              </span>
              <Skeleton className="h-5 w-32 lg:h-6" />
            </div>
            <Button disabled className="w-full lg:text-xs">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
