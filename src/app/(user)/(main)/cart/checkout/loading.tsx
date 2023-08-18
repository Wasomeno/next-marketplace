import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"

export default function CheckoutLoadingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-2 lg:mb-6 lg:px-8">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-base font-medium lg:text-xl">Checkout</h1>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 lg:flex-row">
        <div className="w-full lg:w-4/6">
          <div className="mb-4 flex flex-col gap-1 px-4 lg:px-8">
            <h5 className="text-sm font-medium lg:text-base">
              Shipping Address
            </h5>
            <div className="h-[14px] w-48 rounded-lg bg-slate-300 dark:bg-neutral-400 lg:h-[16px]" />
          </div>
          <div className="flex flex-1 flex-col gap-2 px-4 lg:px-8">
            <div className="flex items-center gap-4 border-t p-4 dark:border-t-neutral-700">
              <div className="flex w-full flex-wrap items-end justify-between gap-2">
                <div className="flex w-full gap-2 lg:w-4/6 lg:gap-4">
                  <div className="relative h-12 w-16 rounded-md bg-slate-300 dark:bg-neutral-400 lg:h-20 lg:w-24" />
                  <div className="flex w-4/6 flex-col gap-1 lg:w-3/6">
                    <div className="h-[14px] w-40 rounded-lg bg-slate-300 text-xs font-medium dark:bg-neutral-400 lg:h-[16px] lg:text-sm" />
                    <div className="h-[14px] w-40 rounded-lg bg-slate-300 text-xs font-medium dark:bg-neutral-400 lg:h-[16px] lg:text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 w-full lg:w-2/6 lg:px-8">
          <div className="border-t border-slate-200 p-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] dark:border-t-gray-800 lg:rounded-md lg:border lg:border-slate-300 lg:p-4 lg:shadow-none lg:dark:border-gray-800">
            <span className="hidden text-xs lg:inline lg:text-lg">
              Order Summary
            </span>
            <div className="my-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 lg:text-base">
                Subtotal
              </span>
              <div className="h-[14px] w-52 rounded-lg bg-slate-300 dark:bg-neutral-400 lg:h-[18px]" />
            </div>
            <Button
              disabled
              variant="default"
              className="my-1 w-full rounded-lg bg-blue-400 py-3  text-xs font-medium text-white dark:bg-blue-900 lg:text-sm"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
