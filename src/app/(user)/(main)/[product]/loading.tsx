import { Button } from "@/components/ui/button";

export default function ProductPageLoading() {
  return (
    <div className="flex flex-1 justify-center">
      <div className="flex w-full flex-wrap justify-center gap-10 lg:w-5/6 lg:flex-nowrap">
        <div className="w-10/12 lg:w-4/12">
          <div className="h-80 animate-pulse rounded-md bg-slate-200 dark:bg-neutral-400" />
          <div className="mt-4 flex items-center gap-2.5">
            {["image", "images", "image"].map((url, index) => (
              <div
                key={index}
                className={
                  "h-16 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-neutral-400"
                }
              />
            ))}
          </div>
        </div>
        <div className="w-10/12 lg:w-5/12">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
          <div className="my-4 h-8 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
          <hr
            className="my-2 w-full bg-slate-200 dark:bg-neutral-400"
            style={{ height: "1px" }}
          />
          <span className="text-sm font-medium lg:text-base">Description</span>
          <hr
            className="my-2 w-full bg-slate-200 dark:bg-neutral-400"
            style={{ height: "1px" }}
          />
          <div className="flex flex-col gap-1.5">
            <div className="h-6 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
            <div className="h-6 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
            <div className="h-6 w-4/6 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
          </div>
        </div>
        <div className="sticky bottom-0 w-full bg-white dark:bg-slate-950 lg:w-3/12">
          <div className="rounded-md border-t border-slate-400 dark:border-gray-700 p-2 lg:border lg:p-4">
            <div className="hidden lg:block">
              <span>Product Amount</span>
              <div className="my-4 flex items-center justify-center gap-4">
                <div className="relative flex w-3/6 items-center justify-center gap-4 rounded-md bg-slate-200 dark:bg-neutral-400 text-sm font-medium">
                  <button className="h-8 w-8">-</button>
                  <div className="h-6 w-10 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
                  <button className="h-8 w-8">+</button>
                </div>
                <div className="jus flex items-center gap-2">
                  <h5 className="text-sm">Stock:</h5>
                  <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
                </div>
              </div>
            </div>

            <div className="my-2 hidden justify-between lg:flex">
              <span className="text-slate-500">Subtotal</span>
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-lg ">Rp.</h5>
                <div className="h-7 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-neutral-400" />
              </div>
            </div>
            <div className="flex w-full gap-2 lg:flex-col lg:gap-0">
              <Button
                disabled
                variant="defaultOutline"
                className="my-2 h-8 w-full border-0 rounded-lg bg-blue-400 dark:bg-blue-900 text-xs font-medium lg:h-10 lg:text-sm"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
